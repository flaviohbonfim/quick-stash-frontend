import { Button } from '@/components/ui/button'
import { motion } from 'framer-motion'

interface EmptyStateProps {
  title: string
  description: string
  actionLabel?: string
  onAction?: () => void
}

const containerVariants = {
  hidden: { opacity: 0 },
  visible: {
    opacity: 1,
    transition: {
      staggerChildren: 0.1,
      delayChildren: 0.2,
    },
  },
}

const itemVariants = {
  hidden: { opacity: 0, y: 15 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.4, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export function EmptyState({ title, description, actionLabel, onAction }: EmptyStateProps) {
  return (
    <motion.div
      className="flex flex-col items-center justify-center py-12 text-center"
      variants={containerVariants}
      initial="hidden"
      animate="visible"
    >
      <motion.div
        className="mb-6 text-muted-foreground"
        variants={itemVariants}
      >
        <svg
          className="mx-auto h-20 w-20"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth={1}
        >
          {/* Amethyst-themed illustration: floating wallet with sparkles */}
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M20 13V6a2 2 0 00-2-2H6a2 2 0 00-2 2v7m16 0v5a2 2 0 01-2 2H6a2 2 0 01-2-2v-5m16 0h-2.586a1 1 0 00-.707.293l-2.414 2.414a1 1 0 01-.707-.293h-3.172a1 1 0 01-.707-.293l-2.414-2.414A1 1 0 006.586 13H4"
            initial={{ pathLength: 0 }}
            animate={{ pathLength: 1 }}
            transition={{ duration: 0.8, ease: 'easeInOut' }}
          />
          {/* Sparkle accents */}
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 2l1.5 4.5L18 8l-4.5 1.5L12 14l-1.5-4.5L6 8l4.5-1.5L12 2z"
            className="text-primary/40"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.6, duration: 0.4 }}
          />
          <motion.path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M18 16l0.75 2.25L21 19l-2.25.75L18 22l-.75-2.25L15 19l2.25-.75L18 16z"
            className="text-primary/30"
            initial={{ scale: 0, opacity: 0 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ delay: 0.8, duration: 0.4 }}
          />
        </svg>
      </motion.div>

      <motion.h3
        className="text-lg font-semibold"
        variants={itemVariants}
      >
        {title}
      </motion.h3>

      <motion.p
        className="mt-2 text-sm text-muted-foreground"
        variants={itemVariants}
      >
        {description}
      </motion.p>

      {actionLabel && onAction && (
        <motion.div variants={itemVariants}>
          <Button
            className="mt-6 shadow-primary"
            onClick={onAction}
          >
            {actionLabel}
          </Button>
        </motion.div>
      )}
    </motion.div>
  )
}
