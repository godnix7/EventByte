import uuid
from django.db import models
from django.conf import settings

class Judge(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='judges')
    user = models.ForeignKey(settings.AUTH_USER_MODEL, on_delete=models.CASCADE, related_name='judge_roles')
    expertise_area = models.CharField(max_length=255, null=True, blank=True)
    affiliation = models.CharField(max_length=255, null=True, blank=True)
    bio = models.TextField(null=True, blank=True)
    rating = models.DecimalField(max_digits=3, decimal_places=2, null=True, blank=True)
    is_active = models.BooleanField(default=True)
    assigned_teams = models.JSONField(default=list, blank=True)
    assigned_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class ScoringRubric(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    event = models.ForeignKey('events.Event', on_delete=models.CASCADE, related_name='scoring_rubrics')
    name = models.CharField(max_length=255)
    description = models.TextField(null=True, blank=True)
    criteria = models.JSONField() # List of criteria objects
    total_max_points = models.DecimalField(max_digits=5, decimal_places=2)
    created_at = models.DateTimeField(auto_now_add=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)

class Score(models.Model):
    id = models.CharField(primary_key=True, max_length=36, editable=False)
    judge = models.ForeignKey(Judge, on_delete=models.CASCADE, related_name='scores')
    team = models.ForeignKey('participants.Team', on_delete=models.CASCADE, related_name='scores')
    rubric = models.ForeignKey(ScoringRubric, on_delete=models.CASCADE, related_name='scores')
    score_data = models.JSONField()
    total_score = models.DecimalField(max_digits=5, decimal_places=2)
    is_final = models.BooleanField(default=False)
    comments = models.TextField(null=True, blank=True)
    submitted_at = models.DateTimeField(auto_now_add=True)
    updated_at = models.DateTimeField(auto_now=True)

    def save(self, *args, **kwargs):
        if not self.id:
            self.id = uuid.uuid4().hex[:24]
        super().save(*args, **kwargs)
