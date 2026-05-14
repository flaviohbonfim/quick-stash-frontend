import { useEffect } from 'react'
import { useForm } from 'react-hook-form'
import { zodResolver } from '@hookform/resolvers/zod'
import { z } from 'zod'
import { CalendarIcon } from 'lucide-react'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import type { Transaction, TransactionType } from '@/types/transactions'

const transactionSchema = z.object({
  description: z.string().min(1, 'Descrição é obrigatória'),
  amount: z.coerce.number().positive('Valor deve ser positivo'),
  date: z.date({ required_error: 'Data é obrigatória' }),
  type: z.enum(['INCOME', 'EXPENSE'], { required_error: 'Tipo é obrigatório' }),
  category: z.string().min(1, 'Categoria é obrigatória'),
  payment_method_id: z.string().min(1, 'Conta é obrigatória'),
})

type TransactionFormData = z.infer<typeof transactionSchema>

interface TransactionFormProps {
  open: boolean
  onOpenChange: (open: boolean) => void
  transaction?: Transaction | null
  paymentMethods: Array<{ id: string; name: string; type: string }>
  onSubmit: (data: TransactionFormData) => void
  loading: boolean
}

const CATEGORIES = {
  EXPENSE: [
    'Alimentação', 'Transporte', 'Moradia', 'Saúde',
    'Educação', 'Lazer', 'Tecnologia', 'Vestuário',
    'Serviços', 'Outros',
  ],
  INCOME: [
    'Salário', 'Freelance', 'Investimentos', 'Presente', 'Outros',
  ],
} as const

export function TransactionForm({
  open,
  onOpenChange,
  transaction,
  paymentMethods,
  onSubmit,
  loading,
}: TransactionFormProps) {
  const isEditing = !!transaction

  const {
    register,
    handleSubmit,
    setValue,
    watch,
    reset,
    formState: { errors, isValid },
  } = useForm<TransactionFormData>({
    resolver: zodResolver(transactionSchema),
    defaultValues: {
      type: 'EXPENSE',
    },
  })

  const selectedType = watch('type')
  const activeCategories = selectedType ? CATEGORIES[selectedType as keyof typeof CATEGORIES] : []

  useEffect(() => {
    if (transaction && open) {
      reset({
        description: transaction.description,
        amount: transaction.amount,
        date: new Date(transaction.date),
        type: transaction.type,
        category: transaction.category,
        payment_method_id: transaction.payment_method_id,
      })
    } else if (!open) {
      reset({
        description: '',
        amount: undefined,
        date: undefined,
        type: 'EXPENSE',
        category: '',
        payment_method_id: '',
      })
    }
  }, [transaction, open, reset])

  const onFormSubmit = (data: TransactionFormData) => {
    onSubmit(data)
  }

  return (
    <Dialog open={open} onOpenChange={(open) => {
      onOpenChange(open)
      if (!open) {
        reset()
      }
    }}>
      <DialogContent className="sm:max-w-[500px]">
        <DialogHeader>
          <DialogTitle>{isEditing ? 'Editar Transação' : 'Nova Transação'}</DialogTitle>
          <DialogDescription>
            {isEditing ? 'Atualize os dados da transação.' : 'Adicione uma nova transação às suas finanças.'}
          </DialogDescription>
        </DialogHeader>

        <form onSubmit={handleSubmit(onFormSubmit)} className="space-y-4">
          {/* Tipo */}
          <div className="space-y-2">
            <Label>Tipo</Label>
            <Select
              value={selectedType}
              onValueChange={(v) => setValue('type', v as TransactionType)}
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

          {/* Descrição */}
          <div className="space-y-2">
            <Label htmlFor="description">Descrição</Label>
            <Input
              id="description"
              placeholder="Ex: Supermercado, Salário..."
              {...register('description')}
            />
            {errors.description && (
              <p className="text-sm text-destructive">{errors.description.message}</p>
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
              placeholder="0,00"
              {...register('amount')}
            />
            {errors.amount && (
              <p className="text-sm text-destructive">{errors.amount.message}</p>
            )}
          </div>

          {/* Data */}
          <div className="space-y-2">
            <Label>Data</Label>
            <Popover>
              <PopoverTrigger>
                <Button
                  variant="outline"
                  className={`w-full justify-start text-left font-normal ${
                    !watch('date') ? 'text-muted-foreground' : ''
                  }`}
                >
                  <CalendarIcon className="mr-2 h-4 w-4" />
                  {watch('date') ? (
                    format(watch('date'), "dd 'de' MMMM 'de' yyyy", { locale: ptBR })
                  ) : (
                    'Selecione a data'
                  )}
                </Button>
              </PopoverTrigger>
              <PopoverContent className="w-auto p-0">
                <Calendar
                  mode="single"
                  selected={watch('date')}
                  onSelect={(d) => setValue('date', d as Date)}
                  locale={ptBR}
                />
              </PopoverContent>
            </Popover>
            {errors.date && (
              <p className="text-sm text-destructive">{errors.date.message}</p>
            )}
          </div>

          {/* Categoria */}
          <div className="space-y-2">
            <Label>Categoria</Label>
            <Select
              value={watch('category')}
              onValueChange={(v: string | null) => v && setValue('category', v)}
            >
              <SelectTrigger>
                <SelectValue placeholder="Selecione a categoria" />
              </SelectTrigger>
              <SelectContent>
                {activeCategories.map((cat) => (
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

          {/* Conta / Meio de Pagamento */}
          <div className="space-y-2">
            <Label htmlFor="payment_method_id">Conta</Label>
            <Select
              value={watch('payment_method_id')}
              onValueChange={(v: string | null) => v && setValue('payment_method_id', v)}
            >
              <SelectTrigger id="payment_method_id">
                <SelectValue placeholder="Selecione a conta" />
              </SelectTrigger>
              <SelectContent>
                {paymentMethods.map((pm) => (
                  <SelectItem key={pm.id} value={pm.id}>
                    {pm.name} {pm.type === 'CREDIT_CARD' && '(Cartão)'}
                  </SelectItem>
                ))}
              </SelectContent>
            </Select>
            {errors.payment_method_id && (
              <p className="text-sm text-destructive">{errors.payment_method_id.message}</p>
            )}
          </div>

          <DialogFooter>
            <Button
              type="button"
              variant="outline"
              onClick={() => {
                onOpenChange(false)
                reset()
              }}
            >
              Cancelar
            </Button>
            <Button type="submit" disabled={loading || !isValid}>
              {loading ? 'Salvando...' : isEditing ? 'Salvar' : 'Criar'}
            </Button>
          </DialogFooter>
        </form>
      </DialogContent>
    </Dialog>
  )
}
