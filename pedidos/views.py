from rest_framework import viewsets
from .models import Cliente, Produto, Pedido
from .serializers import ClienteSerializer, ProdutoSerializer, PedidoSerializer

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