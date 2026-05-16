interface LoadingSpinnerProps {
  className?: string
  size?: 'sm' | 'md' | 'lg'
}

const sizeMap = {
  sm: 'h-5 w-5',
  md: 'h-8 w-8',
  lg: 'h-12 w-12',
}

export function LoadingSpinner({ className, size = 'md' }: LoadingSpinnerProps) {
  return (
    <div className={`flex items-center justify-center ${className}`}>
      <div
        className={`${sizeMap[size]} animate-spin rounded-full border-4 border-primary/20 border-t-primary`}
        style={{
          boxShadow: '0 0 12px oklch(0.55 0.22 295 / 0.3)',
        }}
      />
    </div>
  )
}
