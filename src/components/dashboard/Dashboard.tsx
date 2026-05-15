import { useBalance } from '@/queries/useBalance'
import { useTransactions } from '@/queries/useTransactions'
import { SummaryCards } from './SummaryCards'
import { IncomeExpenseChart } from './IncomeExpenseChart'
import { CategoryChart } from './CategoryChart'
import { TrendChart } from './TrendChart'
import { AccountCards } from './AccountCards'
import { RecentTransactions } from './RecentTransactions'
import { Skeleton } from '@/components/ui/skeleton'
import { motion } from 'framer-motion'
import type { Transaction } from '@/types/transactions'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

export function Dashboard() {
  const { data: balanceData, isLoading: balanceLoading } = useBalance()
  const { data: transactionsData, isLoading: transactionsLoading } = useTransactions({
    limit: 100,
  })

  const transactions = Array.isArray(transactionsData) ? transactionsData : (transactionsData?.data || []) as Transaction[]

  // Prepare chart data - last 6 months
  const incomeExpenseData = transactions.reduce<Record<string, { income: number; expense: number }>>((acc, t) => {
    const month = t.date.substring(0, 7) // YYYY-MM
    if (!acc[month]) acc[month] = { income: 0, expense: 0 }
    if (t.type === 'INCOME') acc[month].income += t.amount
    else acc[month].expense += t.amount
    return acc
  }, {})

  const incomeExpenseChartData = Object.entries(incomeExpenseData)
    .sort(([a], [b]) => a.localeCompare(b))
    .slice(-6)
    .map(([month, data]) => ({
      month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
      income: data.income,
      expense: data.expense,
    }))

  // Category data for expenses
  const categoryData = transactions
    .filter((t): t is Transaction => t.type === 'EXPENSE')
    .reduce<Record<string, number>>((acc, t) => {
      acc[t.category] = (acc[t.category] || 0) + t.amount
      return acc
    }, {})

  const categoryChartData = Object.entries(categoryData)
    .sort(([, a], [, b]) => (b as number) - (a as number))
    .slice(0, 6)
    .map(([name, value]) => ({ name, value: value as number, color: '' }))

  // Trend data
  const trendData = transactions.reduce<Record<string, number>>((acc, t) => {
    const month = t.date.substring(0, 7)
    if (!acc[month]) acc[month] = 0
    acc[month] += t.type === 'INCOME' ? t.amount : -t.amount
    return acc
  }, {})

  const trendChartData = Object.entries(trendData)
    .sort(([a], [b]) => a.localeCompare(b))
    .map(([month, balance]) => ({
      month: new Date(month + '-01').toLocaleDateString('pt-BR', { month: 'short' }),
      balance: balance as number,
    }))

  if (balanceLoading || transactionsLoading) {
    return (
      <div className="space-y-6">
        <Skeleton className="h-8 w-48" />
        <div className="grid gap-4 md:grid-cols-3">
          {[1, 2, 3].map(i => <Skeleton key={i} className="h-24" />)}
        </div>
        <Skeleton className="h-64" />
        <Skeleton className="h-64" />
      </div>
    )
  }

  const totalBalance = (Array.isArray(balanceData) ? 0 : (balanceData?.total_balance || 0))
  const totalIncome = transactions.reduce<number>((sum, t) => t.type === 'INCOME' ? sum + t.amount : sum, 0)
  const totalExpense = transactions.reduce<number>((sum, t) => t.type === 'EXPENSE' ? sum + t.amount : sum, 0)

  return (
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      <motion.h1 variants={itemVariants} className="text-3xl font-bold">
        Dashboard
      </motion.h1>

      {/* Summary Cards */}
      <motion.div variants={itemVariants}>
        <SummaryCards
          totalIncome={totalIncome}
          totalExpense={totalExpense}
          totalBalance={totalBalance}
        />
      </motion.div>

      {/* Charts Row */}
      <motion.div variants={itemVariants}>
        <div className="grid gap-6 md:grid-cols-2">
          <IncomeExpenseChart data={incomeExpenseChartData} />
          <CategoryChart data={categoryChartData} />
        </div>
      </motion.div>

      {/* Trend Chart */}
      <motion.div variants={itemVariants}>
        <TrendChart data={trendChartData} />
      </motion.div>

      {/* Account Cards */}
      {balanceData?.accounts && balanceData.accounts.length > 0 && (
        <motion.div variants={itemVariants}>
          <AccountCards accounts={balanceData.accounts} />
        </motion.div>
      )}

      {/* Recent Transactions */}
      <motion.div variants={itemVariants}>
        <RecentTransactions transactions={transactions.slice(0, 5)} />
      </motion.div>
    </motion.div>
  )
}
