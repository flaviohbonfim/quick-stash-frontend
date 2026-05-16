import api from '@/lib/api'
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
    const response = await api.get<User[]>('/users')
    const data = response.data
    if (!Array.isArray(data) || data.length === 0) {
      return null
    }
    return data[0]
  },
}
