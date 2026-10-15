from django.db import models
from django.core.exceptions import ValidationError
from decimal import Decimal

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
    
    def __str__(self):
        return f"Pedido #{self.id} - {self.cliente.nome}"

class ItemPedido(BaseModel):
    class Rentabilidade(models.TextChoices):
        OTIMA = 'otima', 'Ótima'
        BOA = 'boa', 'Boa'
        RUIM = 'ruim', 'Ruim'

    pedido = models.ForeignKey(Pedido, on_delete=models.CASCADE, related_name='itens')
    produto = models.ForeignKey(Produto, on_delete=models.PROTECT)
    
    quantidade = models.DecimalField(max_digits=10, decimal_places=3)
    preco_unitario = models.DecimalField(max_digits=12, decimal_places=2)
    preco_tabela = models.DecimalField(max_digits=12, decimal_places=2, editable=False)
    
    rentabilidade = models.CharField(
        max_length=10,
        choices=Rentabilidade.choices,
        blank=True,
    )

    def clean(self):
        super().clean()
        if self.produto and self.quantidade and self.produto.multiplo > 0:
            resto = self.quantidade % self.produto.multiplo
            if resto != 0:
                raise ValidationError({
                    'quantidade': f"A quantidade do produto '{self.produto.nome}' deve ser múltipla de {self.produto.multiplo}."
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