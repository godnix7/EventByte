from rest_framework import serializers
from .models import (
    Event, EventRole, EventStaff, 
    EventRegistrationField, EventRegistrationResponse, 
    EventScheduleDay, Submission
)
from clubs.serializers import ClubSerializer
from accounts.serializers import UserSerializer

class EventRoleSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRole
        fields = ['id', 'name', 'color', 'permissions', 'order', 'created_at']
        read_only_fields = ['id', 'created_at']

class EventStaffSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    roles = EventRoleSerializer(many=True, read_only=True)
    
    class Meta:
        model = EventStaff
        fields = ['id', 'user', 'roles', 'joined_at']
        read_only_fields = ['id', 'joined_at']

class EventRegistrationFieldSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistrationField
        fields = [
            'id', 'label', 'key', 'type', 'required', 'order', 
            'placeholder', 'help_text', 'options', 'validation'
        ]
        read_only_fields = ['id']

class EventScheduleDaySerializer(serializers.ModelSerializer):
    class Meta:
        model = EventScheduleDay
        fields = ['id', 'day_index', 'title', 'description', 'start_at', 'end_at']
        read_only_fields = ['id']

class EventSerializer(serializers.ModelSerializer):
    club = ClubSerializer(read_only=True)
    creator = UserSerializer(read_only=True)
    roles = EventRoleSerializer(many=True, read_only=True)
    schedule_days = EventScheduleDaySerializer(many=True, read_only=True)
    registration_fields = EventRegistrationFieldSerializer(many=True, read_only=True)
    
    class Meta:
        model = Event
        fields = '__all__'
        read_only_fields = ['id', 'tenant', 'creator', 'current_participants', 'created_at', 'updated_at']

class EventListSerializer(serializers.ModelSerializer):
    club = serializers.SerializerMethodField()
    
    class Meta:
        model = Event
        fields = [
            'id', 'title', 'slug', 'description', 'short_description',
            'event_type', 'status', 'visibility', 'start_date', 'end_date',
            'banner_image_url', 'is_public', 'current_participants', 'club'
        ]

    def get_club(self, obj):
        if obj.club:
            return {
                'id': obj.club.id,
                'name': obj.club.name,
                'logo_url': obj.club.logo_url
            }
        return None

class EventRegistrationResponseSerializer(serializers.ModelSerializer):
    class Meta:
        model = EventRegistrationResponse
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class SubmissionSerializer(serializers.ModelSerializer):
    class Meta:
        model = Submission
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
