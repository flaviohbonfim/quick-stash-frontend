# 📋 Plano de Implementação — Quick Stash Frontend

## Visão Geral

Aplicação de controle financeiro pessoal com:
- **Vite 8** (build tool)
- **React 19** + **TypeScript**
- **Tailwind CSS v4** + **shadcn/ui** (componentes)
- **TanStack Query** (gerenciamento de estado server-side + token refresh)
- **Zustand** (estado global de auth)
- **Recharts** (gráficos do dashboard)
- **React Router v7** (navegação)
- **Zod** (validação de schemas)
- **Framer Motion** (animações)
- **Lucide React** (ícones)

---

## 1. Arquitetura de Pastas

```
quick-stash-frontend/
├── src/
│   ├── main.tsx                    # Entry point
│   ├── App.tsx                     # Router + Auth provider
│   │
│   ├── assets/
│   │   └── fonts/                  # Inter font
│   │
│   ├── lib/
│   │   ├── api.ts                  # Axios instance + interceptors (token refresh)
│   │   ├── utils.ts                # cn() helper (clsx + tailwind-merge)
│   │   └── constants.ts            # API base URL, categories, etc.
│   │
│   ├── types/
│   │   ├── auth.ts                 # User, LoginRequest, TokenResponse
│   │   ├── transactions.ts         # Transaction, PaymentMethod, Balance
│   │   └── index.ts
│   │
│   ├── stores/
│   │   ├── authStore.ts            # Zustand store (user, tokens, isAuthenticated)
│   │   └── themeStore.ts           # Zustand store (dark/light mode)
│   │
│   ├── hooks/
│   │   ├── useAuth.ts              # Auth context hook
│   │   └── useTheme.ts             # Theme hook
│   │
│   ├── services/
│   │   ├── authService.ts          # login, register, logout, refreshToken
│   │   ├── transactionService.ts   # CRUD transactions, balance, payment-methods
│   │   └── userService.ts          # User CRUD
│   │
│   ├── queries/
│   │   ├── useTransactions.ts      # TanStack Query hooks (list, create, update, delete)
│   │   ├── useBalance.ts           # useBalance() — GET /transactions/balance
│   │   ├── usePaymentMethods.ts    # usePaymentMethods() — CRUD
│   │   └── useUser.ts              # useUser() — profile
│   │
│   ├── components/
│   │   ├── ui/                     # shadcn/ui components
│   │   │   ├── button.tsx
│   │   │   ├── input.tsx
│   │   │   ├── card.tsx
│   │   │   ├── dialog.tsx
│   │   │   ├── dropdown-menu.tsx
│   │   │   ├── select.tsx
│   │   │   ├── tabs.tsx
│   │   │   ├── badge.tsx
│   │   │   ├── toast.tsx
│   │   │   ├── toast-provider.tsx
│   │   │   ├── sonner.tsx
│   │   │   ├── sidebar.tsx
│   │   │   ├── sheet.tsx           # Mobile drawer
│   │   │   ├── table.tsx
│   │   │   ├── form.tsx
│   │   │   ├── label.tsx
│   │   │   ├── popover.tsx
│   │   │   ├── command.tsx
│   │   │   ├── calendar.tsx
│   │   │   ├── avatar.tsx
│   │   │   ├── separator.tsx
│   │   │   ├── scroll-area.tsx
│   │   │   └── tooltip.tsx
│   │   │
│   │   ├── layout/
│   │   │   ├── AppLayout.tsx       # Sidebar + main content wrapper
│   │   │   ├── Sidebar.tsx         # Collapsible sidebar nav
│   │   │   ├── SidebarMobile.tsx   # Mobile drawer (Sheet)
│   │   │   └── Header.tsx          # Top bar (theme toggle, user menu)
│   │   │
│   │   ├── auth/
│   │   │   ├── LoginForm.tsx       # Login form
│   │   │   ├── RegisterForm.tsx    # Register form
│   │   │   └── AuthLayout.tsx      # Centered card layout
│   │   │
│   │   ├── dashboard/
│   │   │   ├── Dashboard.tsx       # Main dashboard page
│   │   │   ├── BalanceOverview.tsx # Total balance card
│   │   │   ├── AccountCards.tsx    # Per-account balance cards
│   │   │   ├── IncomeExpenseChart.tsx    # Bar/line chart
│   │   │   ├── CategoryChart.tsx   # Pie/donut by category
│   │   │   ├── TrendChart.tsx      # Monthly trend line
│   │   │   ├── RecentTransactions.tsx # Transaction list
│   │   │   └── SummaryCards.tsx    # Income/Expense/Balance summary
│   │   │
│   │   ├── transactions/
│   │   │   ├── TransactionList.tsx
│   │   │   ├── TransactionForm.tsx
│   │   │   ├── TransactionFilters.tsx
│   │   │   └── TransactionTable.tsx
│   │   │
│   │   ├── payment-methods/
│   │   │   ├── PaymentMethodList.tsx
│   │   │   └── PaymentMethodForm.tsx
│   │   │
│   │   └── common/
│   │       ├── ErrorBoundary.tsx
│   │       ├── LoadingSpinner.tsx
│   │       ├── EmptyState.tsx
│   │       └── CurrencyFormat.tsx
│   │
│   ├── routes/
│   │   ├── index.tsx               # Route definitions
│   │   └── ProtectedRoute.tsx      # Auth guard
│   │
│   └── pages/
│       ├── LoginPage.tsx
│       ├── RegisterPage.tsx
│       ├── DashboardPage.tsx
│       ├── TransactionsPage.tsx
│       ├── PaymentMethodsPage.tsx
│       └── SettingsPage.tsx
│
├── index.html
├── vite.config.ts
├── tailwind.config.ts
├── tsconfig.json
├── package.json
└── postcss.config.mjs
```

