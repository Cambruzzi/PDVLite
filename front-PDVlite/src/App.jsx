import { useState, useEffect } from 'react';
import { BrowserRouter, Routes, Route } from 'react-router-dom';
import api, { setToken } from './services/api';

import Navbar from './components/Navbar';
import Login from './pages/Login';
import Cadastro from './pages/Cadastro';
import EmissaoPedido from './pages/EmissaoPedido';
import EdicaoPedido from './pages/EdicaoPedido';
import MeusPedidos from './pages/MeusPedidos';

export default function App() {
  const [isVerificandoSessao, setIsVerificandoSessao] = useState(true);

  useEffect(() => {
    const restaurarSessao = async () => {
      try {
        // Tenta renovar o token silenciosamente usando o Cookie HttpOnly
        const response = await api.post('token/refresh/');
        // Se deu certo, salva o novo Access Token na RAM
        setToken(response.data.access);
      } catch (error) {
        // Se falhar (não tem cookie ou expirou), apenas limpa o token
        setToken(null);
      } finally {
        // Libera a renderização da aplicação
        setIsVerificandoSessao(false);
      }
    };

    restaurarSessao();
  }, []);

  if (isVerificandoSessao) {
    return (
      <div className="min-h-screen bg-purple-800 flex items-center justify-center">
        <div className="text-white text-xl font-bold animate-pulse">
          A restaurar sessão...
        </div>
      </div>
    );
  }

  return (
    <BrowserRouter>
      <div className="min-h-screen bg-gray-50 text-gray-800">
        <Navbar />
        <main className="container mx-auto px-4 pb-12 pt-8">
          <Routes>
            <Route path="/login" element={<Login />} />
            <Route path="/cadastro" element={<Cadastro />} />
            <Route path="/" element={<EmissaoPedido />} />
            <Route path="/pedido/:id/editar" element={<EdicaoPedido />} />
            <Route path="/meus-pedidos" element={<MeusPedidos />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}