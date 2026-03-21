from rest_framework import generics, permissions, status, views, filters
from rest_framework.response import Response
from django.db.models import Q
from .models import Event, EventRole, EventStaff, EventRegistrationField
from .serializers import (
    EventSerializer, EventListSerializer, 
    EventRoleSerializer, EventStaffSerializer,
    EventRegistrationFieldSerializer
)
from django_filters.rest_framework import DjangoFilterBackend

class EventDiscoverView(generics.ListAPIView):
    serializer_class = EventListSerializer
    permission_classes = [permissions.AllowAny]
    filter_backends = [DjangoFilterBackend, filters.SearchFilter, filters.OrderingFilter]
    search_fields = ['title', 'description']
    ordering_fields = ['start_date', 'created_at', 'current_participants']

    def get_queryset(self):
        tenant = getattr(self.request, 'tenant', None)
        is_admin = self.request.user.is_authenticated and self.request.user.role == 'admin'
        
        conditions = Q()
        
        if not is_admin:
            conditions &= Q(status='published')

        if tenant:
            if is_admin:
                conditions &= Q(tenant=tenant)
            else:
                # Same-tenant discovery: public OR college_only
                conditions &= Q(tenant=tenant) & Q(visibility__in=['public', 'college_only'])
        else:
            # Cross-tenant discovery (global)
            if not is_admin:
                conditions &= Q(visibility='public')
        
        # Additional filters from query params
        q = self.request.query_params.get('q')
        if q:
            conditions &= (Q(title__icontains=q) | Q(description__icontains=q))

        club_id = self.request.query_params.get('clubId')
        if club_id:
            conditions &= Q(club_id=club_id)

        # Date range
        date_from = self.request.query_params.get('dateFrom')
        if date_from:
            conditions &= Q(start_date__gte=date_from)
        
        date_to = self.request.query_params.get('dateTo')
        if date_to:
            conditions &= Q(start_date__lte=date_to)

        return Event.objects.filter(conditions).select_related('club').distinct()

class EventListCreateView(generics.ListCreateAPIView):
    def get_serializer_class(self):
        if self.request.method == 'POST':
            return EventSerializer
        return EventListSerializer

    def get_permissions(self):
        if self.request.method == 'POST':
            return [permissions.IsAuthenticated()] # Simplified for now
        return [permissions.AllowAny()]

    def get_queryset(self):
        tenant = self.request.tenant
        user = self.request.user
        manage = self.request.query_params.get('manage') == 'true'
        is_admin = user.is_authenticated and user.role == 'admin'

        conditions = Q(tenant=tenant)

        if manage:
            if not is_admin:
                # Restricted to owner or staff
                staff_event_ids = EventStaff.objects.filter(user=user).values_list('event_id', flat=True)
                conditions &= (Q(creator=user) | Q(id__in=staff_event_ids))
        else:
            # Public view
            if not is_admin:
                conditions &= Q(status='published')

        return Event.objects.filter(conditions).select_related('club')

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant, creator=self.request.user)

class EventDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = EventSerializer
    
    def get_queryset(self):
        return Event.objects.filter(tenant=self.request.tenant)

    def get_object(self):
        queryset = self.get_queryset()
        identifier = self.kwargs.get('idOrSlug')
        
        # Try ID first, then slug
        try:
            return queryset.get(id=identifier)
        except (Event.DoesNotExist, ValueError):
            return queryset.get(slug=identifier)

    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()]
        return [permissions.AllowAny()]

class EventPublishView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, id):
        try:
            event = Event.objects.get(id=id, tenant=request.tenant)
            # Permission check: owner or staff with manage permission
            # For now, owner or admin
            if event.creator != request.user and request.user.role != 'admin':
                return Response({"error": "Unauthorized"}, status=status.HTTP_403_FORBIDDEN)
            
            event.status = 'published'
            event.save()
            return Response({"status": "published"})
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)
