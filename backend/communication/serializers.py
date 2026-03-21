from rest_framework import serializers
from .models import Announcement, Notification, Feedback
from accounts.serializers import UserSerializer

class AnnouncementSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Announcement
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'read_count', 'created_at', 'updated_at']

class NotificationSerializer(serializers.ModelSerializer):
    class Meta:
        model = Notification
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class FeedbackSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Feedback
        fields = '__all__'
        read_only_fields = ['id', 'user', 'submitted_at']
