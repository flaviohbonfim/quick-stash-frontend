# 📋 Frontend Plan — Etapa 8/10: Telas de Login e Registro

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 7 — Layout](./frontend-plan-7.md)
> **Fase correspondente:** Fase 2 — Autenticação
> **Duração estimada:** 1-2 dias

---

## 🎯 Objetivo desta etapa

Implementar as telas de Login e Registro com formulários completos, validação Zod + React Hook Form, integração com TanStack Query (Etapa 6), e feedback visual com toasts.

---

## 📦 O que será entregue

### 8.1 — AuthLayout (Layout Centralizado)

**`src/components/auth/AuthLayout.tsx`:**

```typescript
import { ReactNode } from 'react';

interface AuthLayoutProps {
  children: ReactNode;
  title: string;
  subtitle?: string;
}

export function AuthLayout({ children, title, subtitle }: AuthLayoutProps) {
  return (
    <div className="flex min-h-screen w-full items-center justify-center bg-gradient-to-br from-background via-muted/20 to-background p-4">
      <div className="w-full max-w-md">
        <div className="mb-8 text-center">
          <h1 className="text-2xl font-bold text-foreground">Quick Stash</h1>
          <h2 className="mt-2 text-xl font-semibold text-foreground">{title}</h2>
          {subtitle && <p className="mt-1 text-sm text-muted-foreground">{subtitle}</p>}
        </div>
        <div className="rounded-xl border bg-card p-6 shadow-sm">
          {children}
        </div>
      </div>
    </div>
  );
}
```

### 8.2 — LoginForm

**`src/components/auth/LoginForm.tsx`:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useLogin } from '@/queries/useAuth';

const loginSchema = z.object({
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
});

type LoginFormData = z.infer<typeof loginSchema>;

interface LoginFormProps {
  onSwitchToRegister: () => void;
}

export function LoginForm({ onSwitchToRegister }: LoginFormProps) {
  const loginMutation = useLogin();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<LoginFormData>({
    resolver: zodResolver(loginSchema),
    defaultValues: {
      email: '',
      password: '',
    },
  });

  const onSubmit = (data: LoginFormData) => {
    loginMutation.mutate(data);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Entrando...' : 'Entrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Não tem conta?{' '}
        <button
          type="button"
          onClick={onSwitchToRegister}
          className="text-primary underline-offset-4 hover:underline"
        >
          Registrar
        </button>
      </p>
    </form>
  );
}
```

### 8.3 — RegisterForm

**`src/components/auth/RegisterForm.tsx`:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useRegister } from '@/queries/useAuth';

const registerSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  email: z.string().email('Email inválido'),
  password: z.string().min(8, 'Senha deve ter pelo menos 8 caracteres'),
  confirmPassword: z.string(),
}).refine((data) => data.password === data.confirmPassword, {
  message: 'As senhas não coincidem',
  path: ['confirmPassword'],
});

type RegisterFormData = z.infer<typeof registerSchema>;

interface RegisterFormProps {
  onSwitchToLogin: () => void;
}

export function RegisterForm({ onSwitchToLogin }: RegisterFormProps) {
  const registerMutation = useRegister();

  const {
    register,
    handleSubmit,
    formState: { errors, isSubmitting },
  } = useForm<RegisterFormData>({
    resolver: zodResolver(registerSchema),
    defaultValues: {
      name: '',
      email: '',
      password: '',
      confirmPassword: '',
    },
  });

  const onSubmit = (data: RegisterFormData) => {
    const { confirmPassword, ...registerData } = data;
    registerMutation.mutate(registerData);
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="space-y-4">
      <div className="space-y-2">
        <Label htmlFor="name">Nome</Label>
        <Input
          id="name"
          type="text"
          placeholder="Seu nome"
          {...register('name')}
          disabled={isSubmitting}
        />
        {errors.name && (
          <p className="text-sm text-destructive">{errors.name.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="email">E-mail</Label>
        <Input
          id="email"
          type="email"
          placeholder="seu@email.com"
          {...register('email')}
          disabled={isSubmitting}
        />
        {errors.email && (
          <p className="text-sm text-destructive">{errors.email.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="password">Senha</Label>
        <Input
          id="password"
          type="password"
          placeholder="••••••••"
          {...register('password')}
          disabled={isSubmitting}
        />
        {errors.password && (
          <p className="text-sm text-destructive">{errors.password.message}</p>
        )}
      </div>

      <div className="space-y-2">
        <Label htmlFor="confirmPassword">Confirmar Senha</Label>
        <Input
          id="confirmPassword"
          type="password"
          placeholder="••••••••"
          {...register('confirmPassword')}
          disabled={isSubmitting}
        />
        {errors.confirmPassword && (
          <p className="text-sm text-destructive">{errors.confirmPassword.message}</p>
        )}
      </div>

      <Button type="submit" className="w-full" disabled={isSubmitting}>
        {isSubmitting ? 'Criando conta...' : 'Registrar'}
      </Button>

      <p className="text-center text-sm text-muted-foreground">
        Já tem conta?{' '}
        <button
          type="button"
          onClick={onSwitchToLogin}
          className="text-primary underline-offset-4 hover:underline"
        >
          Entrar
        </button>
      </p>
    </form>
  );
}
```

