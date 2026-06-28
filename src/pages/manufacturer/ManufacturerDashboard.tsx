import React, { useEffect, useState } from 'react'
import { Link, useNavigate } from 'react-router-dom'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import {
  Package,
  ShieldCheck,
  AlertOctagon,
  Activity,
  PlusCircle,
  History,
  FileCheck,
  TrendingUp,
  ExternalLink,
  ChevronRight,
  ShieldAlert,
} from 'lucide-react'
import { Button } from '../../components/Button'
import { PartRecord, VerificationLog } from '../../types'
import { motion } from 'framer-motion'

export default function ManufacturerDashboard() {
  const { account, manufacturerName } = useAppContext()
  const { getParts, getLogs } = usePartAuth()
  const [parts, setParts] = useState<PartRecord[]>([])
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [loading, setLoading] = useState(true)
  const navigate = useNavigate()

  useEffect(() => {
    async function loadDashboardData() {
      setLoading(true)
      const [fetchedParts, fetchedLogs] = await Promise.all([getParts(), getLogs()])
      
      // Filter parts by manufacturer
      const mfgParts = fetchedParts.filter(p => p.manufacturer_wallet === account || p.manufacturer_name === manufacturerName)
      setParts(mfgParts)
      setLogs(fetchedLogs)
      setLoading(false)
    }
    loadDashboardData()
  }, [account, manufacturerName, getParts, getLogs])

  const mfgLogs = logs.filter(l => 
    parts.some(p => p.part_code === l.part_code) || l.manufacturer_name === manufacturerName
  )

  const totalParts = parts.length
  const totalVerifications = parts.reduce((sum, p) => sum + p.verified_count, 0)
  const counterfeitAlerts = mfgLogs.filter(l => l.status === 'counterfeit').length
  const healthRate = totalVerifications > 0 
    ? Math.round(((totalVerifications - counterfeitAlerts) / totalVerifications) * 100) 
    : 100

  // Mock chart coordinates for visual representation
  const chartPoints = "10,90 40,75 70,80 100,50 130,45 160,25 190,30 220,15 250,5"

  return (
    <div className="space-y-8">
      
      {/* Dashboard Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Manufacturer Operations
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Manage your registered cryptographic inventory and track supply chain validations.
          </p>
        </div>
        <div className="flex items-center gap-3">
          <Link to="/manufacturer/add">
            <Button variant="gradient" leftIcon={<PlusCircle className="w-4 h-4" />}>
              Register New Part
            </Button>
          </Link>
        </div>
      </div>

      {/* Analytics Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6">
        
        {/* Total Parts */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Registered Parts</span>
            <div className="w-10 h-10 bg-indigo-500/10 text-indigo-500 rounded-xl flex items-center justify-center">
              <Package className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white">
            {loading ? '...' : totalParts}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Active ledger records</span>
        </motion.div>

        {/* Total Verifications */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Total Audits</span>
            <div className="w-10 h-10 bg-emerald-500/10 text-emerald-500 rounded-xl flex items-center justify-center">
              <ShieldCheck className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white">
            {loading ? '...' : totalVerifications}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Queries processed on-chain</span>
        </motion.div>

        {/* Counterfeits */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Counterfeit Intercepts</span>
            <div className="w-10 h-10 bg-red-500/10 text-red-500 rounded-xl flex items-center justify-center">
              <ShieldAlert className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-red-500">
            {loading ? '...' : counterfeitAlerts}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Mismatched query checksums</span>
        </motion.div>

        {/* Verification Success Rate */}
        <motion.div whileHover={{ y: -4 }} className="glass-card p-6 rounded-3xl border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-start mb-4">
            <span className="text-xs font-bold text-zinc-400 uppercase tracking-wider">Genuineness Ratio</span>
            <div className="w-10 h-10 bg-cyan-500/10 text-cyan-500 rounded-xl flex items-center justify-center">
              <TrendingUp className="w-5 h-5" />
            </div>
          </div>
          <span className="text-3xl font-black text-zinc-950 dark:text-white">
            {loading ? '...' : `${healthRate}%`}
          </span>
          <span className="block text-[10px] text-zinc-500 font-medium mt-1">Verification accuracy Index</span>
        </motion.div>

      </div>

      {/* Main Grid: Chart & Activities */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Verification Analytics Graph */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 flex flex-col justify-between border-zinc-200/60 dark:border-zinc-800/80">
          <div className="flex justify-between items-center mb-6">
            <div>
              <h3 className="font-bold text-base text-zinc-950 dark:text-white">Verification Activity Stream</h3>
              <p className="text-xs text-zinc-500">Real-time ledger requests volume chart</p>
            </div>
            <span className="text-xs font-bold text-indigo-600 bg-indigo-500/10 px-3 py-1 rounded-full">Last 30 Days</span>
          </div>

          <div className="w-full h-48 bg-zinc-100/50 dark:bg-zinc-900/30 rounded-2xl relative p-4 flex items-end overflow-hidden border border-zinc-200/30 dark:border-zinc-800/20">
            {/* Grid Lines */}
            <div className="absolute inset-0 flex flex-col justify-between p-4 pointer-events-none opacity-20">
              <div className="border-b border-zinc-500 w-full" />
              <div className="border-b border-zinc-500 w-full" />
              <div className="border-b border-zinc-500 w-full" />
            </div>

            {/* Simulated SVG Graph */}
            <svg viewBox="0 0 260 100" className="w-full h-32 text-indigo-500 overflow-visible relative z-10">
              <defs>
                <linearGradient id="chart-grad" x1="0" y1="0" x2="0" y2="1">
                  <stop offset="0%" stopColor="#5B5FFF" stopOpacity="0.4" />
                  <stop offset="100%" stopColor="#5B5FFF" stopOpacity="0" />
                </linearGradient>
              </defs>
              <polyline
                fill="none"
                stroke="currentColor"
                strokeWidth="2.5"
                strokeLinecap="round"
                strokeLinejoin="round"
                points={chartPoints}
              />
              <polygon
                fill="url(#chart-grad)"
                points={`10,100 ${chartPoints} 250,100`}
              />
            </svg>
          </div>
          
          <div className="flex justify-between text-[10px] text-zinc-400 font-bold px-2 mt-3 uppercase tracking-wider">
            <span>June 1</span>
            <span>June 10</span>
            <span>June 20</span>
            <span>Today</span>
          </div>
        </div>

        {/* Recent Verification Logs Feed */}
        <div className="glass-card rounded-3xl p-6 border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between">
          <div>
            <div className="flex justify-between items-center mb-6">
              <h3 className="font-bold text-base text-zinc-950 dark:text-white">Recent Activity</h3>
              <Link to="/manufacturer/logs" className="text-xs text-indigo-500 font-bold hover:underline flex items-center">
                All Logs <ChevronRight className="w-4.5 h-4.5" />
              </Link>
            </div>

            <div className="space-y-4 max-h-72 overflow-y-auto">
              {loading ? (
                <div className="space-y-3 py-4">
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                  <div className="h-10 bg-zinc-200 dark:bg-zinc-800 rounded-xl animate-pulse" />
                </div>
              ) : mfgLogs.length === 0 ? (
                <div className="text-center py-8 text-zinc-500 font-medium text-xs">
                  No scan queries recorded yet.
                </div>
              ) : (
                mfgLogs.slice(0, 4).map((log) => (
                  <div key={log.id} className="flex gap-3 text-left">
                    <div className={`w-8 h-8 rounded-xl flex items-center justify-center shrink-0 mt-0.5
                      ${log.status === 'genuine' ? 'bg-emerald-500/10 text-emerald-500' : 'bg-red-500/10 text-red-500'}`}
                    >
                      {log.status === 'genuine' ? <ShieldCheck className="w-4 h-4" /> : <AlertOctagon className="w-4 h-4" />}
                    </div>
                    <div className="min-w-0 flex-1">
                      <p className="text-xs font-bold text-zinc-800 dark:text-zinc-200 truncate">
                        {log.status === 'genuine' ? `Verified: ${log.part_name}` : 'Mismatched Checksum Alert'}
                      </p>
                      <p className="text-[10px] text-zinc-500 truncate">
                        {log.status === 'genuine' ? `Code ${log.part_code}` : `Query Code ${log.part_code}`}
                      </p>
                      <span className="text-[9px] text-zinc-400">{new Date(log.verified_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                ))
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  )
}
