from django.contrib import admin
from .models import Committee, CommitteeMember, Volunteer, Task

admin.site.register(Committee)
admin.site.register(CommitteeMember)
admin.site.register(Volunteer)
admin.site.register(Task)
