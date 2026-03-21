from django.urls import path
from .views import (
    CommitteeListCreateView, CommitteeMemberAddView, CommitteeMemberListView,
    VolunteerAssignView, VolunteerListView, TaskListCreateView, TaskUpdateStatusView
)

urlpatterns = [
    # Committees
    path('events/<str:event_id>/committees/', CommitteeListCreateView.as_view(), name='committee-list-create'),
    path('committees/<str:committee_id>/members/', CommitteeMemberAddView.as_view(), name='committee-member-add'),
    path('committees/<str:committee_id>/members-list/', CommitteeMemberListView.as_view(), name='committee-member-list'),
    
    # Volunteers
    path('events/<str:event_id>/volunteers/', VolunteerAssignView.as_view(), name='volunteer-assign'),
    path('events/<str:event_id>/volunteers-list/', VolunteerListView.as_view(), name='volunteer-list'),
    
    # Tasks
    path('events/<str:event_id>/tasks/', TaskListCreateView.as_view(), name='task-list-create'),
    path('tasks/<str:task_id>/status/', TaskUpdateStatusView.as_view(), name='task-update-status'),
]
