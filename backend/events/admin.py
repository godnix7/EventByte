from django.contrib import admin
from .models import Event, EventRole, EventStaff, EventRegistrationField, EventRegistrationResponse, EventScheduleDay, Submission

@admin.register(Event)
class EventAdmin(admin.ModelAdmin):
    list_display = ('title', 'tenant', 'status', 'event_type', 'start_date')
    list_filter = ('status', 'event_type', 'tenant')
    search_fields = ('title', 'slug')

admin.site.register(EventRole)
admin.site.register(EventStaff)
admin.site.register(EventRegistrationField)
admin.site.register(EventRegistrationResponse)
admin.site.register(EventScheduleDay)
admin.site.register(Submission)
