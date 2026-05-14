# 📋 Frontend Plan — Etapa 1/10: Fundação do Projeto

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Fase correspondente:** Fase 1 — Foundation
> **Duração estimada:** 2-3 dias

---

## 🎯 Objetivo desta etapa

Inicializar o projeto React + TypeScript com Vite 8, configurar Tailwind CSS v4, instalar e configurar shadcn/ui, e criar a estrutura de pastas completa conforme definido no plano original.

---

## 📦 O que será entregue

### 1.1 — Inicialização do Projeto

- `npm create vite@latest` com template React + TypeScript
- Configuração do `package.json` com todos os pacotes listados no [Plano §13](./frontend-plan.md#13-pacotes-necessários)
- Configuração do `tsconfig.json` com path aliases (`@/` → `src/`)
- Configuração do `vite.config.ts` com plugin React SWC e alias

**Arquivos criados/modificados:**
- `package.json`
- `vite.config.ts`
- `tsconfig.json`
- `tsconfig.app.json`
- `index.html`

### 1.2 — Tailwind CSS v4

- Instalação do `tailwindcss` v4 + `@tailwindcss/vite`
- Configuração do `postcss.config.mjs`
- Criação de `src/index.css` com `@import "tailwindcss"`
- Configuração do tema com `@theme` (cores light/dark) conforme [Plano §3](./frontend-plan.md#3-configuração-de-tema-claroescuro)
- Paleta de cores roxa conforme [Plano §14](./frontend-plan.md#14-paleta-de-cores-sugerida)

**Arquivos criados/modificados:**
- `src/index.css`
- `postcss.config.mjs`
- `tailwind.config.ts` (se necessário)

### 1.3 — shadcn/ui

- Inicialização do shadcn/ui com `npx shadcn@latest init`
- Configuração de cores do shadcn para combinar com a paleta roxa
- Instalação dos componentes UI listados em [Plano §1 — Pasta `components/ui/`](./frontend-plan.md#1-arquitetura-de-pastas):
  - `button`, `input`, `card`, `dialog`, `dropdown-menu`, `select`, `tabs`, `badge`, `toast`, `toast-provider`, `sonner`, `sidebar`, `sheet`, `table`, `form`, `label`, `popover`, `command`, `calendar`, `avatar`, `separator`, `scroll-area`, `tooltip`

### 1.4 — Estrutura de Pastas

Criar toda a estrutura de diretórios conforme [Plano §1](./frontend-plan.md#1-arquitetura-de-pastas):

```
src/
├── main.tsx
├── App.tsx
├── assets/fonts/
├── lib/
├── types/
├── stores/
├── hooks/
├── services/
├── queries/
├── components/
│   ├── ui/
│   ├── layout/
│   ├── auth/
│   ├── dashboard/
│   ├── transactions/
│   ├── payment-methods/
│   └── common/
├── routes/
└── pages/
```

### 1.5 — Arquivos Base Mínimos

Criar arquivos mínimos (placeholder) para cada módulo, para que o projeto compile e rode:

- `src/main.tsx` — Entry point com `createRoot`
- `src/App.tsx` — Componente raiz com `<RouterProvider>` placeholder
- `src/lib/utils.ts` — Função `cn()` (clsx + tailwind-merge)
- `src/lib/constants.ts` — `API_BASE_URL` placeholder
- `src/types/index.ts` — Re-export dos tipos
- `src/stores/authStore.ts` — Store vazia com estrutura
- `src/stores/themeStore.ts` — Store vazia com estrutura
- `src/hooks/useAuth.ts` — Hook placeholder
- `src/hooks/useTheme.ts` — Hook placeholder
- `src/services/authService.ts` — Service placeholder
- `src/services/transactionService.ts` — Service placeholder
- `src/services/userService.ts` — Service placeholder
- `src/queries/useTransactions.ts` — Hook placeholder
- `src/queries/useBalance.ts` — Hook placeholder
- `src/queries/usePaymentMethods.ts` — Hook placeholder
- `src/queries/useUser.ts` — Hook placeholder
- `src/routes/index.tsx` — Router placeholder
- `src/routes/ProtectedRoute.tsx` — Guard placeholder
- `src/pages/LoginPage.tsx` — Page placeholder
- `src/pages/RegisterPage.tsx` — Page placeholder
- `src/pages/DashboardPage.tsx` — Page placeholder
- `src/pages/TransactionsPage.tsx` — Page placeholder
- `src/pages/PaymentMethodsPage.tsx` — Page placeholder
- `src/pages/SettingsPage.tsx` — Page placeholder
- `src/components/common/LoadingSpinner.tsx` — Spinner placeholder
- `src/components/common/EmptyState.tsx` — EmptyState placeholder
- `src/components/common/CurrencyFormat.tsx` — CurrencyFormat placeholder
- `src/components/common/ErrorBoundary.tsx` — ErrorBoundary placeholder

---

## ✅ Critérios de Validação

- [ ] `npm install` roda sem erros
- [ ] `npm run dev` inicia o servidor de desenvolvimento sem erros
- [ ] `npm run build` compila sem erros
- [ ] O navegador abre em `http://localhost:5173` e mostra algo (mesmo que placeholder)
- [ ] Tailwind classes funcionam (testar com uma div com `bg-primary text-primary-foreground p-4`)
- [ ] Tema dark mode funciona (testar toggle ou `@media (prefers-color-scheme: dark)`)
- [ ] Componentes shadcn/ui renderizam corretamente (testar um `<Button>`, `<Card>`, `<Input>`)
- [ ] Path alias `@/` funciona (importar algo com `@/lib/utils`)
- [ ] Todas as pastas do plano existem no filesystem
- [ ] ESLint não reporta erros críticos

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Stack completa | [Plano §2](./frontend-plan.md#2-stack-detalhada) |
| Estrutura de pastas | [Plano §1](./frontend-plan.md#1-arquitetura-de-pastas) |
| Configuração de tema | [Plano §3](./frontend-plan.md#3-configuração-de-tema-claroescuro) |
| Paleta de cores | [Plano §14](./frontend-plan.md#14-paleta-de-cores-sugerida) |
| Pacotes necessários | [Plano §13](./frontend-plan.md#13-pacotes-necessários) |

---

## ⚠️ Notas

- Não implementar lógica de API ainda — apenas a estrutura
- Não implementar autenticação ainda — apenas os arquivos placeholder
- Foco em **configuração e estrutura**
- Garantir que o projeto **compila e roda** no final desta etapa
