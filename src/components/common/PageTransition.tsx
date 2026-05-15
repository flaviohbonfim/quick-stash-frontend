import { motion } from 'framer-motion'
import { Outlet, useLocation } from 'react-router-dom'

const pageVariants = {
  initial: {
    opacity: 0,
    y: 12,
  },
  animate: {
    opacity: 1,
    y: 0,
    transition: {
      duration: 0.25,
      ease: [0.22, 1, 0.36, 1],
    },
  },
  exit: {
    opacity: 0,
    y: -8,
    transition: {
      duration: 0.15,
      ease: 'easeInOut',
    },
  },
}

export function PageTransition() {
  const location = useLocation()

  return (
    <motion.div
      key={location.pathname}
      initial="initial"
      animate="animate"
      exit="exit"
      variants={pageVariants}
    >
      <Outlet />
    </motion.div>
  )
}
