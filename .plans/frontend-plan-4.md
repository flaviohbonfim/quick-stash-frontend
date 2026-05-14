# 📋 Frontend Plan — Etapa 4/10: Serviços de API (Auth, Transactions, User)

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 3 — API Client](./frontend-plan-3.md)
> **Fase correspondente:** Fase 1 → Fase 2 (Foundation → Autenticação)
> **Duração estimada:** 0.5-1 dia

---

## 🎯 Objetivo desta etapa

Implementar os services que encapsulam as chamadas HTTP para cada domínio da API. Estes services são consumidos pelos hooks TanStack Query (que vêm na Etapa 6).

---

## 📦 O que será entregue

### 4.1 — AuthService

**`src/services/authService.ts`:**

```typescript
import api from '@/lib/api';
import type { LoginRequest, RegisterRequest, TokenResponse, User } from '@/types/auth';

export const authService = {
  /**
   * Login do usuário
   * POST /auth/login
   */
  login: async (data: LoginRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/login', data);
    return response.data;
  },

  /**
   * Registro de novo usuário
   * POST /auth/register
   */
  register: async (data: RegisterRequest): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/register', data);
    return response.data;
  },

  /**
   * Logout
   * POST /auth/logout
   */
  logout: async (): Promise<void> => {
    await api.post('/auth/logout');
  },

  /**
   * Refresh de token (chamado pelo interceptor, mas exposto para uso direto)
   * POST /auth/refresh
   */
  refreshToken: async (refreshToken: string): Promise<TokenResponse> => {
    const response = await api.post<TokenResponse>('/auth/refresh', {
      refresh_token: refreshToken,
    });
    return response.data;
  },
};
```

### 4.2 — TransactionService

**`src/services/transactionService.ts`:**

```typescript
import api from '@/lib/api';
import type { Transaction, PaymentMethod, BalanceResponse } from '@/types/transactions';

export interface TransactionFilters {
  type?: 'INCOME' | 'EXPENSE';
  category?: string;
  payment_method_id?: string;
  start_date?: string;
  end_date?: string;
  limit?: number;
  offset?: number;
}

export const transactionService = {
  /**
   * Listar transações com filtros
   * GET /transactions
   */
  list: async (filters?: TransactionFilters): Promise<{
    data: Transaction[];
    total: number;
    limit: number;
    offset: number;
  }> => {
    const response = await api.get('/transactions', { params: filters });
    return response.data;
  },

  /**
   * Obter saldo consolidado
   * GET /transactions/balance
   */
  getBalance: async (): Promise<BalanceResponse> => {
    const response = await api.get('/transactions/balance');
    return response.data;
  },

  /**
   * Criar transação
   * POST /transactions
   */
  create: async (data: Omit<Transaction, 'id' | 'created_at'>): Promise<Transaction> => {
    const response = await api.post<Transaction>('/transactions', data);
    return response.data;
  },

  /**
   * Atualizar transação
   * PATCH /transactions/:id
   */
  update: async (id: string, data: Partial<Transaction>): Promise<Transaction> => {
    const response = await api.patch<Transaction>(`/transactions/${id}`, data);
    return response.data;
  },

  /**
   * Deletar transação
   * DELETE /transactions/:id
   */
  delete: async (id: string): Promise<void> => {
    await api.delete(`/transactions/${id}`);
  },

  /**
   * Listar payment methods
   * GET /payment-methods
   */
  getPaymentMethods: async (): Promise<PaymentMethod[]> => {
    const response = await api.get('/payment-methods');
    return response.data;
  },

  /**
   * Criar payment method
   * POST /payment-methods
   */
  createPaymentMethod: async (data: {
    name: string;
    type: 'PIX' | 'CREDIT_CARD';
  }): Promise<PaymentMethod> => {
    const response = await api.post<PaymentMethod>('/payment-methods', data);
    return response.data;
  },

  /**
   * Deletar payment method
   * DELETE /payment-methods/:id
   */
  deletePaymentMethod: async (id: string): Promise<void> => {
    await api.delete(`/payment-methods/${id}`);
  },
};
```

### 4.3 — UserService

**`src/services/userService.ts`:**

```typescript
import api from '@/lib/api';
import type { User } from '@/types/auth';

export const userService = {
  /**
   * Obter perfil do usuário
   * GET /users
   */
  getProfile: async (): Promise<User> => {
    const response = await api.get<User>('/users');
    return response.data;
  },

  /**
   * Atualizar perfil do usuário
   * PUT /users/:id
   */
  updateProfile: async (id: string, data: Partial<User>): Promise<User> => {
    const response = await api.put<User>(`/users/${id}`, data);
    return response.data;
  },
};
```

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros de tipo
- [ ] Todos os métodos dos services estão tipados corretamente
- [ ] `authService.login()` chama `POST /auth/login` com os dados corretos
- [ ] `transactionService.list()` passa filtros como query params
- [ ] `transactionService.create()` envia body correto (sem `id` e `created_at`)
- [ ] `transactionService.update()` faz PATCH no endpoint correto
- [ ] `transactionService.delete()` faz DELETE no endpoint correto
- [ ] `userService.getProfile()` chama `GET /users`
- [ ] `userService.updateProfile()` chama `PUT /users/:id`
- [ ] `transactionService.getPaymentMethods()` chama `GET /payment-methods`
- [ ] `transactionService.createPaymentMethod()` chama `POST /payment-methods`
- [ ] `transactionService.deletePaymentMethod()` chama `DELETE /payment-methods/:id`

### Teste Manual (Mock)

Para testar sem backend:
1. Usar `msw` (Mock Service Worker) ou `vitest` com `axios-mock-adapter`
2. Mockar cada endpoint e verificar que o service chama o endpoint correto
3. Verificar que os tipos de retorno batem com os interfaces

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Mapeamento API → Frontend | [Plano §12 — Mapeamento API](./frontend-plan.md#12-mapeamento-api--frontend) |
| Services listados na arquitetura | [Plano §1 — `services/`](./frontend-plan.md#1-arquitetura-de-pastas) |
| Tipos consumidos | [Etapa 2](./frontend-plan-2.md) |
| API client consumido | [Etapa 3](./frontend-plan-3.md) |

---

## ⚠️ Notas

- Services são **puros** — não lidam com loading/error state, isso é responsabilidade dos hooks TanStack Query
- Todos os métodos são `async` e retornam `Promise<T>`
- Não há lógica de UI nos services
- Esta etapa é **100% TypeScript + HTTP**, sem React
