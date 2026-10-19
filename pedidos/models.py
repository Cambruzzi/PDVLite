from django.db import models
from django.core.exceptions import ValidationError
from django.contrib.auth.models import User
from decimal import Decimal
from django.core.validators import MinValueValidator

class BaseModel(models.Model):
    criado_em = models.DateTimeField(auto_now_add=True)
    atualizado_em = models.DateTimeField(auto_now=True)

    class Meta:
        abstract = True

class Cliente(BaseModel):
    nome = models.CharField(max_length=255)

    def __str__(self):
        return self.nome

class Produto(BaseModel):
    nome = models.CharField(max_length=255)
    preco = models.DecimalField(max_digits=12, decimal_places=2)
    multiplo = models.DecimalField(max_digits=10, decimal_places=3, default=Decimal('0.000'))

    def __str__(self):
        return f"{self.nome} - R$ {self.preco}"

class Pedido(BaseModel):
    cliente = models.ForeignKey(Cliente, on_delete=models.PROTECT, related_name='pedidos')
    vendedor = models.ForeignKey(User, on_delete=models.PROTECT, related_name='pedidos_realizados', null=True)
    
    def __str__(self):
        vendedor_nome = self.vendedor.username if self.vendedor else "Sistema"
        return f"Pedido #{self.id} - {self.cliente.nome} (Vendedor: {vendedor_nome})"

class ItemPedido(BaseModel):
    class Rentabilidade(models.TextChoices):
        OTIMA = 'otima', 'Ótima'
        BOA = 'boa', 'Boa'
        RUIM = 'ruim', 'Ruim'

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    
    quantidade = models.IntegerField(validators=[MinValueValidator(1)],help_text="A quantidade deve ser um número inteiro maior que zero.")
    preco_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    preco_tabela = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    
    rentabilidade = models.CharField(
        max_length=10,
        choices=Rentabilidade.choices,
        blank=True,
    )

    def clean(self):
        super().clean()
        
        # 1. Validação do Múltiplo
        if self.produto and self.quantidade and self.produto.multiplo > 0:
            # Multiplicamos por 1000 para evitar erros de precisão com casas decimais (ex: 0.3) no Python
            if (self.quantidade * 1000) % (self.produto.multiplo * 1000) != 0:
                raise ValidationError({'quantidade': f'A quantidade deve ser múltipla de {self.produto.multiplo}.'})

        # 2. Bloqueio de Rentabilidade RUIM (Desconto > 10%)
        preco_base = self.preco_tabela if self.preco_tabela else self.produto.preco
        
        if self.preco_unitario and preco_base:
            if self.preco_unitario < preco_base:
                desconto = ((preco_base - self.preco_unitario) / preco_base) * 100
                if desconto > 10:
                    raise ValidationError({
                        'preco_unitario': 'Venda bloqueada: Não é permitido aplicar um desconto superior a 10% (Rentabilidade RUIM).'
                    })

    def save(self, *args, **kwargs):
        if not self.pk and self.produto:
            self.preco_tabela = self.produto.preco
        if self.preco_unitario and self.preco_tabela:
            if self.preco_unitario > self.preco_tabela:
                self.rentabilidade = self.Rentabilidade.OTIMA
            elif self.preco_unitario >= (self.preco_tabela * Decimal('0.9')):
                self.rentabilidade = self.Rentabilidade.BOA
            else:
                self.rentabilidade = self.Rentabilidade.RUIM
        super().save(*args, **kwargs)
    def __str__(self):
        return f"{self.quantidade}x {self.produto.nome} (Vendido: {self.preco_unitario} | Tabela: {self.preco_tabela})"