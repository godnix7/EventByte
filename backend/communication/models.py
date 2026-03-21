import uuid
from django.db import models
from django.conf import settings

class Announcement(models.Model):
    TYPE_CHOICES = [
        ('update', 'Update'),
        ('urgent', 'Urgent'),
        ('reminder', 'Reminder'),
        ('info', 'Info'),
        ('achievement', 'Achievement'),
    ]
    
    TARGET_AUDIENCE_CHOICES = [
        ('all', 'All'),
        ('committee', 'Committee'),
        ('participants', 'Participants'),
        ('volunteers', 'Volunteers'),
        ('judges', 'Judges'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='announcements')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_announcements')
    title = models.CharField(max_length=255)
    content = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES, default='update')
    target_audience = models.CharField(max_length=20, choices=TARGET_AUDIENCE_CHOICES, default='all')
    is_pinned = models.BooleanField(default=False)
    read_count = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Notification(models.Model):
    TYPE_CHOICES = [
        ('reminder', 'Reminder'),
        ('announcement', 'Announcement'),
        ('message', 'Message'),
        ('task', 'Task'),
        ('achievement', 'Achievement'),
        ('registration', 'Registration'),
        ('score', 'Score'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='notifications')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, null=True, blank=True, related_name='notifications')
    title = models.CharField(max_length=255)
    message = models.TextField()
    type = models.CharField(max_length=20, choices=TYPE_CHOICES)
    is_read = models.BooleanField(default=False)
    action_url = models.CharField(max_length=255, null=True, blank=True)
    metadata = models.JSONField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Message(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    sender = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='sent_messages')
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, null=True, blank=True, related_name='messages')
    group = models.ForeignKey('collaboration.CommitteeGroup', on_delete=models.SET_NULL, null=True, blank=True, related_name='messages')
    recipient = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, null=True, blank=True, related_name='received_messages')
    message_text = models.TextField(null=True, blank=True)
    file_url = models.URLField(null=True, blank=True)
    file_name = models.CharField(max_length=255, null=True, blank=True)
    file_type = models.CharField(max_length=100, null=True, blank=True)
    is_edited = models.BooleanField(default=False)
    is_deleted = models.BooleanField(default=False)
    reply_to = models.ForeignKey('self', on_delete=models.SET_NULL, null=True, blank=True, related_name='replies')
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Feedback(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='feedbacks')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='given_feedbacks')
    overall_rating = models.IntegerField()
    organization_rating = models.IntegerField()
    venue_rating = models.IntegerField()
    content_rating = models.IntegerField()
    would_recommend = models.BooleanField()
    feedback_text = models.TextField(null=True, blank=True)
    improvements = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
