import { format } from 'date-fns'
import { ptBR } from 'date-fns/locale'
import { Pencil, Trash2, MoreHorizontal } from 'lucide-react'
import { Button, buttonVariants } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Badge } from '@/components/ui/badge'
import {
  Table,
  TableBody,
  TableCell,
  TableHead,
  TableHeader,
  TableRow,
} from '@/components/ui/table'
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import type { Transaction } from '@/types/transactions'

interface PaymentMethod {
  id: string
  name: string
  type: string
}

interface TransactionTableProps {
  transactions: Transaction[]
  loading: boolean
  onEdit: (transaction: Transaction) => void
  onDelete: (id: string) => void
  paymentMethods?: PaymentMethod[]
}

export function TransactionTable({
  transactions,
  loading,
  onEdit,
  onDelete,
  paymentMethods = [],
}: TransactionTableProps) {
  const getPaymentMethodName = (id: string) => {
    const pm = paymentMethods.find(p => p.id === id)
    return pm ? pm.name : id.slice(0, 8)
  }

  if (loading) {
    return (
      <div className="flex items-center justify-center py-8" role="status" aria-label="Carregando transações">
        <div className="h-8 w-8 animate-spin rounded-full border-4 border-primary border-t-transparent" />
      </div>
    )
  }

  if (transactions.length === 0) {
    return (
      <div className="flex flex-col items-center justify-center py-12 text-center">
        <p className="text-muted-foreground">Nenhuma transação encontrada</p>
      </div>
    )
  }

  return (
    <Table aria-label="Lista de transações">
      <TableHeader>
        <TableRow className="bg-muted/50">
          <TableHead>Data</TableHead>
          <TableHead>Descrição</TableHead>
          <TableHead>Categoria</TableHead>
          <TableHead className="hidden md:table-cell">Conta</TableHead>
          <TableHead className="text-right">Valor</TableHead>
          <TableHead className="w-10 sr-only">Ações</TableHead>
        </TableRow>
      </TableHeader>
      <TableBody>
        {transactions.map((transaction) => (
          <TableRow key={transaction.id} className="transition-colors duration-150 hover:bg-primary/5">
            <TableCell className="font-medium">
              {format(new Date(transaction.date), "dd 'de' MMMM", { locale: ptBR })}
            </TableCell>
            <TableCell>{transaction.description}</TableCell>
            <TableCell>
              <Badge variant="outline">{transaction.category}</Badge>
            </TableCell>
            <TableCell className="hidden md:table-cell">
              <span className="text-muted-foreground">
                {getPaymentMethodName(transaction.payment_method_id)}
              </span>
            </TableCell>
            <TableCell className="text-right font-medium">
              <span className={transaction.type === 'INCOME' ? 'text-success' : 'text-destructive'}>
                {transaction.type === 'INCOME' ? '+' : '-'}
                <CurrencyFormat value={Math.abs(transaction.amount)} />
              </span>
            </TableCell>
            <TableCell>
              <DropdownMenu>
                <DropdownMenuTrigger
                  className={cn(buttonVariants({ variant: 'ghost', size: 'icon' }), 'h-8 w-8')}
                  aria-label={`Ações para ${transaction.description}`}
                >
                  <MoreHorizontal className="h-4 w-4" />
                  <span className="sr-only">Ações</span>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end">
                  <DropdownMenuItem onClick={() => onEdit(transaction)}>
                    <Pencil className="mr-2 h-4 w-4" />
                    Editar
                  </DropdownMenuItem>
                  <DropdownMenuItem
                    className="text-destructive focus:text-destructive"
                    onClick={() => onDelete(transaction.id)}
                  >
                    <Trash2 className="mr-2 h-4 w-4" />
                    Excluir
                  </DropdownMenuItem>
                </DropdownMenuContent>
              </DropdownMenu>
            </TableCell>
          </TableRow>
        ))}
      </TableBody>
    </Table>
  )
}
