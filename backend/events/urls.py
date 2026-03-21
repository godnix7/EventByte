from django.urls import path
from .views import (
    EventDiscoverView, EventListCreateView, 
    EventDetailView, EventPublishView
)

urlpatterns = [
    path('discover/', EventDiscoverView.as_view(), name='event-discover'),
    path('', EventListCreateView.as_view(), name='event-list-create'),
    path('<str:idOrSlug>/', EventDetailView.as_view(), name='event-detail'),
    path('<str:id>/publish/', EventPublishView.as_view(), name='event-publish'),
    # Wizard and other routes can be added here
]
