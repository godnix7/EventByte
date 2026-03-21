from django.utils.deprecation import MiddlewareMixin
from django.http import JsonResponse
from .models import Tenant

class TenantMiddleware(MiddlewareMixin):
    def process_request(self, request):
        tenant_id = request.headers.get('x-tenant-id')

        if not tenant_id:
            request.tenant = None
            request.tenant_id = None
            return

        try:
            # Try lookup by ID first
            tenant = Tenant.objects.filter(id=tenant_id).first()
            if not tenant:
                # Fallback to lookup by slug
                tenant = Tenant.objects.filter(slug=tenant_id).first()

            if not tenant:
                return JsonResponse({
                    'error': 'Not Found',
                    'message': 'Tenant not found or invalid'
                }, status=404)

            if tenant.status != 'active':
                return JsonResponse({
                    'error': 'Forbidden',
                    'message': 'This college/tenant is currently suspended'
                }, status=403)

            request.tenant = tenant
            request.tenant_id = tenant.id
        except Exception as e:
            return JsonResponse({
                'error': 'Internal Server Error',
                'message': str(e)
            }, status=500)