---

## 2. Stack Detalhada

| Camada | Tecnologia | Justificativa |
|--------|-----------|---------------|
| **Build** | Vite 8 + SWC | Ultra-rápido HMR, bundling otimizado |
| **UI Framework** | React 19 + TypeScript | Tipagem forte, React 19 com server components ready |
| **CSS** | Tailwind CSS v4 | Utility-first, variáveis CSS nativas, tema com `@theme` |
| **Components** | shadcn/ui | Acessível, customizável, sem dependência de lib pesada |
| **HTTP Client** | Axios | Interceptors para token refresh automático |
| **State (server)** | TanStack Query v5 | Cache, refetch, loading/error states, mutations |
| **State (global)** | Zustand | Auth state, theme toggle — leve e simples |
| **Roteamento** | React Router v7 | File-based routing, lazy loading |
| **Validação** | Zod + React Hook Form | Schema validation nos forms |
| **Gráficos** | Recharts | Declarativo, responsivo, bom suporte a dark mode |
| **Animações** | Framer Motion | Transições suaves sidebar, modais, page transitions |
| **Toasts** | Sonner | Notificações elegantes |
| **Ícones** | Lucide React | Consistente com shadcn |

---

## 3. Configuração de Tema (Claro/Escuro)

### `themeStore.ts` (Zustand)
```typescript
// Persiste preferência no localStorage
// Detecta prefers-color-scheme do sistema
// Toggle com transição suave
```

### Tailwind v4 — Configuração de tema
```css
/* src/index.css */
@import "tailwindcss";

@theme {
  --color-background: oklch(1 0 0);
  --color-foreground: oklch(0.145 0 0);
  --color-card: oklch(1 0 0);
  --color-card-foreground: oklch(0.145 0 0);
  --color-primary: oklch(0.205 0.064 285.885);
  --color-primary-foreground: oklch(0.985 0 0);
  --color-muted: oklch(0.967 0.003 286.033);
  --color-muted-foreground: oklch(0.556 0.018 285.936);
  --color-border: oklch(0.922 0.002 286.033);
  --color-input: oklch(0.922 0.002 286.033);
  --color-ring: oklch(0.708 0.07 286.033);
  --color-success: oklch(0.596 0.187 149.579);
  --color-danger: oklch(0.577 0.254 25.331);
  --color-warning: oklch(0.765 0.184 65.697);
}

/* Dark mode */
@theme dark {
  --color-background: oklch(0.145 0 0);
  --color-foreground: oklch(0.985 0 0);
  --color-card: oklch(0.205 0 0);
  --color-card-foreground: oklch(0.985 0 0);
  --color-primary: oklch(0.649 0.171 281.278);
  --color-primary-foreground: oklch(0.205 0.064 285.885);
  --color-muted: oklch(0.269 0 0);
  --color-muted-foreground: oklch(0.708 0 0);
  --color-border: oklch(0.269 0 0);
  --color-input: oklch(0.269 0 0);
  --color-ring: oklch(0.448 0.015 286.097);
  --color-success: oklch(0.696 0.17 160.601);
  --color-danger: oklch(0.637 0.237 25.331);
  --color-warning: oklch(0.828 0.189 70.08);
}
```

