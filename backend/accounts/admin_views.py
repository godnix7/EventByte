from rest_framework import views, status, permissions
from rest_framework.response import Response
from django.contrib.auth import get_user_model
from .serializers import UserSerializer
from events.models import Event
from clubs.models import Club
from tenants.models import Tenant
from django.shortcuts import get_object_or_404
from django.utils import timezone

User = get_user_model()

class IsAdminUser(permissions.BasePermission):
    def has_permission(self, request, view):
        return request.user and (request.user.is_staff or request.user.role == 'admin')

class PlatformStatsView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        stats = {
            'users': User.objects.count(),
            'events': Event.objects.count(),
            'clubs': Club.objects.count(),
            'pendingOrganizers': User.objects.filter(role='organizer', organizer_status='pending').count(),
            'tenants': Tenant.objects.count(),
        }
        return Response({'stats': stats})

class AdminUserListView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        users = User.objects.all().order_by('-date_joined')
        return Response({'users': UserSerializer(users, many=True).data})

class PendingOrganizerListView(views.APIView):
    permission_classes = [IsAdminUser]

    def get(self, request):
        organizers = User.objects.filter(role='organizer', organizer_status='pending').order_by('-date_joined')
        return Response({'organizers': UserSerializer(organizers, many=True).data})

class ApproveOrganizerView(views.APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.organizer_status = 'approved'
        user.save()
        return Response({'message': 'Organizer approved successfully'})

class RejectOrganizerView(views.APIView):
    permission_classes = [IsAdminUser]

    def patch(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.organizer_status = 'rejected'
        user.save()
        return Response({'message': 'Organizer rejected successfully'})

class AdminEditUserView(views.APIView):
    permission_classes = [IsAdminUser]

    def put(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        serializer = UserSerializer(user, data=request.data, partial=True)
        serializer.is_valid(raise_exception=True)
        
        # Handle password change if provided
        password = request.data.get('password')
        if password:
            user.set_password(password)
            user.save()
            
        serializer.save()
        return Response(serializer.data)

class BanUserView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        reason = request.data.get('reason', 'No reason provided')
        user.is_banned = True
        user.ban_reason = reason
        user.banned_at = timezone.now()
        user.is_active = False
        user.save()
        return Response({'message': 'User banned successfully'})

class UnbanUserView(views.APIView):
    permission_classes = [IsAdminUser]

    def post(self, request, pk):
        user = get_object_or_404(User, pk=pk)
        user.is_banned = False
        user.ban_reason = None
        user.banned_at = None
        user.is_active = True
        user.save()
        return Response({'message': 'User unbanned successfully'})
