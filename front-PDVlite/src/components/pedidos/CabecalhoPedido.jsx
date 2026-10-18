export default function CabecalhoPedido({ clientes, clienteId, setClienteId }) {
  return (
    <div className="bg-white p-4 rounded-md shadow-sm border border-gray-200 mb-4">
      <h2 className="text-purple-700 font-bold mb-2 text-sm uppercase tracking-wide">Dados do Cliente</h2>
      <div className="flex flex-col">
        <label className="text-sm font-semibold text-gray-700 mb-1">Selecione o Cliente</label>
        <select 
          className="p-2 text-sm border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-purple-500 focus:border-transparent bg-white"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
          required
        >
          <option value="">-- Selecione --</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}