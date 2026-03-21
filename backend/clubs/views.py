from rest_framework import generics, permissions, status
from rest_framework.response import Response
from .models import Club, ClubMember
from .serializers import ClubSerializer, ClubMemberSerializer

class ClubListCreateView(generics.ListCreateAPIView):
    serializer_class = ClubSerializer
    
    def get_queryset(self):
        return Club.objects.filter(tenant=self.request.tenant)

    def get_permissions(self):
        if self.request.method == 'POST':
            # In TS it was authorize(['admin'])
            return [permissions.IsAuthenticated()] # Adjust based on user roles later
        return [permissions.AllowAny()]

    def perform_create(self, serializer):
        serializer.save(tenant=self.request.tenant)

class ClubDetailView(generics.RetrieveUpdateDestroyAPIView):
    serializer_class = ClubSerializer
    lookup_field = 'slug'

    def get_queryset(self):
        return Club.objects.filter(tenant=self.request.tenant)
    
    def get_permissions(self):
        if self.request.method in ['PUT', 'PATCH', 'DELETE']:
            return [permissions.IsAuthenticated()] # Adjust based on roles
        return [permissions.AllowAny()]

class ClubMemberAddView(generics.CreateAPIView):
    serializer_class = ClubMemberSerializer
    permission_classes = [permissions.IsAuthenticated]

    def create(self, request, *args, **kwargs):
        club_id = self.kwargs.get('club_id')
        user_id = request.data.get('user_id')
        role = request.data.get('role', 'member')

        try:
            club = Club.objects.get(id=club_id, tenant=request.tenant)
        except Club.DoesNotExist:
            return Response({"error": "Club not found"}, status=status.HTTP_404_NOT_FOUND)

        member, created = ClubMember.objects.get_or_create(
            club=club,
            user_id=user_id,
            defaults={'role': role}
        )
        
        if not created:
            return Response({"message": "User is already a member"}, status=status.HTTP_400_BAD_REQUEST)

        return Response(ClubMemberSerializer(member).data, status=status.HTTP_201_CREATED)
