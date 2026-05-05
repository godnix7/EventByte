import os
import sys
from mangum import Mangum
from django.core.asgi import get_asgi_application

# Add backend directory to sys.path so Django can find core.settings
sys.path.append(os.path.join(os.path.dirname(__file__), '..', 'backend'))

os.environ.setdefault("DJANGO_SETTINGS_MODULE", "core.settings")

application = get_asgi_application()
handler = Mangum(application, lifespan="off")
