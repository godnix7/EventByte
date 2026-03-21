from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Judge, ScoringRubric, Score
from .serializers import ScoringRubricSerializer, JudgeSerializer, ScoreSerializer

class ScoringRubricListCreateView(generics.ListCreateAPIView):
    serializer_class = ScoringRubricSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return ScoringRubric.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        criteria = serializer.validated_data.get('criteria', [])
        total_max = sum(int(c.get('max_points', 0)) * int(c.get('weight', 1)) for c in criteria)
        serializer.save(event_id=self.kwargs.get('event_id'), total_max_points=str(total_max))

class JudgeListCreateView(generics.ListCreateAPIView):
    serializer_class = JudgeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Judge.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'))

class JudgeDetailView(generics.RetrieveDestroyAPIView):
    serializer_class = JudgeSerializer
    queryset = Judge.objects.all()
    lookup_field = 'id'

class ScoreSubmitView(generics.CreateAPIView):
    serializer_class = ScoreSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        # judge_id would ideally be linked to the logged in user as a Judge
        # For now, we take it from data or request context if we had a proper Judge role
        serializer.save()
        # Real-time event would be triggered here (e.g. via Django Channels)
