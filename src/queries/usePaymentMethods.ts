import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query'
import { toast } from 'sonner'
import { paymentMethodService } from '@/services/paymentMethodService'
import type { PaymentMethod } from '@/types/transactions'

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => paymentMethodService.getPaymentMethods(),
    staleTime: 1000 * 60, // 1 minuto
  })
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (data: { name: string; type: 'PIX' | 'CREDIT_CARD' }) =>
      paymentMethodService.createPaymentMethod(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success('Conta criada com sucesso!')
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao criar conta'
      toast.error(message)
    },
  })
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient()

  return useMutation({
    mutationFn: (id: string) => paymentMethodService.deletePaymentMethod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] })
      toast.success('Conta removida com sucesso!')
    },
    onError: (error: unknown) => {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      const message = axiosError.response?.data?.detail || 'Erro ao remover conta'
      toast.error(message)
    },
  })
}
