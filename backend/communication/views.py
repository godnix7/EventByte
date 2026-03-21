from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Announcement, Notification, Feedback
from .serializers import AnnouncementSerializer, NotificationSerializer, FeedbackSerializer

class AnnouncementListCreateView(generics.ListCreateAPIView):
    serializer_class = AnnouncementSerializer
    
    def get_queryset(self):
        return Announcement.objects.filter(event_id=self.kwargs.get('event_id'))

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()] # Adjust based on roles
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(created_by=self.request.user, event_id=self.kwargs.get('event_id'))

class NotificationListView(generics.ListAPIView):
    serializer_class = NotificationSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Notification.objects.filter(user=self.request.user).order_by('-created_at')

class NotificationReadView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, notification_id):
        try:
            notification = Notification.objects.get(id=notification_id, user=request.user)
            notification.is_read = True
            notification.save()
            return Response(NotificationSerializer(notification).data)
        except Notification.DoesNotExist:
            return Response({"error": "Notification not found"}, status=status.HTTP_404_NOT_FOUND)

class FeedbackListCreateView(generics.ListCreateAPIView):
    serializer_class = FeedbackSerializer

    def get_queryset(self):
        return Feedback.objects.filter(event_id=self.kwargs.get('event_id'))

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(user=self.request.user, event_id=self.kwargs.get('event_id'))
