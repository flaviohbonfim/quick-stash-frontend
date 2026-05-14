import { useQuery } from '@tanstack/react-query'
import { transactionService } from '@/services/transactionService'

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => transactionService.getBalance(),
    staleTime: 1000 * 30, // 30 segundos
  })
}
