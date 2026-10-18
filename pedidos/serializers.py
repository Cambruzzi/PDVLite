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
    id = serializers.IntegerField(required=False)
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
        pass # Apenas ilustrativo, mantenha o seu código!

    def update(self, instance, validated_data):
        """
        Sincronização Inteligente de Itens na Edição
        """
        # 1. Tira os itens do pacote para atualizarmos o cabeçalho primeiro
        itens_data = validated_data.pop('itens', None)
        
        with transaction.atomic():
            # Atualiza o cabeçalho (ex: se ele trocou o cliente)
            instance.cliente = validated_data.get('cliente', instance.cliente)
            instance.save()

            if itens_data is not None:
                # Pega todos os itens que existem HOJE no banco de dados para este pedido
                itens_atuais = {item.id: item for item in instance.itens.all()}
                
                # Coleta os IDs dos itens que o React mandou
                itens_recebidos_ids = [item_data.get('id') for item_data in itens_data if item_data.get('id')]
                
                # PASSO A: DELETAR
                # Se estava no banco e o React não mandou mais, o usuário apagou na tela
                for item_id, item_obj in itens_atuais.items():
                    if item_id not in itens_recebidos_ids:
                        item_obj.delete()

                # PASSO B: ATUALIZAR OU CRIAR
                for item_data in itens_data:
                    item_id = item_data.get('id')
                    
                    if item_id and item_id in itens_atuais:
                        # ATUALIZAR ITEM EXISTENTE
                        item_obj = itens_atuais[item_id]
                        item_obj.produto = item_data.get('produto', item_obj.produto)
                        item_obj.quantidade = item_data.get('quantidade', item_obj.quantidade)
                        item_obj.preco_unitario = item_data.get('preco_unitario', item_obj.preco_unitario)
                        
                        try:
                            item_obj.clean()
                            item_obj.save() # A rentabilidade será recalculada, mas o preco_tabela fica protegido!
                        except DjangoValidationError as e:
                            raise serializers.ValidationError(e.message_dict)
                    else:
                        # CRIAR NOVO ITEM
                        # Não tem ID? Então foi adicionado na tela de edição agora.
                        novo_item = ItemPedido(pedido=instance, **item_data)
                        try:
                            novo_item.clean()
                            novo_item.save() # O if not self.pk do models.py vai fotografar o preço de hoje
                        except DjangoValidationError as e:
                            raise serializers.ValidationError(e.message_dict)

        return instance