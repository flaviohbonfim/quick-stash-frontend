import { useState, useEffect } from 'react'
import { Loader2, Eye, EyeOff, User, Shield } from 'lucide-react'
import { motion } from 'framer-motion'
import { useUser, useUpdateUser, useChangePassword } from '@/queries/useUser'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Separator } from '@/components/ui/separator'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Skeleton } from '@/components/ui/skeleton'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'

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

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function SettingsPage() {
  return (
    <motion.div
      variants={pageVariants}
      initial="hidden"
      animate="visible"
      className="p-6 space-y-6"
    >
      <motion.div variants={itemVariants}>
        <h1 className="text-3xl font-bold tracking-tight">Configurações</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Gerencie sua conta e preferências
        </p>
      </motion.div>

      <motion.div variants={itemVariants} className="grid gap-6 max-w-3xl">
        <ProfileSection />
        <PasswordSection />
      </motion.div>
    </motion.div>
  )
}

/* ─── Profile Section ─── */

function ProfileSection() {
  const { data: userData, isLoading: userLoading, status } = useUser()
  const updateMutation = useUpdateUser()
  const [editing, setEditing] = useState(false)
  const [name, setName] = useState('')
  const [email, setEmail] = useState('')

  useEffect(() => {
    if (userData) {
      setName(userData.name ?? '')
      setEmail(userData.email ?? '')
    }
  }, [userData])

  if (userLoading) {
    return (
      <Card className="border-primary/10 shadow-card">
        <CardHeader>
          <div className="flex items-center gap-3 mb-4">
            <Skeleton className="h-12 w-12 rounded-full" />
            <div>
              <Skeleton className="h-5 w-32 mb-2" />
              <Skeleton className="h-4 w-48" />
            </div>
          </div>
        </CardHeader>
        <CardContent className="space-y-4">
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <div className="space-y-2">
            <Skeleton className="h-4 w-20" />
            <Skeleton className="h-10 w-full" />
          </div>
          <Skeleton className="h-10 w-32" />
        </CardContent>
      </Card>
    )
  }

  if (status === 'error' || !userData) {
    return (
      <Card>
        <CardHeader>
          <CardTitle>Perfil</CardTitle>
          <CardDescription>
            Atualize suas informações pessoais
          </CardDescription>
        </CardHeader>
        <CardContent className="space-y-4">
          <p className="text-sm text-destructive">
            Erro ao carregar dados do perfil. Tente novamente.
          </p>
          <Button onClick={() => setName('')}>
            Tentar novamente
          </Button>
        </CardContent>
      </Card>
    )
  }

  const isEditing = editing
  const displayName = isEditing ? name : userData.name
  const displayEmail = isEditing ? email : userData.email

  const handleEdit = () => {
    setName(userData.name ?? '')
    setEmail(userData.email ?? '')
    setEditing(true)
  }

  const handleCancel = () => {
    setEditing(false)
  }

  const handleSave = () => {
    if (!name.trim() || !email.trim()) return
    updateMutation.mutate({ id: userData.id, name: name.trim(), email: email.trim() })
    setEditing(false)
  }

  const initials = displayName
    .split(' ')
    .map(n => n[0])
    .join('')
    .toUpperCase()
    .slice(0, 2)

  return (
    <Card className="border-primary/10 shadow-card">
      <CardHeader>
        <div className="flex items-center gap-4">
          <Avatar className="h-14 w-14 ring-2 ring-primary/20">
            <AvatarFallback className="bg-gradient-to-br from-primary to-[oklch(0.65_0.18_320)] text-primary-foreground font-semibold">
              {initials}
            </AvatarFallback>
          </Avatar>
          <div>
            <CardTitle className="flex items-center gap-2">
              <User className="h-5 w-5 text-primary" />
              Perfil
            </CardTitle>
            <CardDescription>
              Atualize suas informações pessoais
            </CardDescription>
          </div>
        </div>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="grid gap-2">
          <Label htmlFor="settings-name">Nome</Label>
          {isEditing ? (
            <Input
              id="settings-name"
              value={name}
              onChange={(e) => setName(e.target.value)}
              disabled={updateMutation.isPending}
            />
          ) : (
            <div className="h-10 flex items-center rounded-md border border-input px-3 text-sm bg-muted/30">
              {displayName}
            </div>
          )}
        </div>

        <div className="grid gap-2">
          <Label htmlFor="settings-email">E-mail</Label>
          {isEditing ? (
            <Input
              id="settings-email"
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              disabled={updateMutation.isPending}
            />
          ) : (
            <div className="h-10 flex items-center rounded-md border border-input px-3 text-sm bg-muted/30">
              {displayEmail}
            </div>
          )}
        </div>

        <Separator />

        <div className="flex gap-2">
          {isEditing ? (
            <>
              <Button
                onClick={handleSave}
                disabled={updateMutation.isPending || !name.trim() || !email.trim()}
                className="shadow-primary"
              >
                {updateMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Salvar
              </Button>
              <Button variant="outline" onClick={handleCancel} disabled={updateMutation.isPending}>
                Cancelar
              </Button>
            </>
          ) : (
            <Button onClick={handleEdit}>
              Editar Perfil
            </Button>
          )}
        </div>
      </CardContent>
    </Card>
  )
}

/* ─── Password Section ─── */

function PasswordSection() {
  const [showCurrent, setShowCurrent] = useState(false)
  const [showNew, setShowNew] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [currentPassword, setCurrentPassword] = useState('')
  const [newPassword, setNewPassword] = useState('')
  const [confirmPassword, setConfirmPassword] = useState('')
  const [errors, setErrors] = useState<Record<string, string>>({})
  const changeMutation = useChangePassword()

  const validate = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!currentPassword) {
      newErrors.currentPassword = 'Senha atual é obrigatória'
    }
    if (!newPassword) {
      newErrors.newPassword = 'Nova senha é obrigatória'
    } else if (newPassword.length < 8) {
      newErrors.newPassword = 'Senha deve ter pelo menos 8 caracteres'
    }
    if (!confirmPassword) {
      newErrors.confirmPassword = 'Confirmação de senha é obrigatória'
    } else if (newPassword !== confirmPassword) {
      newErrors.confirmPassword = 'As senhas não coincidem'
    }

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleChangePassword = () => {
    if (!validate()) return

    changeMutation.mutate(
      { old_password: currentPassword, new_password: newPassword },
      {
        onSuccess: () => {
          setCurrentPassword('')
          setNewPassword('')
          setConfirmPassword('')
          setErrors({})
        },
      }
    )
  }

  return (
    <Card className="border-primary/10 shadow-card">
      <CardHeader>
        <div className="flex items-center gap-2">
          <Shield className="h-5 w-5 text-primary" />
          <CardTitle>Senha</CardTitle>
        </div>
        <CardDescription>
          Altere sua senha de acesso
        </CardDescription>
      </CardHeader>
      <CardContent className="space-y-4">
        {/* Current password */}
        <div className="grid gap-2">
          <Label htmlFor="current-password">Senha atual</Label>
          <div className="relative">
            <Input
              id="current-password"
              type={showCurrent ? 'text' : 'password'}
              value={currentPassword}
              onChange={(e) => setCurrentPassword(e.target.value)}
              placeholder="••••••••"
              disabled={changeMutation.isPending}
              className={errors.currentPassword ? 'border-destructive' : ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowCurrent(!showCurrent)}
            >
              {showCurrent ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.currentPassword && (
            <p className="text-sm text-destructive">{errors.currentPassword}</p>
          )}
        </div>

        <Separator />

        {/* New password */}
        <div className="grid gap-2">
          <Label htmlFor="new-password">Nova senha</Label>
          <div className="relative">
            <Input
              id="new-password"
              type={showNew ? 'text' : 'password'}
              value={newPassword}
              onChange={(e) => setNewPassword(e.target.value)}
              placeholder="••••••••"
              disabled={changeMutation.isPending}
              className={errors.newPassword ? 'border-destructive' : ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowNew(!showNew)}
            >
              {showNew ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.newPassword && (
            <p className="text-sm text-destructive">{errors.newPassword}</p>
          )}
        </div>

        {/* Confirm password */}
        <div className="grid gap-2">
          <Label htmlFor="confirm-password">Confirmar nova senha</Label>
          <div className="relative">
            <Input
              id="confirm-password"
              type={showConfirm ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(e) => setConfirmPassword(e.target.value)}
              placeholder="••••••••"
              disabled={changeMutation.isPending}
              className={errors.confirmPassword ? 'border-destructive' : ''}
            />
            <Button
              type="button"
              variant="ghost"
              size="icon"
              className="absolute right-0 top-0 h-full px-3"
              onClick={() => setShowConfirm(!showConfirm)}
            >
              {showConfirm ? (
                <EyeOff className="h-4 w-4 text-muted-foreground" />
              ) : (
                <Eye className="h-4 w-4 text-muted-foreground" />
              )}
            </Button>
          </div>
          {errors.confirmPassword && (
            <p className="text-sm text-destructive">{errors.confirmPassword}</p>
          )}
        </div>

        <Separator />

        <Button
          onClick={handleChangePassword}
          disabled={changeMutation.isPending || !currentPassword || !newPassword || !confirmPassword}
          className="shadow-primary"
        >
          {changeMutation.isPending && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
          Alterar Senha
        </Button>
      </CardContent>
    </Card>
  )
}
