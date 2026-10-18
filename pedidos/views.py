from rest_framework import viewsets,generics
from .models import Cliente, Produto, Pedido
from pedidos.serializers.vendas import ClienteSerializer, ProdutoSerializer, PedidoSerializer
from pedidos.serializers.auth import CadastroSerializer
from rest_framework_simplejwt.views import TokenObtainPairView
from django.conf import settings
from rest_framework.permissions import AllowAny
from django.contrib.auth.models import User

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer

    def get_queryset(self):
        """
        Filtro de Segurança: Retorna apenas os pedidos onde o vendedor 
        é o usuário que fez a requisição com o Token JWT.
        """
        return Pedido.objects.filter(vendedor=self.request.user).prefetch_related('itens')

    def perform_create(self, serializer):
        """
        Injeção de Segurança: Ao criar um pedido novo, ignora o que veio do front-end
        e força o vendedor a ser o dono do Token JWT da requisição.
        """
        serializer.save(vendedor=self.request.user)

class CookieTokenObtainPairView(TokenObtainPairView):
    """
    Customiza o login padrão do JWT para devolver o Access Token no JSON 
    e blindar o Refresh Token em um Cookie HttpOnly.
    """
    def post(self, request, *args, **kwargs):
        response = super().post(request, *args, **kwargs)
        refresh_token = response.data.get('refresh')

        if refresh_token:
            response.set_cookie(
                key='refresh_token',
                value=refresh_token,
                httponly=True,
                secure=False, # Mude para True quando tiver HTTPS em produção
                samesite='Lax',
                max_age=7 * 24 * 60 * 60 # 7 dias
            )
            # Remove o refresh do JSON para que o front-end não tenha acesso a ele via JavaScript
            del response.data['refresh']

        return response

class CadastroUsuarioView(generics.CreateAPIView):
    queryset = User.objects.all()
    serializer_class = CadastroSerializer
    permission_classes = [AllowAny]