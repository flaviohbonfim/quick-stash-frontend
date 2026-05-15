import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { motion } from 'framer-motion'

interface SummaryCardsProps {
  totalIncome: number
  totalExpense: number
  totalBalance: number
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    transition: {
      delay: i * 0.1,
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

export function SummaryCards({ totalIncome, totalExpense, totalBalance }: SummaryCardsProps) {
  const cards = [
    { title: 'Receita Total', value: totalIncome, icon: ArrowUpRight, color: 'text-success' },
    { title: 'Despesa Total', value: totalExpense, icon: ArrowDownRight, color: 'text-destructive' },
    { title: 'Saldo Total', value: totalBalance, icon: Wallet, color: totalBalance >= 0 ? 'text-success' : 'text-destructive' },
  ]

  return (
    <div className="grid gap-4 md:grid-cols-3">
      {cards.map((card, i) => (
        <motion.div key={card.title} custom={i} variants={cardVariants} initial="hidden" animate="visible">
          <Card className="h-full transition-shadow duration-200 hover:shadow-md">
            <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
              <CardTitle className="text-sm font-medium">{card.title}</CardTitle>
              <card.icon className={`h-4 w-4 ${card.color}`} />
            </CardHeader>
            <CardContent>
              <div className={`text-2xl font-bold ${card.color}`}>
                <CurrencyFormat value={card.value} />
              </div>
            </CardContent>
          </Card>
        </motion.div>
      ))}
    </div>
  )
}
