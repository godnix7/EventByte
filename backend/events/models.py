import uuid
from django.db import models
from django.conf import settings

class Event(models.Model):
    STATUS_CHOICES = [
        ('draft', 'Draft'),
        ('published', 'Published'),
        ('pending_approval', 'Pending Approval'),
        ('ongoing', 'Ongoing'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    TYPE_CHOICES = [
        ('hackathon', 'Hackathon'),
        ('seminar', 'Seminar'),
        ('workshop', 'Workshop'),
        ('conference', 'Conference'),
        ('meetup', 'Meetup'),
    ]
    
    VENUE_TYPE_CHOICES = [
        ('offline', 'Offline'),
        ('online', 'Online'),
        ('hybrid', 'Hybrid'),
    ]
    
    VISIBILITY_CHOICES = [
        ('public', 'Public'),
        ('college_only', 'College Only'),
        ('invite_only', 'Invite Only'),
        ('private_link', 'Private Link'),
    ]
    
    ATTENDANCE_METHOD_CHOICES = [
        ('qr', 'QR Code'),
        ('manual', 'Manual'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='events')
    creator = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_events')
    club = models.ForeignKey('clubs.Club', on_delete=models.SET_NULL, null=True, blank=True, related_name='events')
    
    title = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(null=True, blank=True)
    short_description = models.TextField(null=True, blank=True)
    
    event_type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='draft')
    visibility = models.CharField(max_length=20, choices=VISIBILITY_CHOICES, default='public')
    
    start_date = models.DateTimeField(null=True, blank=True)
    end_date = models.DateTimeField(null=True, blank=True)
    registration_start = models.DateTimeField(null=True, blank=True)
    registration_end = models.DateTimeField(null=True, blank=True)
    
    max_participants = models.IntegerField(null=True, blank=True)
    current_participants = models.IntegerField(default=0)
    
    banner_image_url = models.URLField(null=True, blank=True)
    is_public = models.BooleanField(default=False)
    allow_teams = models.BooleanField(default=False)
    team_min_size = models.IntegerField(default=1)
    team_max_size = models.IntegerField(default=4)
    timezone = models.CharField(max_length=50, default='UTC')
    
    tags = models.JSONField(default=list, blank=True)
    
    # Venue
    venue_type = models.CharField(max_length=20, choices=VENUE_TYPE_CHOICES, default='offline')
    venue_location = models.CharField(max_length=255, null=True, blank=True)
    venue_room = models.CharField(max_length=100, null=True, blank=True)
    online_platform = models.CharField(max_length=100, null=True, blank=True)
    meeting_link = models.URLField(null=True, blank=True)
    
    # Payments
    is_paid = models.BooleanField(default=False)
    fee_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    payment_deadline_at = models.DateTimeField(null=True, blank=True)
    
    # Certificates
    certificates_enabled = models.BooleanField(default=False)
    certificate_template_url = models.URLField(null=True, blank=True)
    
    # Attendance
    attendance_method = models.CharField(max_length=20, choices=ATTENDANCE_METHOD_CHOICES, default='qr')
    
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.title

class EventRole(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='roles')
    name = models.CharField(max_length=100)
    color = models.CharField(max_length=7, default='#94a3b8')
    permissions = models.JSONField(default=list)
    order = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class EventStaff(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='staff')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='event_staff_roles')
    roles = models.ManyToManyField(EventRole, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    class Meta:
        unique_together = ('event', 'user')

class EventRegistrationField(models.Model):
    FIELD_TYPE_CHOICES = [
        ('text', 'Text'),
        ('number', 'Number'),
        ('email', 'Email'),
        ('phone', 'Phone'),
        ('date', 'Date'),
        ('select', 'Select'),
        ('multiselect', 'Multi-select'),
        ('checkbox', 'Checkbox'),
        ('radio', 'Radio'),
        ('textarea', 'Text Area'),
        ('file', 'File'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registration_fields')
    label = models.CharField(max_length=255)
    key = models.CharField(max_length=100)
    type = models.CharField(max_length=20, choices=FIELD_TYPE_CHOICES, default='text')
    required = models.BooleanField(default=False)
    order = models.IntegerField(default=0)
    placeholder = models.CharField(max_length=255, null=True, blank=True)
    help_text = models.TextField(null=True, blank=True)
    options = models.JSONField(null=True, blank=True)
    validation = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class EventRegistrationResponse(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='registration_responses')
    participant = models.ForeignKey('participants.Participant', on_delete=models.CASCADE, related_name='field_responses')
    field = models.ForeignKey(EventRegistrationField, on_delete=models.CASCADE, related_name='responses')
    value_text = models.TextField(null=True, blank=True)
    value_number = models.IntegerField(null=True, blank=True)
    value_bool = models.BooleanField(null=True, blank=True)
    value_file_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class EventScheduleDay(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='schedule_days')
    day_index = models.IntegerField()
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    start_at = models.DateTimeField(null=True, blank=True)
    end_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Submission(models.Model):
    TYPE_CHOICES = [
        ('project', 'Project'),
        ('poster', 'Poster'),
        ('resume', 'Resume'),
        ('other', 'Other'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='submissions')
    event = models.ForeignKey(Event, on_delete=models.CASCADE, related_name='submissions')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='submissions')
    team = models.ForeignKey('participants.Team', on_delete=models.CASCADE, null=True, blank=True, related_name='submissions')
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    title = models.CharField(max_length=255, null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    file_url = models.URLField()
    file_key = models.CharField(max_length=255)
    mime_type = models.CharField(max_length=100, null=True, blank=True)
    size_bytes = models.IntegerField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
