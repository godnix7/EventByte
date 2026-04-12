from rest_framework import serializers
from django.contrib.auth import get_user_model
from tenants.models import Tenant

User = get_user_model()

class UserSerializer(serializers.ModelSerializer):
    firstName = serializers.CharField(source='first_name', required=False)
    lastName = serializers.CharField(source='last_name', required=False)
    profilePhotoUrl = serializers.URLField(source='profile_photo_url', required=False)
    organizerStatus = serializers.CharField(source='organizer_status', read_only=True)
    collegeName = serializers.CharField(source='college_name', required=False)

    createdAt = serializers.DateTimeField(source='date_joined', read_only=True)
    isActive = serializers.BooleanField(source='is_active')
    isBanned = serializers.BooleanField(source='is_banned', read_only=True)
    banReason = serializers.CharField(source='ban_reason', read_only=True)

    class Meta:
        model = User
        fields = [
            'id', 'username', 'email', 'firstName', 'lastName', 
            'role', 'organizerStatus', 'profilePhotoUrl', 'bio', 
            'collegeName', 'phone', 'createdAt', 'isActive',
            'isBanned', 'banReason'
        ]
        read_only_fields = ['id', 'role', 'organizerStatus', 'createdAt', 'isBanned', 'banReason']

class RegisterSerializer(serializers.Serializer):
    username = serializers.CharField(max_length=150)
    email = serializers.EmailField()
    password = serializers.CharField(write_only=True)
    first_name = serializers.CharField(max_length=150, required=False)
    last_name = serializers.CharField(max_length=150, required=False)
    role_choice = serializers.ChoiceField(choices=['participant', 'organizer'], default='participant')

    def validate(self, data):
        errors = {}
        if User.objects.filter(username=data.get('username')).exists():
            errors['username'] = "Username already exists"
        if User.objects.filter(email=data.get('email')).exists():
            errors['email'] = "Email already exists"
            
        if errors:
            raise serializers.ValidationError(errors)
        return data

    def create(self, validated_data):
        role_choice = validated_data.pop('role_choice')
        role = 'organizer' if role_choice == 'organizer' else 'participant'
        organizer_status = 'pending' if role == 'organizer' else None
        
        # Tenant should be provided by the view from request context
        tenant = self.context.get('tenant')
        
        user = User.objects.create_user(
            tenant=tenant,
            username=validated_data['username'],
            email=validated_data['email'],
            password=validated_data['password'],
            first_name=validated_data.get('first_name', ''),
            last_name=validated_data.get('last_name', ''),
            role=role,
            organizer_status=organizer_status
        )
        return user
