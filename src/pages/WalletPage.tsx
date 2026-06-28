import React, { useState, useEffect } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '../components/Button'
import {
  Wallet,
  ArrowRight,
  Download,
  CheckCircle,
  Copy,
  Clock,
  ExternalLink,
  ShieldCheck,
  TrendingUp,
  RefreshCw,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { usePartAuth } from '../hooks/usePartAuth'
import { WalletTransaction } from '../types'

export default function WalletPage() {
  const { account, balance, connectWallet, disconnectWallet, isConnecting } = useAppContext()
  const { getTransactions } = usePartAuth()
  const [txHistory, setTxHistory] = useState<WalletTransaction[]>([])
  const [isCopied, setIsCopied] = useState(false)
  const [isLoadingTxs, setIsLoadingTxs] = useState(false)
  const navigate = useNavigate()

  useEffect(() => {
    if (account) {
      setIsLoadingTxs(true)
      getTransactions().then((txs) => {
        setTxHistory(txs)
        setIsLoadingTxs(false)
      })
    }
  }, [account, getTransactions])

  const handleCopy = () => {
    if (account) {
      navigator.clipboard.writeText(account)
      setIsCopied(true)
      toast.success('Wallet address copied to clipboard!')
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const formatAddress = (addr: string | null) => {
    if (!addr) return ''
    return `${addr.substring(0, 10)}...${addr.substring(addr.length - 8)}`
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Decorative Blobs */}
      <div className="absolute top-1/4 left-1/2 -translate-x-1/2 w-96 h-96 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 rounded-full filter blur-[80px] pointer-events-none" />

      <div className="w-full max-w-xl relative z-10 text-center space-y-8">
        
        {/* Brand / Logo */}
        <div className="flex flex-col items-center gap-2">
          <div className="bg-[#5B5FFF] p-3 rounded-2xl text-white shadow-xl glow-primary">
            <ShieldCheck className="w-8 h-8" />
          </div>
          <h2 className="text-2xl font-bold tracking-tight text-zinc-950 dark:text-white mt-3">Configure Ledger Connection</h2>
          <p className="text-sm text-zinc-500 max-w-sm">
            Access the Spare Guard ledger by connecting your non-custodial Stellar wallet.
          </p>
        </div>

        <AnimatePresence mode="wait">
          {!account ? (
            /* Disconnected Wallet Panel */
            <motion.div
              key="disconnected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="glass-card rounded-3xl p-6 md:p-8 space-y-6 shadow-2xl relative overflow-hidden border-zinc-200/60 dark:border-zinc-800/80"
            >
              <div className="w-16 h-16 bg-indigo-500/10 rounded-full flex items-center justify-center text-indigo-500 mx-auto">
                <Wallet className="w-8 h-8" />
              </div>

              <div className="space-y-3">
                <Button
                  variant="gradient"
                  className="w-full py-3.5"
                  leftIcon={<Wallet className="w-4 h-4 text-white" />}
                  onClick={() => connectWallet('freighter')}
                  isLoading={isConnecting}
                >
                  Connect Freighter Wallet
                </Button>
              </div>

              <div className="border-t border-zinc-100 dark:border-zinc-800/60 pt-6 text-left space-y-3">
                <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400">Freighter Extension Setup</h4>
                <p className="text-xs text-zinc-500 leading-relaxed font-medium">
                  Freighter is a wallet extension that enables secure interactions with Soroban smart contracts.
                </p>
                <a
                  href="https://www.freighter.com/"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 text-xs text-indigo-600 dark:text-indigo-400 font-bold hover:underline"
                >
                  <Download className="w-4 h-4" /> Install Freighter Extension
                  <ExternalLink className="w-3 h-3" />
                </a>
              </div>
            </motion.div>
          ) : (
            /* Connected Wallet Details Panel */
            <motion.div
              key="connected"
              initial={{ opacity: 0, scale: 0.95 }}
              animate={{ opacity: 1, scale: 1 }}
              exit={{ opacity: 0, scale: 0.95 }}
              className="space-y-6"
            >
              {/* Account Overview Card */}
              <div className="glass-card rounded-3xl p-6 md:p-8 text-left space-y-6 shadow-2xl border-zinc-200/80 dark:border-zinc-800/80 relative">
                <div className="flex items-center justify-between">
                  <div className="flex items-center gap-2">
                    <span className="w-2.5 h-2.5 bg-emerald-500 rounded-full animate-ping"></span>
                    <span className="text-xs font-bold text-emerald-500 tracking-wide uppercase">Connection Active</span>
                  </div>
                  <Button variant="ghost" size="sm" className="text-xs text-zinc-400 hover:text-red-500" onClick={disconnectWallet}>
                    Disconnect
                  </Button>
                </div>

                <div className="space-y-1">
                  <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Account Address</span>
                  <div className="flex items-center justify-between p-3.5 bg-zinc-100/50 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800 rounded-2xl">
                    <span className="font-mono text-xs text-zinc-800 dark:text-zinc-300 select-all truncate max-w-[80%]">
                      {formatAddress(account)}
                    </span>
                    <button onClick={handleCopy} className="text-zinc-400 hover:text-indigo-500 transition-colors p-1">
                      {isCopied ? <CheckCircle className="w-4 h-4 text-emerald-500" /> : <Copy className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <div className="grid grid-cols-2 gap-4">
                  <div className="p-4 bg-zinc-100/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wide mb-1">Stellar Balance</span>
                    <span className="text-lg font-black text-zinc-950 dark:text-white truncate block">
                      {balance ? parseFloat(balance).toFixed(4) : '0.00'} XLM
                    </span>
                  </div>
                  <div className="p-4 bg-zinc-100/50 dark:bg-zinc-950/40 border border-zinc-200/50 dark:border-zinc-800/60 rounded-2xl">
                    <span className="block text-[10px] text-zinc-400 font-bold uppercase tracking-wide mb-1">Network Type</span>
                    <span className="text-lg font-black text-indigo-500 flex items-center gap-1">
                      Testnet <TrendingUp className="w-4 h-4" />
                    </span>
                  </div>
                </div>

                <Button
                  variant="gradient"
                  className="w-full py-4 text-sm font-bold"
                  rightIcon={<ArrowRight className="w-5 h-5" />}
                  onClick={() => navigate('/role-selection')}
                >
                  Proceed to Role Configuration
                </Button>
              </div>

              {/* Simulated Transaction Log Card */}
              <div className="glass-card rounded-3xl p-6 text-left space-y-4 border-zinc-200/60 dark:border-zinc-800/60">
                <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                  <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
                    <Clock className="w-4 h-4" /> Recent Ledger Transactions
                  </h4>
                  {isLoadingTxs && <RefreshCw className="w-3.5 h-3.5 text-zinc-400 animate-spin" />}
                </div>

                <div className="space-y-3 max-h-48 overflow-y-auto">
                  {txHistory.length === 0 ? (
                    <p className="text-xs text-zinc-500 text-center py-4 font-medium">No recent transactions recorded.</p>
                  ) : (
                    txHistory.map((tx) => (
                      <div key={tx.id} className="flex items-center justify-between p-3 hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 rounded-xl transition-colors">
                        <div>
                          <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200">{tx.type}</p>
                          <span className="text-[10px] text-zinc-400 font-mono">{tx.hash}</span>
                        </div>
                        <div className="text-right">
                          <span className="text-xs font-bold text-emerald-500 bg-emerald-500/10 px-2 py-0.5 rounded-full">
                            {tx.status}
                          </span>
                          <span className="block text-[9px] text-zinc-500 mt-1">{new Date(tx.timestamp).toLocaleTimeString()}</span>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </div>
            </motion.div>
          )}
        </AnimatePresence>
      </div>
    </div>
  )
}
