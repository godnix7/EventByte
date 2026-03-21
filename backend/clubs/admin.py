from django.contrib import admin
from .models import Club, ClubMember

@admin.register(Club)
class ClubAdmin(admin.ModelAdmin):
    list_display = ('name', 'tenant', 'category', 'created_at')
    list_filter = ('tenant', 'category')
    search_fields = ('name',)

@admin.register(ClubMember)
class ClubMemberAdmin(admin.ModelAdmin):
    list_display = ('user', 'club', 'role')
