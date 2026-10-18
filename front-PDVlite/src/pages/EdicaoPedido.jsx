import { useState, useEffect } from 'react';
import { useParams, useNavigate } from 'react-router-dom';
import api from '../services/api';
import CabecalhoPedido from '../components/pedidos/CabecalhoPedido';
import ItemPedidoForm from '../components/pedidos/ItemPedidoForm';
import ListaItensPedido from '../components/pedidos/ListaItensPedido';

export default function EdicaoPedido() {
  const { id } = useParams(); // Pega o ID do pedido na URL
  const navigate = useNavigate();
  
  const [clientes, setClientes] = useState([]);
  const [produtos, setProdutos] = useState([]);
  const [clienteId, setClienteId] = useState('');
  const [itens, setItens] = useState([]);
  
  const [isLoading, setIsLoading] = useState(true);
  const [isSalvando, setIsSalvando] = useState(false);

  useEffect(() => {
    const carregarDados = async () => {
      try {
        setIsLoading(true);
        // 1. Carrega os catálogos base primeiro
        const [resClientes, resProdutos] = await Promise.all([
          api.get('clientes/'),
          api.get('produtos/')
        ]);
        
        const listaClientes = resClientes.data;
        const listaProdutos = resProdutos.data;
        
        setClientes(listaClientes);
        setProdutos(listaProdutos);

        // 2. Busca o pedido específico
        const resPedido = await api.get(`pedidos/${id}/`);
        const pedido = resPedido.data;

        // 3. Popula o formulário e traduz os itens do banco para o visual da tela
        setClienteId(pedido.cliente);
        
        const itensMapeados = pedido.itens.map(itemDB => ({
          id: itemDB.id, // Fundamental manter o ID para o método UPDATE do Django funcionar
          produto_id: itemDB.produto,
          nome: listaProdutos.find(p => p.id === itemDB.produto)?.nome || 'Desconhecido',
          quantidade: parseFloat(itemDB.quantidade),
          preco_unitario: parseFloat(itemDB.preco_unitario),
          rentabilidadeVisual: itemDB.rentabilidade
        }));
        
        setItens(itensMapeados);
      } catch (error) {
        alert("Erro ao carregar o pedido. Ele pode não existir ou pertencer a outro vendedor.");
        navigate('/'); // Redireciona para segurança
      } finally {
        setIsLoading(false);
      }
    };
    carregarDados();
  }, [id, navigate]);

  const handleAdicionarItem = (novoItem) => {
    setItens([...itens, novoItem]); // Itens novos não possuem 'id' ainda, o que é correto
  };

  const handleRemoverItem = (indexParaRemover) => {
    setItens(itens.filter((_, index) => index !== indexParaRemover));
  };

  const handleSalvarEdicao = async () => {
    if (!clienteId || itens.length === 0) {
      alert("Selecione um cliente e mantenha pelo menos um item.");
      return;
    }

    try {
      setIsSalvando(true);
      
      // 4. Monta o payload respeitando a Sincronização Inteligente do Django
      const payload = {
        cliente: parseInt(clienteId),
        itens: itens.map(i => {
          const payloadItem = {
            produto: i.produto_id,
            quantidade: i.quantidade,
            preco_unitario: i.preco_unitario
          };
          // Se o item já existia no banco, envia o ID para atualizar. Se não, omite para criar.
          if (i.id) payloadItem.id = i.id; 
          return payloadItem;
        })
      };

      await api.put(`pedidos/${id}/`, payload);
      alert("Pedido atualizado com sucesso!");
      navigate('/meus-pedidos'); // Volta para a lista
      
    } catch (error) {
      const mensagemErro = error.response?.data ? JSON.stringify(error.response.data) : "Erro interno.";
      alert("Falha ao salvar edições: " + mensagemErro);
    } finally {
      setIsSalvando(false);
    }
  };

  if (isLoading) return <div className="text-center py-10 text-purple-700 font-bold">Carregando pedido...</div>;

  return (
    <div className="max-w-4xl mx-auto">
      <div className="flex justify-between items-center mb-6">
        <div>
          <button onClick={() => navigate('/meus-pedidos')} className="text-sm text-gray-500 hover:text-purple-700 mb-1 block">
            &larr; Voltar
          </button>
          <h1 className="text-2xl font-black text-purple-800">Editando Pedido #{id}</h1>
        </div>
        
        {itens.length > 0 && (
          <button 
            onClick={handleSalvarEdicao} disabled={isSalvando}
            className="bg-green-500 hover:bg-green-600 text-white px-6 py-2 rounded-md font-bold shadow-md transition-colors"
          >
            {isSalvando ? 'Salvando...' : 'Atualizar Pedido'}
          </button>
        )}
      </div>

      <CabecalhoPedido clientes={clientes} clienteId={clienteId} setClienteId={setClienteId} />
      <ItemPedidoForm produtos={produtos} onAdicionarItem={handleAdicionarItem} />
      <ListaItensPedido itens={itens} onRemoverItem={handleRemoverItem} />
    </div>
  );
}