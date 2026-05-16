import {
  LineChart,
  Line,
  Area,
  AreaChart,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { motion } from 'framer-motion'

interface TrendData {
  month: string
  balance: number
}

interface TrendChartProps {
  data: TrendData[]
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

export function TrendChart({ data }: TrendChartProps) {
  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>Tendência de Saldo</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Sem dados para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <AreaChart data={data}>
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
                  formatter={(value: number) => [<CurrencyFormat value={value} />, 'Saldo']}
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Area
                  type="monotone"
                  dataKey="balance"
                  stroke="oklch(0.55 0.22 295)"
                  strokeWidth={2.5}
                  fill="oklch(0.55 0.22 295 / 0.1)"
                  dot={{
                    fill: 'oklch(1 0 0)',
                    stroke: 'oklch(0.55 0.22 295)',
                    strokeWidth: 2,
                    r: 4,
                  }}
                  activeDot={{
                    r: 7,
                    fill: 'oklch(1 0 0)',
                    stroke: 'oklch(0.55 0.22 295)',
                    strokeWidth: 2.5,
                  }}
                />
              </AreaChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