---

## 4. API Client com Token Refresh

### `lib/api.ts` — Axios instance com interceptor

```typescript
import axios from 'axios';
import { authStore } from '@/stores/authStore';

const api = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

let isRefreshing = false;
let failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) prom.reject(error);
    else prom.resolve(token!);
  });
  failedQueue = [];
};

// Request interceptor — attach token
api.interceptors.request.use(config => {
  const token = authStore.getState().accessToken;
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 with token refresh
api.interceptors.response.use(
  response => response,
  async error => {
    const originalRequest = error.config;

    if (error.response?.status === 401 && !originalRequest._retry) {
      if (isRefreshing) {
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          originalRequest.headers.Authorization = `Bearer ${token}`;
          return api(originalRequest);
        });
      }

      originalRequest._retry = true;
      isRefreshing = true;

      const { refreshToken } = authStore.getState();

      try {
        const { data } = await axios.post('/auth/refresh', {
          refresh_token: refreshToken,
        });

        authStore.getState().setTokens(data.access_token, data.refresh_token);
        api.defaults.headers.common['Authorization'] = `Bearer ${data.access_token}`;

        processQueue(null, data.access_token);
        originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        return api(originalRequest);
      } catch (refreshError) {
        processQueue(refreshError, null);
        authStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    return Promise.reject(error);
  }
);

export default api;
```

---

## 5. Rotas e Navegação

### `routes/index.tsx`
```typescript
import { createBrowserRouter } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProtectedRoute } from './ProtectedRoute';

const LoginPage = lazy(() => import('@/pages/LoginPage'));
const RegisterPage = lazy(() => import('@/pages/RegisterPage'));
const DashboardPage = lazy(() => import('@/pages/DashboardPage'));
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'));
const PaymentMethodsPage = lazy(() => import('@/pages/PaymentMethodsPage'));
const SettingsPage = lazy(() => import('@/pages/SettingsPage'));

const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        index: true,
        element: <DashboardPage />,
      },
      {
        path: 'transactions',
        element: <TransactionsPage />,
      },
      {
        path: 'payment-methods',
        element: <PaymentMethodsPage />,
      },
      {
        path: 'settings',
        element: <SettingsPage />,
      },
    ],
  },
]);

export default router;
```

---

## 6. Sidebar com Opção de Recolher

### `components/layout/Sidebar.tsx`

```typescript
import { cn } from '@/lib/utils';
import { useThemeStore } from '@/stores/themeStore';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { authStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transações', icon: CreditCard, path: '/transactions' },
  { label: 'Contas', icon: Wallet, path: '/payment-methods' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = () => {
    authStore.getState().logout();
    navigate('/login');
  };

  return (
    <aside className={cn(
      "flex h-screen flex-col border-r bg-card transition-all duration-300",
      collapsed ? "w-16" : "w-64"
    )}>
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">Quick Stash</span>
        )}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map(item => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Button
                  variant={location.pathname === item.path ? "secondary" : "ghost"}
                  className={cn(
                    "w-full justify-start gap-2",
                    collapsed && "justify-center px-0"
                  )}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* Bottom */}
      <div className="border-t p-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn("w-full justify-start gap-2 text-destructive",
                  collapsed && "justify-center px-0"
                )}
                onClick={logout}
              >
                <LogOut size={18} />
                {!collapsed && <span>Sair</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
```

### Mobile — Drawer com Sheet

```typescript
// components/layout/SidebarMobile.tsx
// Usa <Sheet> do shadcn para abrir sidebar como drawer em telas pequenas
// Trigger = hamburger menu button no Header
```

---

## 7. Dashboard — Componentes de Gráficos

### `components/dashboard/Dashboard.tsx`

