import uuid
from django.db import models
from django.conf import settings

class Committee(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='committees')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    color = models.CharField(max_length=20, null=True, blank=True)
    total_members = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.name} ({self.event.title})"

class CommitteeMember(models.Model):
    ROLE_CHOICES = [
        ('head', 'Head'),
        ('co_head', 'Co-Head'),
        ('lead', 'Lead'),
        ('coordinator', 'Coordinator'),
        ('member', 'Member'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    committee = models.ForeignKey(Committee, on_delete=models.CASCADE, related_name='members')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='committee_memberships')
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='member')
    department = models.CharField(max_length=100, null=True, blank=True)
    phone_for_event = models.CharField(max_length=20, null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class CommitteeGroup(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    committee = models.ForeignKey(Committee, on_delete=models.CASCADE, related_name='groups')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    group_lead = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='led_groups')
    total_members = models.IntegerField(default=0)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Volunteer(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('inactive', 'Inactive'),
        ('completed', 'Completed'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='volunteers')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='volunteer_roles')
    role_title = models.CharField(max_length=255)
    department = models.CharField(max_length=100, null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    hours_assigned = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    hours_completed = models.DecimalField(max_digits=5, decimal_places=2, default=0)
    certificate_issued = models.TextField(null=True, blank=True)
    joined_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Task(models.Model):
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('in_progress', 'In Progress'),
        ('review', 'Review'),
        ('completed', 'Completed'),
        ('cancelled', 'Cancelled'),
    ]
    
    PRIORITY_CHOICES = [
        ('low', 'Low'),
        ('medium', 'Medium'),
        ('high', 'High'),
        ('urgent', 'Urgent'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='tasks')
    committee = models.ForeignKey(Committee, on_delete=models.SET_NULL, null=True, blank=True, related_name='tasks')
    assigned_to = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='assigned_tasks')
    assigned_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_tasks')
    
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    priority = models.CharField(max_length=20, choices=PRIORITY_CHOICES, default='medium')
    
    due_date = models.DateTimeField(null=True, blank=True)
    estimated_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    actual_hours = models.DecimalField(max_digits=5, decimal_places=2, null=True, blank=True)
    tags = models.JSONField(default=list, blank=True)
    
    created_at = models.DateTimeField(auto_now_add=True)
    completed_at = models.DateTimeField(null=True, blank=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
