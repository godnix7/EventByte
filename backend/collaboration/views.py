from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Committee, CommitteeMember, Volunteer, Task
from .serializers import (
    CommitteeSerializer, CommitteeMemberSerializer, 
    VolunteerSerializer, TaskSerializer
)
from django.utils import timezone

class CommitteeListCreateView(generics.ListCreateAPIView):
    serializer_class = CommitteeSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Committee.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'))

class CommitteeMemberAddView(generics.CreateAPIView):
    serializer_class = CommitteeMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(committee_id=self.kwargs.get('committee_id'))

class CommitteeMemberListView(generics.ListAPIView):
    serializer_class = CommitteeMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return CommitteeMember.objects.filter(committee_id=self.kwargs.get('committee_id'))

class VolunteerAssignView(generics.CreateAPIView):
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'))

class VolunteerListView(generics.ListAPIView):
    serializer_class = VolunteerSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Volunteer.objects.filter(event_id=self.kwargs.get('event_id'))

class TaskListCreateView(generics.ListCreateAPIView):
    serializer_class = TaskSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Task.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'), assigned_by=self.request.user)

class TaskUpdateStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, task_id):
        try:
            task = Task.objects.get(id=task_id)
            status = request.data.get('status')
            task.status = status
            if status == 'completed':
                task.completed_at = timezone.now()
            else:
                task.completed_at = None
            task.save()
            return Response(TaskSerializer(task).data)
        except Task.DoesNotExist:
            return Response({"error": "Task not found"}, status=status.HTTP_404_NOT_FOUND)
