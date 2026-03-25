import axios from 'axios'

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || '/api',
  timeout: 10000,
  headers: {
    'Content-Type': 'application/json',
  },
})

// INTERCEPTOR DE REQUISIÇÃO
// Roda antes de TODA requisição — injeta o token JWT automaticamente
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('token')
    if (token) {
      config.headers.Authorization = `Bearer ${token}`
    }
    return config
  },
  (error) => Promise.reject(error)
)

//INTERCEPTOR DE RESPOSTA
// Roda depois de TODA resposta — trata erros globalmente
api.interceptors.response.use(
  (response) => response,
  (error) => {
    // Só redireciona se havia token (sessão expirada)
    // Se não havia token, é tentativa de login com credenciais erradas — deixa o erro chegar na página
    const hadToken = !!localStorage.getItem('token')
    if (error.response?.status === 401 && hadToken) {
      localStorage.removeItem('token')
      localStorage.removeItem('user')
      window.location.href = '/login'
    }
    return Promise.reject(error)
  }
)

export default api
