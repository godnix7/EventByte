from rest_framework import serializers
from .models import Sponsor, Expense
from accounts.serializers import UserSerializer

class SponsorSerializer(serializers.ModelSerializer):
    class Meta:
        model = Sponsor
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']

class ExpenseSerializer(serializers.ModelSerializer):
    created_by = UserSerializer(read_only=True)
    approved_by = UserSerializer(read_only=True)
    
    class Meta:
        model = Expense
        fields = '__all__'
        read_only_fields = ['id', 'created_by', 'approved_by', 'created_at', 'updated_at', 'paid_at']
