import api from '@/lib/api'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types/auth'

export const authService = {
  async login(data: LoginRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/login', data)
    return response.data
  },

  async register(data: RegisterRequest): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/register', data)
    return response.data
  },

  async logout(): Promise<void> {
    await api.post('/auth/logout')
  },

  async refreshToken(refreshToken: string): Promise<TokenResponse> {
    const response = await api.post<TokenResponse>('/auth/refresh', { refresh_token: refreshToken })
    return response.data
  },

  async getCurrentUser(): Promise<User | null> {
    const { accessToken } = useAuthStore.getState()
    if (!accessToken) return null

    let userId: string
    try {
      const payload = JSON.parse(atob(accessToken.split('.')[1].replace(/-/g, '+').replace(/_/g, '/')))
      userId = payload.sub
      if (!userId) return null
    } catch {
      return null
    }

    const response = await api.get<User>(`/users/${userId}`)
    return response.data
  },
}
