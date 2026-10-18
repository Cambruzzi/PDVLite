from rest_framework.test import APITestCase
from rest_framework import status
from django.contrib.auth.models import User
from rest_framework_simplejwt.tokens import RefreshToken
from .models import Cliente, Produto

class SegurancaAPITest(APITestCase):
    def setUp(self):
        # 1. Prepara o banco de dados
        self.usuario = User.objects.create_user(username='vendedor_teste', password='senha_segura_123')
        self.cliente = Cliente.objects.create(nome="Luke Skywalker")
        self.produto = Produto.objects.create(nome="Lightsaber", preco="6000.00", multiplo="5.000")
        
        # 2. Gera um Token JWT real para o usuário de teste
        refresh = RefreshToken.for_user(self.usuario)
        self.token = str(refresh.access_token)

    def test_bloqueio_de_intrusos(self):
        """Garante que a API rejeita conexões sem o Token JWT."""
        # Tenta acessar a lista de clientes sem passar o cabeçalho Authorization
        response = self.client.get('/api/clientes/')
        
        # O sistema DEVE retornar 401 Unauthorized
        self.assertEqual(response.status_code, status.HTTP_401_UNAUTHORIZED)
        
        # Tenta criar um pedido sem estar logado
        response_pedido = self.client.post('/api/pedidos/', {"cliente": self.cliente.id, "itens": []}, format='json')
        self.assertEqual(response_pedido.status_code, status.HTTP_401_UNAUTHORIZED)

    def test_acesso_permitido_com_jwt(self):
        """Garante que o Token JWT abre as portas da API para leitura."""
        # 1. Anexa o token JWT no cabeçalho das requisições do teste
        self.client.credentials(HTTP_AUTHORIZATION='Bearer ' + self.token)
        
        # 2. Tenta buscar os clientes
        response_clientes = self.client.get('/api/clientes/')
        self.assertEqual(response_clientes.status_code, status.HTTP_200_OK)
        self.assertEqual(len(response_clientes.data), 1) # Verifica se retornou 1 cliente
        self.assertEqual(response_clientes.data[0]['nome'], "Luke Skywalker")
        
        # 3. Tenta buscar os produtos
        response_produtos = self.client.get('/api/produtos/')
        self.assertEqual(response_produtos.status_code, status.HTTP_200_OK)