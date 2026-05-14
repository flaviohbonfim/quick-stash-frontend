import { Component, type ErrorInfo, type ReactNode } from 'react'

interface ErrorBoundaryProps {
  children: ReactNode
  fallback?: ReactNode
}

interface ErrorBoundaryState {
  hasError: boolean
  error: Error | null
}

export class ErrorBoundary extends Component<ErrorBoundaryProps, ErrorBoundaryState> {
  constructor(props: ErrorBoundaryProps) {
    super(props)
    this.state = { hasError: false, error: null }
  }

  static getDerivedStateFromError(error: Error): ErrorBoundaryState {
    return { hasError: true, error }
  }

  componentDidCatch(error: Error, errorInfo: ErrorInfo) {
    console.error('ErrorBoundary caught an error:', error, errorInfo)
  }

  render() {
    if (this.state.hasError) {
      return (
        this.props.fallback || (
          <div className="flex min-h-screen items-center justify-center bg-background p-4">
            <div className="max-w-md text-center">
              <h1 className="text-2xl font-bold text-destructive">Algo deu errado</h1>
              <p className="mt-2 text-muted-foreground">
                {this.state.error?.message || 'Ocorreu um erro inesperado.'}
              </p>
              <button
                className="mt-4 rounded-md bg-primary px-4 py-2 text-primary-foreground hover:bg-primary/90"
                onClick={() => this.setState({ hasError: false, error: null })}
              >
                Tentar novamente
              </button>
            </div>
          </div>
        )
      )
    }

    return this.props.children
  }
}
