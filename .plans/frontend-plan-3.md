# 📋 Frontend Plan — Etapa 3/10: API Client com Token Refresh

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 2 — Tipos, Stores e Hooks](./frontend-plan-2.md)
> **Fase correspondente:** Fase 1 — Foundation (continuação)
> **Duração estimada:** 0.5-1 dia

---

## 🎯 Objetivo desta etapa

Implementar o cliente HTTP com Axios, incluindo o interceptor de token refresh automático. Esta é a ponte entre o frontend e o backend.

---

## 📦 O que será entregue

### 3.1 — Instalação do Axios

- Instalar `axios` via npm
- Instalar `@types/axios` se necessário (normalmente não precisa)

### 3.2 — Instância Axios com Interceptors

**`src/lib/api.ts`:**

Implementar a instância completa do Axios conforme [Plano §4](./frontend-plan.md#4-api-client-com-token-refresh):

```typescript
import axios, { AxiosInstance, InternalAxiosRequestConfig, AxiosResponse, AxiosError } from 'axios';
import { useAuthStore } from '@/stores/authStore';

const api: AxiosInstance = axios.create({
  baseURL: import.meta.env.VITE_API_URL || 'http://localhost:8000',
  headers: { 'Content-Type': 'application/json' },
});

// Queue para requisições que aguardam o refresh
let isRefreshing = false;
const failedQueue: Array<{
  resolve: (token?: string) => void;
  reject: (error?: unknown) => void;
}> = [];

const processQueue = (error: unknown | null, token: string | null = null) => {
  failedQueue.forEach(prom => {
    if (error) {
      prom.reject(error);
    } else {
      prom.resolve(token!);
    }
  });
  failedQueue = [];
};

// Request interceptor — attach token
api.interceptors.request.use((config: InternalAxiosRequestConfig) => {
  const token = useAuthStore.getState().accessToken;
  if (token && config.headers) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

// Response interceptor — handle 401 com token refresh
api.interceptors.response.use(
  (response: AxiosResponse) => response,
  async (error: AxiosError) => {
    const originalRequest = error.config as InternalAxiosRequestConfig & { _retry?: boolean };

    // Se errou com 401 e ainda não tentou refresh
    if (error.response?.status === 401 && !originalRequest._retry) {
      originalRequest._retry = true;

      if (isRefreshing) {
        // Já está refreshando — enfileirar esta requisição
        return new Promise<string>((resolve, reject) => {
          failedQueue.push({ resolve, reject });
        }).then(token => {
          if (originalRequest.headers) {
            originalRequest.headers.Authorization = `Bearer ${token}`;
          }
          return api(originalRequest);
        });
      }

      // Primeiro — iniciar o refresh
      isRefreshing = true;
      const { refreshToken } = useAuthStore.getState();

      try {
        if (!refreshToken) {
          throw new Error('No refresh token available');
        }

        // Chamar endpoint de refresh
        const { data } = await axios.post('/auth/refresh', {
          refresh_token: refreshToken,
        }, {
          baseURL: api.defaults.baseURL,
        });

        // Atualizar store com novos tokens
        useAuthStore.getState().setTokens(data.access_token, data.refresh_token);

        // Processar fila de requisições aguardando
        processQueue(null, data.access_token);

        // Retry da requisição original
        if (originalRequest.headers) {
          originalRequest.headers.Authorization = `Bearer ${data.access_token}`;
        }
        return api(originalRequest);

      } catch (refreshError) {
        // Refresh falhou — logout
        processQueue(refreshError, null);
        useAuthStore.getState().logout();
        window.location.href = '/login';
        return Promise.reject(refreshError);
      } finally {
        isRefreshing = false;
      }
    }

    // Outros erros — apenas rejeitar
    return Promise.reject(error);
  }
);

export default api;
```

### 3.3 — Variável de Ambiente

Criar `.env.local` com:
```
VITE_API_URL=http://localhost:8000
```

Criar `.env.example` como template.

### 3.4 — Tratamento de Erros Genérico

Criar `src/lib/errorHandler.ts` com:
- Função `formatApiError(error: unknown): string` — extrai mensagem de erro da API
- Função `isNetworkError(error: unknown): boolean` — detecta erros de conexão
- Função `isAuthError(error: unknown): boolean` — detecta erro 401

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros
- [ ] Axios instance é exportada corretamente
- [ ] Request interceptor adiciona `Authorization: Bearer <token>` quando há token
- [ ] Response interceptor captura 401 e tenta refresh
- [ ] Se refresh falha, faz logout e redireciona para `/login`
- [ ] Múltiplas requisições 401 simultâneas são enfileiradas (não fazem refresh múltiplo)
- [ ] Após refresh com sucesso, todas as requisições da fila são retryadas
- [ ] `formatApiError` extrai mensagem do erro corretamente
- [ ] `.env.local` é lido corretamente (`import.meta.env.VITE_API_URL`)

### Teste Manual (Mock)

Para testar sem backend:
1. Colocar um token fake no localStorage (via DevTools)
2. Simular resposta 401 de um endpoint
3. Verificar se o interceptor tenta refresh
4. Verificar se o logout ocorre quando refresh falha

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Axios instance + interceptors | [Plano §4](./frontend-plan.md#4-api-client-com-token-refresh) |
| Auth store (consumido pelo interceptor) | [Etapa 2](./frontend-plan-2.md) |
| Pacotes necessários | [Plano §13](./frontend-plan.md#13-pacotes-necessários) |

---

## ⚠️ Notas

- O interceptor usa `axios` (não `api`) para a chamada de refresh, para evitar loop infinito
- O flag `_retry` é adicionado dinamicamente na config do Axios
- O `failedQueue` pattern é essencial para não race condition em requisições simultâneas
- Não implementar services ainda — apenas o cliente HTTP
- Esta etapa é **independente do backend** (pode ser testada com mock)
