from rest_framework import generics
from django.conf import settings
from rest_framework.permissions import AllowAny
from rest_framework_simplejwt.views import TokenObtainPairView, TokenRefreshView
from rest_framework_simplejwt.exceptions import InvalidToken
from django.contrib.auth.models import User
from ..serializers.auth import CadastroSerializer # Ajuste o caminho se necessário

class CookieTokenObtainPairView(TokenObtainPairView):
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get('refresh')
        if refresh_token:
            response.set_cookie(
                key='refresh_token', value=refresh_token,
                httponly=True, secure=True,samesite='None', max_age=7*24*60*60
            )
            del response.data['refresh']
        return response

class CookieTokenRefreshView(TokenRefreshView):
    """Lê o Refresh Token do Cookie HttpOnly e devolve um novo Access Token na RAM"""
    def post(self, request, *args, **kwargs):
        refresh_token = request.COOKIES.get('refresh_token')
        if not refresh_token:
            raise InvalidToken('Nenhum refresh token encontrado no cookie.')
        
        request.data['refresh'] = refresh_token
        return super().post(request, *args, **kwargs)

class CadastroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CadastroSerializer
    permission_classes = [AllowAny]