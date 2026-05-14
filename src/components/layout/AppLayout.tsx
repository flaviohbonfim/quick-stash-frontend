import { Outlet } from 'react-router-dom'
import {
  SidebarProvider,
  Sidebar,
  SidebarHeader,
  SidebarContent,
  SidebarMenu,
  SidebarMenuItem,
  SidebarMenuButton,
  useSidebar,
  SidebarInset,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Wallet, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Header } from './Header'

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
  const logout = useAuthStore((s) => s.logout)

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
          {navItems.map((item) => (
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

      {/* Bottom — Logout only (theme toggle is in Header) */}
      <div className="border-t p-2">
        <Button
          variant="ghost"
          size="icon"
          onClick={handleLogout}
          className="w-full text-destructive hover:text-destructive transition-colors duration-150 hover:bg-accent"
          title="Sair"
        >
          <LogOut className="h-4 w-4" />
        </Button>
      </div>
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
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
