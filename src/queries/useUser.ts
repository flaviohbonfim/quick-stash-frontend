import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { userService } from '@/services/userService'
import { useAuthStore } from '@/stores/authStore'
import type { User } from '@/types/auth'

export function useUser() {
  const userId = useAuthStore((state) => state.user?.id)

  return useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getUser(userId!),
    staleTime: 1000 * 60 * 5, // 5 minutos
    enabled: !!userId,
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  const setUser = useAuthStore((state) => state.setUser)
  const userId = useAuthStore((state) => state.user?.id)

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateUser(userId!, data),
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
