export const API_BASE_URL = (import.meta as any).env.VITE_API_URL || 'http://localhost:8000'

export const CATEGORIES = {
  EXPENSE: [
    'Alimentação',
    'Transporte',
    'Moradia',
    'Saúde',
    'Educação',
    'Lazer',
    'Tecnologia',
    'Vestuário',
    'Serviços',
    'Outros',
  ],
  INCOME: [
    'Salário',
    'Freelance',
    'Investimentos',
    'Presente',
    'Outros',
  ],
} as const

export const PAYMENT_METHOD_TYPES = {
  PIX: 'PIX',
  CREDIT_CARD: 'CREDIT_CARD',
} as const
