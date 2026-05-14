export function CurrencyFormat({ value, className }: { value: number; className?: string }) {
  return (
    <span className={className}>
      {new Intl.NumberFormat('pt-BR', {
        style: 'currency',
        currency: 'BRL',
      }).format(value)}
    </span>
  )
}
