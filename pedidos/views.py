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
    queryset = Pedido.objects.all().prefetch_related('itens') # Otimização de banco de dados
    serializer_class = PedidoSerializer