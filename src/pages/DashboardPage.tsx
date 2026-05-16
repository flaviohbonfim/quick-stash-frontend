import { Dashboard } from '@/components/dashboard/Dashboard'
import { motion } from 'framer-motion'

const pageVariants = {
  hidden: { opacity: 0, y: 8 },
  visible: {
    opacity: 1,
    y: 0,
    transition: { duration: 0.3, ease: [0.22, 1, 0.36, 1] as [number, number, number, number] },
  },
}

export default function DashboardPage() {
  return (
    <motion.div variants={pageVariants} initial="hidden" animate="visible" className="p-6">
      <Dashboard />
    </motion.div>
  )
}