```
┌─────────────────────────────────────────────────────────┐
│  Header: [☰]  Quick Stash                    [🌙] [👤] │
├──────────┬──────────────────────────────────────────────┤
│          │                                              │
│ Sidebar  │  ┌─────────────────────────────────────┐    │
│ (coll.)  │  │  Resumo:  Receita  │  Despesa  │  Saldo │    │
│          │  │            R$ 5.000│  R$ 2.300 │ R$2.700│    │
│          │  └─────────────────────────────────────┘    │
│  📊 Dash │                                              │
│  💳 Trans│  ┌──────────────┐  ┌──────────────────┐    │
│  💰 Contas│  │  Receitas    │  │  Despesas por    │    │
│  ⚙️ Config│  │  vs Despesas   │  │  Categoria       │    │
│          │  │  (últimos 6m)  │  │  [donut chart]   │    │
│          │  │  [bar chart]   │  │                  │    │
│          │  └──────────────┘  └──────────────────┘    │
│          │                                              │
│          │  ┌─────────────────────────────────────┐    │
│          │  │  Saldo por Conta                    │    │
│          │  │  [Nubank] R$ 1.500  [Inter] R$ 1.200│    │
│          │  └─────────────────────────────────────┘    │
│          │                                              │
│          │  ┌─────────────────────────────────────┐    │
│          │  │  Transações Recentes                │    │
│          │  │  [table with 5 latest]              │    │
│          │  └─────────────────────────────────────┘    │
│          │                                              │
└──────────┴──────────────────────────────────────────────┘
```

### Gráficos principais (Recharts):

| Gráfico | Tipo | Dados |
|---------|------|-------|
| **Receitas vs Despesas** | Bar chart (agrupado) | Últimos 6 meses, eixo X=meses, Y=valor |
| **Despesas por Categoria** | Donut chart | Categorias de despesas com percentual |
| **Tendência de Saldo** | Line chart | Evolução do saldo ao longo do tempo |
| **Receitas por Categoria** | Pie chart (opcional) | Distribuição de fontes de renda |

### `components/dashboard/IncomeExpenseChart.tsx`

```typescript
import {
  BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer,
} from 'recharts';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';

interface ChartData {
  month: string;
  income: number;
  expense: number;
}

export function IncomeExpenseChart({ data }: { data: ChartData[] }) {
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
            <YAxis tickFormatter={(v) => `R$ ${v}`} />
            <Tooltip
              formatter={(value: number) => [`R$ ${value.toFixed(2)}`, '']}
              contentStyle={{
                backgroundColor: 'hsl(var(--card))',
                borderColor: 'hsl(var(--border))',
              }}
            />
            <Bar dataKey="income" fill="hsl(var(--success))" radius={[4, 4, 0, 0]} />
            <Bar dataKey="expense" fill="hsl(var(--danger))" radius={[4, 4, 0, 0]} />
          </BarChart>
        </ResponsiveContainer>
      </CardContent>
    </Card>
  );
}
```

---

## 8. Telas de Login e Registro

### `pages/LoginPage.tsx`

```
┌─────────────────────────────────────────┐
│                                         │
│            Quick Stash                  │
│                                         │
│      ┌─────────────────────────────┐    │
│      │  Entrar na sua conta        │    │
│      │                             │    │
│      │  E-mail    [____________]   │    │
│      │  Senha     [____________]   │    │
│      │                             │    │
│      │  [  Entrar  ]               │    │
│      │                             │    │
│      │  Não tem conta? Registrar   │    │
│      └─────────────────────────────┘    │
│                                         │
└─────────────────────────────────────────┘
```

- Formulário com **React Hook Form + Zod**
- Validação de email e senha (min 8 chars)
- Loading state no botão
- Toast de erro em caso de 401
- Link para registro
- Background sutil com gradiente

---

## 9. TanStack Query Hooks

### `queries/useTransactions.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { Transaction } from '@/types';

export function useTransactions(params?: {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  payment_method_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}) {
  return useQuery({
    queryKey: ['transactions', params],
    queryFn: () => api.get('/transactions', { params }).then(r => r.data),
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: Omit<Transaction, 'id' | 'created_at'>) =>
      api.post('/transactions', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Transaction> & { id: string }) =>
      api.patch(`/transactions/${id}`, data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/transactions/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['transactions'] }),
  });
}
```

### `queries/useBalance.ts`

```typescript
import { useQuery } from '@tanstack/react-query';
import api from '@/lib/api';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => api.get('/transactions/balance').then(r => r.data),
  });
}
```

### `queries/usePaymentMethods.ts`

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import api from '@/lib/api';
import type { PaymentMethod } from '@/types';

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => api.get('/payment-methods').then(r => r.data),
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (data: { name: string; type: 'PIX' | 'CREDIT_CARD' }) =>
      api.post('/payment-methods', data).then(r => r.data),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-methods'] }),
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();
  return useMutation({
    mutationFn: (id: string) => api.delete(`/payment-methods/${id}`),
    onSuccess: () => qc.invalidateQueries({ queryKey: ['payment-methods'] }),
  });
}
```

