import { useQuery } from '@tanstack/react-query'
import { transactionService } from '@/services/transactionService'
import type { BalanceResponse } from '@/types/transactions'

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => transactionService.getBalance(),
    staleTime: 1000 * 30, // 30 segundos
  })
}
