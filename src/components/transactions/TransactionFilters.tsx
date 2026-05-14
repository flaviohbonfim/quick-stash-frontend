import { useState, useEffect, useCallback } from 'react'
import { Search, X } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import {
  Popover,
  PopoverContent,
  PopoverTrigger,
} from '@/components/ui/popover'
import { Calendar } from '@/components/ui/calendar'
import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import type { TransactionType } from '@/types/transactions'

interface TransactionFiltersProps {
  onFilter: (filters: TransactionFilters) => void
  paymentMethods: Array<{ id: string; name: string }>
}

export interface TransactionFilters {
  search?: string
  type?: TransactionType
  category?: string
  payment_method_id?: string
  start_date?: string
  end_date?: string
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

export function TransactionFilters({ onFilter, paymentMethods }: TransactionFiltersProps) {
  const [search, setSearch] = useState('')
  const [type, setType] = useState<TransactionType | ''>('')
  const [category, setCategory] = useState('')
  const [paymentMethodId, setPaymentMethodId] = useState('')
  const [startDate, setStartDate] = useState<Date | undefined>(undefined)
  const [endDate, setEndDate] = useState<Date | undefined>(undefined)
  const [showCalendar, setShowCalendar] = useState<'start' | 'end' | null>(null)

  const applyFilters = useCallback(() => {
    const filters: TransactionFilters = {}
    if (search) filters.search = search
    if (type) filters.type = type
    if (category) filters.category = category
    if (paymentMethodId) filters.payment_method_id = paymentMethodId
    if (startDate) filters.start_date = format(startDate, 'yyyy-MM-dd')
    if (endDate) filters.end_date = format(endDate, 'yyyy-MM-dd')
    onFilter(filters)
  }, [search, type, category, paymentMethodId, startDate, endDate, onFilter])

  useEffect(() => {
    applyFilters()
  }, [applyFilters])

  const handleClear = () => {
    setSearch('')
    setType('')
    setCategory('')
    setPaymentMethodId('')
    setStartDate(undefined)
    setEndDate(undefined)
  }

  const hasFilters = search || type || category || paymentMethodId || startDate || endDate

  const activeCategories = type ? CATEGORIES[type as keyof typeof CATEGORIES] : []

  return (
    <div className="space-y-4 rounded-lg border bg-card p-4">
      <div className="flex flex-col gap-3 sm:flex-row">
        <div className="relative flex-1">
          <Search className="absolute left-3 top-1/2 h-4 w-4 -translate-y-1/2 text-muted-foreground" />
          <Input
            placeholder="Buscar transações..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            className="pl-9"
          />
        </div>
        <Select value={type} onValueChange={(v) => setType(v as TransactionType | '')}>
          <SelectTrigger className="w-full sm:w-[140px]">
            <SelectValue placeholder="Tipo" />
          </SelectTrigger>
          <SelectContent>
            <SelectItem value="INCOME">Receita</SelectItem>
            <SelectItem value="EXPENSE">Despesa</SelectItem>
          </SelectContent>
        </Select>
        <Select value={category} onValueChange={(v) => setCategory(v || '')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Categoria" />
          </SelectTrigger>
          <SelectContent>
            {activeCategories.map(cat => (
              <SelectItem key={cat} value={cat}>{cat}</SelectItem>
            ))}
          </SelectContent>
        </Select>
        <Select value={paymentMethodId} onValueChange={(v) => setPaymentMethodId(v || '')}>
          <SelectTrigger className="w-full sm:w-[160px]">
            <SelectValue placeholder="Conta" />
          </SelectTrigger>
          <SelectContent>
            {paymentMethods.map(pm => (
              <SelectItem key={pm.id} value={pm.id}>{pm.name}</SelectItem>
            ))}
          </SelectContent>
        </Select>
      </div>

      <div className="flex items-center gap-2">
        <Popover open={showCalendar === 'start'} onOpenChange={(open) => {
          if (open) setShowCalendar('start')
        }}>
          <PopoverTrigger>
            <div className="w-full sm:w-[180px] justify-start text-left font-normal flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {startDate ? format(startDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data início'}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={startDate}
              onSelect={(d) => { setStartDate(d); setShowCalendar(null) }}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        <span className="text-muted-foreground">até</span>

        <Popover open={showCalendar === 'end'} onOpenChange={(open) => {
          if (open) setShowCalendar('end')
        }}>
          <PopoverTrigger>
            <div className="w-full sm:w-[180px] justify-start text-left font-normal flex items-center gap-2 rounded-md border border-input bg-background px-3 py-2 text-sm ring-offset-background placeholder:text-muted-foreground focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2 disabled:cursor-not-allowed disabled:opacity-50">
              {endDate ? format(endDate, 'dd/MM/yyyy', { locale: ptBR }) : 'Data fim'}
            </div>
          </PopoverTrigger>
          <PopoverContent className="w-auto p-0">
            <Calendar
              mode="single"
              selected={endDate}
              onSelect={(d) => { setEndDate(d); setShowCalendar(null) }}
              locale={ptBR}
            />
          </PopoverContent>
        </Popover>

        {hasFilters && (
          <Button variant="ghost" size="icon" onClick={handleClear} className="ml-auto">
            <X className="h-4 w-4" />
          </Button>
        )}
      </div>
    </div>
  )
}
