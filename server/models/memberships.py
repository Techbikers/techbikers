from datetime import datetime, timedelta
from django.db import models
from django.contrib.auth.models import User

from server.models.sales import Sale
from server.models.chapters import Chapter


class Membership(models.Model):
    user = models.ForeignKey(User)
    sale = models.ForeignKey(Sale, blank=True, null=True)
    # Riders are members of a specific chapter (which determines the membership fee)
    chapter = models.ForeignKey(Chapter)
    # Membership start
    start_date = models.DateField(auto_now_add=True)
    # Membership end (defaults to 365 days later... doesn't account for leap years)
    end_date = models.DateField(blank=True, null=True)

    @property
    def expired(self):
        return self.end_date < datetime.now().date()

    def save(self, *args, **kwargs):
        self.end_date = datetime.now().date() + timedelta(days=365)
        super(Membership, self).save(*args, **kwargs)

    class Meta:
        db_table = 'memberships'
