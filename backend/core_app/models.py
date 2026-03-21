import uuid
from django.db import models

class Category(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey('tenants.Tenant', on_delete=models.CASCADE, related_name='categories', null=True)
    name = models.CharField(max_length=255)
    slug = models.SlugField(unique=True)
    description = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return self.name

    class Meta:
        verbose_name_plural = "Categories"

class Venue(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    # Venue can be event specific or global. For now, let's keep it event specific as per schema.
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='venues')
    name = models.CharField(max_length=255)
    address = models.TextField(null=True, blank=True)
    city = models.CharField(max_length=100, null=True, blank=True)
    state = models.CharField(max_length=100, null=True, blank=True)
    country = models.CharField(max_length=100, null=True, blank=True)
    postal_code = models.CharField(max_length=20, null=True, blank=True)
    latitude = models.DecimalField(max_digits=10, decimal_places=8, null=True, blank=True)
    longitude = models.DecimalField(max_digits=11, decimal_places=8, null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    parking_available = models.BooleanField(default=False)
    wifi_available = models.BooleanField(default=False)
    map_url = models.URLField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Room(models.Model):
    ROOM_TYPE_CHOICES = [
        ('main_stage', 'Main Stage'),
        ('workshop', 'Workshop'),
        ('breakout', 'Breakout'),
        ('judging', 'Judging'),
        ('registration', 'Registration'),
        ('vip_lounge', 'VIP Lounge'),
        ('cafeteria', 'Cafeteria'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    venue = models.ForeignKey(Venue, on_delete=models.CASCADE, related_name='rooms')
    name = models.CharField(max_length=255)
    floor = models.CharField(max_length=50, null=True, blank=True)
    capacity = models.IntegerField(null=True, blank=True)
    room_type = models.CharField(max_length=20, choices=ROOM_TYPE_CHOICES)
    equipment = models.JSONField(default=list, blank=True)
    is_available = models.BooleanField(default=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
