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
  SidebarRail,
} from '@/components/ui/sidebar'
import { useAuthStore } from '@/stores/authStore'
import { useNavigate, useLocation } from 'react-router-dom'
import { LayoutDashboard, CreditCard, Wallet, Settings, LogOut } from 'lucide-react'
import { Button } from '@/components/ui/button'
import { cn } from '@/lib/utils'
import { Header } from './Header'
import { motion } from 'framer-motion'

const sidebarItemVariants = {
  hidden: { opacity: 0, x: -12 },
  visible: (i: number) => ({
    opacity: 1,
    x: 0,
    transition: {
      delay: i * 0.05,
      duration: 0.3,
      ease: [0.22, 1, 0.36, 1] as [number, number, number, number],
    },
  }),
}

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

  const isActive = (path: string) => location.pathname === path

  return (
    <>
      <SidebarHeader className="flex h-14 items-center px-3">
        {state !== 'collapsed' ? (
          <div className="flex items-center gap-2.5">
            <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.65_0.18_320)] shadow-[0_4px_14px_oklch(0.55_0.22_295/_0.25)]">
              <Wallet className="h-4 w-4 text-primary-foreground" />
            </div>
            <span className="font-['Syne'] bg-gradient-to-r from-primary to-[oklch(0.65_0.18_320)] bg-clip-text text-lg font-bold text-transparent">
              Quick Stash
            </span>
          </div>
        ) : (
          <div className="flex h-8 w-8 shrink-0 items-center justify-center rounded-lg bg-gradient-to-br from-primary to-[oklch(0.65_0.18_320)]">
            <Wallet className="h-4 w-4 text-primary-foreground" />
          </div>
        )}
      </SidebarHeader>

      <SidebarContent className="px-2 py-2">
        <SidebarMenu>
          {navItems.map((item, i) => (
            <SidebarMenuItem key={item.path}>
              <motion.div variants={sidebarItemVariants} custom={i}>
                <SidebarMenuButton
                  isActive={isActive(item.path)}
                  tooltip={item.label}
                  onClick={() => navigate(item.path)}
                  className={cn(
                    "group/menu-item relative h-9 rounded-md transition-all duration-200",
                    isActive(item.path) && "bg-[var(--sidebar-accent)]"
                  )}
                >
                  {/* Active indicator bar */}
                  {isActive(item.path) && (
                    <div
                      className={cn(
                        "absolute left-0 top-1/2 h-5 w-[3px] -translate-y-1/2 rounded-r-full bg-[var(--sidebar-active-border)] transition-all duration-200",
                        state === 'collapsed' && "opacity-0"
                      )}
                    />
                  )}
                  <item.icon className={cn(
                    "h-4 w-4 shrink-0 transition-colors duration-200",
                    !isActive(item.path) && "text-sidebar-foreground/50",
                    isActive(item.path) && "text-[var(--sidebar-accent-foreground)]"
                  )} />
                  <span className={cn(
                    "text-sm transition-colors duration-200",
                    !isActive(item.path) && "text-sidebar-foreground/70",
                    isActive(item.path) && "font-medium text-[var(--sidebar-accent-foreground)]"
                  )}>{item.label}</span>
                </SidebarMenuButton>
              </motion.div>
            </SidebarMenuItem>
          ))}
        </SidebarMenu>
      </SidebarContent>

      {/* Bottom — Logout */}
      <div className="mt-auto px-2 pb-3">
        <Button
          variant="ghost"
          size="sm"
          onClick={handleLogout}
          className={cn(
            "w-full justify-start gap-2 text-muted-foreground/60 hover:text-destructive",
            "hover:bg-destructive/10 transition-all duration-200",
            state === 'collapsed' && "justify-center px-2"
          )}
          aria-label="Sair da conta"
        >
          <LogOut className="h-4 w-4 shrink-0" />
          {state !== 'collapsed' && <span className="text-sm">Sair</span>}
        </Button>
      </div>
    </>
  )
}

export function AppLayout() {
  return (
    <SidebarProvider defaultOpen={true}>
      <Sidebar variant="sidebar" collapsible="icon" className="border-r" style={{ borderColor: 'var(--panel-border)', boxShadow: 'var(--panel-shadow)' }}>
        <SidebarNav />
        <SidebarRail />
      </Sidebar>
      <SidebarInset className="bg-background">
        <Header />
        <main className="flex-1 overflow-auto p-4 md:p-6 lg:p-8">
          <div className="mx-auto max-w-7xl">
            <Outlet />
          </div>
        </main>
      </SidebarInset>
    </SidebarProvider>
  )
}
