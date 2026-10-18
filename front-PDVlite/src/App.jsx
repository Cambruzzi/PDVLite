import { BrowserRouter, Routes, Route } from 'react-router-dom';
import './index.css';

// Componentes Base
import Navbar from './components/Navbar';

// Páginas
import Login from './pages/Login';
import EmissaoPedido from './pages/EmissaoPedido';
import EdicaoPedido from './pages/EdicaoPedido';
import MeusPedidos from './pages/MeusPedidos';

export default function App() {
  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        
        {/* A nossa nova barra de navegação inteligente */}
        <Navbar />
        
        {/* Adicionei um padding-top (pt-8) para afastar o conteúdo do cabeçalho */}
        <main className="container mx-auto px-4 pb-12 pt-8">
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