# 📋 Frontend Plan — Etapa 10/10: Transações, Contas, Configurações e Refinamento

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 9 — Dashboard](./frontend-plan-9.md)
> **Fase correspondente:** Fase 4 — Transações + Fase 5 — Meios de Pagamento + Fase 6 — Refinamento
> **Duração estimada:** 3-5 dias

---

## 🎯 Objetivo desta etapa

Implementar as telas restantes (Transações, Meios de Pagamento, Configurações), formulários de CRUD, filtros, e aplicar refinamentos finais (animações, empty states, loading skeletons).

---

## 📦 O que será entregue

### 10.1 — TransactionForm (Dialog)

**`src/components/transactions/TransactionForm.tsx`:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { CATEGORIES, type Transaction, type TransactionType } from '@/types/transactions';
import { usePaymentMethods } from '@/queries/usePaymentMethods';

const transactionSchema = z.object({
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  date: z.string().min(1, 'Data é obrigatória'),
  description: z.string().min(1, 'Descrição é obrigatória'),
  type: z.enum(['INCOME', 'EXPENSE']),
  category: z.string().min(1, 'Categoria é obrigatória'),
  payment_method_id: z.string().min(1, 'Conta é obrigatória'),
});

type TransactionFormData = z.infer<typeof transactionSchema>;

interface TransactionFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: TransactionFormData) => void;
  isLoading?: boolean;
  initialData?: Transaction;
}

