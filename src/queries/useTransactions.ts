import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import api from '@/lib/api'
import type { Transaction } from '@/types/transactions'

export function useTransactions(params?: {
  type?: 'INCOME' | 'EXPENSE'
  category?: string
  payment_method_id?: string
  start_date?: string
  end_date?: string
  limit?: number
  offset?: number
}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.get('/transactions', { params }).then(r => r.data),
  })
}

export function useCreateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (data: Omit<Transaction, 'id' | 'created_at'>) =>
      api.post('/transactions', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })
}

export function useUpdateTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Transaction> & { id: string }) =>
      api.patch(`/transactions/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })
}

export function useDeleteTransaction() {
  const qc = useQueryClient()
  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  })
}
