import React, { useEffect, useState } from 'react'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import {
  History,
  ShieldCheck,
  AlertOctagon,
  Search,
  Filter,
  Calendar,
  Wallet,
} from 'lucide-react'
import { VerificationLog } from '../../types'

export default function LogsPage() {
  const { manufacturerName } = useAppContext()
  const { getLogs } = usePartAuth()
  
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [search, setSearch] = useState('')
  const [statusFilter, setStatusFilter] = useState('All')
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadLogs() {
      setLoading(true)
      const fetchedLogs = await getLogs()
      
      // Manufacturers only care about logs that they manufactured or if they are in the ledger
      // For this mock layout we show all queries made in relation to this brand or general ledger
      const filtered = fetchedLogs.filter(l => !l.manufacturer_name || l.manufacturer_name === manufacturerName)
      setPartsLogs(filtered)
      setLoading(false)
    }
    loadLogs()
  }, [manufacturerName, getLogs])

  const [partsLogs, setPartsLogs] = useState<VerificationLog[]>([])

  const filteredLogs = partsLogs.filter(log => {
    const matchesSearch = 
      log.part_code.toLowerCase().includes(search.toLowerCase()) ||
      log.hash.toLowerCase().includes(search.toLowerCase()) ||
      (log.part_name && log.part_name.toLowerCase().includes(search.toLowerCase()))
    
    const matchesStatus = statusFilter === 'All' || log.status === statusFilter
    return matchesSearch && matchesStatus
  })

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Verification Audit Logs
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          A tamper-proof chronological history of all product authenticity checks.
        </p>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="glass-card rounded-3xl p-5 border-zinc-200/60 dark:border-zinc-800/80 shadow-xl flex flex-col md:flex-row gap-4 items-center justify-between">
        
        {/* Search */}
        <div className="relative w-full md:max-w-sm">
          <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by part serial, hash..."
            className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] text-xs transition-all duration-200"
          />
        </div>

        {/* Status Filter */}
        <div className="flex items-center gap-3 w-full md:w-auto">
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] w-full md:w-auto"
          >
            <option value="All">All Verification Statuses</option>
            <option value="genuine">Genuine Only</option>
            <option value="counterfeit">Counterfeits Only</option>
          </select>
        </div>

      </div>

      {/* Table view */}
      {loading ? (
        <div className="glass-card rounded-3xl p-8 animate-pulse space-y-4">
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
          <div className="h-8 bg-zinc-200 dark:bg-zinc-800 rounded-lg w-full"></div>
        </div>
      ) : filteredLogs.length === 0 ? (
        <div className="glass-card rounded-3xl p-16 text-center border-dashed border-2 border-zinc-200 dark:border-zinc-800 space-y-3">
          <History className="w-10 h-10 text-zinc-400 mx-auto" />
          <h4 className="font-bold text-sm text-zinc-950 dark:text-white">No Verification Matches</h4>
          <p className="text-xs text-zinc-500 max-w-sm mx-auto">
            We couldn't find any ledger validation logs matching your specified queries.
          </p>
        </div>
      ) : (
        <div className="glass-card rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-100/50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Log ID</th>
                  <th className="p-4">Part Serial</th>
                  <th className="p-4">Audit Status</th>
                  <th className="p-4">Assigned Component</th>
                  <th className="p-4">Audited Date</th>
                  <th className="p-4">Auditor Wallet</th>
                  <th className="p-4">Notes / Flag Reasons</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredLogs.map(log => (
                  <tr key={log.id} className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 font-bold text-zinc-950 dark:text-white">{log.id}</td>
                    <td className="p-4 font-mono font-bold text-zinc-600 dark:text-zinc-300">{log.part_code}</td>
                    <td className="p-4">
                      <span className={`inline-flex items-center gap-1 text-[10px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider
                        ${log.status === 'genuine' ? 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20' : 'bg-red-500/10 text-red-500 border border-red-500/20'}`}
                      >
                        {log.status === 'genuine' ? (
                          <><ShieldCheck className="w-3.5 h-3.5" /> Genuine</>
                        ) : (
                          <><AlertOctagon className="w-3.5 h-3.5" /> Counterfeit</>
                        )}
                      </span>
                    </td>
                    <td className="p-4 font-medium text-zinc-800 dark:text-zinc-200">
                      {log.part_name ? (
                        <div>
                          <p className="font-bold">{log.part_name}</p>
                          <span className="text-[10px] text-zinc-400 font-medium">{log.product_name}</span>
                        </div>
                      ) : (
                        <span className="text-zinc-400 italic">Unknown Cryptogram</span>
                      )}
                    </td>
                    <td className="p-4 text-zinc-500 font-medium">{new Date(log.verified_at).toLocaleDateString()} {new Date(log.verified_at).toLocaleTimeString()}</td>
                    <td className="p-4 font-mono text-zinc-500 truncate max-w-[120px]">{log.verifier_wallet}</td>
                    <td className="p-4 font-medium text-zinc-500 max-w-xs truncate">
                      {log.status === 'genuine' ? (
                        <span className="text-emerald-600 dark:text-emerald-400">Ledger checksum verified.</span>
                      ) : (
                        <span className="text-red-500">{log.failure_reason}</span>
                      )}
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

    </div>
  )
}
