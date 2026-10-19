# pedidos/services/pedido_service.py
from django.db import transaction
from ..models import Pedido
from .item_pedido_service import criar_itens_pedido, sincronizar_itens_pedido

def criar_pedido(dados_validados):
    """Orquestra a criação completa de um pedido"""
    itens_data = dados_validados.pop('itens', [])
    
    with transaction.atomic():
        pedido = Pedido.objects.create(**dados_validados)
        
        # Delega o trabalho pesado!
        criar_itens_pedido(pedido, itens_data)
        
    return pedido

def atualizar_pedido(pedido_instancia, dados_validados):
    """Orquestra a atualização completa de um pedido"""
    itens_data = dados_validados.pop('itens', None)
    
    with transaction.atomic():
        pedido_instancia.cliente = dados_validados.get('cliente', pedido_instancia.cliente)
        pedido_instancia.save()
        
        if itens_data is not None:
            # Delega a sincronização!
            sincronizar_itens_pedido(pedido_instancia, itens_data)
            
    return pedido_instancia