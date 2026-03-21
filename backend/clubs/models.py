import uuid
from django.db import models
from tenants.models import Tenant
from django.conf import settings

class Club(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='clubs')
    category = models.ForeignKey('core_app.Category', on_delete=models.SET_NULL, null=True, blank=True, related_name='clubs')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='created_clubs')
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(null=True, blank=True)
    logo_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

class ClubMember(models.Model):
    ROLE_CHOICES = [
        ('member', 'Member'),
        ('admin', 'Admin'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    club = models.ForeignKey(Club, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='club_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    joined_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('club', 'user')
