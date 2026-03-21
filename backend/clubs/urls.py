from django.urls import path
from .views import ClubListCreateView, ClubDetailView, ClubMemberAddView

urlpatterns = [
    path('', ClubListCreateView.as_view(), name='club-list'),
    path('<slug:slug>/', ClubDetailView.as_view(), name='club-detail'),
    path('<str:club_id>/members/', ClubMemberAddView.as_view(), name='club-member-add'),
]
