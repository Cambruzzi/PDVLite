from rest_framework import serializers
from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from .models import Cliente, Produto, Pedido, ItemPedido

class ClienteSerializer(serializers.ModelSerializer):
    class Meta:
        model = Cliente
        fields = ['id', 'nome', 'criado_em']

class ProdutoSerializer(serializers.ModelSerializer):
    class Meta:
        model = Produto
        fields = ['id', 'nome', 'preco', 'multiplo']

class ItemPedidoSerializer(serializers.ModelSerializer):
    class Meta:
        model = ItemPedido
        fields = ['id', 'produto', 'quantidade', 'preco_unitario', 'preco_tabela', 'rentabilidade']
        read_only_fields = ['preco_tabela', 'rentabilidade']

class PedidoSerializer(serializers.ModelSerializer):
    itens = ItemPedidoSerializer(many=True)
    
    # Exibe o username do vendedor em vez de apenas o ID (opcional para UX)
    vendedor_nome = serializers.CharField(source='vendedor.username', read_only=True)

    class Meta:
        model = Pedido
        fields = ['id', 'cliente', 'vendedor', 'vendedor_nome', 'criado_em', 'itens']
        read_only_fields = ['vendedor'] # Bloqueia alterações maliciosas

    def create(self, validated_data):
        # A lógica de transaction.atomic() e loop nos itens continua exatamente a mesma!
        itens_data = validated_data.pop('itens')
        
        with transaction.atomic():
            pedido = Pedido.objects.create(**validated_data)
            
            for item in itens_data:
                novo_item = ItemPedido(pedido=pedido, **item)
                try:
                    novo_item.clean()
                    novo_item.save()
                except DjangoValidationError as e:
                    raise serializers.ValidationError(e.message_dict)
                    
        return pedido