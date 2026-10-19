from django.urls import path, include
from rest_framework.routers import DefaultRouter

# Importações dos novos módulos
from .views.vendas import ClienteViewSet, ProdutoViewSet, PedidoViewSet
from .views.auth import CookieTokenObtainPairView, CookieTokenRefreshView, CadastroUsuarioView

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedidos')

urlpatterns = [
    path('', include(router.urls)),
    path('login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', CookieTokenRefreshView.as_view(), name='token_refresh'), # A NOVA VIEW!
    path('cadastro/', CadastroUsuarioView.as_view(), name='cadastro_usuario'),
]