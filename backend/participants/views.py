from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from django.db import transaction
from django.db.models import F
from .models import Team, Participant
from .serializers import TeamSerializer, ParticipantSerializer
from events.models import Event
import random

class ParticipantRegisterView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id):
        tenant = request.tenant
        user = request.user
        
        try:
            with transaction.atomic():
                event = Event.objects.select_for_update().get(id=event_id, tenant=tenant)
                
                if Participant.objects.filter(event=event, user=user).exists():
                    return Response({"error": "Already registered"}, status=status.HTTP_400_BAD_REQUEST)

                is_full = event.max_participants is not None and event.current_participants >= event.max_participants
                
                if is_full:
                    # In TS it was status: 'waitlisted'
                    return Response({"error": "Event is full"}, status=status.HTTP_400_BAD_REQUEST)

                registration_number = f"REG-{random.randint(100000, 999999)}"
                
                participant = Participant.objects.create(
                    tenant=tenant,
                    event=event,
                    user=user,
                    registration_number=registration_number,
                    status='registered',
                    registration_data=request.data.get('registrationData')
                )
                
                event.current_participants = F('current_participants') + 1
                event.save()
                
                return Response(ParticipantSerializer(participant).data, status=status.HTTP_201_CREATED)
        except Event.DoesNotExist:
            return Response({"error": "Event not found"}, status=status.HTTP_404_NOT_FOUND)

class ParticipantUnregisterView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def delete(self, request, event_id):
        tenant = request.tenant
        user = request.user

        try:
            with transaction.atomic():
                participant = Participant.objects.get(event_id=event_id, user=user, tenant=tenant)
                participant.delete()
                
                Event.objects.filter(id=event_id).update(current_participants=F('current_participants') - 1)
                
                return Response({"message": "Unregistered successfully"}, status=status.HTTP_200_OK)
        except Participant.DoesNotExist:
            return Response({"error": "Not registered"}, status=status.HTTP_404_NOT_FOUND)

class TeamCreateView(generics.CreateAPIView):
    serializer_class = TeamSerializer
    permission_classes = [permissions.IsAuthenticated]

    def perform_create(self, serializer):
        event_id = self.kwargs.get('event_id')
        event = Event.objects.get(id=event_id, tenant=self.request.tenant)
        
        team = serializer.save(
            tenant=self.request.tenant,
            event=event,
            team_lead=self.request.user,
            max_members=event.team_max_size or 4
        )
        
        # Update participant team
        Participant.objects.filter(event=event, user=self.request.user).update(team=team)

class ParticipantListView(generics.ListAPIView):
    serializer_class = ParticipantSerializer
    
    def get_queryset(self):
        return Participant.objects.filter(event_id=self.kwargs.get('event_id'), tenant=self.request.tenant)

    def get_permissions(self):
        return [permissions.IsAuthenticated()] # Adjust for admin/organizer

class ParticipantCheckInView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request, event_id):
        reg_num = request.data.get('registrationNumber')
        tenant = request.tenant

        try:
            participant = Participant.objects.get(event_id=event_id, registration_number=reg_num, tenant=tenant)
            if participant.check_in_time:
                return Response({"error": "Already checked in"}, status=status.HTTP_400_BAD_REQUEST)
            
            from django.utils import timezone
            participant.check_in_time = timezone.now()
            participant.status = 'attended'
            participant.save()
            
            return Response(ParticipantSerializer(participant).data)
        except Participant.DoesNotExist:
            return Response({"error": "Participant not found"}, status=status.HTTP_404_NOT_FOUND)
