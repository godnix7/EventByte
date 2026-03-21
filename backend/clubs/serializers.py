from rest_framework import serializers
from .models import Club, ClubMember
from accounts.serializers import UserSerializer

class ClubSerializer(serializers.ModelSerializer):
    class Meta:
        model = Club
        fields = ['id', 'name', 'slug', 'description', 'logo_url', 'created_at', 'updated_at']
        read_only_fields = ['id', 'created_at', 'updated_at']

class ClubMemberSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = ClubMember
        fields = ['id', 'user', 'role', 'joined_at']
        read_only_fields = ['id', 'joined_at']
