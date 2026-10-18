import { useState, useEffect } from 'react';

export default function ItemPedidoForm({ produtos, onAdicionarItem }) {
  const [produtoId, setProdutoId] = useState('');
  const [quantidade, setQuantidade] = useState('');
  const [precoUnitario, setPrecoUnitario] = useState('');
  const [rentabilidade, setRentabilidade] = useState(null);

  const produtoSelecionado = produtos.find(p => p.id === parseInt(produtoId));

  // 1. O Filtro Sênior: Bloqueia letras, aceita apenas números e uma única vírgula
  const formatarEntrada = (valor) => {
    let formatado = valor.replace(/[^0-9,]/g, ''); // Remove tudo que não for número ou vírgula
    const partes = formatado.split(',');
    if (partes.length > 2) {
      // Se o usuário tentar digitar duas vírgulas (ex: 5,5,5), mantemos apenas a primeira
      formatado = partes[0] + ',' + partes.slice(1).join('');
    }
    return formatado;
  };

  // 2. Helper para o React e o Django fazerem contas matemáticas (transforma vírgula em ponto)
  const converterParaFloat = (valorStr) => {
    if (!valorStr) return 0;
    return parseFloat(valorStr.replace(',', '.'));
  };

  // Quando o usuário seleciona um produto, preenchemos o preço já convertendo o ponto do banco para vírgula na tela
  useEffect(() => {
    if (produtoSelecionado) {
      setPrecoUnitario(produtoSelecionado.preco.replace('.', ','));
    } else {
      setPrecoUnitario('');
    }
  }, [produtoSelecionado]);

  // Cálculo da rentabilidade em tempo real
  useEffect(() => {
    if (produtoSelecionado && precoUnitario) {
      const precoDigitado = converterParaFloat(precoUnitario);
      const precoTabela = parseFloat(produtoSelecionado.preco);

      if (precoDigitado > precoTabela) setRentabilidade('otima');
      else if (precoDigitado >= (precoTabela * 0.9)) setRentabilidade('boa');
      else setRentabilidade('ruim');
    } else {
      setRentabilidade(null);
    }
  }, [precoUnitario, produtoSelecionado]);

  const handleSubmit = (e) => {
    e.preventDefault();
    if (!produtoSelecionado) return;

    const qtdFloat = converterParaFloat(quantidade);
    const precoFloat = converterParaFloat(precoUnitario);

    if (qtdFloat <= 0 || precoFloat <= 0) {
      alert("A quantidade e o valor devem ser maiores que zero.");
      return;
    }

    onAdicionarItem({
      produto_id: produtoSelecionado.id,
      nome: produtoSelecionado.nome,
      quantidade: qtdFloat,
      preco_unitario: precoFloat,
      rentabilidadeVisual: rentabilidade
    });

    // Limpa os campos após adicionar
    setProdutoId('');
    setQuantidade('');
    setPrecoUnitario('');
  };

  // Cores dinâmicas para a rentabilidade
  const coresRentabilidade = {
    otima: 'text-green-600 bg-green-100',
    boa: 'text-blue-600 bg-blue-100',
    ruim: 'text-red-600 bg-red-100'
  };

  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <h2 className="text-purple-700 font-bold mb-3 text-sm uppercase tracking-wide">Adicionar Produto</h2>
      
      {/* Usamos flex-wrap para garantir que fica bonito no celular também */}
      <form onSubmit={handleSubmit} className="flex flex-wrap md:flex-nowrap items-end gap-3">
        <div className="flex-1 min-w-[200px]">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Produto</label>
          <select 
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 bg-white"
            value={produtoId} onChange={e => setProdutoId(e.target.value)} required
          >
            <option value="">-- Selecione --</option>
            {produtos.map(p => (
              <option key={p.id} value={p.id}>{p.nome} (Mult: {p.multiplo})</option>
            ))}
          </select>
        </div>

        {/* Campo Quantidade Ajustado */}
        <div className="w-28">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Quantidade</label>
          <input 
            type="text" 
            inputMode="decimal" // Força o teclado numérico no celular
            required
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            value={quantidade} 
            onChange={e => setQuantidade(formatarEntrada(e.target.value))}
            placeholder="Ex: 5 ou 1,5"
          />
        </div>

        {/* Campo Valor Unitário Ajustado */}
        <div className="w-36 relative">
          <label className="block text-sm font-semibold text-gray-700 mb-1">Valor Unitário (R$)</label>
          <input 
            type="text" 
            inputMode="decimal" 
            required
            className="w-full p-2 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500"
            value={precoUnitario} 
            onChange={e => setPrecoUnitario(formatarEntrada(e.target.value))}
          />
          {rentabilidade && (
            <span className={`absolute -top-2 -right-2 text-[10px] px-1.5 py-0.5 rounded-full font-bold uppercase shadow-sm ${coresRentabilidade[rentabilidade]}`}>
              {rentabilidade}
            </span>
          )}
        </div>

        <button type="submit" className="bg-purple-600 hover:bg-purple-700 text-white p-2 rounded-md text-sm font-bold transition-colors w-full md:w-auto">
          + Adicionar
        </button>
      </form>
    </div>
  );
}