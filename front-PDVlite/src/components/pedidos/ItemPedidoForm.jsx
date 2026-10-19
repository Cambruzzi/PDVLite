import { useState, useEffect } from 'react';

export default function ItemPedidoForm({ produtos, onAdicionarItem }) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState(''); // Agora guardará a string formatada "60.000,00"
  const [rentabilidadePreview, setRentabilidadePreview] = useState(null);

  // MÁSCARA DE MOEDA (Estilo Multibanco: Direita para a Esquerda)
  const mascaraMoeda = (valor) => {
    // 1. Remove tudo o que não for número
    const apenasNumeros = String(valor).replace(/\D/g, '');
    if (!apenasNumeros) return '';
    
    // 2. Transforma em decimal (ex: 6000000 vira 60000.00)
    const valorDecimal = (parseInt(apenasNumeros, 10) / 100).toFixed(2);
    
    // 3. Aplica a formatação do Brasil (pontos nos milhares e vírgula nos cêntimos)
    return valorDecimal
      .replace('.', ',')
      .replace(/(\d)(?=(\d{3})+(?!\d))/g, '$1.');
  };

  useEffect(() => {
    if (!produtoId || !precoUnitario) {
      setRentabilidadePreview(null);
      return;
    }

    const produto = produtos.find(p => p.id === parseInt(produtoId));
    if (produto) {
      const precoTabela = parseFloat(produto.preco);
      
      // Converte a string "60.000,00" de volta para número limpo "60000.00" para fazer contas
      const precoLimpoStr = precoUnitario.replace(/\./g, '').replace(',', '.');
      const precoDigitado = parseFloat(precoLimpoStr);

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

    // BLOQUEIO FRONT-END DA RENTABILIDADE RUIM
    if (rentabilidadePreview === 'RUIM') {
      alert('Venda bloqueada: Não é permitido adicionar produtos com rentabilidade RUIM (desconto > 10%).');
      return; // Interrompe a função, não deixa adicionar à lista!
    }

    if (!quantidade || quantidade < 1) {
      alert("A quantidade deve ser um número inteiro maior que zero.");
      return;
    }

    const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));
    
    const qtdNum = parseFloat(quantidade.replace(',', '.'));
    const precoNum = parseFloat(precoUnitario.replace(/\./g, '').replace(',', '.'));
    const multiploNum = parseFloat(produtoSelecionado.multiplo);

    if (multiploNum > 0) {
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

    setProdutoId('');
    setQuantidade('');
    setPrecoUnitario('');
    setRentabilidadePreview(null);
  };

  const coresRentabilidade = {
    'ÓTIMA': 'bg-green-100 text-green-800 border-green-200',
    'BOA': 'bg-blue-100 text-blue-800 border-blue-200',
    'RUIM': 'bg-red-100 text-red-800 border-red-200', // Ainda mantemos a cor para aviso visual
  };

  return (
    <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mb-6">
      <h2 className="text-sm font-bold text-purple-800 mb-4 uppercase">Adicionar Produto</h2>
      
      <form onSubmit={handleAdicionar} className="grid grid-cols-1 md:grid-cols-12 gap-4 items-end">
        
        <div className="md:col-span-5">
          <label htmlFor="produto" className="block text-sm font-semibold text-gray-700 mb-1">Produto</label>
          <select 
            id="produto" required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            value={produtoId}
            onChange={(e) => {
              setProdutoId(e.target.value);
              const prod = produtos.find(p => p.id === parseInt(e.target.value));
              // Quando o utilizador escolhe o produto, o preço de tabela é automaticamente formatado!
              if (prod) setPrecoUnitario(mascaraMoeda(prod.preco));
            }}
          >
            <option value="">Selecione um produto...</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>
                {p.nome} (Mult: {parseFloat(p.multiplo)}) - R$ {mascaraMoeda(p.preco)}
              </option>
            ))}
          </select>
        </div>

        <div className="md:col-span-2">
          <label htmlFor="quantidade" className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
          <input 
          type="number"
            min="1"
            step="1"
            value={quantidade}
            onChange={(e) => {
              const valor = e.target.value;
              if (valor === '') {
                setQuantidade('');
                return;
              }              
              const numeroInteiro = parseInt(valor, 10);              
              if (!isNaN(numeroInteiro) && numeroInteiro >= 1) {
                setQuantidade(numeroInteiro);
              }
            }}
            className="w-full bg-white border border-gray-300 text-gray-800 text-sm rounded-lg focus:ring-purple-500 focus:border-purple-500 block p-2.5"
            placeholder="Qtd"
          />
        </div>

        <div className="md:col-span-3 relative">
          <div className="flex items-center gap-3 mb-1">
            <label htmlFor="precoUnitario" className="block text-sm font-semibold text-gray-700 whitespace-nowrap">Valor Unit. (R$)</label>
            {rentabilidadePreview && (
              <span className={`text-[10px] font-bold px-2 py-0.5 rounded border ${coresRentabilidade[rentabilidadePreview]}`}>
                {rentabilidadePreview}
              </span>
            )}
          </div>
          <input 
            id="precoUnitario" type="text" required
            className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
            value={precoUnitario}
            onChange={(e) => setPrecoUnitario(mascaraMoeda(e.target.value))} // Aplica a máscara em tempo real!
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