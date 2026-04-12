import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tenants.models import Tenant
from events.models import Event

def check_db():
    try:
        tenant_count = Tenant.objects.count()
        event_count = Event.objects.count()
        print(f"Connection OK. Tenants: {tenant_count}, Events: {event_count}")
        for t in Tenant.objects.all():
            print(f"Tenant: ID={t.id}, Slug={t.slug}, Name={t.name}")
    except Exception as e:
        print(f"DB Error: {e}")

if __name__ == "__main__":
    check_db()
