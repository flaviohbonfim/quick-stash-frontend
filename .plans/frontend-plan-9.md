# 📋 Frontend Plan — Etapa 9/10: Dashboard Completo

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 8 — Login e Registro](./frontend-plan-8.md)
> **Fase correspondente:** Fase 3 — Dashboard
> **Duração estimada:** 3-4 dias

---

## 🎯 Objetivo desta etapa

Implementar o dashboard principal com todos os componentes de visualização: summary cards, gráficos (Recharts), saldo por conta e transações recentes. Esta é a tela principal da aplicação.

---

## 📦 O que será entregue

### 9.1 — CurrencyFormat (Componente Utilitário)

**`src/components/common/CurrencyFormat.tsx`:**

```typescript
export function CurrencyFormat({
  value,
  className = '',
}: {
  value: number;
  className?: string;
}) {
  const formatted = new Intl.NumberFormat('pt-BR', {
    style: 'currency',
    currency: 'BRL',
  }).format(value);

  return <span className={className}>{formatted}</span>;
}
```

### 9.2 — SummaryCards

**`src/components/dashboard/SummaryCards.tsx`:**

```typescript
import { ArrowUpRight, ArrowDownRight, Wallet } from 'lucide-react';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';

interface SummaryCardsProps {
  totalIncome: number;
  totalExpense: number;
  totalBalance: number;
}

export function SummaryCards({ totalIncome, totalExpense, totalBalance }: SummaryCardsProps) {
  return (
    <div className="grid gap-4 md:grid-cols-3">
      {/* Receita */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Receita</CardTitle>
          <ArrowUpRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyFormat value={totalIncome} />
          </div>
          <p className="text-xs text-muted-foreground">Total recebido</p>
        </CardContent>
      </Card>

      {/* Despesa */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Despesa</CardTitle>
          <ArrowDownRight className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className="text-2xl font-bold">
            <CurrencyFormat value={totalExpense} />
          </div>
          <p className="text-xs text-muted-foreground">Total gasto</p>
        </CardContent>
      </Card>

      {/* Saldo */}
      <Card>
        <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
          <CardTitle className="text-sm font-medium">Saldo</CardTitle>
          <Wallet className="h-4 w-4 text-muted-foreground" />
        </CardHeader>
        <CardContent>
          <div className={`text-2xl font-bold ${totalBalance >= 0 ? 'text-success' : 'text-danger'}`}>
            <CurrencyFormat value={totalBalance} />
          </div>
          <p className="text-xs text-muted-foreground">Saldo total</p>
        </CardContent>
      </Card>
    </div>
  );
}
```

### 9.3 — BalanceOverview

**`src/components/dashboard/BalanceOverview.tsx`:**

```typescript
import { useBalance } from '@/queries/useBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';

export function BalanceOverview() {
  const { data, isLoading, error } = useBalance();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Erro ao carregar saldo" />;
  if (!data) return <EmptyState title="Nenhum dado encontrado" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Saldo Total</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="text-3xl font-bold">
          <CurrencyFormat value={data.total_balance} />
        </div>
      </CardContent>
    </Card>
  );
}
```

### 9.4 — AccountCards

**`src/components/dashboard/AccountCards.tsx`:**

```typescript
import { useBalance } from '@/queries/useBalance';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { Badge } from '@/components/ui/badge';

export function AccountCards() {
  const { data, isLoading, error } = useBalance();

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Erro ao carregar saldo" />;
  if (!data || data.accounts.length === 0) return <EmptyState title="Nenhuma conta encontrada" />;

  return (
    <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
      {data.accounts.map((account) => (
        <Card key={account.id}>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">{account.name}</CardTitle>
            <Badge variant={account.type === 'PIX' ? 'default' : 'secondary'}>
              {account.type === 'PIX' ? 'PIX' : 'Cartão Crédito'}
            </Badge>
          </CardHeader>
          <CardContent>
            <div className={`text-2xl font-bold ${account.balance >= 0 ? 'text-success' : 'text-danger'}`}>
              <CurrencyFormat value={account.balance} />
            </div>
          </CardContent>
        </Card>
      ))}
    </div>
  );
}
```

