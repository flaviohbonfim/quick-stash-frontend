import { useState } from 'react'
import { Plus, Trash2 } from 'lucide-react'
import { usePaymentMethods, useCreatePaymentMethod, useDeletePaymentMethod } from '@/queries/usePaymentMethods'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Input } from '@/components/ui/input'
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
} from '@/components/ui/dialog'
import {
  Select,
  SelectContent,
  SelectItem,
  SelectTrigger,
  SelectValue,
} from '@/components/ui/select'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { EmptyState } from '@/components/common/EmptyState'
import { motion, AnimatePresence } from 'framer-motion'
import type { PaymentMethod } from '@/types/transactions'

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

const cardVariants = {
  hidden: { opacity: 0, y: 20, scale: 0.97 },
  visible: (i: number) => ({
    opacity: 1,
    y: 0,
    scale: 1,
    transition: {
      delay: i * 0.06,
      duration: 0.35,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
  exit: { opacity: 0, scale: 0.95, transition: { duration: 0.15 } },
}

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function PaymentMethodsPage() {
  const { data } = usePaymentMethods()
  const createMutation = useCreatePaymentMethod()
  const deleteMutation = useDeletePaymentMethod()

  const paymentMethods = Array.isArray(data) ? data : (data || [])

  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'PIX' | 'CREDIT_CARD'>('PIX')

  const typeLabel = (value: 'PIX' | 'CREDIT_CARD') =>
    value === 'CREDIT_CARD' ? 'Cartão de Crédito' : 'PIX'

  const handleCreate = () => {
    if (!newName.trim()) {
      return
    }
    createMutation.mutate(
      { name: newName, type: newType },
      {
        onSuccess: () => {
          setFormOpen(false)
          setNewName('')
          setNewType('PIX')
        },
      }
    )
  }

  const handleDelete = (id: string) => {
    deleteMutation.mutate(id, {
      onSuccess: () => setDeleteId(null),
    })
  }

  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={itemVariants} className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold tracking-tight">Contas</h1>
          <p className="mt-1 text-sm text-muted-foreground">
            Gerencie seus meios de pagamento
          </p>
        </div>
        <Button
          onClick={() => setFormOpen(true)}
          className="shadow-primary"
        >
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </motion.div>

      {paymentMethods.length === 0 ? (
        <EmptyState
          title="Nenhuma conta cadastrada"
          description="Comece adicionando sua primeira conta."
          actionLabel="Nova Conta"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          <AnimatePresence>
            {paymentMethods.map((pm: PaymentMethod, i: number) => (
              <motion.div
                key={pm.id}
                custom={i}
                variants={cardVariants}
                initial="hidden"
                animate="visible"
                exit="exit"
                whileHover={{ scale: 1.02, transition: { duration: 0.15 } }}
              >
                <Card className={`border transition-all duration-200 ${
                  pm.type === 'CREDIT_CARD'
                    ? 'border-primary/20 bg-gradient-to-br from-primary/5 to-transparent shadow-card hover:shadow-card-hover'
                    : 'border-primary/10 bg-gradient-to-br from-primary/3 to-transparent shadow-card hover:shadow-card-hover'
                }`}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{pm.name}</CardTitle>
                <Badge variant={pm.type === 'CREDIT_CARD' ? 'destructive' : 'outline'}>
                  {pm.type === 'CREDIT_CARD' ? 'Cartão' : 'PIX'}
                </Badge>
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">
                  <CurrencyFormat value={pm.balance} />
                </div>
                <p className="mt-1 text-xs text-muted-foreground">
                  Criada em {new Date(pm.created_at).toLocaleDateString('pt-BR')}
                </p>
                <Button
                  variant="ghost"
                  size="sm"
                  className="mt-2 text-destructive hover:text-destructive"
                  onClick={() => setDeleteId(pm.id)}
                >
                  <Trash2 className="mr-2 h-4 w-4" />
                  Excluir
                </Button>
              </CardContent>
            </Card>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      )}

      {/* Create Dialog */}
      <Dialog open={formOpen} onOpenChange={setFormOpen}>
        <DialogContent>
          <DialogHeader>
            <DialogTitle>Nova Conta</DialogTitle>
            <DialogDescription>
              Adicione um novo meio de pagamento.
            </DialogDescription>
          </DialogHeader>
          <div className="space-y-4">
            <div className="space-y-2">
              <label className="text-sm font-medium" htmlFor="name">
                Nome
              </label>
              <Input
                id="name"
                placeholder="Ex: Nubank, Inter, etc."
                value={newName}
                onChange={(e) => setNewName(e.target.value)}
              />
            </div>
            <div className="space-y-2">
              <label className="text-sm font-medium">Tipo</label>
              <Select value={newType} onValueChange={(v) => setNewType(v as 'PIX' | 'CREDIT_CARD')}>
                <SelectTrigger>
                  <SelectValue>{newType ? typeLabel(newType) : 'Selecione o tipo'}</SelectValue>
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="PIX">PIX</SelectItem>
                  <SelectItem value="CREDIT_CARD">Cartão de Crédito</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </div>
          <DialogFooter>
            <Button variant="outline" onClick={() => setFormOpen(false)}>
              Cancelar
            </Button>
            <Button onClick={handleCreate} disabled={createMutation.isPending}>
              {createMutation.isPending ? 'Criando...' : 'Criar'}
            </Button>
          </DialogFooter>
        </DialogContent>
      </Dialog>

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
                  Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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
