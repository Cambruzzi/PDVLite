from rest_framework.test import APITestCase
from rest_framework import status
from decimal import Decimal
from .models import Cliente, Produto, Pedido, ItemPedido
from django.contrib.auth.models import User

class PedidoAPITest(APITestCase):
    def setUp(self):
        self.usuario = User.objects.create_user(username='admin_teste', password='123')
        self.client.force_authenticate(user=self.usuario)
        self.cliente = Cliente.objects.create(nome="Empresa XPTO")
        self.produto = Produto.objects.create(
            nome="Cabo de Aço", 
            preco=Decimal('100.00'), 
            multiplo=Decimal('5.000')
        )
        self.url = '/api/pedidos/'
    def test_criar_pedido_com_rentabilidade_boa(self):
        """Garante que um pedido é criado e a rentabilidade é calculada corretamente."""
        payload = {
            "cliente": self.cliente.id,
            "itens": [
                {
                    "produto": self.produto.id,
                    "quantidade": "10.000", 
                    "preco_unitario": "95.00" 
                }
            ]
        }
        
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_201_CREATED)
        item_salvo = ItemPedido.objects.first()
        self.assertEqual(item_salvo.preco_tabela, Decimal('100.00'))
        self.assertEqual(item_salvo.rentabilidade, 'boa')

    def test_bloqueio_de_multiplo_invalido(self):
        """Garante que o sistema bloqueia quantidades fora do múltiplo (Ex: pedir 7 itens onde o múltiplo é 5)."""
        payload = {
            "cliente": self.cliente.id,
            "itens": [
                {
                    "produto": self.produto.id,
                    "quantidade": "7.000", 
                    "preco_unitario": "100.00"
                }
            ]
        }
        
        response = self.client.post(self.url, payload, format='json')
        self.assertEqual(response.status_code, status.HTTP_400_BAD_REQUEST)
        self.assertEqual(Pedido.objects.count(), 0)
        self.assertIn("múltipla", str(response.data))