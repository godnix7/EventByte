from django.urls import path
from .admin_views import (
    PlatformStatsView, AdminUserListView, PendingOrganizerListView,
    ApproveOrganizerView, RejectOrganizerView, AdminEditUserView,
    BanUserView, UnbanUserView
)

urlpatterns = [
    path('stats', PlatformStatsView.as_view(), name='admin_stats'),
    path('users/all', AdminUserListView.as_view(), name='admin_user_list'),
    path('users/pending-organizers', PendingOrganizerListView.as_view(), name='admin_pending_organizers'),
    path('users/<str:pk>/approve-organizer', ApproveOrganizerView.as_view(), name='admin_approve_organizer'),
    path('users/<str:pk>/reject-organizer', RejectOrganizerView.as_view(), name='admin_reject_organizer'),
    path('users/<str:pk>/edit', AdminEditUserView.as_view(), name='admin_edit_user'),
    path('users/<str:pk>/ban', BanUserView.as_view(), name='admin_ban_user'),
    path('users/<str:pk>/unban', UnbanUserView.as_view(), name='admin_unban_user'),
]
