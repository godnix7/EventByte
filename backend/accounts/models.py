import uuid
from django.contrib.auth.models import AbstractUser, BaseUserManager
from django.db import models
from tenants.models import Tenant

class UserManager(BaseUserManager):
    def create_user(self, email, password=None, **extra_fields):
        if not email:
            raise ValueError('The Email field must be set')
        email = self.normalize_email(email)
        user = self.model(email=email, **extra_fields)
        user.set_password(password)
        user.save(using=self._db)
        return user

    def create_superuser(self, email, password=None, **extra_fields):
        extra_fields.setdefault('is_staff', True)
        extra_fields.setdefault('is_superuser', True)
        extra_fields.setdefault('role', 'admin')
        return self.create_user(email, password, **extra_fields)

class User(AbstractUser):
    ROLE_CHOICES = [
        ('admin', 'Admin'),
        ('organizer', 'Organizer'),
        ('tenant_admin', 'Tenant Admin'),
        ('committee_member', 'Committee Member'),
        ('judge', 'Judge'),
        ('volunteer', 'Volunteer'),
        ('participant', 'Participant'),
    ]

    AUTH_PROVIDER_CHOICES = [
        ('local', 'Local'),
        ('google', 'Google'),
    ]

    ORGANIZER_STATUS_CHOICES = [
        ('pending', 'Pending'),
        ('approved', 'Approved'),
        ('rejected', 'Rejected'),
    ]

    id = models.CharField(primary_key=True, max_length=36, editable=False)
    tenant = models.ForeignKey(Tenant, on_delete=models.CASCADE, related_name='users', null=True, blank=True)
    email = models.EmailField(unique=True)
    username = models.CharField(max_length=150, unique=True)
    
    auth_provider = models.CharField(max_length=20, choices=AUTH_PROVIDER_CHOICES, default='local')
    google_id = models.CharField(max_length=255, unique=True, null=True, blank=True)
    
    phone = models.CharField(max_length=20, null=True, blank=True)
    profile_photo_url = models.URLField(null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    college_name = models.CharField(max_length=255, null=True, blank=True)
    
    role = models.CharField(max_length=20, choices=ROLE_CHOICES, default='participant')
    organizer_status = models.CharField(max_length=20, choices=ORGANIZER_STATUS_CHOICES, null=True, blank=True)
    
    is_banned = models.BooleanField(default=False)
    banned_at = models.DateTimeField(null=True, blank=True)
    ban_reason = models.TextField(null=True, blank=True)
    
    email_verified = models.BooleanField(default=False)
    email_verification_token = models.CharField(max_length=255, null=True, blank=True)
    
    password_reset_token = models.CharField(max_length=255, null=True, blank=True)
    password_reset_expires = models.DateTimeField(null=True, blank=True)

    objects = UserManager()

    USERNAME_FIELD = 'email'
    REQUIRED_FIELDS = ['username', 'first_name', 'last_name']

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

    def __str__(self):
        return f"{self.email} ({self.role})"
