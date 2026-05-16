import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { motion } from 'framer-motion'
import { useState } from 'react'

interface CategoryData {
  name: string
  value: number
  color: string
}

const CATEGORY_COLORS = [
  'oklch(0.55 0.22 295)', // amethyst primary
  'oklch(0.65 0.18 320)', // lilac
  'oklch(0.70 0.15 270)', // violet blue
  'oklch(0.60 0.20 340)', // magenta
  'oklch(0.75 0.12 250)', // indigo
  'oklch(0.60 0.18 155)', // emerald
  'oklch(0.78 0.16 70)', // amber
  'oklch(0.55 0.22 25)', // red
  'oklch(0.65 0.25 295)', // light amethyst
  'oklch(0.50 0.015 286)', // muted
]

interface CategoryChartProps {
  data: CategoryData[]
  title?: string
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

export function CategoryChart({ data, title = 'Despesas por Categoria' }: CategoryChartProps) {
  const [activeIndex, setActiveIndex] = useState<number | null>(null)

  const handlePieHover = (index: number) => {
    setActiveIndex(index === activeIndex ? null : index)
  }

  return (
    <motion.div variants={cardVariants} initial="hidden" animate="visible">
      <Card className="h-full transition-shadow duration-200 hover:shadow-md">
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          {data.length === 0 ? (
            <div className="flex h-[300px] items-center justify-center text-muted-foreground">
              Sem dados para exibir
            </div>
          ) : (
            <ResponsiveContainer width="100%" height={300}>
              <PieChart>
                <Pie
                  data={data}
                  cx="50%"
                  cy="50%"
                  labelLine={false}
                  label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
                  outerRadius={80}
                  innerRadius={activeIndex !== null ? 55 : 60}
                  dataKey="value"
                  stroke="none"
                  onMouseEnter={(_, index) => handlePieHover(index)}
                  onMouseLeave={() => setActiveIndex(null)}
                >
                  {data.map((_entry, index) => (
                    <Cell
                      key={`cell-${index}`}
                      fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                      stroke="none"
                      opacity={activeIndex !== null && activeIndex !== index ? 0.5 : 1}
                      className="transition-opacity duration-200 cursor-pointer"
                    />
                  ))}
                </Pie>
                <Tooltip
                  formatter={(value: number) => [<CurrencyFormat value={value} />, 'Valor']}
                  contentStyle={tooltipStyle}
                  wrapperStyle={{ outline: 'none' }}
                />
                <Legend
                  formatter={(value) => <span className="text-xs">{value}</span>}
                  wrapperStyle={{ fontSize: '12px' }}
                />
              </PieChart>
            </ResponsiveContainer>
          )}
        </CardContent>
      </Card>
    </motion.div>
  )
}
