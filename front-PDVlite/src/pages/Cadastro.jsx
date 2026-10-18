import { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import api from '../services/api';

export default function Cadastro() {
  const [username, setUsername] = useState('');
  const [password, setPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [erro, setErro] = useState('');
  const [isLoading, setIsLoading] = useState(false);
  
  const navigate = useNavigate();

  const handleCadastro = async (e) => {
    e.preventDefault();
    setErro('');

    // Validação básica no front-end
    if (password !== confirmPassword) {
      setErro('As senhas não coincidem.');
      return;
    }
    if (password.length < 6) {
      setErro('A senha deve ter pelo menos 6 caracteres.');
      return;
    }

    setIsLoading(true);

    try {
      // Faz o POST para a nova rota que criámos no Django
      await api.post('cadastro/', { username, password });
      
      alert('Conta criada com sucesso! Faça login para aceder ao PDVLite.');
      navigate('/login'); // Redireciona para o login após o sucesso
      
    } catch (err) {
      // Se o Django reclamar (ex: utilizador já existe), mostramos o erro
      if (err.response?.data?.username) {
        setErro('Este nome de utilizador já está em uso. Escolha outro.');
      } else {
        setErro('Ocorreu um erro ao criar a conta. Tente novamente.');
      }
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-gray-50 px-4">
      <div className="max-w-md w-full bg-white rounded-md shadow-lg border border-gray-200 overflow-hidden">
        
        <div className="bg-purple-800 p-6 text-center">
          <h1 className="text-3xl font-bold text-white tracking-wider">
            PDV<span className="font-light text-purple-300">Lite</span>
          </h1>
          <p className="text-purple-200 text-sm mt-2">Criar Nova Conta</p>
        </div>

        <div className="p-8">
          <form onSubmit={handleCadastro} className="flex flex-col gap-4">
            {erro && (
              <div className="bg-red-100 text-red-700 p-3 rounded-md text-sm font-bold text-center border border-red-200">
                {erro}
              </div>
            )}

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Nome de Utilizador</label>
              <input 
                type="text" required 
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={username} onChange={(e) => setUsername(e.target.value)}
                placeholder="Ex: joaosilva"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Senha</label>
              <input 
                type="password" required 
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={password} onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <div>
              <label className="block text-sm font-semibold text-gray-700 mb-1">Confirmar Senha</label>
              <input 
                type="password" required 
                className="w-full p-2.5 text-sm border border-gray-300 rounded-md focus:ring-2 focus:ring-purple-500 outline-none"
                value={confirmPassword} onChange={(e) => setConfirmPassword(e.target.value)}
                placeholder="••••••••"
              />
            </div>

            <button 
              type="submit" disabled={isLoading}
              className="mt-4 w-full bg-green-600 hover:bg-green-700 text-white p-3 rounded-md font-bold transition-colors"
            >
              {isLoading ? 'Criando conta...' : 'Cadastrar'}
            </button>
            
            <div className="text-center mt-4">
              <Link to="/login" className="text-sm text-purple-700 hover:underline font-semibold">
                Já tem uma conta? Faça Login
              </Link>
            </div>
          </form>
        </div>
      </div>
    </div>
  );
}