import { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import api from '../services/api';

export default function MeusPedidos() {
  const [pedidos, setPedidos] = useState([]);
  const [clientes, setClientes] = useState([]);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        // Busca os pedidos do vendedor logado e a lista de clientes para traduzir o nome
        const [resPedidos, resClientes] = await Promise.all([
          api.get('pedidos/'),
          api.get('clientes/')
        ]);
        
        setPedidos(resPedidos.data);
        setClientes(resClientes.data);
      } catch (error) {
        console.error("Erro ao carregar pedidos", error);
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, []);

  // Helper para buscar o nome do cliente pelo ID
  const getClienteNome = (id) => {
    const cliente = clientes.find(c => c.id === id);
    return cliente ? cliente.nome : 'Desconhecido';
  };

  // Helper para somar o valor total de um pedido
  const calcularTotal = (itens) => {
    return itens.reduce((acc, item) => acc + (parseFloat(item.quantidade) * parseFloat(item.preco_unitario)), 0);
  };

  if (isLoading) return <div className="text-center py-10 text-purple-700 font-bold text-sm">Buscando seus pedidos...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-purple-800">Meus Pedidos</h1>
        <Link to="/" className="bg-purple-600 hover:bg-purple-700 text-white px-4 py-2 rounded-md text-sm font-bold shadow-sm transition-colors">
          + Novo Pedido
        </Link>
      </div>

      {pedidos.length === 0 ? (
        <div className="bg-white p-8 rounded-md shadow-sm border border-gray-200 text-center">
          <p className="text-gray-600 mb-4 text-sm">Você ainda não possui pedidos registrados.</p>
        </div>
      ) : (
        <div className="bg-white rounded-md shadow-sm border border-gray-200 overflow-hidden">
          <table className="w-full text-left text-sm text-gray-700">
            <thead className="bg-purple-50 text-purple-800 text-xs uppercase">
              <tr>
                <th className="p-3">Nº Pedido</th>
                <th className="p-3">Data</th>
                <th className="p-3">Cliente</th>
                <th className="p-3 text-center">Itens</th>
                <th className="p-3 text-right">Total</th>
                <th className="p-3 text-center">Ações</th>
              </tr>
            </thead>
            <tbody className="divide-y divide-gray-200">
              {pedidos.map(pedido => (
                <tr key={pedido.id} className="hover:bg-gray-50 transition-colors">
                  <td className="p-3 font-bold text-purple-700">#{pedido.id}</td>
                  <td className="p-3 text-xs">
                    {new Date(pedido.criado_em).toLocaleDateString('pt-BR')}
                  </td>
                  <td className="p-3 font-medium truncate max-w-[200px]">
                    {getClienteNome(pedido.cliente)}
                  </td>
                  <td className="p-3 text-center font-bold">
                    {pedido.itens.length}
                  </td>
                  <td className="p-3 text-right font-black text-gray-900">
                    R$ {calcularTotal(pedido.itens).toFixed(2).replace('.', ',')}
                  </td>
                  <td className="p-3 text-center">
                    {/* O LINK DINÂMICO DE EDIÇÃO QUE FALTAVA! */}
                    <Link 
                      to={`/pedido/${pedido.id}/editar`}
                      className="inline-block bg-blue-50 text-blue-600 border border-blue-200 hover:bg-blue-600 hover:text-white px-3 py-1 rounded text-xs font-bold transition-all"
                    >
                      Editar
                    </Link>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      )}
    </div>
  );
}