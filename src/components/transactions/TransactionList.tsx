import { useState } from 'react'
import { Plus } from 'lucide-react'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/queries/useTransactions'
import { usePaymentMethods } from '@/queries/usePaymentMethods'
import { Button } from '@/components/ui/button'
import { TransactionFilters, type TransactionFilters as FiltersType } from './TransactionFilters'
import { TransactionTable } from './TransactionTable'
import { TransactionForm } from './TransactionForm'
import { EmptyState } from '@/components/common/EmptyState'
import type { Transaction } from '@/types/transactions'

export function TransactionList() {
  const [filters, setFilters] = useState<FiltersType>({})
  const [page, setPage] = useState(1)
  const limit = 20
  const [formOpen, setFormOpen] = useState(false)
  const [editingTransaction, setEditingTransaction] = useState<Transaction | null>(null)
  const [deleteId, setDeleteId] = useState<string | null>(null)

  const { data, isLoading } = useTransactions({
    ...filters,
    limit,
    offset: (page - 1) * limit,
    start_date: filters.start_date || undefined,
    end_date: filters.end_date || undefined,
  })

  const { data: paymentMethodsData } = usePaymentMethods()
  const paymentMethods = paymentMethodsData || []

  const createMutation = useCreateTransaction()
  const updateMutation = useUpdateTransaction()
  const deleteMutation = useDeleteTransaction()

  const transactions = Array.isArray(data) ? data : (data?.data || [])
  const total = typeof data?.total === 'number' ? data.total : 0
  const totalPages = Math.ceil(total / limit)

  const handleCreate = (formData: any) => {
    createMutation.mutate(
      {
        description: formData.description,
        amount: formData.amount,
        date: formData.date.toISOString().split('T')[0],
        type: formData.type,
        category: formData.category,
        payment_method_id: formData.payment_method_id,
      },
      { onSuccess: () => setFormOpen(false) }
    )
  }

  const handleUpdate = (formData: any) => {
    if (!editingTransaction) return
    updateMutation.mutate(
      {
        id: editingTransaction.id,
        description: formData.description,
        amount: formData.amount,
        date: formData.date.toISOString().split('T')[0],
        type: formData.type,
        category: formData.category,
        payment_method_id: formData.payment_method_id,
      },
      {
        onSuccess: () => {
          setFormOpen(false)
          setEditingTransaction(null)
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, { onSuccess: () => setDeleteId(null) })
  }

  const handleEdit = (transaction: Transaction) => {
    setEditingTransaction(transaction)
    setFormOpen(true)
  }

  const handleDeleteClick = (id: string) => {
    setDeleteId(id)
  }

  return (
    <div className="space-y-4">
      {/* Header */}
      <div className="flex items-center justify-between">
        <h2 className="text-2xl font-bold">Transações</h2>
        <Button onClick={() => {
          setEditingTransaction(null)
          setFormOpen(true)
        }}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </div>

      {/* Filters */}
      <TransactionFilters
        onFilter={setFilters}
        paymentMethods={paymentMethods}
      />

      {/* Table or Empty State */}
      {transactions.length > 0 ? (
        <>
          <TransactionTable
            transactions={transactions}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex items-center justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} transações
              </p>
              <div className="flex gap-2">
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === 1}
                  onClick={() => setPage(p => p - 1)}
                >
                  Anterior
                </Button>
                <Button
                  variant="outline"
                  size="sm"
                  disabled={page === totalPages}
                  onClick={() => setPage(p => p + 1)}
                >
                  Próximo
                </Button>
              </div>
            </div>
          )}
        </>
      ) : (
        <EmptyState
          title="Nenhuma transação encontrada"
          description="Comece adicionando sua primeira transação."
          actionLabel="Nova Transação"
          onAction={() => {
            setEditingTransaction(null)
            setFormOpen(true)
          }}
        />
      )}

      {/* Create/Edit Dialog */}
      <TransactionForm
        open={formOpen}
        onOpenChange={setFormOpen}
        transaction={editingTransaction}
        paymentMethods={paymentMethods}
        onSubmit={editingTransaction ? handleUpdate : handleCreate}
        loading={createMutation.isPending || updateMutation.isPending}
      />

      {/* Delete Confirmation */}
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
            </p>
            <div className="mt-4 flex justify-end gap-2">
              <Button variant="outline" onClick={() => setDeleteId(null)}>
                Cancelar
              </Button>
              <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
                Excluir
              </Button>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