### 8.4 — LoginPage

**`src/pages/LoginPage.tsx`:**

```typescript
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <AuthLayout
        title="Criar conta"
        subtitle="Preencha os dados abaixo para se registrar"
      >
        <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Entrar na sua conta"
      subtitle="Insira suas credenciais para acessar"
    >
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    </AuthLayout>
  );
}
```

*Correção: RegisterForm deve ser importado e usado:*

```typescript
import { useState } from 'react';
import { AuthLayout } from '@/components/auth/AuthLayout';
import { LoginForm } from '@/components/auth/LoginForm';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function LoginPage() {
  const [showRegister, setShowRegister] = useState(false);

  if (showRegister) {
    return (
      <AuthLayout
        title="Criar conta"
        subtitle="Preencha os dados abaixo para se registrar"
      >
        <RegisterForm onSwitchToLogin={() => setShowRegister(false)} />
      </AuthLayout>
    );
  }

  return (
    <AuthLayout
      title="Entrar na sua conta"
      subtitle="Insira suas credenciais para acessar"
    >
      <LoginForm onSwitchToRegister={() => setShowRegister(true)} />
    </AuthLayout>
  );
}
```

### 8.5 — RegisterPage

**`src/pages/RegisterPage.tsx`:**

```typescript
import { AuthLayout } from '@/components/auth/AuthLayout';
import { RegisterForm } from '@/components/auth/RegisterForm';

export default function RegisterPage() {
  return (
    <AuthLayout
      title="Criar conta"
      subtitle="Preencha os dados abaixo para se registrar"
    >
      <RegisterForm onSwitchToLogin={() => {}} />
    </AuthLayout>
  );
}
```

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros de tipo
- [ ] Página de login abre em `/login`
- [ ] Página de registro abre em `/register`
- [ ] Formulário de login valida email (formato)
- [ ] Formulário de login valida senha (min 8 chars)
- [ ] Formulário de registro valida nome (min 2 chars)
- [ ] Formulário de registro valida email (formato)
- [ ] Formulário de registro valida senha (min 8 chars)
- [ ] Formulário de registro valida confirmação de senha (deve coincidir)
- [ ] Mensagens de erro aparecem abaixo dos campos inválidos
- [ ] Botão de login fica desabilitado durante submit (loading state)
- [ ] Botão de registro fica desabilitado durante submit (loading state)
- [ ] Texto do botão muda para "Entrando..." / "Criando conta..." durante submit
- [ ] Login com dados válidos redireciona para `/` (dashboard)
- [ ] Registro com dados válidos redireciona para `/` (dashboard)
- [ ] Login com dados inválidos mostra toast de erro
- [ ] Registro com email duplicado mostra toast de erro
- [ ] Link "Registrar" no login troca para o formulário de registro
- [ ] Link "Entrar" no registro troca para o formulário de login
- [ ] Layout é centralizado com fundo gradiente sutil
- [ ] Toast de sucesso aparece após login/registro com sucesso

### Teste Manual

1. Abrir `/login` → ver formulário de login
2. Tentar login com email inválido → ver erro de validação
3. Tentar login com senha < 8 chars → ver erro de validação
4. Preencher corretamente e clicar "Entrar" → ver loading no botão
5. Com backend mockado, simular sucesso → ver toast + redirecionamento
6. Com backend mockado, simular 401 → ver toast de erro
7. Clicar "Registrar" → ver formulário de registro
8. Preencher senhas diferentes → ver erro de confirmação
9. Clicar "Entrar" no registro → voltar para login

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Telas de Login e Registro | [Plano §8](./frontend-plan.md#8-telas-de-login-e-registro) |
| React Hook Form + Zod | [Plano §2 — Stack](./frontend-plan.md#2-stack-detalhada) |
| Toast de erros/sucesso | [Plano §13](./frontend-plan.md#13-pacotes-necessários) |
| Hooks de auth | [Etapa 6](./frontend-plan-6.md) |
| Auth store | [Etapa 2](./frontend-plan-2.md) |

---

## ⚠️ Notas

- Validação é feita em duas camadas: Zod (schema) + React Hook Form (UI)
- `zodResolver` conecta o schema Zod ao React Hook Form
- `.refine()` no schema de registro valida que senhas coincidem
- Loading state é controlado por `isSubmitting` do React Hook Form
- Toasts são disparados dentro dos hooks TanStack Query (onSuccess/onError)
- `AuthLayout` usa gradiente sutil no background
- A navegação entre login/registro é controlada por estado local na LoginPage
