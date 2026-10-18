import { Link, useNavigate, useLocation } from 'react-router-dom';
import { setToken } from '../services/api';

export default function Navbar() {
  const navigate = useNavigate();
  const location = useLocation();

  // Se estivermos na página de Login, a barra superior não deve aparecer
  if (location.pathname === '/login') return null;

  const handleLogout = () => {
    // 1. Limpa o token da memória RAM do Axios
    setToken(null);
    
    // 2. Redireciona para o login de forma segura
    navigate('/login');
  };

  return (
    <header className="bg-purple-800 text-white p-4 shadow-md">
      <div className="container mx-auto max-w-4xl flex justify-between items-center">
        
        <div className="font-bold text-xl tracking-wider">
          PDV<span className="font-light text-purple-300">Lite</span>
        </div>
        
        <nav className="flex gap-5 items-center text-sm font-semibold">
          <Link to="/" className="hover:text-purple-300 transition-colors">Novo Pedido</Link>
          <Link to="/meus-pedidos" className="hover:text-purple-300 transition-colors">Meus Pedidos</Link>
          
          {/* Separador visual elegante */}
          <div className="w-px h-5 bg-purple-600 rounded-full mx-1"></div> 
          
          <button 
            onClick={handleLogout}
            className="text-red-300 hover:text-red-400 transition-colors font-bold flex items-center gap-1"
          >
            Sair &rarr;
          </button>
        </nav>
        
      </div>
    </header>
  );
}