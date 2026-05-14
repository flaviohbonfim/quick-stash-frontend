import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { Badge } from '@/components/ui/badge'
import type { PaymentMethodType } from '@/types/transactions'

interface Account {
  id: string
  name: string
  type: PaymentMethodType
  balance: number
}

interface AccountCardsProps {
  accounts: Account[]
}

export function AccountCards({ accounts }: AccountCardsProps) {
  if (accounts.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Saldo por Conta</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="text-center text-muted-foreground">
            Nenhuma conta cadastrada
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo por Conta</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {accounts.map((account) => (
            <div
              key={account.id}
              className="rounded-lg border bg-card p-4"
            >
              <div className="flex items-center justify-between">
                <span className="font-medium">{account.name}</span>
                <Badge variant={account.type === 'CREDIT_CARD' ? 'destructive' : 'outline'}>
                  {account.type === 'CREDIT_CARD' ? 'Cartão' : 'PIX'}
                </Badge>
              </div>
              <div className={`mt-2 text-2xl font-bold ${account.balance >= 0 ? 'text-success' : 'text-destructive'}`}>
                <CurrencyFormat value={account.balance} />
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  )
}
