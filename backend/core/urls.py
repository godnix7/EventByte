from django.contrib import admin
from django.urls import path, include
from django.conf import settings
from django.conf.urls.static import static

urlpatterns = [
    path('admin/', admin.site.urls),
    path('api/auth/', include('accounts.urls')),
    path('api/admin/', include('accounts.admin_urls')),
    path('api/clubs/', include('clubs.urls')),
    path('api/events/', include('events.urls')),
    path('api/participants/', include('participants.urls')),
    path('api/communication/', include('communication.urls')),
    path('api/collaboration/', include('collaboration.urls')),
    path('api/judging/', include('judging.urls')),
    path('api/sponsors/', include('sponsors.urls')),
    # Add other app URLs as they are implemented
]

if settings.DEBUG:
    urlpatterns += static(settings.MEDIA_URL, document_root=settings.MEDIA_ROOT)
