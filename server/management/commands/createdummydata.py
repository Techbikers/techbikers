from django.core.management.base import BaseCommand, CommandError
from django.contrib.auth.models import User

from faker import Faker
from datetime import datetime, timedelta

from server.models.riders import RiderProfile
from server.models.rides import Ride, RideRiders
from server.models.chapters import Chapter
from server.models.sales import Sale
from server.models.memberships import Membership
from server.models.sponsors import Sponsor, RideSponsor
from server.models.fundraisers import Fundraiser

class Command(BaseCommand):
    faker = Faker()

    help = 'Creates dummy data'

    # TODO: sales

    def handle(self, *args, **options):
        """
            Find available fake data providers at 
            https://faker.readthedocs.io/en/master/providers.html
        """

        self.create_users(10)
        self.create_chapters(5)
        self.create_rides(10)
        self.create_sponsors(8)

        self.stdout.write(self.style.SUCCESS('Done'))

    def create_rides(self, count): 
        for _ in range(count):
            start_location = self.faker.city()
            end_location   = self.faker.city()

            new_ride = Ride()
            new_ride.name                 = start_location  + " - " + end_location + " 2018"
            new_ride.slug                 = self.faker.slug()
            new_ride.strapline            = self.faker.text(50)
            new_ride.description          = self.faker.text(200)
            new_ride.start_location       = start_location
            new_ride.end_location         = end_location
            new_ride.start_date           = self.faker.date_time_this_year()
            new_ride.end_date             = new_ride.start_date + timedelta(days=3)
            new_ride.preregistration_required = self.faker.boolean()
            new_ride.rider_capacity       = self.faker.random_number(2)
            new_ride.price                = self.faker.random_number(3)
            new_ride.full_cost            = self.faker.random_number(3)
            new_ride.currency             = self.faker.currency_code()
            new_ride.terms_and_conditions = self.faker.text(150)
            new_ride.chapter              = Chapter.objects.order_by("?").first()
            new_ride.save()

            user_set = User.objects.order_by("?")[:10]
            for user in user_set:
                signup_date = datetime.today()
                signup_expires = datetime.today()
                payload = ''
                paid = True
                sale = None
                m1 = RideRiders(None, user=user, ride=new_ride, status=RideRiders.ACCEPTED, signup_date=signup_date, signup_expires=signup_expires, payload=payload, paid=paid, sale=sale)
                m1.save()
                self.stdout.write(self.style.SUCCESS('  Added user %s to ride %s' % (user, new_ride)))

                new_fundraiser = self.create_fundraiser(user, new_ride)
                self.stdout.write(self.style.SUCCESS('  Added fundraiser %s' % new_fundraiser))

            self.stdout.write(self.style.SUCCESS('Created ride %s' % new_ride))

        self.stdout.write(self.style.SUCCESS('Created %s rides' % count))

    def create_chapters(self, count): 
        for _ in range(count):
            new_chapter = Chapter()
            new_chapter.name                 = self.faker.city()
            new_chapter.description          = self.faker.text(200)
            new_chapter.membership_fee       = self.faker.random_number(3)
            new_chapter.currency             = self.faker.currency_code()
            new_chapter.stripe_priv_key      = self.faker.sha256()
            new_chapter.stripe_pub_key       = self.faker.sha256()
            new_chapter.stripe_test_priv_key = self.faker.sha256()
            new_chapter.stripe_test_pub_key  = self.faker.sha256()
            new_chapter.save()

            # Chapter members
            user_set = User.objects.order_by("?")[:10]
            for user in user_set:
                m1 = Membership(user=user, chapter=new_chapter)
                m1.save()
                self.stdout.write(self.style.SUCCESS('  Added member %s to chapter %s' % (user, new_chapter)))

            self.stdout.write(self.style.SUCCESS('Created chapter %s' % new_chapter))

        self.stdout.write(self.style.SUCCESS('Created %s chapters' % count))

    def create_sponsors(self, count): 
        for _ in range(count):
            new_sponsor = Sponsor()
            new_sponsor.organisation = self.faker.company()
            new_sponsor.description  = self.faker.text(200)
            new_sponsor.logo         = self.faker.file_path()
            new_sponsor.website      = self.faker.url()
            new_sponsor.twitter      = self.faker.url()
            new_sponsor.facebook     = self.faker.url()
            new_sponsor.save()

            # Riders who work for this sponsor
            user_set = User.objects.order_by("?")[:2]
            for user in user_set:
                new_sponsor.riders.add(user)
                self.stdout.write(self.style.SUCCESS('  Added user %s to sponsor %s' % (user, new_sponsor)))

            # Rides this sponsor has sponsored
            ride_set = Ride.objects.order_by("?")[:3]
            for ride in ride_set:
                m1 = RideSponsor(sponsor=new_sponsor, ride=ride, sponsor_level=RideSponsor.GOLD)
                m1.save()
                self.stdout.write(self.style.SUCCESS('  Added user %s to sponsor %s' % (user, new_sponsor)))

            self.stdout.write(self.style.SUCCESS('Created sponsor %s' % new_sponsor))

        self.stdout.write(self.style.SUCCESS('Created %s sponsors' % count))

    def create_users(self, count): 
        for _ in range(count):
            email = self.faker.email()
            password = self.faker.sha256()

            new_user = User.objects.create_user(email, email, password)
            new_user.first_name = self.faker.first_name()
            new_user.last_name  = self.faker.last_name()            
            new_user.profile    = self.create_rider_profile(new_user)
            new_user.save()

            self.stdout.write(self.style.SUCCESS('Created user %s' % new_user))

        self.stdout.write(self.style.SUCCESS('Created %s users' % count))

    def create_rider_profile(self, user):
            new_rider_profile = RiderProfile()
            new_rider_profile.company   = self.faker.company()
            new_rider_profile.website   = self.faker.url()
            new_rider_profile.twitter   = self.faker.url()
            new_rider_profile.biography = self.faker.text(200)
            new_rider_profile.statement = self.faker.text(50)
            new_rider_profile.user      = user
            new_rider_profile.save()

            self.stdout.write(self.style.SUCCESS('Created profile %s' % new_rider_profile))
            return new_rider_profile

    def create_fundraiser(self, user, ride):
        new_fundraiser = Fundraiser()
        new_fundraiser.pageId          = self.faker.random_number(6)
        new_fundraiser.pageStatus      = self.faker.boolean()
        new_fundraiser.pageUrl         = self.faker.url()
        new_fundraiser.signOnUrl       = self.faker.url()
        new_fundraiser.currency        = self.faker.currency_code()
        new_fundraiser.manuallyCreated = self.faker.boolean()

        new_fundraiser.user = user
        new_fundraiser.ride = ride

        new_fundraiser.fundraisingTarget  = self.faker.random_number(4)
        new_fundraiser.totalRaisedOffline = self.faker.random_number(4)
        new_fundraiser.totalRaisedOnline  = self.faker.random_number(4)
        new_fundraiser.totalRaisedSms     = self.faker.random_number(4)
        totalRaised = new_fundraiser.totalRaisedOffline + new_fundraiser.totalRaisedOffline + new_fundraiser.totalRaisedSms
        new_fundraiser.totalRaised        = totalRaised
        new_fundraiser.giftAid            = self.faker.random_number(4)
        new_fundraiser.save()

        self.stdout.write(self.style.SUCCESS('Created fundraiser %s' % new_fundraiser))
        return new_fundraiser
