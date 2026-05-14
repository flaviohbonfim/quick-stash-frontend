import { useAuthStore } from '@/stores/authStore'

export function useAuth() {
  const { isAuthenticated, user, accessToken } = useAuthStore()

  return {
    isAuthenticated,
    user,
    accessToken,
  }
}
