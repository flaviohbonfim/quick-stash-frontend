# 📋 Frontend Plan — Etapa 6/10: TanStack Query Hooks

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 5 — Rotas e Router](./frontend-plan-5.md)
> **Fase correspondente:** Fase 2 — Autenticação (preparação)
> **Duração estimada:** 1 dia

---

## 🎯 Objetivo desta etapa

Implementar todos os hooks TanStack Query que farão a ponte entre os services (Etapa 4) e os componentes de UI. Estes hooks gerenciam cache, loading states, error states e mutations.

---

## 📦 O que será entregue

### 6.1 — useAuth Hook (Login/Register)

**`src/queries/useAuth.ts`:**

```typescript
import { useMutation } from '@tanstack/react-query';
import { useNavigate } from 'react-router-dom';
import { toast } from 'sonner';
import { authService } from '@/services/authService';
import { useAuthStore } from '@/stores/authStore';
import type { LoginRequest, RegisterRequest } from '@/types/auth';

export function useLogin() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (data: LoginRequest) => authService.login(data),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      toast.success('Login realizado com sucesso!');
      // Redirecionar para a rota original ou dashboard
      navigate('/', { replace: true });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao fazer login';
      toast.error(message);
    },
  });
}

export function useRegister() {
  const navigate = useNavigate();
  const setTokens = useAuthStore((state) => state.setTokens);

  return useMutation({
    mutationFn: (data: RegisterRequest) => authService.register(data),
    onSuccess: (data) => {
      setTokens(data.access_token, data.refresh_token);
      toast.success('Conta criada com sucesso!');
      navigate('/', { replace: true });
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao criar conta';
      toast.error(message);
    },
  });
}

export function useLogout() {
  const navigate = useNavigate();
  const logout = useAuthStore((state) => state.logout);

  return useMutation({
    mutationFn: () => authService.logout(),
    onSuccess: () => {
      logout();
      toast.success('Logout realizado com sucesso!');
      navigate('/login', { replace: true });
    },
    onError: () => {
      // Mesmo se o backend falhar, faz logout local
      logout();
      navigate('/login', { replace: true });
    },
  });
}
```

### 6.2 — useTransactions Hooks

**`src/queries/useTransactions.ts`:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionService } from '@/services/transactionService';
import type { Transaction, TransactionFilters } from '@/types/transactions';

export function useTransactions(filters?: TransactionFilters) {
  return useQuery({
    queryKey: ['transactions', filters],
    queryFn: () => transactionService.list(filters),
    staleTime: 1000 * 60, // 1 minuto
  });
}

export function useCreateTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: Omit<Transaction, 'id' | 'created_at'>) =>
      transactionService.create(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao criar transação';
      toast.error(message);
    },
  });
}

export function useUpdateTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: ({ id, ...data }: Partial<Transaction> & { id: string }) =>
      transactionService.update(id, data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação atualizada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao atualizar transação';
      toast.error(message);
    },
  });
}

export function useDeleteTransaction() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.delete(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['transactions'] });
      toast.success('Transação removida com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao remover transação';
      toast.error(message);
    },
  });
}
```

### 6.3 — useBalance Hook

**`src/queries/useBalance.ts`:**

```typescript
import { useQuery } from '@tanstack/react-query';
import { transactionService } from '@/services/transactionService';
import type { BalanceResponse } from '@/types/transactions';

export function useBalance() {
  return useQuery({
    queryKey: ['balance'],
    queryFn: () => transactionService.getBalance(),
    staleTime: 1000 * 30, // 30 segundos
  });
}
```

### 6.4 — usePaymentMethods Hooks

**`src/queries/usePaymentMethods.ts`:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { transactionService } from '@/services/transactionService';
import type { PaymentMethod } from '@/types/transactions';

export function usePaymentMethods() {
  return useQuery({
    queryKey: ['payment-methods'],
    queryFn: () => transactionService.getPaymentMethods(),
    staleTime: 1000 * 60, // 1 minuto
  });
}

export function useCreatePaymentMethod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (data: { name: string; type: 'PIX' | 'CREDIT_CARD' }) =>
      transactionService.createPaymentMethod(data),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Conta criada com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao criar conta';
      toast.error(message);
    },
  });
}

export function useDeletePaymentMethod() {
  const qc = useQueryClient();

  return useMutation({
    mutationFn: (id: string) => transactionService.deletePaymentMethod(id),
    onSuccess: () => {
      qc.invalidateQueries({ queryKey: ['payment-methods'] });
      toast.success('Conta removida com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao remover conta';
      toast.error(message);
    },
  });
}
```

### 6.5 — useUser Hook

**`src/queries/useUser.ts`:**

```typescript
import { useQuery, useMutation, useQueryClient } from '@tanstack/react-query';
import { toast } from 'sonner';
import { userService } from '@/services/userService';
import { useAuthStore } from '@/stores/authStore';
import type { User } from '@/types/auth';

export function useUser() {
  return useQuery({
    queryKey: ['user'],
    queryFn: () => userService.getProfile(),
    staleTime: 1000 * 60 * 5, // 5 minutos
  });
}

export function useUpdateUser() {
  const qc = useQueryClient();
  const setUser = useAuthStore((state) => state.setUser);

  return useMutation({
    mutationFn: (data: Partial<User>) => userService.updateProfile('me', data),
    onSuccess: (data) => {
      qc.invalidateQueries({ queryKey: ['user'] });
      setUser(data);
      toast.success('Perfil atualizado com sucesso!');
    },
    onError: (error: any) => {
      const message = error.response?.data?.detail || 'Erro ao atualizar perfil';
      toast.error(message);
    },
  });
}
```

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros de tipo
- [ ] `useLogin()` retorna objeto com `mutate`, `isPending`, `error`
- [ ] `useRegister()` retorna objeto com `mutate`, `isPending`, `error`
- [ ] `useLogout()` retorna objeto com `mutate`, `isPending`, `error`
- [ ] `useTransactions()` retorna objeto com `data`, `isLoading`, `error`
- [ ] `useBalance()` retorna objeto com `data`, `isLoading`, `error`
- [ ] `usePaymentMethods()` retorna objeto com `data`, `isLoading`, `error`
- [ ] `useUser()` retorna objeto com `data`, `isLoading`, `error`
- [ ] Mutations chamam `toast.success()` no onSuccess
- [ ] Mutations chamam `toast.error()` no onError
- [ ] Mutations de create/update/delete chamam `qc.invalidateQueries()`
- [ ] `useLogin` salva tokens na store após sucesso
- [ ] `useLogout` limpa store após sucesso

### Teste Manual (com mock)

Para testar sem backend:
1. Usar `msw` para mockar os endpoints
2. Chamar `mutate()` de cada hook
3. Verificar que o toast aparece
4. Verificar que a store é atualizada
5. Verificar que as queries são invalidadas

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| TanStack Query hooks | [Plano §9](./frontend-plan.md#9-tanstack-query-hooks) |
| Services consumidos | [Etapa 4](./frontend-plan-4.md) |
| Auth store consumido | [Etapa 2](./frontend-plan-2.md) |
| Toast (Sonner) | [Plano §13](./frontend-plan.md#13-pacotes-necessários) |

---

## ⚠️ Notas

- TanStack Query v5 usa `useQuery` e `useMutation` (API estável)
- `staleTime` define quanto tempo os dados são considerados "frescos"
- `invalidateQueries` é o mecanismo de refetch automático
- Toasts são integrados em cada mutation para feedback ao usuário
- `useLogin` e `useRegister` fazem navigation após sucesso
- `useLogout` faz cleanup da store mesmo se o backend falhar
