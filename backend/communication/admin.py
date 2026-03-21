from django.contrib import admin
from .models import Announcement, Notification, Feedback

admin.site.register(Announcement)
admin.site.register(Notification)
admin.site.register(Feedback)
