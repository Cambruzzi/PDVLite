export default function ListaItensPedido({ itens, onRemoverItem }) {
  if (itens.length === 0) return null;

  const totalPedido = itens.reduce((acc, item) => acc + (item.quantidade * item.preco_unitario), 0);

  return (
    <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
      <table className="w-full text-left text-sm text-gray-700">
        <thead className="bg-purple-50 text-purple-800 text-xs uppercase">
          <tr>
            <th className="p-2">Produto</th>
            <th className="p-2 text-right">Qtd</th>
            <th className="p-2 text-right">Vlr. Unitário</th>
            <th className="p-2 text-right">Total</th>
            <th className="p-2 text-center">Rentabilidade</th>
            <th className="p-2 text-center">Ações</th>
          </tr>
        </thead>
        <tbody className="divide-y divide-gray-200">
          {itens.map((item, index) => (
            <tr key={index} className="hover:bg-gray-50">
              <td className="p-2 font-medium">{item.nome}</td>
              <td className="p-2 text-right">{item.quantidade}</td>
              <td className="p-2 text-right">R$ {item.preco_unitario.toFixed(2)}</td>
              <td className="p-2 text-right font-bold text-gray-900">
                R$ {(item.quantidade * item.preco_unitario).toFixed(2)}
              </td>
              <td className="p-2 text-center">
                <span className={`text-[10px] px-2 py-1 rounded-md uppercase font-bold 
                  ${item.rentabilidadeVisual === 'otima' ? 'bg-green-100 text-green-700' : 
                    item.rentabilidadeVisual === 'boa' ? 'bg-blue-100 text-blue-700' : 'bg-red-100 text-red-700'}`}>
                  {item.rentabilidadeVisual}
                </span>
              </td>
              <td className="p-2 text-center">
                <button onClick={() => onRemoverItem(index)} className="text-red-500 hover:text-red-700 font-bold">X</button>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
      
      <div className="bg-gray-100 p-3 text-right">
        <span className="text-sm text-gray-600 mr-4">Total do Pedido:</span>
        <span className="text-xl font-black text-purple-700">R$ {totalPedido.toFixed(2)}</span>
      </div>
    </div>
  );
}