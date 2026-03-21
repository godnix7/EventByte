from django.urls import path
from .views import (
    AnnouncementListCreateView, NotificationListView, 
    NotificationReadView, FeedbackListCreateView
)

urlpatterns = [
    path('events/<str:event_id>/announcements/', AnnouncementListCreateView.as_view(), name='announcement-list-create'),
    path('notifications/', NotificationListView.as_view(), name='notification-list'),
    path('notifications/<str:notification_id>/read/', NotificationReadView.as_view(), name='notification-read'),
    path('events/<str:event_id>/feedback/', FeedbackListCreateView.as_view(), name='feedback-list-create'),
]
