from django.urls import path
from .views import (
    SponsorListCreateView, SponsorUpdatePaymentView,
    ExpenseListCreateView, ExpenseUpdateStatusView
)

urlpatterns = [
    path('events/<str:event_id>/sponsors/', SponsorListCreateView.as_view(), name='sponsor-list-create'),
    path('sponsors/<str:sponsor_id>/payment/', SponsorUpdatePaymentView.as_view(), name='sponsor-update-payment'),
    path('events/<str:event_id>/expenses/', ExpenseListCreateView.as_view(), name='expense-list-create'),
    path('expenses/<str:expense_id>/status/', ExpenseUpdateStatusView.as_view(), name='expense-update-status'),
]
