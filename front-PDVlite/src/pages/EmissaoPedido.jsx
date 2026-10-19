import { useState, useEffect } from 'react';
import api from '../services/api';
import CabecalhoPedido from '../components/pedidos/CabecalhoPedido';
import ItemPedidoForm from '../components/pedidos/ItemPedidoForm';
import ListaItensPedido from '../components/pedidos/ListaItensPedido';

export default function EmissaoPedido() {
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]);
  const [isSalvando, setIsSalvando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        const [resClientes, resProdutos] = await Promise.all([
          api.get('clientes/'),
          api.get('produtos/')
        ]);
        setClientes(resClientes.data);
        setProdutos(resProdutos.data);
      } catch (error) {
        console.error("Erro ao carregar base de dados", error);
      }
    };
    carregarDados();
  }, []);

  const handleAdicionarItem = (novoItem) => {
    setItens([...itens, novoItem]);
  };

  const handleRemoverItem = (indexParaRemover) => {
    setItens(itens.filter((_, index) => index !== indexParaRemover));
  };

  const handleSalvarPedido = async () => {
    if (!clienteId) {
      alert("Selecione um cliente.");
      return;
    }
    if (itens.length === 0) {
      alert("Adicione pelo menos um item ao pedido.");
      return;
    }

    try {
      const payload = {
        cliente: parseInt(clienteId),
        itens: itens.map(item => ({
          produto: item.produto_id,         // O Django exige 'produto' e não 'produto_id'
          quantidade: item.quantidade,      // Já é um número do parseFloat
          preco_unitario: item.preco_unitario // Já é um número do parseFloat
        }))
      };

      await api.post('pedidos/', payload);
      
      alert("Pedido emitido com sucesso!");
      // Limpar o ecrã após salvar
      setClienteId('');
      setItens([]);
      
    } catch (error) {
      // Se der erro, isto vai mostrar exatamente o campo que o Django rejeitou
      const mensagemErro = error.response?.data 
        ? JSON.stringify(error.response.data) 
        : "Erro de conexão com o servidor.";
      
      alert("Falha ao salvar o pedido: " + mensagemErro);
    }
  };

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <h1 className="text-2xl font-black text-purple-800">Novo Pedido</h1>
        {itens.length > 0 && (
          <button 
            onClick={handleSalvarPedido} disabled={isSalvando}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-bold shadow-md transition-colors"
          >
            {isSalvando ? 'Gravando...' : 'Finalizar Pedido'}
          </button>
        )}
      </div>

      <CabecalhoPedido clientes={clientes} clienteId={clienteId} setClienteId={setClienteId} />
      <ItemPedidoForm produtos={produtos} onAdicionarItem={handleAdicionarItem} />
      <ListaItensPedido itens={itens} onRemoverItem={handleRemoverItem} />
    </div>
  );
}