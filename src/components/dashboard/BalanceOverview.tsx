import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Wallet } from 'lucide-react'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'

interface BalanceOverviewProps {
  totalBalance: number
}

export function BalanceOverview({ totalBalance }: BalanceOverviewProps) {
  return (
    <Card className="bg-gradient-to-br from-primary/10 to-primary/5">
      <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
        <CardTitle className="text-sm font-medium">Saldo Total</CardTitle>
        <Wallet className="h-4 w-4 text-primary" />
      </CardHeader>
      <CardContent>
        <div className={`text-3xl font-bold ${totalBalance >= 0 ? 'text-success' : 'text-destructive'}`}>
          <CurrencyFormat value={totalBalance} />
        </div>
        <p className="mt-1 text-xs text-muted-foreground">
          {totalBalance >= 0 ? 'Seu saldo está positivo' : 'Seu saldo está negativo'}
        </p>
      </CardContent>
    </Card>
  )
}
