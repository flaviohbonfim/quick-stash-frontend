import { Outlet } from 'react-router-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarFooter,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarInset,
  SidebarTrigger,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/authStore'
import { useTheme } from '@/hooks/useTheme'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Wallet, Settings, LogOut, Moon, Sun } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'

const navItems = [
  { label: 'Dashboard', icon: LayoutDashboard, path: '/' },
  { label: 'Transações', icon: CreditCard, path: '/transactions' },
  { label: 'Contas', icon: Wallet, path: '/payment-methods' },
  { label: 'Configurações', icon: Settings, path: '/settings' },
]

function SidebarNav() {
  const navigate = useNavigate()
  const location = useLocation()
  const { state } = useSidebar()
  const logout = useAuthStore(s => s.logout)
  const { theme, toggleTheme } = useTheme()

  const handleLogout = () => {
    logout()
    navigate('/login')
  }

  return (
    <>
      <SidebarHeader className="flex h-14 items-center border-b px-2">
        {state !== 'collapsed' && (
          <span className="text-lg font-bold">Quick Stash</span>
        )}
      </SidebarHeader>

      <SidebarContent>
        <SidebarMenu>
          {navItems.map(item => (
            <SidebarMenuItem key={item.path}>
              <SidebarMenuButton
                isActive={location.pathname === item.path}
                tooltip={item.label}
                onClick={() => navigate(item.path)}
                className={cn(
                  'transition-colors duration-150',
                  'hover:bg-accent hover:text-accent-foreground',
                  'data-[active=true]:bg-accent data-[active=true]:text-accent-foreground data-[active=true]:font-medium',
                )}
              >
                <item.icon className="h-4 w-4" />
                <span>{item.label}</span>
              </SidebarMenuButton>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      <SidebarFooter className="border-t p-2">
        <div className="flex gap-2">
          <Button
            variant="ghost"
            size="icon"
            onClick={toggleTheme}
            className="flex-1 transition-colors duration-150 hover:bg-accent hover:text-accent-foreground"
            title={theme === 'dark' ? 'Modo claro' : 'Modo escuro'}
          >
            {theme === 'dark' ? <Sun className="h-4 w-4" /> : <Moon className="h-4 w-4" />}
          </Button>
          <Button
            variant="ghost"
            size="icon"
            onClick={handleLogout}
            className="flex-1 text-destructive hover:text-destructive transition-colors duration-150 hover:bg-accent"
            title="Sair"
          >
            <LogOut className="h-4 w-4" />
          </Button>
        </div>
      </SidebarFooter>
    </>
  )
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="inset" collapsible="icon">
        <SidebarNav />
      </Sidebar>
      <SidebarInset>
        <div className="flex items-center gap-2 border-b px-4 py-2">
          <SidebarTrigger />
        </div>
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
