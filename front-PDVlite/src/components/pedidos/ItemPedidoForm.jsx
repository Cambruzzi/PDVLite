import { useState, useEffect } from 'react';

export default function ItemPedidoForm({ produtos, onAdicionarItem }) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [rentabilidadePreview, setRentabilidadePreview] = useState(null);

  // Calcula a rentabilidade em tempo real enquanto o utilizador digita
  useEffect(() => {
    if (!produtoId || !precoUnitario) {
      setRentabilidadePreview(null);
      return;
    }

    const produto = produtos.find(p => p.id === parseInt(produtoId));
    if (produto) {
      const precoTabela = parseFloat(produto.preco);
      const precoDigitado = parseFloat(precoUnitario.replace(',', '.'));

      if (precoDigitado > precoTabela) {
        setRentabilidadePreview('ÓTIMA');
      } else {
        const desconto = ((precoTabela - precoDigitado) / precoTabela) * 100;
        if (desconto <= 10) {
          setRentabilidadePreview('BOA');
        } else {
          setRentabilidadePreview('RUIM');
        }
      }
    }
  }, [produtoId, precoUnitario, produtos]);

  const handleAdicionar = (e) => {
    e.preventDefault();
    if (!produtoId || !quantidade || !precoUnitario) return;

    const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));
    
    // Converte vírgulas para pontos se o utilizador as tiver digitado
    const qtdNum = parseFloat(quantidade.replace(',', '.'));
    const precoNum = parseFloat(precoUnitario.replace(',', '.'));
    const multiploNum = parseFloat(produtoSelecionado.multiplo);

    // VALIDAÇÃO DE MÚLTIPLO FRONT-END
    if (multiploNum > 0) {
      // Multiplicamos por 1000 para evitar o famoso bug de precisão decimal do JavaScript (ex: 0.3 % 0.1)
      const resto = (qtdNum * 1000) % (multiploNum * 1000);
      if (resto !== 0) {
        alert(`A quantidade para "${produtoSelecionado.nome}" tem de ser múltipla de ${produtoSelecionado.multiplo}.`);
        return;
      }
    }

    onAdicionarItem({
      produto_id: produtoSelecionado.id,
      nome: produtoSelecionado.nome,
      quantidade: qtdNum,
      preco_unitario: precoNum,
      rentabilidadeVisual: rentabilidadePreview
    });

    // Limpa os campos após adicionar
    setProdutoId('');
    setQuantidade('');
    setPrecoUnitario('');
    setRentabilidadePreview(null);
  };

  const coresRentabilidade = {
    'ÓTIMA': 'bg-green-100 text-green-800 border-green-200',
    'BOA': 'bg-blue-100 text-blue-800 border-blue-200',
    'RUIM': 'bg-red-100 text-red-800 border-red-200',
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mb-6">
      <h2 className="text-sm font-bold text-purple-800 mb-4 uppercase">Adicionar Produto</h2>
      
      <form onSubmit={handleAdicionar} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        <div className="md:col-span-5">
          {/* 1. Adicionado htmlFor="produto" */}
          <label htmlFor="produto" className="block text-sm font-semibold text-gray-700 mb-1">Produto</label>
          <select 
            id="produto" /* Adicionado id="produto" */
            required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            value={produtoId}
            onChange={(e) => {
              setProdutoId(e.target.value);
              const prod = produtos.find(p => p.id === parseInt(e.target.value));
              if (prod) setPrecoUnitario(prod.preco);
            }}
          >
            <option value="">Selecione um produto...</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} (Mult: {parseFloat(p.multiplo)}) - R$ {p.preco}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          {/* 2. Adicionado htmlFor="quantidade" */}
          <label htmlFor="quantidade" className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
          <input 
            id="quantidade" /* Adicionado id="quantidade" */
            type="text" 
            required
            placeholder="Ex: 5 ou 1,5"
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            value={quantidade}
            onChange={(e) => setQuantidade(e.target.value)}
          />
        </div>

        <div className="md:col-span-3 relative">
          <div className="flex items-center gap-3 mb-1">
            {/* 3. Adicionado htmlFor="precoUnitario" */}
            <label htmlFor="precoUnitario" className="block text-sm font-semibold text-gray-700 whitespace-nowrap">Valor Unit. (R$)</label>
            {rentabilidadePreview && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${coresRentabilidade[rentabilidadePreview]}`}>
                {rentabilidadePreview}
              </span>
            )}
          </div>
          <input 
            id="precoUnitario" /* Adicionado id="precoUnitario" */
            type="text" 
            required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(e.target.value)}
          />
        </div>

        <div className="md:col-span-2">
          <button 
            type="submit"
            className="w-full bg-purple-600 hover:bg-purple-700 text-white font-bold py-2.5 px-4 rounded-md transition-colors"
          >
            + Adicionar
          </button>
        </div>

      </form>
    </div>
  );
}