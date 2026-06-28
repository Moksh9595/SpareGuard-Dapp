import React from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import { HelpCircle, ArrowLeft } from 'lucide-react'

export default function NotFoundPage() {
  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Background decoration */}
      <div className="absolute top-1/3 left-1/2 -translate-x-1/2 w-80 h-80 bg-indigo-500/5 dark:bg-indigo-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 text-center space-y-6 shadow-2xl border-zinc-200/60 dark:border-zinc-800/80"
      >
        <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-2xl flex items-center justify-center mx-auto text-zinc-400">
          <HelpCircle className="w-8 h-8 text-indigo-500" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">Page Not Found</h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed font-semibold">
            The page you are looking for does not exist or has been shifted to a new ledger block.
          </p>
        </div>

        <div className="pt-2">
          <Link to="/">
            <Button variant="gradient" className="w-full" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Return to Safety
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
