import { createBrowserRouter } from 'react-router-dom'
import { lazy, Suspense } from 'react'
import { AnimatePresence } from 'framer-motion'
import { LoadingSpinner } from '@/components/common/LoadingSpinner'
import { AppLayout } from '@/components/layout/AppLayout'
import { ProtectedRoute } from './ProtectedRoute'
import { PageTransition } from '@/components/common/PageTransition'

const LoginPage = lazy(() => import('@/pages/LoginPage'))
const RegisterPage = lazy(() => import('@/pages/RegisterPage'))
const DashboardPage = lazy(() => import('@/pages/DashboardPage'))
const TransactionsPage = lazy(() => import('@/pages/TransactionsPage'))
const PaymentMethodsPage = lazy(() => import('@/pages/PaymentMethodsPage'))
const SettingsPage = lazy(() => import('@/pages/SettingsPage'))

export const router = createBrowserRouter([
  {
    path: '/login',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <LoginPage />
      </Suspense>
    ),
  },
  {
    path: '/register',
    element: (
      <Suspense fallback={<LoadingSpinner />}>
        <RegisterPage />
      </Suspense>
    ),
  },
  {
    path: '/',
    element: <ProtectedRoute />,
    children: [
      {
        element: <AppLayout />,
        children: [
          {
            element: (
              <AnimatePresence mode="wait">
                <PageTransition />
              </AnimatePresence>
            ),
            children: [
              {
                index: true,
                element: <DashboardPage />,
              },
              {
                path: 'transactions',
                element: <TransactionsPage />,
              },
              {
                path: 'payment-methods',
                element: <PaymentMethodsPage />,
              },
              {
                path: 'settings',
                element: <SettingsPage />,
              },
            ],
          },
        ],
      },
    ],
  },
])
