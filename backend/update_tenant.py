import os
import django
import sys

# Setup Django environment
sys.path.append(os.getcwd())
os.environ.setdefault('DJANGO_SETTINGS_MODULE', 'core.settings')
django.setup()

from tenants.models import Tenant

def update_tenant():
    try:
        t = Tenant.objects.get(slug='cm1testtenant')
        t.slug = 'default'
        t.save()
        print("Successfully updated tenant slug from 'cm1testtenant' to 'default'")
    except Tenant.DoesNotExist:
        # Check if 'default' already exists
        if Tenant.objects.filter(slug='default').exists():
            print("Tenant 'default' already exists.")
        else:
            # Create it if none found? No, better to see what exists
            print("Target tenant 'cm1testtenant' not found and 'default' doesn't exist.")
            for t in Tenant.objects.all():
                print(f"Existing tenant: {t.slug}")
    except Exception as e:
        print(f"Error: {e}")

if __name__ == "__main__":
    update_tenant()
