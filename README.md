# Quick Stash Frontend

Gerenciador de finanças pessoais construído com React, TypeScript e Tailwind CSS.

## 🚀 Tecnologias

| Camada | Tecnologia |
|--------|-----------|
| **Framework** | React 19 + TypeScript |
| **Build** | Vite 7 |
| **Estilização** | Tailwind CSS v4 + shadcn/ui |
| **Roteamento** | React Router v7 |
| **Estado Global** | Zustand |
| **Server State** | TanStack Query |
| **Formulários** | React Hook Form + Zod |
| **Gráficos** | Recharts |
| **Animações** | Framer Motion |
| **UI** | shadcn/ui + Lucide Icons |
| **Data Formatting** | date-fns (pt-BR) |
| **HTTP Client** | Axios |
| **Toasts** | Sonner |
| **Temas** | next-themes |

## 📦 Instalação

```bash
# Instalar dependências
npm install

# Criar arquivo de variáveis de ambiente
cp .env.example .env
```

## ⚙️ Configuração

Edite o arquivo `.env` com a URL da sua API:

```env
VITE_API_URL=http://localhost:8000
```

## 🏃 Comandos

```bash
# Desenvolvimento com hot reload
npm run dev

# Build de produção
npm run build

# Preview da build
npm run preview

# Linting
npm run lint
```

## 📁 Estrutura de Pastas

```
src/
├── components/
│   ├── common/          # Componentes reutilizáveis
│   │   ├── CurrencyFormat.tsx
│   │   ├── EmptyState.tsx
│   │   ├── ErrorBoundary.tsx
│   │   ├── LoadingSpinner.tsx
│   │   └── PageTransition.tsx
│   ├── dashboard/       # Componentes do dashboard
│   │   ├── AccountCards.tsx
│   │   ├── BalanceOverview.tsx
│   │   ├── CategoryChart.tsx
│   │   ├── Dashboard.tsx
│   │   ├── IncomeExpenseChart.tsx
│   │   ├── RecentTransactions.tsx
│   │   ├── SummaryCards.tsx
│   │   └── TrendChart.tsx
│   ├── layout/          # Layout da aplicação
│   │   ├── AppLayout.tsx
│   │   └── Header.tsx
│   ├── transactions/    # Componentes de transações
│   │   ├── TransactionFilters.tsx
│   │   ├── TransactionForm.tsx
│   │   ├── TransactionList.tsx
│   │   └── TransactionTable.tsx
│   └── ui/              # Componentes shadcn/ui
├── hooks/               # Custom hooks
│   ├── useAuth.ts
│   ├── use-mobile.ts
│   └── useTheme.ts
├── lib/                 # Utilitários
│   ├── api.ts           # Axios instance com interceptors
│   ├── constants.ts     # Categorias e configurações
│   ├── errorHandler.ts  # Tratamento de erros
│   └── utils.ts         # cn() helper
├── pages/               # Páginas da aplicação
│   ├── DashboardPage.tsx
│   ├── LoginPage.tsx
│   ├── PaymentMethodsPage.tsx
│   ├── RegisterPage.tsx
│   ├── SettingsPage.tsx
│   └── TransactionsPage.tsx
├── queries/             # TanStack Query hooks
│   ├── useAuth.ts
│   ├── useBalance.ts
│   ├── usePaymentMethods.ts
│   ├── useTransactions.ts
│   └── useUser.ts
├── routes/              # Configuração de rotas
│   ├── ProtectedRoute.tsx
│   └── index.tsx
├── services/            # Camada de API
│   ├── authService.ts
│   ├── paymentMethodService.ts
│   ├── transactionService.ts
│   └── userService.ts
├── stores/              # Zustand stores
│   ├── authStore.ts
│   └── themeStore.ts
└── types/               # Tipos TypeScript
    ├── auth.ts
    ├── index.ts
    └── transactions.ts
```

## 🎨 Componentes Principais

### PageTransition
Transições animadas entre rotas usando `AnimatePresence` do Framer Motion. Aplica fade/slide suave ao trocar de página.

### Dashboard
Dashboard principal com animações staggered nos cards, gráficos e listas. Usa variants customizadas com easing `[0.22, 1, 0.36, 1]`.

### TransactionTable
Tabela de transações com:
- Resolução de nomes de contas (evita mostrar UUIDs)
- Dropdown de ações com ARIA labels
- Loading e empty states acessíveis

### TransactionForm
Formulário de criação/edição de transações com:
- Validação Zod
- Seletor de data (Calendar popover)
- Campos dinâmicos de categoria baseados no tipo

### Header
Barra superior com:
- Toggle de sidebar (desktop/mobile)
- Toggle de tema (dark/light) com ícones Lucide
- Menu do usuário com avatar

## 🎭 Animações

O projeto usa Framer Motion em diversos componentes:

- **Page transitions**: Fade/slide ao trocar de rota
- **Dashboard stagger**: Cards e gráficos aparecem em sequência
- **Sidebar items**: Nav items deslizam com delay escalonado
- **Card hover**: Scale sutil em cards e list items
- **Dialog animations**: AnimatePresence para entrada/saída de modais

### Custom Easing

```ts
[0.22, 1, 0.36, 1]  // Cubic-bezier suave e não-linear
```

## ♿ Acessibilidade

- Skip link "Pular para o conteúdo principal"
- ARIA labels em botões e menus
- `role="alert"` em mensagens de erro
- `aria-invalid` e `aria-describedby` em formulários
- `sr-only` spans para contexto de screen readers
- `role="status"` em loading states
- Focus rings visíveis em todos os elementos interativos

## 🌙 Temas

O app suporta modo claro e escuro com persistência em `localStorage`. O tema inicial respeita a preferência do sistema (`prefers-color-scheme`).

## 📊 Gráficos

- **IncomeExpenseChart**: Barras comparando receitas vs despesas por mês
- **CategoryChart**: Pizza mostrando distribuição de despesas por categoria
- **TrendChart**: Linha mostrando tendência de saldo ao longo do tempo

## 🔐 Autenticação

- Login/Registro com JWT (access + refresh tokens)
- Refresh token automático em 401
- Logout limpa store e redireciona
- Protected routes bloqueiam acesso sem autenticação

## 🧪 Testes

Para rodar testes (quando configurados):

```bash
npm run test
```

## 📝 API Backend

Este frontend espera uma API backend rodando em `http://localhost:8000` com os seguintes endpoints:

| Método | Endpoint | Descrição |
|--------|----------|-----------|
| POST | `/auth/login` | Login |
| POST | `/auth/register` | Registro |
| POST | `/auth/logout` | Logout |
| POST | `/auth/refresh` | Refresh token |
| GET | `/users` | Usuário atual |
| PUT | `/users/:id` | Atualizar perfil |
| POST | `/users/change-password` | Alterar senha |
| GET | `/payment-methods` | Listar contas |
| POST | `/payment-methods` | Criar conta |
| DELETE | `/payment-methods/:id` | Excluir conta |
| GET | `/transactions` | Listar transações |
| POST | `/transactions` | Criar transação |
| PATCH | `/transactions/:id` | Atualizar transação |
| DELETE | `/transactions/:id` | Excluir transação |
| GET | `/transactions/balance` | Saldo total |

## 📄 Licença

MIT
