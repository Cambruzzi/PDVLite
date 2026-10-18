from django.urls import path, include
from rest_framework.routers import DefaultRouter
from .views import ClienteViewSet, ProdutoViewSet, PedidoViewSet, CookieTokenObtainPairView, CadastroUsuarioView
from rest_framework_simplejwt.views import TokenRefreshView

router = DefaultRouter()
router.register(r'clientes', ClienteViewSet)
router.register(r'produtos', ProdutoViewSet)
router.register(r'pedidos', PedidoViewSet, basename='pedidos')

urlpatterns = [
    path('', include(router.urls)),
    # Novas rotas de segurança
    path('login/', CookieTokenObtainPairView.as_view(), name='token_obtain_pair'),
    path('token/refresh/', TokenRefreshView.as_view(), name='token_refresh'),
    path('cadastro/', CadastroUsuarioView.as_view(), name='cadastro_usuario'),
]