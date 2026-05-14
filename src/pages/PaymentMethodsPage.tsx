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
import { toast } from 'sonner'
import { CurrencyFormat } from '@/components/common/CurrencyFormat'
import { EmptyState } from '@/components/common/EmptyState'
import type { PaymentMethod } from '@/types/transactions'

export default function PaymentMethodsPage() {
  const { data } = usePaymentMethods()
  const createMutation = useCreatePaymentMethod()
  const deleteMutation = useDeletePaymentMethod()

  const paymentMethods = Array.isArray(data) ? data : (data?.data || [])

  const [formOpen, setFormOpen] = useState(false)
  const [deleteId, setDeleteId] = useState<string | null>(null)
  const [newName, setNewName] = useState('')
  const [newType, setNewType] = useState<'PIX' | 'CREDIT_CARD'>('PIX')

  const handleCreate = async () => {
    if (!newName.trim()) {
      toast.error('Nome é obrigatório')
      return
    }
    try {
      await createMutation.mutateAsync({ name: newName, type: newType })
      toast.success('Conta criada com sucesso!')
      setFormOpen(false)
      setNewName('')
      setNewType('PIX')
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      toast.error(axiosError.response?.data?.detail || 'Erro ao criar conta')
    }
  }

  const handleDelete = async (id: string) => {
    try {
      await deleteMutation.mutateAsync(id)
      toast.success('Conta excluída com sucesso!')
      setDeleteId(null)
    } catch (error: unknown) {
      const axiosError = error as { response?: { data?: { detail?: string } } }
      toast.error(axiosError.response?.data?.detail || 'Erro ao excluir conta')
    }
  }

  return (
    <div className="p-6 space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h1 className="text-3xl font-bold">Contas</h1>
          <p className="mt-2 text-muted-foreground">
            Gerencie seus meios de pagamento
          </p>
        </div>
        <Button onClick={() => setFormOpen(true)}>
          <Plus className="mr-2 h-4 w-4" />
          Nova Conta
        </Button>
      </div>

      {paymentMethods.length === 0 ? (
        <EmptyState
          title="Nenhuma conta cadastrada"
          description="Comece adicionando sua primeira conta."
          actionLabel="Nova Conta"
          onAction={() => setFormOpen(true)}
        />
      ) : (
        <div className="grid gap-4 md:grid-cols-2 lg:grid-cols-3">
          {paymentMethods.map((pm: PaymentMethod) => (
            <Card key={pm.id}>
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
          ))}
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
                  <SelectValue placeholder="Selecione o tipo" />
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
      {deleteId && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/50">
          <div className="w-full max-w-sm rounded-lg bg-card p-6 shadow-lg">
            <h3 className="text-lg font-semibold">Confirmar exclusão</h3>
            <p className="mt-2 text-sm text-muted-foreground">
              Tem certeza que deseja excluir esta conta? Esta ação não pode ser desfeita.
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
