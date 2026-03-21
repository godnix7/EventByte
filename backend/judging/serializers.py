from rest_framework import serializers
from .models import Judge, ScoringRubric, Score
from accounts.serializers import UserSerializer

class ScoringRubricSerializer(serializers.ModelSerializer):
    class Meta:
        model = ScoringRubric
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at', 'total_max_points']

class JudgeSerializer(serializers.ModelSerializer):
    user = UserSerializer(read_only=True)
    
    class Meta:
        model = Judge
        fields = '__all__'
        read_only_fields = ['id', 'created_at']

class ScoreSerializer(serializers.ModelSerializer):
    class Meta:
        model = Score
        fields = '__all__'
        read_only_fields = ['id', 'created_at', 'updated_at']
