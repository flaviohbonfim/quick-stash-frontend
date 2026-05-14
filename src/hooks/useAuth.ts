import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/auth'

export function useAuth() {
  const { isAuthenticated, user, accessToken } = useAuthStore()

  return {
    isAuthenticated,
    user,
    accessToken,
  }
}

/**
 * Require that the user is authenticated.
 * Throws an error if not authenticated.
 */
export function requireAuth(): User {
  const user = useAuthStore.getState().user
  if (!user) {
    throw new Error('User is not authenticated')
  }
  return user
}

/**
 * Get the current access token, or null if not available.
 */
export function getAuthToken(): string | null {
  return useAuthStore.getState().accessToken
}

// Re-export the store for direct access
export { useAuthStore }
