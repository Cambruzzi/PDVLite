import csv
import os
from decimal import Decimal
from django.core.management.base import BaseCommand
from pedidos.models import Cliente, Produto

class Command(BaseCommand):
    help = 'Importa clientes e produtos a partir de arquivos CSV'

    def handle(self, *args, **kwargs):
        # Caminhos dos arquivos (Coloque os arquivos CSV na raiz do projeto, junto com manage.py)
        caminho_clientes = 'clientes.csv'
        caminho_produtos = 'produtos.csv'

        self.importar_clientes(caminho_clientes)
        self.importar_produtos(caminho_produtos)

    def importar_clientes(self, caminho):
        if not os.path.exists(caminho):
            self.stdout.write(self.style.ERROR(f'Arquivo {caminho} não encontrado!'))
            return

        with open(caminho, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Usa update_or_create para não duplicar se rodar o comando duas vezes
                cliente, created = Cliente.objects.update_or_create(
                    id=row['ID'],
                    defaults={'nome': row['Nome']}
                )
                acao = "Criado" if created else "Atualizado"
                self.stdout.write(self.style.SUCCESS(f'Cliente {cliente.nome} {acao} com sucesso!'))

    def importar_produtos(self, caminho):
        if not os.path.exists(caminho):
            self.stdout.write(self.style.ERROR(f'Arquivo {caminho} não encontrado!'))
            return

        with open(caminho, newline='', encoding='utf-8') as csvfile:
            reader = csv.DictReader(csvfile)
            for row in reader:
                # Limpeza do formato de moeda (R$ 550.000,00 -> 550000.00)
                preco_str = row['Preço Unitário (R$)'].replace('.', '').replace(',', '.')
                preco = Decimal(preco_str)

                # Tratamento do múltiplo (se vazio, vira 0)
                multiplo_str = row['Múltiplo'].strip()
                multiplo = Decimal(multiplo_str) if multiplo_str else Decimal('0.000')

                produto, created = Produto.objects.update_or_create(
                    id=row['ID'],
                    defaults={
                        'nome': row['Nome'],
                        'preco': preco,
                        'multiplo': multiplo
                    }
                )
                acao = "Criado" if created else "Atualizado"
                self.stdout.write(self.style.SUCCESS(f'Produto {produto.nome} {acao} com sucesso!'))