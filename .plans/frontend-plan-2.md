# 📋 Frontend Plan — Etapa 2/10: Tipos, Stores e Hooks Base

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 1 — Fundação](./frontend-plan-1.md)
> **Fase correspondente:** Fase 1 — Foundation (continuação)
> **Duração estimada:** 0.5-1 dia

---

## 🎯 Objetivo desta etapa

Implementar os tipos TypeScript, stores Zustand (auth + theme), hooks (useAuth, useTheme), e o arquivo de utilitários. Esta etapa prepara o terreno para toda a lógica de estado da aplicação.

---

## 📦 O que será entregue

### 2.1 — Tipos TypeScript

Implementar todos os tipos conforme [Plano §10](./frontend-plan.md#10-tipos-typescript):

**`src/types/auth.ts`:**
```typescript
export interface User {
  id: string;
  email: string;
  name: string;
  created_at: string;
}

export interface LoginRequest {
  email: string;
  password: string;
}

export interface RegisterRequest {
  email: string;
  password: string;
  name: string;
}

export interface TokenResponse {
  access_token: string;
  refresh_token: string;
  token_type: string;
}
```

**`src/types/transactions.ts`:**
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

**`src/types/index.ts`:** Re-export de todos os tipos.

### 2.2 — Store de Autenticação (Zustand)

**`src/stores/authStore.ts`:**

```typescript
import { create } from 'zustand';
import { persist } from 'zustand/middleware';
import type { User, TokenResponse } from '@/types/auth';

interface AuthState {
  user: User | null;
  accessToken: string | null;
  refreshToken: string | null;
  isAuthenticated: boolean;

  // Actions
  setTokens: (access: string, refresh: string) => void;
  setUser: (user: User) => void;
  logout: () => void;
  setAuthenticated: (value: boolean) => void;
}

export const useAuthStore = create<AuthState>()(
  persist(
    (set, get) => ({
      user: null,
      accessToken: null,
      refreshToken: null,
      isAuthenticated: false,

      setTokens: (access, refresh) =>
        set({
          accessToken: access,
          refreshToken: refresh,
          isAuthenticated: true,
        }),

      setUser: (user) => set({ user }),

      logout: () =>
        set({
          user: null,
          accessToken: null,
          refreshToken: null,
          isAuthenticated: false,
        }),

      setAuthenticated: (value) => set({ isAuthenticated: value }),
    }),
    {
      name: 'auth-storage',
      partialize: (state) => ({
        user: state.user,
        accessToken: state.accessToken,
        refreshToken: state.refreshToken,
        isAuthenticated: state.isAuthenticated,
      }),
    }
  )
);
```

### 2.3 — Store de Tema (Zustand)

**`src/stores/themeStore.ts`:**

```typescript
import { create } from 'zustand';

interface ThemeState {
  theme: 'dark' | 'light';
  setTheme: (theme: 'dark' | 'light') => void;
  toggleTheme: () => void;
}

export const useThemeStore = create<ThemeState>()((set) => ({
  theme:
    typeof window !== 'undefined' &&
    document.documentElement.classList.contains('dark')
      ? 'dark'
      : 'light',

  setTheme: (theme) => {
    document.documentElement.classList.toggle('dark', theme === 'dark');
    set({ theme });
  },

  toggleTheme: () => {
    const newTheme = useThemeStore.getState().theme === 'dark' ? 'light' : 'dark';
    useThemeStore.getState().setTheme(newTheme);
  },
}));
```

### 2.4 — Hooks

**`src/hooks/useAuth.ts`:**
- Hook que consome `useAuthStore`
- Funções auxiliares: `requireAuth()`, `getAuthToken()`
- Exporta `useAuthStore` diretamente

**`src/hooks/useTheme.ts`:**
- Hook que consome `useThemeStore`
- Detecta `prefers-color-scheme` do sistema no mount
- Sincroniza tema inicial com preferência do sistema

### 2.5 — Utilitários

**`src/lib/utils.ts`:**
```typescript
import { clsx, type ClassValue } from 'clsx';
import { twMerge } from 'tailwind-merge';

export function cn(...inputs: ClassValue[]) {
  return twMerge(clsx(inputs));
}
```

**`src/lib/constants.ts`:**
```typescript
export const API_BASE_URL = import.meta.env.VITE_API_URL || 'http://localhost:8000';
export const APP_NAME = 'Quick Stash';
export const ITEMS_PER_PAGE = 20;
```

---

## ✅ Critérios de Validação

- [ ] Todos os tipos TypeScript compilam sem erros
- [ ] `useAuthStore` persiste dados no localStorage (verificar no DevTools)
- [ ] `useAuthStore.logout()` limpa todos os estados e localStorage
- [ ] `useThemeStore.toggleTheme()` alterna entre dark/light
- [ ] Classe `dark` é adicionada/removida do `<html>` corretamente
- [ ] Hook `useTheme` detecta preferência do sistema no mount
- [ ] `cn()` funciona corretamente (combinar classes, remover conflitos)
- [ ] `API_BASE_URL` lê da variável de ambiente corretamente
- [ ] `npm run build` compila sem erros de tipo

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Tipos TypeScript | [Plano §10](./frontend-plan.md#10-tipos-typescript) |
| Stores Zustand | [Plano §1 — `stores/`](./frontend-plan.md#1-arquitetura-de-pastas) |
| Hooks | [Plano §1 — `hooks/`](./frontend-plan.md#1-arquitetura-de-pastas) |
| Utilitários | [Plano §1 — `lib/utils.ts`](./frontend-plan.md#1-arquitetura-de-pastas) |

---

## ⚠️ Notas

- Zustand com `persist` já cuida da persistência no localStorage
- Tema é controlado via classe `dark` no `<html>` (Tailwind v4 dark mode)
- Não implementar API calls ainda — apenas a estrutura de estado
- Esta etapa é **100% frontend**, sem dependência do backend
