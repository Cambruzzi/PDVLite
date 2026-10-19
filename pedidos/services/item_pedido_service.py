from django.core.exceptions import ValidationError as DjangoValidationError
from rest_framework.exceptions import ValidationError
from ..models import ItemPedido

def criar_itens_pedido(pedido, itens_data):
    """Cria e valida novos itens para um pedido"""
    for item_data in itens_data:
        novo_item = ItemPedido(pedido=pedido, **item_data)
        try:
            novo_item.clean()
            novo_item.save()
        except DjangoValidationError as e:
            raise ValidationError(e.message_dict)

def _remover_itens_ausentes(itens_atuais_dict, recebidos_ids):
    """Remove da base de dados os itens que o utilizador apagou no front-end"""
    for item_id, item_obj in itens_atuais_dict.items():
        if item_id not in recebidos_ids:
            item_obj.delete()

def _atualizar_item_existente(item_obj, item_data):
    """Aplica novos valores a um item existente e garante as validações de negócio"""
    item_obj.produto = item_data.get('produto', item_obj.produto)
    item_obj.quantidade = item_data.get('quantidade', item_obj.quantidade)
    item_obj.preco_unitario = item_data.get('preco_unitario', item_obj.preco_unitario)
    
    try:
        item_obj.clean()
        item_obj.save()
    except DjangoValidationError as e:
        raise ValidationError(e.message_dict)

def sincronizar_itens_pedido(pedido, itens_recebidos_data):
    """Orquestra a adição, edição e remoção de itens na edição de um pedido"""
    itens_atuais = {item.id: item for item in pedido.itens.all()}
    recebidos_ids = [item.get('id') for item in itens_recebidos_data if item.get('id')]

    # 1. Limpa os que já não pertencem ao pedido
    _remover_itens_ausentes(itens_atuais, recebidos_ids)

    # 2. Separa quem é para atualizar de quem é para criar
    itens_para_criar = []
    
    for item_data in itens_recebidos_data:
        item_id = item_data.get('id')
        if item_id and item_id in itens_atuais:
            _atualizar_item_existente(itens_atuais[item_id], item_data)
        else:
            itens_para_criar.append(item_data)

    # 3. Cria os novos em lote
    if itens_para_criar:
        criar_itens_pedido(pedido, itens_para_criar)