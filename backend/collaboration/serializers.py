from rest_framework import serializers
from .models import Committee, CommitteeMember, CommitteeGroup, Volunteer, Task
from accounts.serializers import UserSerializer

class CommitteeSerializer(serializers.ModelSerializer):
    class Meta:
        model = Committee
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class CommitteeMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = CommitteeMember
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class CommitteeGroupSerializer(serializers.ModelSerializer):
    class Meta:
        model = CommitteeGroup
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class VolunteerSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Volunteer
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class TaskSerializer(serializers.ModelSerializer):
    assigned_by = UserSerializer(read_only=True)
    assigned_to = UserSerializer(read_only=True)
    
    class Meta:
        model = Task
        fields = '__all__'
        read_only_fields = ['id', 'assigned_by', 'created_at', 'updated_at', 'completed_at']
