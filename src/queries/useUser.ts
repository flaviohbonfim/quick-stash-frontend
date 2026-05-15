import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { authService } from '@/services/authService'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/auth'

export function useUser() {
  const setUser = useAuthStore((state) => state.setUser)

  return useQuery({
    queryKey: ['user'],
    queryFn: () => authService.getCurrentUser(),
    staleTime: 1000 * 60 * 5,
    retry: 1,
    refetchOnMount: 'always',
    refetchOnWindowFocus: true,
    onSuccess: (data) => {
      setUser(data)
    },
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)

  return useMutation({
    mutationFn: (data: { id: string } & Partial<User>) => {
      return userService.updateUser(data.id, { name: data.name, email: data.email })
    },
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user'] })
      setUser(data)
      toast.success('Perfil atualizado com sucesso!')
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao atualizar perfil'
      toast.error(message)
    },
  })
}

export function useChangePassword() {
  return useMutation({
    mutationFn: (data: { old_password: string; new_password: string }) =>
      userService.changePassword(data),
    onSuccess: () => {
      toast.success('Senha alterada com sucesso!')
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao alterar senha'
      toast.error(message)
    },
  })
}
