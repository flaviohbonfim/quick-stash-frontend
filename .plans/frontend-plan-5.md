# 📋 Frontend Plan — Etapa 5/10: Rotas, Router e ProtectedRoute

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 4 — Serviços de API](./frontend-plan-4.md)
> **Fase correspondente:** Fase 1 → Fase 2 (Foundation → Autenticação)
> **Duração estimada:** 0.5-1 dia

---

## 🎯 Objetivo desta etapa

Configurar o React Router v7 com lazy loading, criar o ProtectedRoute guard, e conectar todas as páginas ao roteador. Esta etapa torna a navegação funcional.

---

## 📦 O que será entregue

### 5.1 — Configuração do React Router

**`src/routes/index.tsx`:**

```typescript
import { createBrowserRouter, Navigate } from 'react-router-dom';
import { lazy, Suspense } from 'react';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { ProtectedRoute } from './ProtectedRoute';

// Lazy loading para code splitting
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
  // Catch-all — redireciona para login se não autenticado
  {
    path: '*',
    element: <Navigate to="/login" replace />,
  },
]);

export default router;
```

### 5.2 — ProtectedRoute Guard

**`src/routes/ProtectedRoute.tsx`:**

```typescript
import { useEffect } from 'react';
import { useNavigate, useLocation, Outlet } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';

export function ProtectedRoute() {
  const isAuthenticated = useAuthStore((state) => state.isAuthenticated);
  const navigate = useNavigate();
  const location = useLocation();

  useEffect(() => {
    if (!isAuthenticated) {
      // Salvar a rota original para redirecionar após login
      navigate('/login', {
        state: { from: location },
        replace: true,
      });
    }
  }, [isAuthenticated, navigate, location]);

  // Mostrar loading enquanto verifica auth
  if (!isAuthenticated) {
    return <LoadingSpinner />;
  }

  // Se autenticado, renderiza as children (Outlet)
  return <Outlet />;
}
```

### 5.3 — App.tsx com Router

**`src/App.tsx`:**

```typescript
import { RouterProvider } from 'react-router-dom';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import { ReactQueryDevtools } from '@tanstack/react-query-devtools';
import { Toaster } from '@/components/ui/sonner';
import router from '@/routes';

const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 1000 * 60 * 5, // 5 minutos
      retry: 1,
    },
  },
});

export default function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <RouterProvider router={router} />
      <Toaster />
      <ReactQueryDevtools initialIsOpen={false} />
    </QueryClientProvider>
  );
}
```

### 5.4 — main.tsx Atualizado

**`src/main.tsx`:**

```typescript
import React from 'react';
import ReactDOM from 'react-dom/client';
import App from './App';
import './index.css';

ReactDOM.createRoot(document.getElementById('root')!).render(
  <React.StrictMode>
    <App />
  </React.StrictMode>,
);
```

### 5.5 — Páginas Placeholder

Criar todas as páginas com estrutura mínima para o router funcionar:

**`src/pages/LoginPage.tsx`:**
```typescript
export default function LoginPage() {
  return <div className="flex items-center justify-center min-h-screen">Login Page</div>;
}
```

**`src/pages/RegisterPage.tsx`:**
```typescript
export default function RegisterPage() {
  return <div className="flex items-center justify-center min-h-screen">Register Page</div>;
}
```

**`src/pages/DashboardPage.tsx`:**
```typescript
export default function DashboardPage() {
  return <div className="p-6">Dashboard Page</div>;
}
```

**`src/pages/TransactionsPage.tsx`:**
```typescript
export default function TransactionsPage() {
  return <div className="p-6">Transactions Page</div>;
}
```

**`src/pages/PaymentMethodsPage.tsx`:**
```typescript
export default function PaymentMethodsPage() {
  return <div className="p-6">Payment Methods Page</div>;
}
```

**`src/pages/SettingsPage.tsx`:**
```typescript
export default function SettingsPage() {
  return <div className="p-6">Settings Page</div>;
}
```

### 5.6 — LoadingSpinner

**`src/components/common/LoadingSpinner.tsx`:**

```typescript
export function LoadingSpinner({ size = 'default' }: { size?: 'sm' | 'default' | 'lg' }) {
  const sizeClasses = {
    sm: 'w-4 h-4',
    default: 'w-8 h-8',
    lg: 'w-12 h-12',
  };

  return (
    <div className="flex items-center justify-center min-h-screen">
      <div
        className={`${sizeClasses[size]} animate-spin rounded-full border-2 border-primary border-t-transparent`}
      />
    </div>
  );
}
```

---

## ✅ Critérios de Validação

- [ ] `npm run dev` inicia sem erros
- [ ] Navegar para `/login` mostra a página de login
- [ ] Navegar para `/register` mostra a página de registro
- [ ] Navegar para `/transactions` (sem estar logado) redireciona para `/login`
- [ ] Navegar para `/` (sem estar logado) redireciona para `/login`
- [ ] Navegar para rota inexistente (ex: `/foo`) redireciona para `/login`
- [ ] Lazy loading funciona (verificar no DevTools Network que os chunks são carregados sob demanda)
- [ ] Suspense fallback (LoadingSpinner) aparece durante o lazy load
- [ ] `npm run build` compila sem erros

### Teste Manual de Navegação

1. Abrir `http://localhost:5173` → deve redirecionar para `/login`
2. Ir para `/login` → deve mostrar "Login Page"
3. Ir para `/register` → deve mostrar "Register Page"
4. Ir para `/transactions` → deve redirecionar para `/login`
5. Colocar `isAuthenticated = true` no localStorage (via DevTools Zustand persist)
6. Recarregar a página → deve ir para `/` (dashboard)
7. Navegar entre `/transactions`, `/payment-methods`, `/settings` → cada um mostra sua página

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Rotas e navegação | [Plano §5](./frontend-plan.md#5-rotas-e-navegação) |
| Estrutura de pastas (routes/, pages/) | [Plano §1](./frontend-plan.md#1-arquitetura-de-pastas) |
| Pacotes necessários | [Plano §13](./frontend-plan.md#13-pacotes-necessários) |
| Auth store (consumido pelo guard) | [Etapa 2](./frontend-plan-2.md) |

---

## ⚠️ Notas

- React Router v7 usa `createBrowserRouter` (data router API)
- Lazy loading com `lazy()` + `Suspense` é essencial para performance
- `ProtectedRoute` usa `useEffect` para redirecionar, e `Outlet` para renderizar children
- `state: { from: location }` no navigate salva a rota original para redirecionar após login (será usado na Etapa 6)
- TanStack Query é configurado no `App.tsx` mas os hooks virão na Etapa 6
