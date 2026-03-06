import axios from 'axios'

// Instância base do Axios com a URL da API vinda do .env
const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL,
})

// Interceptor: adiciona o token JWT em todas as requisições
api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token')
  if (token) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Interceptor: trata erros globais (ex: token expirado)
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Redireciona para login apenas se receber 401 em rota privada (/admin)
    if (error.response?.status === 401 && window.location.pathname.startsWith('/admin')) {
      localStorage.removeItem('token')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
