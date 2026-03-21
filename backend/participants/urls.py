from django.urls import path
from .views import (
    ParticipantRegisterView, ParticipantUnregisterView,
    TeamCreateView, ParticipantListView, ParticipantCheckInView
)

urlpatterns = [
    path('events/<str:event_id>/register/', ParticipantRegisterView.as_view(), name='participant-register'),
    path('events/<str:event_id>/unregister/', ParticipantUnregisterView.as_view(), name='participant-unregister'),
    path('events/<str:event_id>/teams/', TeamCreateView.as_view(), name='team-create'),
    path('events/<str:event_id>/participants/', ParticipantListView.as_view(), name='participant-list'),
    path('events/<str:event_id>/checkin/', ParticipantCheckInView.as_view(), name='participant-checkin'),
]
