export type PaymentMethodType = 'CREDIT_CARD' | 'PIX'
export type TransactionType = 'INCOME' | 'EXPENSE'

export interface PaymentMethod {
  id: string
  name: string
  type: PaymentMethodType
  balance: number
  created_at: string
}

export interface Transaction {
  id: string
  amount: number
  date: string
  description: string
  type: TransactionType
  category: string
  payment_method_id: string
  created_at: string
}

export interface BalanceResponse {
  total_balance: number
  accounts: Array<{
    id: string
    name: string
    type: PaymentMethodType
    balance: number
  }>
}

export interface User {
  id: string
  name: string
  email: string
  created_at: string
}

export interface LoginRequest {
  email: string
  password: string
}

export interface RegisterRequest {
  name: string
  email: string
  password: string
}

export interface TokenResponse {
  access_token: string
  refresh_token: string
  token_type: string
}
