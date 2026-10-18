import { BrowserRouter, Routes, Route } from 'react-router-dom';
import EmissaoPedido from './pages/EmissaoPedido';

export default function App() {
  return (
    <BrowserRouter>
      {/* O fundo cinza claro e a altura mínima da tela inteira */}
      <div className="min-h-screen bg-gray-50 text-gray-800">
        
        {/* Barra de Navegação Superior (Header) */}
        <header className="bg-purple-800 text-white p-4 shadow-md mb-8">
          <div className="container mx-auto max-w-4xl font-bold text-xl tracking-wider">
            PDV<span className="font-light text-purple-300">Lite</span>
          </div>
        </header>
        
        {/* Área principal onde as páginas são renderizadas */}
        <main className="container mx-auto px-4 pb-12">
          <Routes>
            {/* Define a Emissão de Pedido como a página inicial do sistema */}
            <Route path="/" element={<EmissaoPedido />} />
          </Routes>
        </main>
      </div>
    </BrowserRouter>
  );
}