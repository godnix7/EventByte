from django.contrib import admin
from .models import Judge, ScoringRubric, Score

admin.site.register(Judge)
admin.site.register(ScoringRubric)
admin.site.register(Score)
