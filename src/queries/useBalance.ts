import { useQuery } from '@tanstack/react-query'
import api from '@/lib/api'

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => api.get('/transactions/balance').then(r => r.data),
  })
}
