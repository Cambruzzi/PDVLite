import { BrowserRouter, Routes, Route, Link } from 'react-router-dom';

// Importação das 4 páginas que criamos
import Login from './pages/Login';
import EmissaoPedido from './pages/EmissaoPedido';
import EdicaoPedido from './pages/EdicaoPedido';
import MeusPedidos from './pages/MeusPedidos';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        
        {/* Barra de Navegação */}
        <header className="bg-purple-800 text-white p-4 shadow-md mb-8">
          <div className="container mx-auto max-w-4xl flex justify-between items-center">
            <div className="font-bold text-xl tracking-wider">
              PDV<span className="font-light text-purple-300">Lite</span>
            </div>
            <nav className="flex gap-4 text-sm font-semibold">
              <Link to="/" className="hover:text-purple-300 transition-colors">Novo Pedido</Link>
              <Link to="/meus-pedidos" className="hover:text-purple-300 transition-colors">Meus Pedidos</Link>
            </nav>
          </div>
        </header>
        
        {/* Área Principal */}
        <main className="container mx-auto px-4 pb-12">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/" element={<EmissaoPedido />} />
            <Route path="/pedido/:id/editar" element={<EdicaoPedido />} />
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
          </Routes>
        </main>
        
      </div>
    </BrowserRouter>
  );
}