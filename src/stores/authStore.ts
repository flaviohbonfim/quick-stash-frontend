import { create } from 'zustand'
import type { AuthState } from '@/types'
import type { User } from '@/types/transactions'

interface AuthStore extends AuthState {
  setUser: (user: User) => void
  setTokens: (accessToken: string, refreshToken: string) => void
  logout: () => void
}

export const useAuthStore = create<AuthStore>((set) => ({
  user: null,
  accessToken: null,
  refreshToken: null,
  isAuthenticated: false,

  setUser: (user) => set({ user }),
  setTokens: (accessToken, refreshToken) => set({
    accessToken,
    refreshToken,
    isAuthenticated: true,
  }),
  logout: () => set({
    user: null,
    accessToken: null,
    refreshToken: null,
    isAuthenticated: false,
  }),
}))
