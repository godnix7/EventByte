from rest_framework import serializers
from .models import Team, Participant
from events.serializers import EventSerializer
from accounts.serializers import UserSerializer

class TeamSerializer(serializers.ModelSerializer):
    team_lead = UserSerializer(read_only=True)
    
    class Meta:
        model = Team
        fields = '__all__'
        read_only_fields = ['id', 'tenant', 'event', 'team_lead', 'current_members', 'created_at', 'updated_at']

class ParticipantSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    team = TeamSerializer(read_only=True)
    
    class Meta:
        model = Participant
        fields = '__all__'
        read_only_fields = ['id', 'tenant', 'event', 'user', 'registration_number', 'registration_date', 'updated_at']