### 9.5 — IncomeExpenseChart

**`src/components/dashboard/IncomeExpenseChart.tsx`:**

```typescript
import {
  BarChart,
  Bar,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

interface IncomeExpenseChartProps {
  data: ChartData[];
}

export function IncomeExpenseChart({ data }: IncomeExpenseChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Receitas vs Despesas</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <BarChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `R$ ${value}`}
              width={60}
            />
            <Tooltip
              formatter={(value: number) => [
                <CurrencyFormat key="currency" value={value} />,
                '',
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} name="Receita" />
            <Bar dataKey="expense" fill="hsl(var(--danger))" radius={[4, 4, 0, 0]} name="Despesa" />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### 9.6 — CategoryChart

**`src/components/dashboard/CategoryChart.tsx`:**

```typescript
import {
  PieChart,
  Pie,
  Cell,
  Tooltip,
  ResponsiveContainer,
  Legend,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';

interface CategoryData {
  name: string;
  value: number;
}

// Cores para as categorias
const CATEGORY_COLORS = [
  'hsl(149.579, 59.6%, 59.6%)',   // success green
  'hsl(25.331, 84.7%, 57.7%)',     // danger red
  'hsl(285.885, 64.9%, 64.9%)',    // primary purple
  'hsl(210, 100%, 56%)',           // blue
  'hsl(45, 93%, 47%)',             // yellow
  'hsl(180, 50%, 50%)',            // teal
  'hsl(340, 82%, 52%)',            // pink
  'hsl(280, 50%, 50%)',            // violet
];

interface CategoryChartProps {
  data: CategoryData[];
  title?: string;
}

export function CategoryChart({ data, title = 'Despesas por Categoria' }: CategoryChartProps) {
  if (data.length === 0) return null;

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
              dataKey="value"
              nameKey="name"
              cx="50%"
              cy="50%"
              outerRadius={100}
              label={({ name, percent }) =>
                `${name} ${(percent * 100).toFixed(0)}%`
              }
            >
              {data.map((_entry, index) => (
                <Cell
                  key={`cell-${index}`}
                  fill={CATEGORY_COLORS[index % CATEGORY_COLORS.length]}
                />
              ))}
            </Pie>
            <Tooltip
              formatter={(value: number) => [
                <CurrencyFormat key="currency" value={value} />,
                '',
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Legend />
          </PieChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### 9.7 — TrendChart

**`src/components/dashboard/TrendChart.tsx`:**

```typescript
import {
  LineChart,
  Line,
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';

interface TrendData {
  month: string;
  balance: number;
}

interface TrendChartProps {
  data: TrendData[];
}

export function TrendChart({ data }: TrendChartProps) {
  return (
    <Card>
      <CardHeader>
        <CardTitle>Tendência de Saldo</CardTitle>
      </CardHeader>
      <CardContent>
        <ResponsiveContainer width="100%" height={300}>
          <LineChart data={data}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="month" />
            <YAxis
              tickFormatter={(value) => `R$ ${value}`}
              width={60}
            />
            <Tooltip
              formatter={(value: number) => [
                <CurrencyFormat key="currency" value={value} />,
                '',
              ]}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
                borderRadius: '8px',
              }}
            />
            <Line
              type="monotone"
              dataKey="balance"
              stroke="hsl(var(--primary))"
              strokeWidth={2}
              dot={{ fill: 'hsl(var(--primary))' }}
            />
          </LineChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

### 9.8 — RecentTransactions

**`src/components/dashboard/RecentTransactions.tsx`:**

```typescript
import { useTransactions } from '@/queries/useTransactions';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Badge } from '@/components/ui/badge';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { ArrowUpRight, ArrowDownRight } from 'lucide-react';

export function RecentTransactions() {
  const { data, isLoading, error } = useTransactions({ limit: 5 });

  if (isLoading) return <LoadingSpinner />;
  if (error) return <EmptyState title="Erro ao carregar transações" />;
  if (!data || data.data.length === 0) return <EmptyState title="Nenhuma transação encontrada" />;

  return (
    <Card>
      <CardHeader>
        <CardTitle>Transações Recentes</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="space-y-3">
          {data.data.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between border-b pb-2 last:border-0 last:pb-0"
            >
              <div className="space-y-1">
                <p className="text-sm font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{transaction.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-2">
                <Badge variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}>
                  {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </Badge>
                <span
                  className={`text-sm font-bold ${
                    transaction.type === 'INCOME' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  <CurrencyFormat value={transaction.amount} />
                </span>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}
```

### 9.9 — Dashboard Page

**`src/pages/DashboardPage.tsx`:**

```typescript
import { useBalance } from '@/queries/useBalance';
import { useTransactions } from '@/queries/useTransactions';
import { SummaryCards } from '@/components/dashboard/SummaryCards';
import { IncomeExpenseChart } from '@/components/dashboard/IncomeExpenseChart';
import { CategoryChart } from '@/components/dashboard/CategoryChart';
import { TrendChart } from '@/components/dashboard/TrendChart';
import { AccountCards } from '@/components/dashboard/AccountCards';
import { RecentTransactions } from '@/components/dashboard/RecentTransactions';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export default function DashboardPage() {
  const { data: balance, isLoading: balanceLoading } = useBalance();
  const { data: transactions, isLoading: transactionsLoading } = useTransactions({ limit: 50 });

  if (balanceLoading || transactionsLoading) {
    return <LoadingSpinner />;
  }

  // Calcular totais para summary cards
  const totalIncome = transactions?.data
    ?.filter((t) => t.type === 'INCOME')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalExpense = transactions?.data
    ?.filter((t) => t.type === 'EXPENSE')
    .reduce((sum, t) => sum + t.amount, 0) || 0;

  const totalBalance = balance?.total_balance || 0;

  // Preparar dados para gráficos
  const incomeExpenseData = transactions?.data
    ? prepareIncomeExpenseData(transactions.data)
    : [];

  const categoryData = transactions?.data
    ? prepareCategoryData(transactions.data)
    : [];

  const trendData = transactions?.data
    ? prepareTrendData(transactions.data)
    : [];

  return (
    <div className="space-y-6">
      <h1 className="text-3xl font-bold text-foreground">Dashboard</h1>

      {/* Summary Cards */}
      <SummaryCards
        totalIncome={totalIncome}
        totalExpense={totalExpense}
        totalBalance={totalBalance}
      />

      {/* Account Cards */}
      <AccountCards />

      {/* Charts Row 1 */}
      <div className="grid gap-4 md:grid-cols-2">
        <IncomeExpenseChart data={incomeExpenseData} />
        <CategoryChart data={categoryData} />
      </div>

      {/* Trend Chart */}
      <TrendChart data={trendData} />

      {/* Recent Transactions */}
      <RecentTransactions />
    </div>
  );
}

// Helpers para preparar dados dos gráficos
function prepareIncomeExpenseData(transactions: any[]) {
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const grouped: Record<string, { income: number; expense: number }> = {};

  transactions.forEach((t) => {
    const date = new Date(t.date);
    const month = months[date.getMonth()];
    if (!grouped[month]) grouped[month] = { income: 0, expense: 0 };
    if (t.type === 'INCOME') grouped[month].income += t.amount;
    else grouped[month].expense += t.amount;
  });

  return months
    .filter((m) => grouped[m])
    .map((month) => ({
      month,
      ...grouped[month],
    }));
}

function prepareCategoryData(transactions: any[]) {
  const grouped: Record<string, number> = {};
  transactions
    .filter((t) => t.type === 'EXPENSE')
    .forEach((t) => {
      grouped[t.category] = (grouped[t.category] || 0) + t.amount;
    });

  return Object.entries(grouped)
    .map(([name, value]) => ({ name, value }))
    .sort((a, b) => b.value - a.value);
}

function prepareTrendData(transactions: any[]) {
  const sorted = [...transactions].sort(
    (a, b) => new Date(a.date).getTime() - new Date(b.date).getTime()
  );

  let cumulative = 0;
  const months = ['Jan', 'Fev', 'Mar', 'Abr', 'Mai', 'Jun', 'Jul', 'Ago', 'Set', 'Out', 'Nov', 'Dez'];
  const seen = new Set<string>();

  return sorted
    .map((t) => {
      const date = new Date(t.date);
      const key = `${date.getFullYear()}-${date.getMonth()}`;
      const month = months[date.getMonth()];

      if (t.type === 'INCOME') cumulative += t.amount;
      else cumulative -= t.amount;

      if (seen.has(key)) return null;
      seen.add(key);

      return { month: `${month}/${date.getFullYear()}`, balance: cumulative };
    })
    .filter(Boolean)
    .slice(-6); // Últimos 6 meses
}
```

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros de tipo
- [ ] Dashboard abre em `/` (após login)
- [ ] Summary cards mostram receita, despesa e saldo corretamente
- [ ] Saldo positivo aparece em verde, negativo em vermelho
- [ ] Account cards mostram saldo por conta com badge PIX/Cartão
- [ ] Gráfico de barras (Receitas vs Despesas) renderiza corretamente
- [ ] Gráfico de donut (Despesas por Categoria) renderiza corretamente
- [ ] Gráfico de linha (Tendência de Saldo) renderiza corretamente
- [ ] Tooltips dos gráficos mostram valores em formato monetário (R$)
- [ ] Transações recentes mostram as 5 últimas com descrição, categoria, tipo e valor
- [ ] LoadingSpinner aparece enquanto dados estão carregando
- [ ] EmptyState aparece quando não há dados
- [ ] Layout é responsivo (grid 1 coluna mobile, 2 colunas desktop)
- [ ] Gráficos são responsivos (ResponsiveContainer do Recharts)

### Teste Manual

1. Fazer login
2. Verificar que o dashboard carrega
3. Verificar que os 3 summary cards aparecem
4. Verificar que os 3 gráficos aparecem
5. Verificar que as transações recentes aparecem
6. Redimensionar a janela — verificar responsividade
7. Trocar tema dark/light — verificar que gráficos se adaptam

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Dashboard layout | [Plano §7](./frontend-plan.md#7-dashboard--componentes-de-gráficos) |
| Gráficos Recharts | [Plano §7 — Gráficos principais](./frontend-plan.md#7-dashboard--componentes-de-gráficos) |
| Summary cards | [Plano §7 — Resumo](./frontend-plan.md#7-dashboard--componentes-de-gráficos) |
| Account cards | [Plano §7 — Saldo por Conta](./frontend-plan.md#7-dashboard--componentes-de-gráficos) |
| Responsividade | [Plano §11](./frontend-plan.md#11-responsividade) |
| Hooks TanStack Query | [Etapa 6](./frontend-plan-6.md) |
| Layout (AppLayout) | [Etapa 7](./frontend-plan-7.md) |

---

## ⚠️ Notas

- Recharts usa `ResponsiveContainer` para ser responsivo
- Cores dos gráficos usam `hsl(var(--success))`, `hsl(var(--danger))`, `hsl(var(--primary))` para seguir o tema
- Helpers `prepareIncomeExpenseData`, `prepareCategoryData`, `prepareTrendData` transformam os dados da API no formato que o Recharts espera
- `CurrencyFormat` usa `Intl.NumberFormat` com locale `pt-BR` e currency `BRL`
- O dashboard faz 2 queries: `useBalance` e `useTransactions`
- Dados dos gráficos são calculados no frontend a partir das transações
