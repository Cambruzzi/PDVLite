from rest_framework import viewsets
from ..models import Cliente, Produto, Pedido
from ..serializers.vendas import ClienteSerializer, ProdutoSerializer, PedidoSerializer

class ClienteViewSet(viewsets.ModelViewSet):
    queryset = Cliente.objects.all()
    serializer_class = ClienteSerializer

class ProdutoViewSet(viewsets.ModelViewSet):
    queryset = Produto.objects.all()
    serializer_class = ProdutoSerializer

class PedidoViewSet(viewsets.ModelViewSet):
    serializer_class = PedidoSerializer

    def get_queryset(self):
        return Pedido.objects.filter(vendedor=self.request.user)

    def perform_create(self, serializer):
        serializer.save(vendedor=self.request.user)