import axios, {
  type AxiosInstance,
  type InternalAxiosRequestConfig,
  type AxiosResponse,
  type AxiosError,
} from 'axios'
import { useAuthStore } from '@/stores/authStore'

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
})

// Queue para requisições que aguardam o refresh
let isRefreshing = false
let failedQueue: Array<{
  resolve: (token: string) => void
  reject: (error?: unknown) => void
}> = []

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error)
    } else {
      prom.resolve(token!)
    }
  })
  failedQueue = []
}

// Request interceptor — attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`
  }
  return config
})

// Response interceptor — handle 401 com token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean }

    // Se errou com 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true

      if (isRefreshing) {
        // Já está refreshando — enfileirar esta requisição
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject })
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`
          }
          return api(originalRequest)
        })
      }

      // Primeiro — iniciar o refresh
      isRefreshing = true
      const { refreshToken } = useAuthStore.getState()

      try {
        if (!refreshToken) {
          throw new Error('No refresh token available')
        }

        // Chamar endpoint de refresh (usa axios direto para evitar loop no interceptor)
        const { data } = await axios.post('/auth/refresh', {
          refresh_token: refreshToken,
        }, {
          baseURL: api.defaults.baseURL,
        })

        // Atualizar store com novos tokens
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token)

        // Processar fila de requisições aguardando
        processQueue(null, data.access_token)

        // Retry da requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`
        }
        return api(originalRequest)

      } catch (refreshError) {
        // Refresh falhou — logout
        processQueue(refreshError, null)
        useAuthStore.getState().logout()
        window.location.href = '/login'
        return Promise.reject(refreshError)
      } finally {
        isRefreshing = false
      }
    }

    // Outros erros — apenas rejeitar
    return Promise.reject(error)
  }
)

export default api
