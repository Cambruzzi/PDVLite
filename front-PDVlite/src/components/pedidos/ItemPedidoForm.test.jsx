import { render, screen, fireEvent } from '@testing-library/react';
import { describe, it, expect, vi } from 'vitest';
import ItemPedidoForm from './ItemPedidoForm';

// Criamos dados falsos para alimentar o componente sem precisar do Back-end
const produtosMock = [
  { id: 1, nome: 'X-Wing', preco: '60000.00', multiplo: '2' }
];

describe('Regras de Negócio: ItemPedidoForm', () => {
  
  it('deve apresentar a badge ÓTIMA quando o preço digitado é maior que a tabela', () => {
    // 1. Renderiza o componente isolado no "navegador virtual"
    render(<ItemPedidoForm produtos={produtosMock} onAdicionarItem={vi.fn()} />);

    // 2. Simula o utilizador a selecionar o produto X-Wing
    const selectProduto = screen.getByRole('combobox');
    fireEvent.change(selectProduto, { target: { value: '1' } });

    // 3. Simula o utilizador a digitar 70.000 no valor unitário (10k a mais que a tabela)
    const inputValor = screen.getByLabelText(/Valor Unit\. \(R\$\)/i);
    fireEvent.change(inputValor, { target: { value: '70000' } });

    // 4. Verifica (Assert) se a interface reagiu corretamente e mostrou "ÓTIMA"
    expect(screen.getByText('ÓTIMA')).toBeInTheDocument();
  });

  it('deve apresentar a badge RUIM quando o desconto passa dos 10%', () => {
    render(<ItemPedidoForm produtos={produtosMock} onAdicionarItem={vi.fn()} />);
    
    fireEvent.change(screen.getByRole('combobox'), { target: { value: '1' } });
    
    // Tabela é 60.000. 10% de desconto seria 54.000. Vamos digitar 50.000 (desconto > 10%)
    fireEvent.change(screen.getByLabelText(/Valor Unit\. \(R\$\)/i), { target: { value: '50000' } });

    // 5. Verifica se o sistema marcou a venda como "RUIM"
    expect(screen.getByText('RUIM')).toBeInTheDocument();
  });
});