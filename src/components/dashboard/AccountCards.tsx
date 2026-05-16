import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { Badge } from '@/components/ui/badge'
import { motion } from 'framer-motion'
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

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const itemVariants = {
  hidden: { opacity: 0, x: -10 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: { delay: i * 0.06, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
}

export function AccountCards({ accounts }: AccountCardsProps) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Saldo por Conta</CardTitle>
        </CardHeader>
        <CardContent>
          {accounts.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhuma conta cadastrada</div>
          ) : (
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {accounts.map((account, i) => (
                <motion.div
                  key={account.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
                  className={`rounded-xl border p-4 transition-all duration-200 ${
                    account.type === 'CREDIT_CARD'
                      ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-card hover:shadow-card-hover'
                      : 'border-primary/10 bg-gradient-to-br from-primary/3 to-transparent shadow-card hover:shadow-card-hover'
                  }`}
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
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
