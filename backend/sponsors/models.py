import uuid
from django.db import models
from django.conf import settings

class Sponsor(models.Model):
    TIER_CHOICES = [
        ('platinum', 'Platinum'),
        ('gold', 'Gold'),
        ('silver', 'Silver'),
        ('bronze', 'Bronze'),
        ('supporter', 'Supporter'),
    ]
    
    PAYMENT_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('partial', 'Partial'),
        ('paid', 'Paid'),
        ('cancelled', 'Cancelled'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='sponsors')
    company_name = models.CharField(max_length=255)
    contact_person = models.CharField(max_length=255, null=True, blank=True)
    email = models.EmailField(null=True, blank=True)
    phone = models.CharField(max_length=20, null=True, blank=True)
    website_url = models.URLField(null=True, blank=True)
    sponsorship_tier = models.CharField(max_length=20, choices=TIER_CHOICES)
    amount_committed = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    amount_paid = models.DecimalField(max_digits=10, decimal_places=2, default=0)
    payment_status = models.CharField(max_length=20, choices=PAYMENT_STATUS_CHOICES, default='pending')
    logo_url = models.URLField(null=True, blank=True)
    booth_space = models.CharField(max_length=100, null=True, blank=True)
    perks = models.JSONField(null=True, blank=True)
    notes = models.TextField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Expense(models.Model):
    CATEGORY_CHOICES = [
        ('venue', 'Venue'),
        ('food', 'Food'),
        ('prizes', 'Prizes'),
        ('equipment', 'Equipment'),
        ('marketing', 'Marketing'),
        ('logistics', 'Logistics'),
        ('printing', 'Printing'),
        ('miscellaneous', 'Miscellaneous'),
    ]
    
    STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('paid', 'Paid'),
        ('rejected', 'Rejected'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='expenses')
    category = models.CharField(max_length=20, choices=CATEGORY_CHOICES)
    title = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    estimated_amount = models.DecimalField(max_digits=10, decimal_places=2, null=True, blank=True)
    currency = models.CharField(max_length=10, default='INR')
    status = models.CharField(max_length=20, choices=STATUS_CHOICES, default='pending')
    receipt_url = models.URLField(null=True, blank=True)
    approved_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.SET_NULL, null=True, blank=True, related_name='approved_expenses')
    created_by = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='created_expenses')
    paid_at = models.DateTimeField(null=True, blank=True)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
