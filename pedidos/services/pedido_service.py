from django.db import transaction
from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from pedidos.models import Pedido, ItemPedido

def criar_pedido(dados_validados):
    """Serviço isolado para criar um pedido completo"""
    itens_data = dados_validados.pop('itens', [])
    
    with transaction.atomic():
        pedido = Pedido.objects.create(**dados_validados)
        _criar_itens(pedido, itens_data)
        
    return pedido

def atualizar_pedido(pedido_instancia, dados_validados):
    """Serviço isolado para atualizar o pedido e sincronizar itens"""
    itens_data = dados_validados.pop('itens', None)
    
    with transaction.atomic():
        pedido_instancia.cliente = dados_validados.get('cliente', pedido_instancia.cliente)
        pedido_instancia.save()
        
        if itens_data is not None:
            _sincronizar_itens(pedido_instancia, itens_data)
            
    return pedido_instancia

# --- Funções privadas que suportam o serviço ---

def _criar_itens(pedido, itens_data):
    for item_data in itens_data:
        novo_item = ItemPedido(pedido=pedido, **item_data)
        try:
            novo_item.clean()
            novo_item.save()
        except DjangoValidationError as e:
            raise ValidationError(e.message_dict)

def _sincronizar_itens(pedido, itens_recebidos_data):
    itens_atuais = {item.id: item for item in pedido.itens.all()}
    recebidos_ids = [item.get('id') for item in itens_recebidos_data if item.get('id')]

    # 1. Deletar os que foram removidos
    for item_id, item_obj in itens_atuais.items():
        if item_id not in recebidos_ids:
            item_obj.delete()

    # 2. Atualizar ou Criar
    for item_data in itens_recebidos_data:
        item_id = item_data.get('id')
        if item_id and item_id in itens_atuais:
            item_obj = itens_atuais[item_id]
            item_obj.produto = item_data.get('produto', item_obj.produto)
            item_obj.quantidade = item_data.get('quantidade', item_obj.quantidade)
            item_obj.preco_unitario = item_data.get('preco_unitario', item_obj.preco_unitario)
            try:
                item_obj.clean()
                item_obj.save()
            except DjangoValidationError as e:
                raise ValidationError(e.message_dict)
        else:
            _criar_itens(pedido, [item_data])