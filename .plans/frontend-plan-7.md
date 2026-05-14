# 📋 Frontend Plan — Etapa 7/10: Layout (Sidebar, Header, AppLayout)

> **Plano original:** [frontend-plan.md](./frontend-plan.md)
> **Etapa anterior:** [Etapa 6 — TanStack Query Hooks](./frontend-plan-6.md)
> **Fase correspondente:** Fase 3 — Dashboard (preparação)
> **Duração estimada:** 1 dia

---

## 🎯 Objetivo desta etapa

Implementar o layout principal da aplicação: Sidebar (desktop + mobile), Header, e o AppLayout wrapper. Esta etapa define a estrutura visual que envolve todas as páginas internas.

---

## 📦 O que será entregue

### 7.1 — Sidebar Desktop

**`src/components/layout/Sidebar.tsx`:**

```typescript
import { cn } from '@/lib/utils';
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Settings,
  ChevronLeft,
  ChevronRight,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Tooltip,
  TooltipContent,
  TooltipProvider,
  TooltipTrigger,
} from '@/components/ui/tooltip';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transações', icon: CreditCard, path: '/transactions' },
  { label: 'Contas', icon: Wallet, path: '/payment-methods' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

interface SidebarProps {
  collapsed: boolean;
  onToggle: () => void;
}

export function Sidebar({ collapsed, onToggle }: SidebarProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <aside
      className={cn(
        'flex h-screen flex-col border-r bg-card transition-all duration-300',
        collapsed ? 'w-16' : 'w-64'
      )}
    >
      {/* Logo */}
      <div className="flex h-14 items-center border-b px-4">
        {!collapsed && (
          <span className="text-lg font-bold text-foreground">Quick Stash</span>
        )}
        <div className="ml-auto">
          <Button variant="ghost" size="icon" onClick={onToggle}>
            {collapsed ? <ChevronRight size={16} /> : <ChevronLeft size={16} />}
          </Button>
        </div>
      </div>

      {/* Nav */}
      <nav className="flex-1 space-y-1 p-2">
        <TooltipProvider delayDuration={0}>
          {navItems.map((item) => (
            <Tooltip key={item.path}>
              <TooltipTrigger asChild>
                <Button
                  variant={location.pathname === item.path ? 'secondary' : 'ghost'}
                  className={cn('w-full justify-start gap-2', collapsed && 'justify-center px-0')}
                  onClick={() => navigate(item.path)}
                >
                  <item.icon size={18} />
                  {!collapsed && <span>{item.label}</span>}
                </Button>
              </TooltipTrigger>
              {collapsed && <TooltipContent side="right">{item.label}</TooltipContent>}
            </Tooltip>
          ))}
        </TooltipProvider>
      </nav>

      {/* Bottom — Logout */}
      <div className="border-t p-2">
        <TooltipProvider delayDuration={0}>
          <Tooltip>
            <TooltipTrigger asChild>
              <Button
                variant="ghost"
                className={cn(
                  'w-full justify-start gap-2 text-destructive',
                  collapsed && 'justify-center px-0'
                )}
                onClick={handleLogout}
              >
                <LogOut size={18} />
                {!collapsed && <span>Sair</span>}
              </Button>
            </TooltipTrigger>
            {collapsed && <TooltipContent side="right">Sair</TooltipContent>}
          </Tooltip>
        </TooltipProvider>
      </div>
    </aside>
  );
}
```

### 7.2 — Sidebar Mobile (Drawer com Sheet)

**`src/components/layout/SidebarMobile.tsx`:**

