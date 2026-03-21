import uuid
from django.db import models

class Tenant(models.Model):
    STATUS_CHOICES = [
        ('active', 'Active'),
        ('suspended', 'Suspended'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='active')
    branding_json = models.JSONField(null=True, blank=True)
    config = models.JSONField(default=dict)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            # Simple ID generation to mimic cuid2 style if needed, 
            # or just use uuid/random string
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name