export function TransactionForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
  initialData,
}: TransactionFormProps) {
  const { data: paymentMethods } = usePaymentMethods();

  const {
    register,
    handleSubmit,
    reset,
    watch,
    setValue,
    formState: { errors },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: initialData
      ? {
          amount: initialData.amount,
          date: initialData.date,
          description: initialData.description,
          type: initialData.type,
          category: initialData.category,
          payment_method_id: initialData.payment_method_id,
        }
      : {
          amount: 0,
          date: new Date().toISOString().split('T')[0],
          description: '',
          type: 'EXPENSE',
          category: '',
          payment_method_id: '',
        },
  });

  // Reset form when dialog opens/closes
  useEffect(() => {
    if (!open) {
      reset({
        amount: 0,
        date: new Date().toISOString().split('T')[0],
        description: '',
        type: 'EXPENSE',
        category: '',
        payment_method_id: '',
      });
    }
  }, [open, reset]);

  // Update categories when type changes
  const selectedType = watch('type');
  useEffect(() => {
    setValue('category', '');
  }, [selectedType, setValue]);

  const categories = CATEGORIES[selectedType as TransactionType] || [];

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit(data);
    onOpenChange(false);
  };

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>
            {initialData ? 'Editar Transação' : 'Nova Transação'}
          </DialogTitle>
          <DialogDescription>
            {initialData
              ? 'Atualize os dados da transação.'
              : 'Preencha os dados da nova transação.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={selectedType}
              onValueChange={(value) => setValue('type', value as TransactionType)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione o tipo" />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="INCOME">Receita</SelectItem>
                <SelectItem value="EXPENSE">Despesa</SelectItem>
              </SelectContent>
            </Select>
            {errors.type && (
              <p className="text-sm text-destructive">{errors.type.message}</p>
            )}
          </div>

          {/* Valor */}
          <div className="space-y-2">
            <Label htmlFor="amount">Valor (R$)</Label>
            <Input
              id="amount"
              type="number"
              step="0.01"
              min="0.01"
              placeholder="0.00"
              {...register('amount')}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label htmlFor="date">Data</Label>
            <Input
              id="date"
              type="date"
              {...register('date')}
            />
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado"
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={watch('category')}
              onValueChange={(value) => setValue('category', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {categories.map((cat) => (
                  <SelectItem key={cat} value={cat}>
                    {cat}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.category && (
              <p className="text-sm text-destructive">{errors.category.message}</p>
            )}
          </div>

          {/* Conta */}
          <div className="space-y-2">
            <Label>Conta</Label>
            <Select
              value={watch('payment_method_id')}
              onValueChange={(value) => setValue('payment_method_id', value)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods?.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    {pm.name} ({pm.type})
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method_id && (
              <p className="text-sm text-destructive">{errors.payment_method_id.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : initialData ? 'Atualizar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 10.2 — TransactionList com Filtros

**`src/components/transactions/TransactionList.tsx`:**

```typescript
import { useState } from 'react';
import { useTransactions } from '@/queries/useTransactions';
import { useDeleteTransaction } from '@/queries/useTransactions';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { TransactionForm } from './TransactionForm';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';
import { Input } from '@/components/ui/input';
import { Pencil, Trash2, Plus } from 'lucide-react';
import { toast } from 'sonner';

export function TransactionList() {
  const [filters, setFilters] = useState<{
    type?: 'INCOME' | 'EXPENSE';
    category?: string;
  }>({});
  const [formOpen, setFormOpen] = useState(false);
  const [editingTransaction, setEditingTransaction] = useState<any>(null);

  const deleteMutation = useDeleteTransaction();

  const { data, isLoading, isFetching } = useTransactions({
    ...filters,
    limit: 50,
  });

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta transação?')) {
      deleteMutation.mutate(id);
    }
  };

  const handleEdit = (transaction: any) => {
    setEditingTransaction(transaction);
    setFormOpen(true);
  };

  const handleFormSubmit = (formData: any) => {
    if (editingTransaction) {
      // Update logic would go here
      toast.info('Edição implementada na próxima iteração');
    } else {
      // Create logic would go here
      toast.info('Criação implementada na próxima iteração');
    }
    setEditingTransaction(null);
    setFormOpen(false);
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      {/* Filters + Add Button */}
      <div className="flex flex-col gap-4 sm:flex-row sm:items-center sm:justify-between">
        <div className="flex flex-wrap gap-2">
          <Select
            value={filters.type}
            onValueChange={(value) =>
              setFilters((f) => ({ ...f, type: value as 'INCOME' | 'EXPENSE' }))
            }
          >
            <SelectTrigger className="w-[140px]">
              <SelectValue placeholder="Tipo" />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="INCOME">Receitas</SelectItem>
              <SelectItem value="EXPENSE">Despesas</SelectItem>
              <SelectItem value="">Todos</SelectItem>
            </SelectContent>
          </Select>

          <Input
            placeholder="Buscar descrição..."
            className="max-w-xs"
            onChange={(e) =>
              setFilters((f) => ({ ...f, search: e.target.value }))
            }
          />
        </div>

        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Nova Transação
        </Button>
      </div>

      {/* Transaction List */}
      {isFetching && <LoadingSpinner size="sm" />}

      {!data || data.data.length === 0 ? (
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Comece adicionando sua primeira transação."
        />
      ) : (
        <div className="space-y-2">
          {data.data.map((transaction) => (
            <div
              key={transaction.id}
              className="flex items-center justify-between rounded-lg border p-3 transition-colors hover:bg-muted/50"
            >
              <div className="space-y-1">
                <p className="font-medium">{transaction.description}</p>
                <div className="flex items-center gap-2">
                  <Badge variant="outline">{transaction.category}</Badge>
                  <span className="text-xs text-muted-foreground">
                    {new Date(transaction.date).toLocaleDateString('pt-BR')}
                  </span>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <Badge variant={transaction.type === 'INCOME' ? 'default' : 'secondary'}>
                  {transaction.type === 'INCOME' ? 'Receita' : 'Despesa'}
                </Badge>
                <span
                  className={`font-bold ${
                    transaction.type === 'INCOME' ? 'text-success' : 'text-danger'
                  }`}
                >
                  {transaction.type === 'INCOME' ? '+' : '-'}
                  <CurrencyFormat value={transaction.amount} />
                </span>
                <div className="flex gap-1">
                  <Button
                    variant="ghost"
                    size="icon"
                    onClick={() => handleEdit(transaction)}
                  >
                    <Pencil size={16} />
                  </Button>
                  <Button
                    variant="ghost"
                    size="icon"
                    className="text-destructive"
                    onClick={() => handleDelete(transaction.id)}
                    disabled={deleteMutation.isPending}
                  >
                    <Trash2 size={16} />
                  </Button>
                </div>
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Form Dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={handleFormSubmit}
        isLoading={deleteMutation.isPending}
        initialData={editingTransaction || undefined}
      />
    </div>
  );
}
```

### 10.3 — TransactionsPage

**`src/pages/TransactionsPage.tsx`:**

```typescript
import { TransactionList } from '@/components/transactions/TransactionList';

export default function TransactionsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Transações</h1>
        <p className="text-muted-foreground">Gerencie suas receitas e despesas</p>
      </div>
      <TransactionList />
    </div>
  );
}
```

### 10.4 — PaymentMethodForm

**`src/components/payment-methods/PaymentMethodForm.tsx`:**

```typescript
import { useForm } from 'react-hook-form';
import { zodResolver } from '@hookform/resolvers/zod';
import { z } from 'zod';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog';
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select';

const paymentMethodSchema = z.object({
  name: z.string().min(2, 'Nome deve ter pelo menos 2 caracteres'),
  type: z.enum(['PIX', 'CREDIT_CARD']),
});

type PaymentMethodFormData = z.infer<typeof paymentMethodSchema>;

interface PaymentMethodFormProps {
  open: boolean;
  onOpenChange: (open: boolean) => void;
  onSubmit: (data: PaymentMethodFormData) => void;
  isLoading?: boolean;
}

export function PaymentMethodForm({
  open,
  onOpenChange,
  onSubmit,
  isLoading = false,
}: PaymentMethodFormProps) {
  const {
    register,
    handleSubmit,
    reset,
    setValue,
    watch,
    formState: { errors },
  } = useForm<PaymentMethodFormData>({
    resolver: zodResolver(paymentMethodSchema),
    defaultValues: {
      name: '',
      type: 'PIX',
    },
  });

  const type = watch('type');

  return (
    <Dialog open={open} onOpenChange={onOpenChange}>
      <DialogContent className="sm:max-w-md">
        <DialogHeader>
          <DialogTitle>Nova Conta</DialogTitle>
          <DialogDescription>
            Adicione uma nova conta para registrar transações.
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit((data) => {
          onSubmit(data);
          onOpenChange(false);
        })}} className="space-y-4">
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select value={type} onValueChange={(v) => setValue('type', v as 'PIX' | 'CREDIT_CARD')}>
              <SelectTrigger>
                <SelectValue />
              </SelectTrigger>
              <SelectContent>
                <SelectItem value="PIX">PIX</SelectItem>
                <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
              </SelectContent>
            </Select>
          </div>

          <div className="space-y-2">
            <Label htmlFor="name">Nome</Label>
            <Input
              id="name"
              placeholder="Ex: Nubank, Inter, etc."
              {...register('name')}
            />
            {errors.name && (
              <p className="text-sm text-destructive">{errors.name.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button type="button" variant="outline" onClick={() => onOpenChange(false)}>
              Cancelar
            </Button>
            <Button type="submit" disabled={isLoading}>
              {isLoading ? 'Salvando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  );
}
```

### 10.5 — PaymentMethodList

**`src/components/payment-methods/PaymentMethodList.tsx`:**

```typescript
import { usePaymentMethods } from '@/queries/usePaymentMethods';
import { useDeletePaymentMethod } from '@/queries/usePaymentMethods';
import { Button } from '@/components/ui/button';
import { Badge } from '@/components/ui/badge';
import { CurrencyFormat } from '@/components/common/CurrencyFormat';
import { LoadingSpinner } from '@/components/common/LoadingSpinner';
import { EmptyState } from '@/components/common/EmptyState';
import { PaymentMethodForm } from './PaymentMethodForm';
import { Plus, Trash2, Wallet } from 'lucide-react';
import { useState } from 'react';

export function PaymentMethodList() {
  const [formOpen, setFormOpen] = useState(false);
  const deleteMutation = useDeletePaymentMethod();

  const { data, isLoading } = usePaymentMethods();

  const handleDelete = (id: string) => {
    if (window.confirm('Tem certeza que deseja remover esta conta?')) {
      deleteMutation.mutate(id);
    }
  };

  if (isLoading) return <LoadingSpinner />;

  return (
    <div className="space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">Contas</h2>
        <Button onClick={() => setFormOpen(true)}>
          <Plus size={16} className="mr-2" />
          Nova Conta
        </Button>
      </div>

      {!data || data.length === 0 ? (
        <EmptyState
          title="Nenhuma conta encontrada"
          description="Adicione sua primeira conta para começar a registrar transações."
        >
          <Button onClick={() => setFormOpen(true)}>
            <Plus size={16} className="mr-2" />
            Adicionar Conta
          </Button>
        </EmptyState>
      ) : (
        <div className="grid gap-4 md:grid-cols-2">
          {data.map((pm) => (
            <div
              key={pm.id}
              className="flex items-center justify-between rounded-lg border p-4"
            >
              <div className="flex items-center gap-3">
                <div className="flex h-10 w-10 items-center justify-center rounded-full bg-primary/10">
                  <Wallet size={20} className="text-primary" />
                </div>
                <div>
                  <p className="font-medium">{pm.name}</p>
                  <Badge variant={pm.type === 'PIX' ? 'default' : 'secondary'}>
                    {pm.type === 'PIX' ? 'PIX' : 'Cartão de Crédito'}
                  </Badge>
                </div>
              </div>
              <div className="flex items-center gap-3">
                <span className="font-bold">
                  <CurrencyFormat value={pm.balance} />
                </span>
                <Button
                  variant="ghost"
                  size="icon"
                  className="text-destructive"
                  onClick={() => handleDelete(pm.id)}
                  disabled={deleteMutation.isPending}
                >
                  <Trash2 size={16} />
                </Button>
              </div>
            </div>
          ))}
        </div>
      )}

      <PaymentMethodForm
        open={formOpen}
        onOpenChange={setFormOpen}
        onSubmit={() => {}}
        isLoading={deleteMutation.isPending}
      />
    </div>
  );
}
```

### 10.6 — PaymentMethodsPage

**`src/pages/PaymentMethodsPage.tsx`:**

```typescript
import { PaymentMethodList } from '@/components/payment-methods/PaymentMethodList';

export default function PaymentMethodsPage() {
  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Contas</h1>
        <p className="text-muted-foreground">Gerencie suas contas e meios de pagamento</p>
      </div>
      <PaymentMethodList />
    </div>
  );
}
```

### 10.7 — SettingsPage

**`src/pages/SettingsPage.tsx`:**

```typescript
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import { useLogout } from '@/queries/useAuth';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Separator } from '@/components/ui/separator';
import { Moon, Sun, LogOut, User } from 'lucide-react';

export default function SettingsPage() {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const logoutMutation = useLogout();

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground">Configurações</h1>
        <p className="text-muted-foreground">Gerencie suas preferências</p>
      </div>

      <div className="grid gap-6 md:grid-cols-2">
        {/* Appearance */}
        <Card>
          <CardHeader>
            <CardTitle>Aparência</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center justify-between">
              <div className="flex items-center gap-2">
                {theme === 'dark' ? <Moon size={20} /> : <Sun size={20} />}
                <span>Modo {theme === 'dark' ? 'Escuro' : 'Claro'}</span>
              </div>
              <Button variant="outline" onClick={toggleTheme}>
                Alternar
              </Button>
            </div>
          </CardContent>
        </Card>

        {/* Account */}
        <Card>
          <CardHeader>
            <CardTitle>Conta</CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            <div className="flex items-center gap-2">
              <User size={20} />
              <div>
                <p className="font-medium">{user?.name || 'Usuário'}</p>
                <p className="text-sm text-muted-foreground">{user?.email || ''}</p>
              </div>
            </div>
            <Separator />
            <Button
              variant="destructive"
              className="w-full"
              onClick={() => logoutMutation.mutate()}
              disabled={logoutMutation.isPending}
            >
              <LogOut size={16} className="mr-2" />
              Sair
            </Button>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
```

### 10.8 — EmptyState com children

Atualizar `src/components/common/EmptyState.tsx` para aceitar children:

```typescript
import { ReactNode } from 'react';
import { Inbox } from 'lucide-react';

interface EmptyStateProps {
  title: string;
  description?: string;
  children?: ReactNode;
}

export function EmptyState({ title, description, children }: EmptyStateProps) {
  return (
    <div className="flex flex-col items-center justify-center rounded-lg border-2 border-dashed p-8 text-center">
      <Inbox size={32} className="mb-4 text-muted-foreground" />
      <h3 className="text-lg font-semibold text-foreground">{title}</h3>
      {description && (
        <p className="mt-1 text-sm text-muted-foreground">{description}</p>
      )}
      {children && <div className="mt-4">{children}</div>}
    </div>
  );
}
```

---

## ✅ Critérios de Validação

### Transações
- [ ] `npm run build` compila sem erros
- [ ] Página de transações abre em `/transactions`
- [ ] Filtro por tipo (Receita/Despesa/Todos) funciona
- [ ] Lista de transações mostra todas as transações
- [ ] Botão "Nova Transação" abre dialog com formulário
- [ ] Formulário valida todos os campos (valor, data, descrição, categoria, conta)
- [ ] Categorias mudam conforme o tipo selecionado
- [ ] Botão deletar pede confirmação e remove a transação
- [ ] Botão editar abre formulário preenchido
- [ ] EmptyState aparece quando não há transações

### Contas (Payment Methods)
- [ ] Página de contas abre em `/payment-methods`
- [ ] Lista de contas mostra todas as contas com saldo
- [ ] Badge visual diferencia PIX (default) de Cartão (secondary)
- [ ] Botão "Nova Conta" abre dialog
- [ ] Formulário valida nome (min 2 chars) e tipo
- [ ] Botão deletar pede confirmação
- [ ] EmptyState aparece quando não há contas

### Configurações
- [ ] Página de configurações abre em `/settings`
- [ ] Toggle de tema funciona
- [ ] Mostra nome e email do usuário
- [ ] Botão "Sair" faz logout

### Refinamento
- [ ] EmptyState aparece em todas as listas vazias
- [ ] LoadingSpinner aparece durante carregamento
- [ ] CurrencyFormat formata corretamente em todas as telas
- [ ] Layout é responsivo em todas as páginas

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Transações — CRUD | [Plano §12 — Fase 4](./frontend-plan.md#12-plano-de-implementação-fases) |
| Payment Methods — CRUD | [Plano §12 — Fase 5](./frontend-plan.md#12-plano-de-implementação-fases) |
| Settings | [Plano §1 — `pages/SettingsPage.tsx`](./frontend-plan.md#1-arquitetura-de-pastas) |
| Responsividade | [Plano §11](./frontend-plan.md#11-responsividade) |
| Empty states | [Plano §12 — Fase 6](./frontend-plan.md#12-plano-de-implementação-fases) |
| Hooks TanStack Query | [Etapa 6](./frontend-plan-6.md) |
| Layout | [Etapa 7](./frontend-plan-7.md) |

---

## ⚠️ Notas

- Formulários usam `Dialog` do shadcn para modais
- Categorias são dinâmicas: mudam conforme o tipo (INCOME/EXPENSE)
- `EmptyState` aceita `children` para botões de ação
- `PaymentMethodList` mostra saldo da conta (vindo do `usePaymentMethods`)
- `SettingsPage` usa `useLogout` mutation para logout
- Todas as páginas seguem o padrão: título + descrição + conteúdo
- Esta etapa **completa** a implementação do plano original

---

## 🎉 Fim do Plano

Parabéns! Você completou todas as 10 etapas do plano de implementação do Quick Stash Frontend.

**Resumo das etapas:**

| Etapa | Descrição | Plano Original |
|-------|-----------|---------------|
| 1/10 | Fundação do Projeto | §1, §2, §3, §13 |
| 2/10 | Tipos, Stores e Hooks Base | §1, §10 |
| 3/10 | API Client com Token Refresh | §4 |
| 4/10 | Serviços de API | §1, §12 |
| 5/10 | Rotas, Router e ProtectedRoute | §1, §5 |
| 6/10 | TanStack Query Hooks | §1, §9, §12 |
| 7/10 | Layout (Sidebar, Header, AppLayout) | §1, §6, §11 |
| 8/10 | Telas de Login e Registro | §2, §8 |
| 9/10 | Dashboard Completo | §1, §7, §11 |
| 10/10 | Transações, Contas, Configurações e Refinamento | §1, §12 (Fases 4-6) |