---

## 10. Tipos TypeScript

### `types/transactions.ts`

```typescript
export type PaymentMethodType = 'CREDIT_CARD' | 'PIX';
export type TransactionType = 'INCOME' | 'EXPENSE';

export interface PaymentMethod {
  id: string;
  name: string;
  type: PaymentMethodType;
  balance: number;
  created_at: string;
}

export interface Transaction {
  id: string;
  amount: number;
  date: string;
  description: string;
  type: TransactionType;
  category: string;
  payment_method_id: string;
  created_at: string;
}

export interface BalanceResponse {
  total_balance: number;
  accounts: Array<{
    id: string;
    name: string;
    type: PaymentMethodType;
    balance: number;
  }>;
}

export const CATEGORIES = {
  EXPENSE: [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde',
    'Educação', 'Lazer', 'Tecnologia', 'Vestuário',
    'Serviços', 'Outros',
  ],
  INCOME: [
    'Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros',
  ],
} as const;
```

---

## 11. Responsividade

| Breakpoint | Comportamento |
|------------|--------------|
| **< 768px** (mobile) | Sidebar oculta, drawer (Sheet) com hamburger menu, gráficos empilhados verticalmente |
| **768px – 1024px** (tablet) | Sidebar colapsada automaticamente, grid 2 colunas nos gráficos |
| **> 1024px** (desktop) | Sidebar expandida (padrão), grid 2-3 colunas nos gráficos |

```css
/* AppLayout.tsx */
<div className="flex h-screen">
  {/* Desktop sidebar */}
  <div className="hidden md:block">
    <Sidebar collapsed={sidebarCollapsed} onToggle={toggleSidebar} />
  </div>

  {/* Mobile trigger */}
  <div className="md:hidden fixed top-0 left-0 right-0 z-50">
    <Header onMenuClick={() => setMobileOpen(true)} />
    <SidebarMobile open={mobileOpen} onClose={() => setMobileOpen(false)} />
  </div>

  {/* Main content */}
  <main className="flex-1 overflow-auto p-4 md:p-6">
    <div className="mx-auto max-w-7xl">
      {children}
    </div>
  </main>
</div>
```

---

## 12. Plano de Implementação (Fases)

### Fase 1 — Foundation (2-3 dias)
- [ ] `npm create vite@latest` com React + TypeScript
- [ ] Instalar e configurar Tailwind CSS v4
- [ ] Instalar e configurar shadcn/ui (button, input, card, dialog, etc.)
- [ ] Configurar Axios + interceptor de token refresh
- [ ] Criar stores Zustand (auth + theme)
- [ ] Criar tipos TypeScript
- [ ] Configurar React Router
- [ ] Criar layout base (AppLayout)

### Fase 2 — Autenticação (1-2 dias)
- [ ] Tela de Login (form + validation + API call)
- [ ] Tela de Registro
- [ ] ProtectedRoute guard
- [ ] Logout functionality
- [ ] Token refresh automático
- [ ] Toast de erros/sucesso

### Fase 3 — Dashboard (3-4 dias)
- [ ] Sidebar com toggle (expandir/recolher)
- [ ] Sidebar mobile (Sheet/drawer)
- [ ] Header com theme toggle + user menu
- [ ] Hook `useBalance` + componente BalanceOverview
- [ ] Gráfico Receitas vs Despesas (bar chart)
- [ ] Gráfico Despesas por Categoria (donut chart)
- [ ] Gráfico Tendência de Saldo (line chart)
- [ ] Cards de saldo por conta
- [ ] Lista de transações recentes
- [ ] Summary cards (receita/despesa/saldo total)

### Fase 4 — Transações (2-3 dias)
- [ ] Lista de transações com filtros (tipo, categoria, período)
- [ ] Tabela/paginação de transações
- [ ] Formulário de criar transação (dialog)
- [ ] Formulário de editar transação
- [ ] Delete com confirmação
- [ ] Hook `useTransactions` completo

### Fase 5 — Meios de Pagamento (1-2 dias)
- [ ] Lista de payment methods
- [ ] Criar payment method (dialog)
- [ ] Deletar payment method (com verificação de transações)
- [ ] Badge visual diferenciando PIX vs CREDIT_CARD

