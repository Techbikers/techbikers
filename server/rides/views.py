# encoding=utf8
import stripe
import requests
import base64
from django_slack import slack_message
from rest_framework import generics
from rest_framework.exceptions import ValidationError, ParseError
from django.template.loader import render_to_string
from django.shortcuts import get_object_or_404
from django.contrib.auth.models import User
from django.utils.text import slugify
from django.conf import settings

from server.rides.models import Ride, RideRiders
from server.sales.models import Sale
from server.sponsors.models import Sponsor
from server.fundraisers.models import Fundraiser
from server.rides.serializers import RideSerializer, RideRiderSerializer
from server.riders.serializers import RiderSerializer
from server.sponsors.serializers import SponsorSerializer
from server.fundraisers.serializers import FundraiserSerializer
from server.api.permissions import IsOwner, RiderIsAccepted
from server.auth.utils import get_auth0_management_token

class RidesList(generics.ListCreateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer


class RideDetails(generics.RetrieveUpdateAPIView):
    model = Ride
    queryset = Ride.objects.all()
    serializer_class = RideSerializer
    lookup_field = 'id'


class RideRidersList(generics.ListCreateAPIView):
    def get_queryset(self):
        return User.objects.filter(
            ride__id=self.kwargs.get('id'),
            rideriders__status=RideRiders.REGISTERED)

    def get_serializer_class(self):
        """
        We want to return a list of the riders that are on the ride when the action
        is 'list'. When the action is 'create' we want to try and create a new
        RideRider object for the current user on the current ride so use the
        RideRiderSerializer instead.
        """
        if self.request.method == 'POST':
            return RideRiderSerializer
        return RiderSerializer

    def perform_create(self, serializer):
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        user = self.request.user

        registration = serializer.save(
            user=user,
            ride=ride,
            paid=False,
            status=RideRiders.PENDING)

        slack_message('slack/new_registration.slack', {
            'user': user,
            'ride': ride,
            'reg': registration
        })



class RideRiderDetails(generics.RetrieveAPIView):
    model = RideRiders
    queryset = RideRiders.objects.all()
    serializer_class = RideRiderSerializer
    permission_classes = (IsOwner,)

    def get_object(self):
        queryset = self.get_queryset()
        filter = {
            'ride__id': self.kwargs.get('id'),
            'user__id': self.kwargs.get('rider_id')
        }
        obj = get_object_or_404(queryset, **filter)
        self.check_object_permissions(self.request, obj)
        return obj


class RideRiderCharge(generics.UpdateAPIView):
    model = RideRiders
    serializer_class = RideRiderSerializer
    permission_classes = (IsOwner, RiderIsAccepted)
    lookup_field = 'user__id'
    lookup_url_kwarg = 'rider_id'

    def get_queryset(self):
        return RideRiders.objects.filter(ride__id=self.kwargs.get('id'))

    def perform_update(self, serializer):
        """
        Charge the user for the ride fee and then update the status of
        their RideRider entry. The current status must be 'accepted'
        and the logged in user must be the owner of the record.
        """
        request = self.request
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        amount = request.data.get('amount')

        # Check that there is actually space left on the ride
        # People shouldn't get here if there isn't but let's make sure we don't
        # charge anyone if there isn't enough space on the ride
        if ride.spaces_left == 0:
            raise ValidationError("This ride is already at full capacity")

        # Determine how much we are charging this user (either the minimum
        # contribution or more if they have explicitely specified more)
        if amount is None:
            amount = ride.price
        else:
            amount = float(amount)

        if amount < ride.price:
            raise ValidationError("The amount can't be less than the price of the ride.")

        # Go ahead and charge them!
        if ride.price > 0:
            try:
                sale = Sale.charge(
                    request.data.get('token'),
                    ride.chapter.private_key,
                    int(amount * 100),
                    ride.currency,
                    "Techbikers {0}: {1}".format(ride.name, request.user.email),
                    request.user.email)
            except stripe.error.CardError, e:
                raise ValidationError(e.json_body['error'])
            sale.rider_id = request.user.id
            sale.save()

            slack_message('slack/completed_registration.slack', {
                'user': request.user,
                'ride': ride,
                'amount': amount
            })

            serializer.save(status=RideRiders.REGISTERED, paid=True, sale=sale)
        else:
            serializer.save(status=RideRiders.REGISTERED)


class RideRiderFundraiser(generics.RetrieveAPIView, generics.CreateAPIView):
    model = Fundraiser
    serializer_class = FundraiserSerializer
    lookup_field = 'user__id'
    lookup_url_kwarg = 'rider_id'

    def get_queryset(self):
        return Fundraiser.objects.filter(ride__id=self.kwargs.get('id'))

    def perform_create(self, serializer):
        ride = Ride.objects.get(id=self.kwargs.get('id'))
        user = self.request.user

        # Get the Just Giving access token by using the auth code we received
        # We need to encode the API key and secret to submit in the header with this requests
        auth_header = base64.b64encode('{0}:{1}'.format(
            settings.JUSTGIVING_API_KEY,
            settings.JUSTGIVING_API_SECRET))

        response = requests.post(
            '{0}/connect/token'.format(settings.JUSTGIVING_AUTH_URL),
            headers={
                'Authorization': 'Basic {0}'.format(auth_header)},
            data={
                'code': self.request.data.get('auth_code'),
                'grant_type': 'authorization_code',
                'redirect_uri': settings.JUSTGIVING_REDIRECT_URI})

        response.raise_for_status()
        tokens_json = response.json()
        access_token = tokens_json.get('access_token')

        # Ok, now let's go ahead an actually create the fundraising page on Just Giving
        pageShortName = slugify('techbikers {0} {1}'.format(ride.name, user.id))
        pageStory = render_to_string('justgiving_page_story.html', {'ride': ride})
        payload = {
            'charityId': settings.JUSTGIVING_CHARITY_ID,
            'eventId': ride.just_giving_event_id,
            'pageShortName': pageShortName,
            'pageTitle': 'I\'m doing Techbikers {0}: Support my 300km cycle for childhood literacy!'.format(ride.chapter.name),
            'targetAmount': int(ride.fundraising_target),
            'currency': ride.currency.upper(),
            'justGivingOptIn': False,
            'charityOptIn': False,
            'charityFunded': False,
            'pageSummaryWhat': 'I am cycling from {0} to {1}'.format(ride.start_location, ride.end_location),
            'pageSummaryWhy': 'world change starts with educated children',
            'pageStory': pageStory,
            'theme': {
                'pageBackground': '#FFFFFF',
                'buttonsThermometerFill': '#4494C7',
                'linesThermometerBackground': '#76C15A'
            },
            'images': [
                {
                    'caption': '',
                    'url': 'https://techbikers.com/static/img/techbikers_group.jpg',
                    'isDefault': True
                },
                {
                    'caption': '',
                    'url': 'https://techbikers.com/static/img/classroom.jpg',
                    'isDefault': False
                }
            ]
        }

        response = requests.put(
            '{0}/fundraising/pages'.format(settings.JUSTGIVING_API_URL),
            headers={
                'x-api-key': settings.JUSTGIVING_API_KEY,
                'x-application-key': settings.JUSTGIVING_API_SECRET,
                'Authorization': 'Bearer {0}'.format(access_token)},
            json=payload)

        response.raise_for_status()

        # Now let's create the fundraising record with the returned info
        response_json = response.json()

        fundraiser = serializer.save(
            user=user,
            ride=ride,
            pageUrl='http://www.justgiving.com/{0}'.format(pageShortName),
            pageId=response_json['pageId'])

        try:
            slack_message('slack/new_fundraiser.slack', {
                'user': user,
                'ride': ride,
                'pageUrl': fundraiser.pageUrl
            })
        except:
            # No worries, no Slack notification
            pass
