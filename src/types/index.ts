export type {
  User,
  LoginRequest,
  RegisterRequest,
  TokenResponse,
  PaymentMethod,
  Transaction,
  BalanceResponse,
  PaymentMethodType,
  TransactionType,
} from './transactions'

export interface AuthState {
  user: import('./transactions').User | null
  accessToken: string | null
  refreshToken: string | null
  isAuthenticated: boolean
}

export interface ThemeState {
  theme: 'light' | 'dark'
  toggleTheme: () => void
}
