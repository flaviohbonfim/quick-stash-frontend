import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => api.get('/payment-methods').then(r => r.data),
  })
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: { name: string; type: 'PIX' | 'CREDIT_CARD' }) =>
      api.post('/payment-methods', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-methods'] }),
  })
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/payment-methods/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-methods'] }),
  })
}
