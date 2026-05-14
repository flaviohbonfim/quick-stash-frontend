import { useMutation } from '@tanstack/react-query'
import { useNavigate } from 'react-router-dom'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { useAuthStore } from '@/stores/authStore'
import type { LoginRequest, RegisterRequest } from '@/types/auth'

export function useLogin() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      toast.success('Login realizado com sucesso!')
      navigate('/', { replace: true })
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao fazer login'
      toast.error(message)
    },
  })
}

export function useRegister() {
  const navigate = useNavigate()
  const setTokens = useAuthStore((state) => state.setTokens)

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token)
      toast.success('Conta criada com sucesso!')
      navigate('/', { replace: true })
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao criar conta'
      toast.error(message)
    },
  })
}

export function useLogout() {
  const navigate = useNavigate()
  const logout = useAuthStore((state) => state.logout)

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout()
      toast.success('Logout realizado com sucesso!')
      navigate('/login', { replace: true })
    },
    onError: () => {
      logout()
      navigate('/login', { replace: true })
    },
  })
}