```typescript
import {
  LayoutDashboard,
  CreditCard,
  Wallet,
  Settings,
  LogOut,
} from 'lucide-react';
import { useNavigate, useLocation } from 'react-router-dom';
import { useAuthStore } from '@/stores/authStore';
import { Button } from '@/components/ui/button';
import {
  Sheet,
  SheetContent,
  SheetHeader,
  SheetTitle,
} from '@/components/ui/sheet';

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transações', icon: CreditCard, path: '/transactions' },
  { label: 'Contas', icon: Wallet, path: '/payment-methods' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
];

interface SidebarMobileProps {
  open: boolean;
  onClose: () => void;
}

export function SidebarMobile({ open, onClose }: SidebarMobileProps) {
  const navigate = useNavigate();
  const location = useLocation();
  const logout = useAuthStore((state) => state.logout);

  const handleNavigate = (path: string) => {
    navigate(path);
    onClose();
  };

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <Sheet open={open} onOpenChange={onClose}>
      <SheetContent side="left" className="w-64 p-0">
        <SheetHeader className="border-b px-4 py-3">
          <SheetTitle>Quick Stash</SheetTitle>
        </SheetHeader>
        <nav className="flex-1 space-y-1 p-2">
          {navItems.map((item) => (
            <Button
              key={item.path}
              variant={location.pathname === item.path ? 'secondary' : 'ghost'}
              className="w-full justify-start gap-2"
              onClick={() => handleNavigate(item.path)}
            >
              <item.icon size={18} />
              <span>{item.label}</span>
            </Button>
          ))}
        </nav>
        <div className="border-t p-2">
          <Button variant="ghost" className="w-full justify-start gap-2 text-destructive" onClick={handleLogout}>
            <LogOut size={18} />
            <span>Sair</span>
          </Button>
        </div>
      </SheetContent>
    </Sheet>
  );
}
```

### 7.3 — Header

**`src/components/layout/Header.tsx`:**

```typescript
import { Menu, Moon, Sun, User } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useThemeStore } from '@/stores/themeStore';
import { useAuthStore } from '@/stores/authStore';
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuLabel,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from '@/components/ui/dropdown-menu';
import { Avatar, AvatarFallback } from '@/components/ui/avatar';

interface HeaderProps {
  onMenuClick: () => void;
}

export function Header({ onMenuClick }: HeaderProps) {
  const theme = useThemeStore((state) => state.theme);
  const toggleTheme = useThemeStore((state) => state.toggleTheme);
  const user = useAuthStore((state) => state.user);
  const logout = useAuthStore((state) => state.logout);

  const getInitials = () => {
    if (!user?.name) return 'U';
    return user.name.split(' ').map((n) => n[0]).join('').toUpperCase().slice(0, 2);
  };

  return (
    <header className="flex h-14 items-center border-b bg-card px-4">
      {/* Mobile hamburger */}
      <Button variant="ghost" size="icon" className="md:hidden" onClick={onMenuClick}>
        <Menu size={20} />
      </Button>

      <div className="ml-auto flex items-center gap-2">
        {/* Theme toggle */}
        <Button variant="ghost" size="icon" onClick={toggleTheme}>
          {theme === 'dark' ? <Sun size={18} /> : <Moon size={18} />}
        </Button>

        {/* User menu */}
        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button variant="ghost" className="relative h-8 w-8 rounded-full">
              <Avatar className="h-8 w-8">
                <AvatarFallback>{getInitials()}</AvatarFallback>
              </Avatar>
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end">
            <DropdownMenuLabel>{user?.name || 'Usuário'}</DropdownMenuLabel>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={() => {}}>
              <User size={16} className="mr-2" />
              Perfil
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem onClick={logout} className="text-destructive">
              <LogOut size={16} className="mr-2" />
              Sair
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
```

*Nota: importar `LogOut` do `lucide-react` no Header também.*

### 7.4 — AppLayout

**`src/components/layout/AppLayout.tsx`:**

