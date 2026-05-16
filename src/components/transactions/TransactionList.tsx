import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { useTransactions, useCreateTransaction, useUpdateTransaction, useDeleteTransaction } from '@/queries/useTransactions'
import { usePaymentMethods } from '@/queries/usePaymentMethods'
import { Button } from '@/components/ui/button'
import { TransactionFilters, type TransactionFilters as FiltersType } from './TransactionFilters'
import { TransactionTable } from './TransactionTable'
import { TransactionForm } from './TransactionForm'
import { EmptyState } from '@/components/common/EmptyState'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Pagination,
  PaginationContent,
  PaginationEllipsis,
  PaginationItem,
  PaginationLink,
  PaginationNext,
  PaginationPrevious,
} from '@/components/ui/pagination'
import type { Transaction } from '@/types/transactions'
import { motion, AnimatePresence } from 'framer-motion'

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.08,
      delayChildren: 0.1,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 16 },
  visible: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.4,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  },
}

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
    <motion.div
      variants={containerVariants}
      initial="hidden"
      animate="visible"
      className="space-y-6"
    >
      {/* Header */}
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Transações</h1>
          <p className="mt-1 text-sm text-muted-foreground">Gerencie suas receitas e despesas</p>
        </div>
        <Button
          onClick={() => {
            setEditingTransaction(null)
            setFormOpen(true)
          }}
          className="shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Transação
        </Button>
      </motion.div>

      {/* Filters */}
      <motion.div variants={itemVariants}>
        <TransactionFilters
          onFilter={setFilters}
          paymentMethods={paymentMethods}
        />
      </motion.div>

      {/* Table or Empty State */}
      {transactions.length > 0 ? (
        <>
          <TransactionTable
            transactions={transactions}
            loading={isLoading}
            onEdit={handleEdit}
            onDelete={handleDeleteClick}
            paymentMethods={paymentMethods}
          />

          {/* Pagination */}
          {totalPages > 1 && (
            <div className="flex flex-col items-center gap-3 sm:flex-row sm:items-center sm:justify-between">
              <p className="text-sm text-muted-foreground">
                Mostrando {(page - 1) * limit + 1} a {Math.min(page * limit, total)} de {total} transações
              </p>
              <Pagination>
                <PaginationContent>
                  <PaginationItem>
                    <PaginationPrevious
                      onClick={() => setPage(p => Math.max(1, p - 1))}
                      disabled={page === 1}
                    />
                  </PaginationItem>

                  {/* Show first page */}
                  {page > 2 && (
                    <>
                      <PaginationItem>
                        <PaginationLink onClick={() => setPage(1)}>1</PaginationLink>
                      </PaginationItem>
                      {page > 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                    </>
                  )}

                  {/* Show pages around current */}
                  {Array.from({ length: Math.min(5, totalPages) }, (_, i) => {
                    let pageNum: number
                    if (totalPages <= 5) {
                      pageNum = i + 1
                    } else if (page <= 3) {
                      pageNum = i + 1
                    } else if (page >= totalPages - 2) {
                      pageNum = totalPages - 4 + i
                    } else {
                      pageNum = page - 2 + i
                    }
                    return (
                      <PaginationItem key={pageNum}>
                        <PaginationLink isActive={pageNum === page} onClick={() => setPage(pageNum)}>
                          {pageNum}
                        </PaginationLink>
                      </PaginationItem>
                    )
                  })}

                  {/* Show last page */}
                  {page < totalPages - 2 && (
                    <>
                      {page < totalPages - 3 && (
                        <PaginationItem>
                          <PaginationEllipsis />
                        </PaginationItem>
                      )}
                      <PaginationItem>
                        <PaginationLink onClick={() => setPage(totalPages)}>{totalPages}</PaginationLink>
                      </PaginationItem>
                    </>
                  )}

                  <PaginationItem>
                    <PaginationNext
                      onClick={() => setPage(p => Math.min(totalPages, p + 1))}
                      disabled={page === totalPages}
                    />
                  </PaginationItem>
                </PaginationContent>
              </Pagination>
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
      <AnimatePresence>
        {deleteId && (
          <Dialog open={!!deleteId} onOpenChange={(open) => !open && setDeleteId(null)}>
            <DialogContent className="sm:max-w-[400px]">
              <DialogHeader>
                <DialogTitle className="flex items-center gap-2">
                  <Trash2 className="h-5 w-5 text-destructive" />
                  Confirmar exclusão
                </DialogTitle>
                <DialogDescription>
                  Tem certeza que deseja excluir esta transação? Esta ação não pode ser desfeita.
                </DialogDescription>
              </DialogHeader>
              <DialogFooter className="gap-2 sm:gap-0">
                <Button variant="outline" onClick={() => setDeleteId(null)}>
                  Cancelar
                </Button>
                <Button variant="destructive" onClick={() => handleDelete(deleteId)}>
                  Excluir
                </Button>
              </DialogFooter>
            </DialogContent>
          </Dialog>
        )}
      </AnimatePresence>
    </motion.div>
  )
}
