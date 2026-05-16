import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { motion } from 'framer-motion'

interface ChartData {
  month: string
  income: number
  expense: number
}

interface IncomeExpenseChartProps {
  data: ChartData[]
}

const cardVariants = {
  hidden: { opacity: 0, y: 20 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.5, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

const tooltipStyle: React.CSSProperties = {
  backgroundColor: 'rgba(255, 255, 255, 0.85)',
  backdropFilter: 'blur(12px)',
  borderColor: 'rgba(139, 92, 246, 0.2)',
  borderRadius: '12px',
  boxShadow: '0 10px 25px rgba(0, 0, 0, 0.06), 0 4px 10px rgba(0, 0, 0, 0.04)',
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Receitas vs Despesas</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Sem dados para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <BarChart data={data}>
                <CartesianGrid strokeDasharray="3 3" stroke="oklch(0 0 0 / 0.04)" />
                <XAxis
                  dataKey="month"
                  className="text-xs"
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                  axisLine={{ stroke: 'var(--color-border)' }}
                  tickLine={false}
                />
                <YAxis
                  tickFormatter={(value) => `R$ ${value}`}
                  className="text-xs"
                  tick={{ fill: 'var(--color-muted-foreground)', fontSize: 11 }}
                  axisLine={false}
                  tickLine={false}
                />
                <Tooltip
                  formatter={(value: number) => [<CurrencyFormat value={value} />, '']}
                  cursor={{ fill: 'oklch(0.55 0.22 295 / 0.05)' }}
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Bar
                  dataKey="income"
                  fill="oklch(0.55 0.22 295)"
                  radius={[6, 6, 0, 0]}
                  name="Receita"
                  maxBarSize={32}
                />
                <Bar
                  dataKey="expense"
                  fill="oklch(0.55 0.22 25)"
                  radius={[6, 6, 0, 0]}
                  name="Despesa"
                  maxBarSize={32}
                />
              </BarChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
