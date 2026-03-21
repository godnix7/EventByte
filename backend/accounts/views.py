from rest_framework import status, generics, permissions, views
from rest_framework.response import Response
from rest_framework_simplejwt.tokens import RefreshToken
from django.contrib.auth import authenticate
from .serializers import UserSerializer, RegisterSerializer
from django.utils import timezone

class RegisterView(generics.GenericAPIView):
    serializer_class = RegisterSerializer
    permission_classes = [permissions.AllowAny]

    def post(self, request, *args, **kwargs):
        # Tenant is already set on request by TenantMiddleware
        serializer = self.get_serializer(data=request.data, context={'tenant': request.tenant})
        serializer.is_valid(raise_exception=True)
        user = serializer.save()
        
        return Response({
            "message": "User created successfully",
            "user_id": user.id
        }, status=status.HTTP_201_CREATED)

class LoginView(views.APIView):
    permission_classes = [permissions.AllowAny]

    def post(self, request):
        email = request.data.get('email')
        password = request.data.get('password')
        tenant = request.tenant

        if not tenant:
            return Response({"error": "Tenant context missing"}, status=status.HTTP_400_BAD_REQUEST)

        # Authenticate with email
        from django.contrib.auth import get_user_model
        User = get_user_model()
        
        try:
            user = User.objects.get(email=email, tenant=tenant)
        except User.DoesNotExist:
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if not user.check_password(password):
            return Response({"error": "Invalid credentials"}, status=status.HTTP_401_UNAUTHORIZED)

        if user.is_banned:
            return Response({
                "error": "Your account has been banned",
                "reason": user.ban_reason
            }, status=status.HTTP_403_FORBIDDEN)

        user.last_login = timezone.now()
        user.save()

        refresh = RefreshToken.for_user(user)
        # Custom claims (matching TS implementation)
        refresh['role'] = user.role
        refresh['tenantId'] = str(tenant.id)

        return Response({
            'accessToken': str(refresh.access_token),
            'refreshToken': str(refresh),
            'user': UserSerializer(user).data
        })

class MeView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def get(self, request):
        return Response({
            'user': UserSerializer(request.user).data
        })

class LogoutView(views.APIView):
    permission_classes = [permissions.IsAuthenticated]

    def post(self, request):
        try:
            refresh_token = request.data.get("refreshToken")
            token = RefreshToken(refresh_token)
            token.blacklist()
            return Response({"message": "Logged out successfully"}, status=status.HTTP_200_OK)
        except Exception:
            return Response({"error": "Invalid token"}, status=status.HTTP_400_BAD_REQUEST)