```typescript
import { useState } from 'react';
import { cn } from '@/lib/utils';
import { Sidebar } from './Sidebar';
import { SidebarMobile } from './SidebarMobile';
import { Header } from './Header';
import { Outlet } from 'react-router-dom';

export function AppLayout() {
  const [sidebarCollapsed, setSidebarCollapsed] = useState(false);
  const [mobileOpen, setMobileOpen] = useState(false);

  return (
    <div className="flex h-screen bg-background">
      {/* Desktop Sidebar */}
      <div className={cn('hidden md:block', sidebarCollapsed ? 'w-16' : 'w-64')}>
        <Sidebar collapsed={sidebarCollapsed} onToggle={() => setSidebarCollapsed((v) => !v)} />
      </div>

      {/* Mobile Sidebar (Drawer) */}
      <SidebarMobile open={mobileOpen} onClose={() => setMobileOpen(false)} />

      {/* Main Content */}
      <div className="flex flex-1 flex-col overflow-hidden">
        {/* Header */}
        <Header onMenuClick={() => setMobileOpen(true)} />

        {/* Page Content */}
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </div>
    </div>
  );
}
```

### 7.5 — Atualizar Rotas com AppLayout

Atualizar `src/routes/index.tsx` para envolver as rotas protegidas com `<AppLayout>`:

```typescript
{
  path: '/',
  element: (
    <ProtectedRoute>
      <AppLayout />
    </ProtectedRoute>
  ),
  children: [
    { index: true, element: <DashboardPage /> },
    { path: 'transactions', element: <TransactionsPage /> },
    { path: 'payment-methods', element: <PaymentMethodsPage /> },
    { path: 'settings', element: <SettingsPage /> },
  ],
},
```

---

## ✅ Critérios de Validação

- [ ] `npm run build` compila sem erros
- [ ] Sidebar desktop aparece em telas ≥ 768px
- [ ] Sidebar colapsa/recolhe ao clicar no botão de seta
- [ ] Tooltip aparece quando sidebar está colapsada
- [ ] Navegação entre rotas funciona via sidebar
- [ ] Botão "Sair" faz logout e redireciona para `/login`
- [ ] Sidebar mobile (Sheet) abre ao clicar no hamburger menu em telas < 768px
- [ ] Sidebar mobile fecha ao clicar em um item de navegação
- [ ] Header aparece no topo com theme toggle e user menu
- [ ] Theme toggle alterna entre dark/light
- [ ] Avatar mostra iniciais do nome do usuário
- [ ] Dropdown menu do usuário funciona
- [ ] Logout pelo header funciona
- [ ] Layout é responsivo (testar em diferentes tamanhos de tela)

### Teste Manual de Responsividade

1. **Desktop (>1024px):** Sidebar expandida, header com theme toggle e avatar
2. **Tablet (768-1024px):** Sidebar colapsada automaticamente
3. **Mobile (<768px):** Sidebar oculta, hamburger menu abre drawer

---

## 🔗 Links com o Plano Original

| Item | Referência |
|------|-----------|
| Sidebar com toggle | [Plano §6](./frontend-plan.md#6-sidebar-com-opção-de-recolher) |
| Mobile drawer (Sheet) | [Plano §6 — SidebarMobile](./frontend-plan.md#6-sidebar-com-opção-de-recolher) |
| Responsividade | [Plano §11](./frontend-plan.md#11-responsividade) |
| Layout base | [Plano §1 — `components/layout/`](./frontend-plan.md#1-arquitetura-de-pastas) |
| Theme store | [Etapa 2](./frontend-plan-2.md) |
| Auth store | [Etapa 2](./frontend-plan-2.md) |

---

## ⚠️ Notas

- Sidebar usa `TooltipProvider` para tooltips em modo colapsado
- Mobile usa `Sheet` do shadcn (drawer)
- `AppLayout` usa `Outlet` do React Router para renderizar as children
- Breakpoints seguem Tailwind: `sm:640px`, `md:768px`, `lg:1024px`
- Estado do sidebar (collapsed) é local ao `AppLayout`
- Estado do mobile drawer é local ao `AppLayout`
