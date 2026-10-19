export default function CabecalhoPedido({ clientes, clienteId, setClienteId }) {
  return (
    <div className="bg-white p-5 rounded-md shadow-sm border border-gray-200 mb-6">
      <h2 className="text-sm font-bold text-purple-800 mb-4 uppercase">Dados do Cliente</h2>
      
      <div>
        <label htmlFor="cliente" className="block text-sm font-semibold text-gray-700 mb-1">
          Selecione o Cliente
        </label>
        <select 
          id="cliente"
          required
          className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
          value={clienteId}
          onChange={(e) => setClienteId(e.target.value)}
        >
          <option value="">Selecione um cliente...</option>
          {clientes.map(c => (
            <option key={c.id} value={c.id}>{c.nome}</option>
          ))}
        </select>
      </div>
    </div>
  );
}