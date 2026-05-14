import api from '@/lib/api'
import type { PaymentMethod } from '@/types/transactions'

export const paymentMethodService = {
  async getPaymentMethods(): Promise<PaymentMethod[]> {
    const response = await api.get<PaymentMethod[]>('/payment-methods')
    return response.data
  },

  async createPaymentMethod(data: { name: string; type: 'PIX' | 'CREDIT_CARD' }): Promise<PaymentMethod> {
    const response = await api.post<PaymentMethod>('/payment-methods', data)
    return response.data
  },

  async deletePaymentMethod(id: string): Promise<void> {
    await api.delete(`/payment-methods/${id}`)
  },
}
