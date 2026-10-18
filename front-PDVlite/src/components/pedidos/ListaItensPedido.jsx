export default function ListaItensPedido({ itens, onRemoverItem }) {
  if (itens.length === 0) return null;

  const calcularTotalPedido = () => {
    return itens.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0);
  };

  // Função para garantir a formatação com separador de milhares e vírgula nos cêntimos
  const formatarValor = (valor) => {
    return new Intl.NumberFormat('pt-BR', { 
      minimumFractionDigits: 2, 
      maximumFractionDigits: 2 
    }).format(valor);
  };

  const coresRentabilidade = {
    'ÓTIMA': 'bg-green-100 text-green-800',
    'BOA': 'bg-blue-100 text-blue-800',
    'RUIM': 'bg-red-100 text-red-800',
  };

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-purple-50 text-purple-800 text-xs uppercase font-bold">
          <tr>
            <th className="p-3">Produto</th>
            <th className="p-3 text-center">Qtd</th>
            <th className="p-3 text-right">Vlr. Unitário</th>
            <th className="p-3 text-right">Total</th>
            <th className="p-3 text-center">Rentabilidade</th>
            <th className="p-3 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-100">
          {itens.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50 transition-colors">
              <td className="p-3 font-medium text-gray-900">{item.nome}</td>
              <td className="p-3 text-center">{item.quantidade}</td>
              
              {/* Valores formatados */}
              <td className="p-3 text-right text-gray-600">
                R$ {formatarValor(item.preco_unitario)}
              </td>
              <td className="p-3 text-right font-bold text-gray-900">
                R$ {formatarValor(item.quantidade * item.preco_unitario)}
              </td>
              
              <td className="p-3 text-center">
                <span className={`text-[10px] font-bold px-2 py-1 rounded-full uppercase ${coresRentabilidade[item.rentabilidadeVisual]}`}>
                  {item.rentabilidadeVisual}
                </span>
              </td>
              <td className="p-3 text-center">
                <button 
                  onClick={() => onRemoverItem(index)}
                  className="text-red-500 hover:text-red-700 font-bold px-2 py-1"
                  title="Remover Item"
                >
                  X
                </button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="bg-gray-50 p-4 border-t border-gray-200 text-right flex justify-end items-center gap-4">
        <span className="text-gray-600 text-sm">Total do Pedido:</span>
        {/* Total global também formatado */}
        <span className="text-2xl font-black text-purple-800">
          R$ {formatarValor(calcularTotalPedido())}
        </span>
      </div>
    </div>
  );
}