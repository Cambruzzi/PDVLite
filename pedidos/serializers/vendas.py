from rest_framework import serializers
from pedidos.models import Cliente, Produto, Pedido, ItemPedido
from pedidos.services.pedido_service import criar_pedido, atualizar_pedido


class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'criado_em']

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'multiplo']

class ItemPedidoSerializer(serializers.ModelSerializer):
    id = serializers.IntegerField(required=False)
    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'quantidade', 'preco_unitario', 'preco_tabela', 'rentabilidade']
        read_only_fields = ['preco_tabela', 'rentabilidade']

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)
    vendedor_nome = serializers.CharField(source='vendedor.username', read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'vendedor', 'vendedor_nome', 'criado_em', 'itens']
        read_only_fields = ['vendedor']

    def create(self, validated_data):
        return criar_pedido(validated_data)

    def update(self, instance, validated_data):
        return atualizar_pedido(instance, validated_data)
