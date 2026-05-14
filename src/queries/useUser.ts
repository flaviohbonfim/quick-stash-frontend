import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { User } from '@/types/transactions'

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => api.get('/users').then(r => r.data),
  })
}

export function useUpdateUser() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Partial<User>) =>
      api.put('/users', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['user'] }),
  })
}
