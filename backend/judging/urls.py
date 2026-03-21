from django.urls import path
from .views import (
    ScoringRubricListCreateView, JudgeListCreateView, 
    JudgeDetailView, ScoreSubmitView
)

urlpatterns = [
    path('events/<str:event_id>/rubrics/', ScoringRubricListCreateView.as_view(), name='rubric-list-create'),
    path('events/<str:event_id>/judges/', JudgeListCreateView.as_view(), name='judge-list-create'),
    path('judges/<str:id>/', JudgeDetailView.as_view(), name='judge-detail'),
    path('scores/', ScoreSubmitView.as_view(), name='score-submit'),
]
