import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight } from 'lucide-react'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { Badge } from '@/components/ui/badge'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { motion } from 'framer-motion'
import type { Transaction } from '@/types/transactions'

interface RecentTransactionsProps {
  transactions: Transaction[]
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
    transition: { delay: i * 0.05, duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  }),
  hover: {
    x: 4,
    transition: { duration: 0.15 },
  },
}

export function RecentTransactions({ transactions }: RecentTransactionsProps) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Transações Recentes</CardTitle>
        </CardHeader>
        <CardContent>
          {transactions.length === 0 ? (
            <div className="text-center text-muted-foreground">Nenhuma transação recente</div>
          ) : (
            <div className="space-y-4">
              {transactions.map((transaction, i) => (
                <motion.div
                  key={transaction.id}
                  custom={i}
                  variants={itemVariants}
                  initial="hidden"
                  animate="visible"
                  whileHover="hover"
                  className="group flex items-center justify-between border-b border-border/50 pb-3 last:border-0 last:pb-0 transition-colors duration-150 hover:bg-primary/5"
                >
                  <div className="flex items-center gap-3">
                    <motion.div
                      className={`flex h-10 w-10 items-center justify-center rounded-full ${
                        transaction.type === 'INCOME'
                          ? 'bg-primary/10 text-primary'
                          : 'bg-destructive/10 text-destructive'
                      }`}
                      whileHover={{ scale: 1.1, rotate: 5 }}
                      transition={{ duration: 0.15 }}
                    >
                      {transaction.type === 'INCOME' ? (
                        <ArrowUpRight className="h-5 w-5" />
                      ) : (
                        <ArrowDownRight className="h-5 w-5" />
                      )}
                    </motion.div>
                    <div>
                      <p className="font-medium">{transaction.description}</p>
                      <div className="flex items-center gap-2">
                        <Badge variant="outline" className="text-xs">
                          {transaction.category}
                        </Badge>
                        <span className="text-xs text-muted-foreground">
                          {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
                        </span>
                      </div>
                    </div>
                  </div>
                  <motion.span
                    className={`font-medium ${
                      transaction.type === 'INCOME' ? 'text-success' : 'text-destructive'
                    }`}
                    whileHover={{ scale: 1.05 }}
                  >
                    {transaction.type === 'INCOME' ? '+' : '-'}
                    <CurrencyFormat value={Math.abs(transaction.amount)} />
                  </motion.span>
                </motion.div>
              ))}
            </div>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
