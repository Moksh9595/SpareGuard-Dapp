import React from 'react'
import { useParams, Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import { Button } from '../components/Button'
import {
  Wallet,
  ShieldAlert,
  Coins,
  XCircle,
  FileWarning,
  ArrowLeft,
  ServerCrash,
} from 'lucide-react'

export default function ErrorPages() {
  const { errorType } = useParams<{ errorType: string }>()

  const errorConfigs: {
    [key: string]: {
      icon: any
      color: string
      title: string
      desc: string
      actionText: string
      actionLink: string
    }
  } = {
    'wallet-not-connected': {
      icon: Wallet,
      color: 'text-indigo-500 bg-indigo-500/10',
      title: 'Wallet Disconnected',
      desc: 'You must establish a connection with your non-custodial Stellar wallet to access this screen.',
      actionText: 'Connect Wallet',
      actionLink: '/wallet',
    },
    unauthorized: {
      icon: ShieldAlert,
      color: 'text-red-500 bg-red-500/10',
      title: 'Access Restricted',
      desc: 'You do not hold permissions to access this dashboard. Switch roles or authenticate with proper credentials.',
      actionText: 'Go to Selection',
      actionLink: '/role-selection',
    },
    'insufficient-balance': {
      icon: Coins,
      color: 'text-yellow-500 bg-yellow-500/10',
      title: 'Insufficient Balance',
      desc: 'Your Stellar wallet balance is too low to settle the smart contract execution gas fees.',
      actionText: 'Deposit XLM',
      actionLink: '/wallet',
    },
    'transaction-failed': {
      icon: XCircle,
      color: 'text-red-500 bg-red-500/10',
      title: 'Transaction Rejected',
      desc: 'The Horizon consensus node failed to compile the transaction. Please verify parameters and signatures.',
      actionText: 'Re-authenticate Wallet',
      actionLink: '/wallet',
    },
    'contract-not-connected': {
      icon: ServerCrash,
      color: 'text-purple-500 bg-purple-500/10',
      title: 'Smart Contract Offline',
      desc: 'No Soroban contract deployment was detected matching the specified network node address.',
      actionText: 'Verify Settings',
      actionLink: '/manufacturer/settings',
    },
  }

  const config = errorConfigs[errorType || ''] || {
    icon: FileWarning,
    color: 'text-zinc-500 bg-zinc-500/10',
    title: 'System Error',
    desc: 'An unexpected application state error was encountered. Please contact network administrators.',
    actionText: 'Return Home',
    actionLink: '/',
  }

  const Icon = config.icon

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Background radial gradient */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-red-500/5 dark:bg-red-500/10 rounded-full filter blur-[100px] pointer-events-none" />

      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        className="w-full max-w-md glass-card rounded-3xl p-8 text-center space-y-6 shadow-2xl border-zinc-200/60 dark:border-zinc-800/80"
      >
        <div className={`w-16 h-16 ${config.color} rounded-2xl flex items-center justify-center mx-auto`}>
          <Icon className="w-8 h-8" />
        </div>

        <div className="space-y-2">
          <h2 className="text-xl font-extrabold text-zinc-950 dark:text-white">{config.title}</h2>
          <p className="text-xs text-zinc-500 max-w-xs mx-auto leading-relaxed font-semibold">
            {config.desc}
          </p>
        </div>

        <div className="pt-2 flex flex-col gap-3">
          <Link to={config.actionLink}>
            <Button variant="gradient" className="w-full">
              {config.actionText}
            </Button>
          </Link>
          <Link to="/">
            <Button variant="ghost" className="w-full text-zinc-400 hover:text-zinc-600 flex items-center justify-center gap-1.5" leftIcon={<ArrowLeft className="w-4 h-4" />}>
              Landing Page
            </Button>
          </Link>
        </div>
      </motion.div>
    </div>
  )
}
