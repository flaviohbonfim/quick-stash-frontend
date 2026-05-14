import api from '@/lib/api'
import type { Transaction, BalanceResponse } from '@/types/transactions'

export const transactionService = {
  async getTransactions(params?: Record<string, string | number>): Promise<{
    data: Transaction[]
    total: number
    limit: number
    offset: number
  }> {
    const response = await api.get('/transactions', { params })
    return response.data
  },

  async getTransaction(id: string): Promise<Transaction> {
    const response = await api.get<Transaction>(`/transactions/${id}`)
    return response.data
  },

  async createTransaction(data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> {
    const response = await api.post<Transaction>('/transactions', data)
    return response.data
  },

  async updateTransaction(id: string, data: Partial<Transaction>): Promise<Transaction> {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data)
    return response.data
  },

  async deleteTransaction(id: string): Promise<void> {
    await api.delete(`/transactions/${id}`)
  },

  async getBalance(): Promise<BalanceResponse> {
    const response = await api.get<BalanceResponse>('/transactions/balance')
    return response.data
  },
}
