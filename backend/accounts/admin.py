from django.contrib import admin
from .models import User

@admin.register(User)
class UserAdmin(admin.ModelAdmin):
    list_display = ('email', 'username', 'role', 'tenant', 'is_staff')
    list_filter = ('role', 'tenant', 'is_staff')
    search_fields = ('email', 'username', 'first_name', 'last_name')
