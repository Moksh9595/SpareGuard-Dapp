import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import {
  ShieldCheck,
  PlusCircle,
  Package,
  History,
  AlertTriangle,
  UserCheck,
  Search,
  ArrowRight,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '../../components/Button'
import { VerificationLog } from '../../types'
import { motion } from 'framer-motion'

export default function CustomerDashboard() {
  const { account } = useAppContext()
  const { getLogs } = usePartAuth()
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadCustomerData() {
      setLoading(true)
      const fetchedLogs = await getLogs()
      // Filter by customer wallet
      const customerLogs = fetchedLogs.filter((l) => l.verifier_wallet === account)
      setLogs(customerLogs)
      setLoading(false)
    }
    loadCustomerData()
  }, [account, getLogs])

  const totalChecks = logs.length
  const genuineChecks = logs.filter((l) => l.status === 'genuine').length
  const counterfeitChecks = logs.filter((l) => l.status === 'counterfeit').length
  const validationRate = totalChecks > 0 ? Math.round((genuineChecks / totalChecks) * 100) : 100

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Customer Audit Dashboard
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Verify hardware integrity, review check histories, and trace manufacturers.
          </p>
        </div>
        <div>
          <Link to="/customer/verify">
            <Button variant="gradient" leftIcon={<ShieldCheck className="w-4 h-4" />}>
              Verify Spare Part
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Stats Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Scanned */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Scanned</span>
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <Search className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white">
            {loading ? '...' : totalChecks}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Provenance query requests</span>
        </motion.div>

        {/* Genuine Checked */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Genuine Components</span>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-emerald-500">
            {loading ? '...' : genuineChecks}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Confirmed authentic parts</span>
        </motion.div>

        {/* Counterfeits Detected */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Counterfeit Flags</span>
            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-red-500">
            {loading ? '...' : counterfeitChecks}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Blocked counterfeit designs</span>
        </motion.div>

        {/* Authentication success rate */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Authenticity Ratio</span>
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center">
              <UserCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white">
            {loading ? '...' : `${validationRate}%`}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Query validity index</span>
        </motion.div>

      </div>

      {/* Main Sections Layout: History and Call To Action */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification History list */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-center mb-6">
            <h3 className="font-bold text-base text-zinc-950 dark:text-white flex items-center gap-1.5">
              <History className="w-5 h-5 text-indigo-500" /> Audit Scan Trace
            </h3>
            <span className="text-xs text-zinc-400 font-semibold uppercase tracking-wider">Your verification logs</span>
          </div>

          <div className="space-y-4 max-h-[360px] overflow-y-auto pr-2">
            {loading ? (
              <div className="space-y-3 py-4">
                <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
                <div className="h-14 bg-zinc-200 dark:bg-zinc-800 rounded-2xl animate-pulse" />
              </div>
            ) : logs.length === 0 ? (
              <div className="text-center py-16 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl space-y-3">
                <History className="w-8 h-8 text-zinc-400 mx-auto" />
                <h4 className="text-sm font-bold text-zinc-950 dark:text-white">No Scan Audit History</h4>
                <p className="text-xs text-zinc-500 max-w-sm mx-auto leading-relaxed">
                  You have not performed any cryptographic part searches from this wallet. Scan or input credentials to start.
                </p>
                <Link to="/customer/verify" className="inline-block mt-2">
                  <Button variant="outline" size="sm">
                    Perform First Verify Check
                  </Button>
                </Link>
              </div>
            ) : (
              logs.map((log) => (
                <div key={log.id} className="p-4 bg-zinc-100/50 dark:bg-zinc-900/30 hover:bg-zinc-100 dark:hover:bg-zinc-900/50 transition-all border border-zinc-200/40 dark:border-zinc-800/60 rounded-2xl flex justify-between items-center text-left">
                  <div>
                    <div className="flex items-center gap-2">
                      <span className={`inline-flex items-center gap-1 text-[9px] px-2 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${log.status === 'genuine' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                      >
                        {log.status}
                      </span>
                      <span className="text-[10px] text-zinc-400 font-mono font-bold">Log: {log.id}</span>
                    </div>
                    <h5 className="font-bold text-sm text-zinc-950 dark:text-white mt-2">
                      {log.part_name ? log.part_name : 'Unknown Hardware Item'}
                    </h5>
                    <p className="text-[11px] text-zinc-500 font-semibold font-mono">Serial: {log.part_code}</p>
                  </div>

                  <div className="text-right space-y-1">
                    <span className="block text-[10px] text-zinc-400 font-medium">
                      {new Date(log.verified_at).toLocaleDateString()}
                    </span>
                    <span className="block text-[9px] text-zinc-500">
                      {new Date(log.verified_at).toLocaleTimeString()}
                    </span>
                  </div>
                </div>
              ))
            )}
          </div>
        </div>

        {/* Dynamic educational side panel */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between text-left space-y-6">
          <div className="space-y-4">
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
            <h4 className="font-bold text-sm text-zinc-950 dark:text-white">Understanding Part Integrity</h4>
            <p className="text-xs text-zinc-500 leading-relaxed font-medium">
              Authentic manufacturers register spare parts with a secure signing process on-chain. When you enter a serial code and checksum hash:
            </p>
            <ul className="text-xs text-zinc-500 space-y-2 list-disc pl-4 font-medium">
              <li>Soroban confirms manufacturer keys</li>
              <li>Signature cryptology validates authenticity</li>
              <li>Tampered items flag quick mismatch warnings</li>
            </ul>
          </div>

          <Link to="/customer/verify" className="block pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
            <Button variant="gradient" className="w-full text-xs font-bold py-3" rightIcon={<ArrowRight className="w-4.5 h-4.5" />}>
              Verify Now
            </Button>
          </Link>
        </div>

      </div>
    </div>
  )
}
