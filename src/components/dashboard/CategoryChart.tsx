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

interface CategoryData {
  name: string
  value: number
  color: string
}

const CATEGORY_COLORS = [
  'hsl(var(--success))',
  'hsl(var(--danger))',
  'hsl(var(--primary))',
  'hsl(217 91% 60%)',
  'hsl(280 70% 55%)',
  'hsl(35 90% 55%)',
  'hsl(170 70% 45%)',
  'hsl(25 95% 55%)',
  'hsl(300 70% 55%)',
  'hsl(190 80% 50%)',
]

interface CategoryChartProps {
  data: CategoryData[]
  title?: string
}

export function CategoryChart({ data, title = 'Despesas por Categoria' }: CategoryChartProps) {
  if (data.length === 0) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>{title}</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex h-[300px] items-center justify-center text-muted-foreground">
            Sem dados para exibir
          </div>
        </CardContent>
      </Card>
    )
  }

  return (
    <Card>
      <CardHeader>
        <CardTitle>{title}</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <PieChart>
            <Pie
              data={data}
              cx="50%"
              cy="50%"
              labelLine={false}
              label={({ name, percent }) => `${name} (${(percent * 100).toFixed(0)}%)`}
              outerRadius={80}
              fill="#8884d8"
              dataKey="value"
            >
              {data.map((_entry, index) => (
                <Cell key={`cell-${index}`} fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]} />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [<CurrencyFormat value={value} />, 'Valor']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend
              formatter={(value) => <span className="text-xs">{value}</span>}
              wrapperStyle={{ fontSize: '12px' }}
            />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  )
}
