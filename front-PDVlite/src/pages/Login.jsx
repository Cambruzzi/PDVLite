import { useState } from 'react';
import { useNavigate } from 'react-router-dom';
import api, { setToken } from '../services/api';

export default function Login() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    setErro('');
    setIsLoading(true);

    try {
      // Bate na rota que acabamos de criar no Django
      const response = await api.post('login/', { username, password });
      
      // O Refresh Token já foi salvo silenciosamente no Cookie pelo navegador!
      // Nós salvamos apenas o Access Token na memória RAM:
      setToken(response.data.access);
      
      // Redireciona para a emissão de pedidos
      navigate('/');
    } catch (err) {
      setErro('Usuário ou senha incorretos. Tente novamente.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        
        {/* Cabeçalho do Login */}
        <div className="bg-purple-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            PDV<span className="font-light text-purple-300">Lite</span>
          </h1>
          <p className="text-purple-200 text-sm mt-2">Acesso Seguro</p>
        </div>

        {/* Formulário */}
        <div className="p-8">
          <form onSubmit={handleLogin} className="flex flex-col gap-5">
            {erro && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-bold text-center border border-red-200">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Usuário</label>
              <input 
                type="text" 
                required 
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={username}
                onChange={(e) => setUsername(e.target.value)}
                placeholder="Seu nome de usuário"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
              <input 
                type="password" 
                required 
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 focus:border-transparent outline-none transition-all"
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" 
              disabled={isLoading}
              className="mt-2 w-full bg-purple-600 hover:bg-purple-700 text-white p-3 rounded-md font-bold transition-colors flex justify-center items-center"
            >
              {isLoading ? 'Autenticando...' : 'Entrar no Sistema'}
            </button>
          </form>
        </div>
      </div>
    </div>
  );
}