import uuid
from django.db import models
from django.conf import settings

class Team(models.Model):
    STATUS_CHOICES = [
        ('forming', 'Forming'),
        ('complete', 'Complete'),
        ('submitted', 'Submitted'),
        ('disqualified', 'Disqualified'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='teams')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='teams')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    team_lead = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='led_teams')
    max_members = models.IntegerField()
    current_members = models.IntegerField(default=1)
    
    project_name = models.CharField(max_length=255, null=True, blank=True)
    project_description = models.TextField(null=True, blank=True)
    github_repo_url = models.URLField(null=True, blank=True)
    demo_url = models.URLField(null=True, blank=True)
    
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='forming')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.event.title})"

class Participant(models.Model):
    STATUS_CHOICES = [
        ('registered', 'Registered'),
        ('attended', 'Attended'),
        ('no_show', 'No Show'),
        ('cancelled', 'Cancelled'),
        ('waitlisted', 'Waitlisted'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='participants')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='participants')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_participations')
    
    registration_number = models.CharField(max_length=100, unique=True)
    registration_data = models.JSONField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='registered')
    
    check_in_time = models.DateTimeField(null=True, blank=True)
    check_out_time = models.DateTimeField(null=True, blank=True)
    
    team = models.ForeignKey(Team, on_delete=models.SET_NULL, null=True, blank=True, related_name='members')
    qr_code_url = models.URLField(null=True, blank=True)
    
    registration_date = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.user.email} - {self.event.title}"