### Fase 6 — Refinamento (2-3 dias)
- [ ] Animações com Framer Motion
- [ ] Page transitions
- [ ] Loading skeletons
- [ ] Empty states
- [ ] Acessibilidade (ARIA, keyboard nav)
- [ ] Testes de integração básicos
- [ ] Otimização de bundle
- [ ] Documentação README

---

## 13. Pacotes Necessários

```json
{
  "dependencies": {
    "react": "^19.0.0",
    "react-dom": "^19.0.0",
    "react-router-dom": "^7.0.0",
    "@tanstack/react-query": "^5.60.0",
    "@tanstack/react-query-devtools": "^5.60.0",
    "zustand": "^5.0.0",
    "axios": "^1.7.0",
    "recharts": "^2.13.0",
    "framer-motion": "^11.0.0",
    "sonner": "^1.7.0",
    "lucide-react": "^0.460.0",
    "zod": "^3.24.0",
    "react-hook-form": "^7.53.0",
    "@hookform/resolvers": "^3.9.0",
    "clsx": "^2.1.0",
    "tailwind-merge": "^2.5.0",
    "date-fns": "^3.6.0",
    "react-day-picker": "^8.10.1"
  },
  "devDependencies": {
    "@types/react": "^19.0.0",
    "@types/react-dom": "^19.0.0",
    "@vitejs/plugin-react-swc": "^3.7.0",
    "vite": "^8.0.0",
    "typescript": "^5.6.0",
    "tailwindcss": "^4.0.0",
    "@tailwindcss/vite": "^4.0.0",
    "postcss": "^8.4.0",
    "autoprefixer": "^10.4.0"
  }
}
```

---

## 14. Paleta de Cores Sugerida

| Uso | Light | Dark |
|-----|-------|------|
| **Background** | `#FAFAFA` | `#0F0F0F` |
| **Card** | `#FFFFFF` | `#1A1A1A` |
| **Primary** | `#6D28D9` (roxo) | `#8B5CF6` (roxo claro) |
| **Success** | `#059669` (verde) | `#34D399` |
| **Danger** | `#DC2626` (vermelho) | `#F87171` |
| **Text** | `#111827` | `#F3F4F6` |
| **Muted** | `#6B7280` | `#9CA3AF` |

Design clean, com bastante whitespace, cards com bordas sutis e sombras leves. O roxo como cor primária transmite confiança e modernidade, adequado para uma aplicação financeira.

---

## Mapeamento API → Frontend

### Autenticação (`api_spec.md`)

| Endpoint | Método | Hook/Service | Uso |
|----------|--------|-------------|-----|
| `/auth/register` | POST | `authService.register()` | Tela de registro |
| `/auth/login` | POST | `authService.login()` | Tela de login |
| `/auth/refresh` | POST | Axios interceptor | Token refresh automático |
| `/auth/logout` | POST | `authService.logout()` | Botão sair |
| `/users` | GET | `useUser()` | Perfil do usuário |
| `/users/{id}` | GET | `useUser(id)` | Detalhes do usuário |
| `/users/{id}` | PUT | `useUpdateUser()` | Editar perfil |

### Transações (`API_TRANSACTIONS.md`)

| Endpoint | Método | Hook/Service | Uso |
|----------|--------|-------------|-----|
| `/payment-methods` | POST | `useCreatePaymentMethod()` | Criar conta |
| `/payment-methods` | GET | `usePaymentMethods()` | Lista de contas |
| `/payment-methods/{id}` | DELETE | `useDeletePaymentMethod()` | Remover conta |
| `/transactions` | POST | `useCreateTransaction()` | Criar transação |
| `/transactions` | GET | `useTransactions()` | Lista com filtros |
| `/transactions/balance` | GET | `useBalance()` | Saldo consolidado |
| `/transactions/{id}` | PATCH | `useUpdateTransaction()` | Editar transação |
| `/transactions/{id}` | DELETE | `useDeleteTransaction()` | Remover transação |

### Regras de Negócio (Frontend)

| Regra | Comportamento |
|-------|--------------|
| **PIX + INCOME** | Aumenta saldo da conta |
| **PIX + EXPENSE** | Diminui saldo da conta |
| **CREDIT_CARD** | Não afeta saldo (apenas registra despesa) |
| **Update transação** | Backend estorna valor antigo, aplica novo |
| **Delete transação** | Backend estorna valor original |
| **Delete PM** | Backend bloqueia se houver transações vinculadas |
| **Ownership** | Backend filtra por user_id do token |
