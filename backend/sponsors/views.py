from rest_framework import generics, permissions, status, views
from rest_framework.response import Response
from .models import Sponsor, Expense
from .serializers import SponsorSerializer, ExpenseSerializer
from django.utils import timezone

class SponsorListCreateView(generics.ListCreateAPIView):
    serializer_class = SponsorSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Sponsor.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'))

class SponsorUpdatePaymentView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, sponsor_id):
        try:
            sponsor = Sponsor.objects.get(id=sponsor_id)
            sponsor.amount_paid = request.data.get('amountPaid')
            sponsor.payment_status = request.data.get('paymentStatus')
            sponsor.save()
            return Response(SponsorSerializer(sponsor).data)
        except Sponsor.DoesNotExist:
            return Response({"error": "Sponsor not found"}, status=status.HTTP_404_NOT_FOUND)

class ExpenseListCreateView(generics.ListCreateAPIView):
    serializer_class = ExpenseSerializer
    permission_classes = [permissions.IsAuthenticated]

    def get_queryset(self):
        return Expense.objects.filter(event_id=self.kwargs.get('event_id'))

    def perform_create(self, serializer):
        serializer.save(event_id=self.kwargs.get('event_id'), created_by=self.request.user)

class ExpenseUpdateStatusView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def patch(self, request, expense_id):
        try:
            expense = Expense.objects.get(id=expense_id)
            new_status = request.data.get('status')
            expense.status = new_status
            if new_status == 'approved':
                expense.approved_by = self.request.user
            if new_status == 'paid':
                expense.paid_at = timezone.now()
            expense.save()
            return Response(ExpenseSerializer(expense).data)
        except Expense.DoesNotExist:
            return Response({"error": "Expense not found"}, status=status.HTTP_404_NOT_FOUND)
