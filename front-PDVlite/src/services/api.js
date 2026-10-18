import axios from 'axios';

// 1. Instância base com a configuração de Cookies ativada
const api = axios.create({
  baseURL: 'http://127.0.0.1:8000/api/',
  withCredentials: true, // Essencial: Diz ao navegador para enviar o Cookie HttpOnly sempre
});

// 2. Memória local para o Access Token (Blindado contra XSS)
let accessToken = null;

export const setToken = (token) => {
  accessToken = token;
};

// 3. Interceptor de Requisição: Antes de enviar ao Django
api.interceptors.request.use(
  (config) => {
    if (accessToken) {
      config.headers['Authorization'] = `Bearer ${accessToken}`;
    }
    return config;
  },
  (error) => Promise.reject(error)
);

// 4. Interceptor de Resposta: O "Anjo da Guarda" da sessão
api.interceptors.response.use(
  (response) => response, // Se a requisição deu 200 OK, passa direto
  
  async (error) => {
    const originalRequest = error.config;

    // Se o erro for 401 (Expirou) e ainda não tentámos refazer a requisição
    if (error.response?.status === 401 && !originalRequest.url.includes('login')) {
      originalRequest._retry = true;

      try {
        // Tenta renovar o token chamando a rota de refresh (o navegador envia o Cookie aqui)
        const res = await axios.post('http://127.0.0.1:8000/api/token/refresh/', {}, {
          withCredentials: true 
        });

        const newAccessToken = res.data.access;
        setToken(newAccessToken);

        // Atualiza a requisição original com o novo token e refaz o pedido silenciosamente
        originalRequest.headers['Authorization'] = `Bearer ${newAccessToken}`;
        return api(originalRequest);
        
      } catch (refreshError) {
        // Se o refresh falhar (o cookie expirou após 7 dias), limpa a memória
        setToken(null);
        // Opcional: Redirecionar para a página de login
        window.location.href = '/login';
        return Promise.reject(refreshError);
      }
    }
    
    return Promise.reject(error);
  }
);

export default api;