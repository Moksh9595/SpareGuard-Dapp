import React, { useEffect, useState } from 'react'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import { Button } from '../../components/Button'
import { Modal } from '../../components/Modal'
import {
  Search,
  Grid,
  List,
  Copy,
  CheckCircle,
  Eye,
  Trash2,
  Edit2,
  Filter,
  ArrowUpDown,
  History,
  Calendar,
  X,
  Package,
} from 'lucide-react'
import toast from 'react-hot-toast'
import { PartRecord, VerificationLog } from '../../types'
import { motion, AnimatePresence } from 'framer-motion'

export default function AddedProductsPage() {
  const { account, manufacturerName } = useAppContext()
  const { getParts, getLogs, deletePart, updatePartStatus } = usePartAuth()

  const [parts, setParts] = useState<PartRecord[]>([])
  const [logs, setLogs] = useState<VerificationLog[]>([])
  const [loading, setLoading] = useState(true)
  
  // Search & Filter State
  const [search, setSearch] = useState('')
  const [categoryFilter, setCategoryFilter] = useState('All')
  const [statusFilter, setStatusFilter] = useState('All')
  const [sortOrder, setSortOrder] = useState<'newest' | 'oldest' | 'verifications'>('newest')
  const [viewMode, setViewMode] = useState<'grid' | 'list'>('grid')
  
  // Modal State
  const [selectedPart, setSelectedPart] = useState<PartRecord | null>(null)
  const [partLogs, setPartLogs] = useState<VerificationLog[]>([])
  const [isViewModalOpen, setIsViewModalOpen] = useState(false)
  const [isEditModalOpen, setIsEditModalOpen] = useState(false)
  const [editStatus, setEditStatus] = useState<'active' | 'recalled' | 'discontinued'>('active')
  
  const [copiedHashId, setCopiedHashId] = useState<string | null>(null)

  const loadData = async () => {
    setLoading(true)
    const [allParts, allLogs] = await Promise.all([getParts(), getLogs()])
    
    // Filter parts owned by current manufacturer
    const mfgParts = allParts.filter(p => p.manufacturer_wallet === account || p.manufacturer_name === manufacturerName)
    setParts(mfgParts)
    setLogs(allLogs)
    setLoading(false)
  }

  useEffect(() => {
    loadData()
  }, [account, manufacturerName])

  const handleCopyHash = (hash: string) => {
    navigator.clipboard.writeText(hash)
    setCopiedHashId(hash)
    toast.success('Part hash copied to clipboard!')
    setTimeout(() => setCopiedHashId(null), 2000)
  }

  const handleDelete = async (id: number) => {
    if (window.confirm('Are you sure you want to revoke this part? This action permanently removes the record from your catalog.')) {
      const success = await deletePart(id)
      if (success) {
        setParts(prev => prev.filter(p => p.id !== id))
      }
    }
  }

  const handleOpenView = (part: PartRecord) => {
    setSelectedPart(part)
    const matchingLogs = logs.filter(l => l.hash === part.hash)
    setPartLogs(matchingLogs)
    setIsViewModalOpen(true)
  }

  const handleOpenEdit = (part: PartRecord) => {
    setSelectedPart(part)
    setEditStatus(part.status || 'active')
    setIsEditModalOpen(true)
  }

  const handleSaveStatus = async () => {
    if (selectedPart) {
      const updated = await updatePartStatus(selectedPart.id, editStatus)
      if (updated) {
        setParts(prev => prev.map(p => p.id === selectedPart.id ? { ...p, status: editStatus } : p))
        setIsEditModalOpen(false)
      }
    }
  }

  // Filter and Sort calculation
  const filteredParts = parts
    .filter(p => {
      const matchesSearch = 
        p.part_name.toLowerCase().includes(search.toLowerCase()) ||
        p.part_code.toLowerCase().includes(search.toLowerCase()) ||
        p.hash.toLowerCase().includes(search.toLowerCase())
      
      const matchesCategory = categoryFilter === 'All' || p.product_name === categoryFilter
      const matchesStatus = statusFilter === 'All' || p.status === statusFilter

      return matchesSearch && matchesCategory && matchesStatus
    })
    .sort((a, b) => {
      if (sortOrder === 'newest') return b.created_at - a.created_at
      if (sortOrder === 'oldest') return a.created_at - b.created_at
      if (sortOrder === 'verifications') return b.verified_count - a.verified_count
      return 0
    })

  const uniqueCategories = Array.from(new Set(parts.map(p => p.product_name)))

  const statusColor = (status?: string) => {
    if (status === 'recalled') return 'bg-red-500/10 text-red-500 border border-red-500/20'
    if (status === 'discontinued') return 'bg-yellow-500/10 text-yellow-500 border border-yellow-500/20'
    return 'bg-emerald-500/10 text-emerald-500 border border-emerald-500/20'
  }

  return (
    <div className="space-y-8">
      
      {/* Header */}
      <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
        <div>
          <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
            Added Products Registry
          </h1>
          <p className="text-sm text-zinc-500 font-medium">
            Manage your registered parts lifecycle and audit history catalog.
          </p>
        </div>
      </div>

      {/* Toolbar / Search Filters */}
      <div className="glass-card rounded-3xl p-5 border-zinc-200/60 dark:border-zinc-800/80 space-y-4 shadow-xl">
        <div className="flex flex-col md:flex-row gap-4 justify-between items-center">
          
          {/* Search bar */}
          <div className="relative w-full md:max-w-sm">
            <Search className="absolute left-3.5 top-1/2 -translate-y-1/2 w-4 h-4 text-zinc-400 dark:text-zinc-500" />
            <input
              type="text"
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by part name, code, hash..."
              className="w-full pl-10 pr-4 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 placeholder-zinc-400 focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] text-xs transition-all duration-200"
            />
          </div>

          <div className="flex flex-wrap items-center gap-3 w-full md:w-auto">
            {/* Category Filter */}
            <select
              value={categoryFilter}
              onChange={(e) => setCategoryFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B5FFF]"
            >
              <option value="All">All Categories</option>
              {uniqueCategories.map(cat => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>

            {/* Status Filter */}
            <select
              value={statusFilter}
              onChange={(e) => setStatusFilter(e.target.value)}
              className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B5FFF]"
            >
              <option value="All">All Statuses</option>
              <option value="active">Active</option>
              <option value="recalled">Recalled</option>
              <option value="discontinued">Discontinued</option>
            </select>

            {/* Sorting */}
            <select
              value={sortOrder}
              onChange={(e) => setSortOrder(e.target.value as any)}
              className="px-3 py-2.5 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-700 dark:text-zinc-300 text-xs focus:outline-none focus:ring-2 focus:ring-[#5B5FFF]"
            >
              <option value="newest">Newest First</option>
              <option value="oldest">Oldest First</option>
              <option value="verifications">Verifications Count</option>
            </select>

            {/* View switcher */}
            <div className="flex border border-zinc-200 dark:border-zinc-800 rounded-xl overflow-hidden shrink-0 bg-white dark:bg-zinc-950">
              <button
                onClick={() => setViewMode('grid')}
                className={`p-2 transition-colors ${viewMode === 'grid' ? 'bg-zinc-100 dark:bg-zinc-900 text-[#5B5FFF]' : 'text-zinc-400 hover:text-zinc-500'}`}
              >
                <Grid className="w-4.5 h-4.5" />
              </button>
              <button
                onClick={() => setViewMode('list')}
                className={`p-2 transition-colors ${viewMode === 'list' ? 'bg-zinc-100 dark:bg-zinc-900 text-[#5B5FFF]' : 'text-zinc-400 hover:text-zinc-500'}`}
              >
                <List className="w-4.5 h-4.5" />
              </button>
            </div>

          </div>

        </div>
      </div>

      {/* Grid or List View render */}
      {loading ? (
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <div className="h-64 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-3xl animate-pulse" />
          <div className="h-64 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-3xl animate-pulse" />
          <div className="h-64 bg-zinc-200/50 dark:bg-zinc-900/50 rounded-3xl animate-pulse" />
        </div>
      ) : filteredParts.length === 0 ? (
        /* Empty State */
        <motion.div
          initial={{ opacity: 0 }}
          animate={{ opacity: 1 }}
          className="glass-card rounded-3xl p-16 text-center space-y-4 border-dashed border-2 border-zinc-200 dark:border-zinc-800"
        >
          <div className="w-16 h-16 bg-zinc-100 dark:bg-zinc-900 rounded-full flex items-center justify-center text-zinc-400 mx-auto">
            <Package className="w-8 h-8" />
          </div>
          <div className="space-y-1">
            <h3 className="font-bold text-base text-zinc-950 dark:text-white">No Products Registered</h3>
            <p className="text-xs text-zinc-500 max-w-sm mx-auto">
              Your query didn't return any matching registered spare parts. Reset filters or create a new part.
            </p>
          </div>
        </motion.div>
      ) : viewMode === 'grid' ? (
        /* Grid Layout */
        <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredParts.map((part) => (
              <motion.div
                key={part.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="glass-card rounded-3xl overflow-hidden shadow-lg border border-zinc-200/60 dark:border-zinc-800/80 flex flex-col justify-between"
              >
                <div>
                  <div className="h-44 overflow-hidden bg-zinc-100 dark:bg-zinc-900 relative">
                    <img
                      src={part.ipfs_image}
                      alt={part.part_name}
                      className="w-full h-full object-cover"
                      onError={(e) => {
                        ;(e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
                      }}
                    />
                    <span className="absolute top-3 left-3 text-[10px] bg-zinc-950/80 backdrop-blur-md px-2.5 py-1 rounded-full text-white font-semibold">
                      {part.product_name}
                    </span>
                    <span className={`absolute top-3 right-3 text-[10px] backdrop-blur-md px-2.5 py-1 rounded-full font-bold uppercase tracking-wider ${statusColor(part.status)}`}>
                      {part.status || 'active'}
                    </span>
                  </div>

                  <div className="p-5 space-y-4">
                    <div>
                      <h4 className="font-bold text-base text-zinc-900 dark:text-white line-clamp-1">{part.part_name}</h4>
                      <p className="text-[11px] text-zinc-500 font-bold tracking-tight mt-0.5">Code: {part.part_code}</p>
                    </div>

                    <div className="space-y-1">
                      <span className="text-[9px] uppercase tracking-wider text-zinc-400 font-bold">Ledger Address Hash</span>
                      <div className="flex items-center justify-between p-2 bg-zinc-100/50 dark:bg-zinc-950/60 border border-zinc-200/50 dark:border-zinc-800 rounded-xl">
                        <span className="font-mono text-[10px] text-zinc-600 dark:text-zinc-400 truncate max-w-[85%]">
                          {part.hash}
                        </span>
                        <button
                          onClick={() => handleCopyHash(part.hash)}
                          className="text-zinc-400 hover:text-indigo-500 transition-colors p-1"
                        >
                          {copiedHashId === part.hash ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                        </button>
                      </div>
                    </div>
                  </div>
                </div>

                <div className="p-5 border-t border-zinc-100 dark:border-zinc-800/80 flex items-center justify-between bg-zinc-50/50 dark:bg-zinc-900/10">
                  <div className="text-left">
                    <span className="block text-[9px] text-zinc-400 font-bold uppercase">Audits</span>
                    <span className="text-xs font-black text-[#5B5FFF]">{part.verified_count} times</span>
                  </div>
                  <div className="flex items-center gap-1.5">
                    <Button variant="ghost" size="sm" className="p-2" onClick={() => handleOpenView(part)}>
                      <Eye className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-indigo-500" onClick={() => handleOpenEdit(part)}>
                      <Edit2 className="w-4 h-4" />
                    </Button>
                    <Button variant="ghost" size="sm" className="p-2 text-red-500" onClick={() => handleDelete(part.id)}>
                      <Trash2 className="w-4 h-4" />
                    </Button>
                  </div>
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>
      ) : (
        /* List Layout */
        <div className="glass-card rounded-3xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50 shadow-xl">
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse text-xs">
              <thead>
                <tr className="bg-zinc-100/50 dark:bg-zinc-950/60 border-b border-zinc-200 dark:border-zinc-800 text-zinc-400 font-bold uppercase tracking-wider">
                  <th className="p-4">Asset Details</th>
                  <th className="p-4">Part Serial</th>
                  <th className="p-4">Ledger Hash</th>
                  <th className="p-4">Audits</th>
                  <th className="p-4">Status</th>
                  <th className="p-4 text-right">Actions</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-zinc-200 dark:divide-zinc-800">
                {filteredParts.map(part => (
                  <tr key={part.id} className="hover:bg-zinc-100/30 dark:hover:bg-zinc-900/10 transition-colors">
                    <td className="p-4 flex items-center gap-3">
                      <img
                        src={part.ipfs_image}
                        alt={part.part_name}
                        className="w-10 h-10 rounded-xl object-cover"
                        onError={(e) => {
                          ;(e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
                        }}
                      />
                      <div>
                        <p className="font-bold text-zinc-950 dark:text-white">{part.part_name}</p>
                        <span className="text-[10px] text-zinc-400 font-medium">{part.product_name}</span>
                      </div>
                    </td>
                    <td className="p-4 font-mono font-bold text-zinc-600 dark:text-zinc-300">{part.part_code}</td>
                    <td className="p-4 font-mono text-zinc-500 max-w-[160px] truncate">{part.hash}</td>
                    <td className="p-4 font-bold text-[#5B5FFF]">{part.verified_count} scan queries</td>
                    <td className="p-4">
                      <span className={`text-[9px] px-2.5 py-0.5 rounded-full font-bold uppercase tracking-wider ${statusColor(part.status)}`}>
                        {part.status || 'active'}
                      </span>
                    </td>
                    <td className="p-4 text-right space-x-1">
                      <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-zinc-500" onClick={() => handleOpenView(part)}>
                        <Eye className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-indigo-500" onClick={() => handleOpenEdit(part)}>
                        <Edit2 className="w-4 h-4" />
                      </button>
                      <button className="p-1.5 hover:bg-zinc-100 dark:hover:bg-zinc-900 rounded-lg text-red-500" onClick={() => handleDelete(part.id)}>
                        <Trash2 className="w-4 h-4" />
                      </button>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {/* Part Profiling Modal (View specifications & scan history) */}
      <Modal
        isOpen={isViewModalOpen}
        onClose={() => setIsViewModalOpen(false)}
        title="Ledger Inventory Details"
        size="lg"
      >
        {selectedPart && (
          <div className="space-y-6">
            <div className="flex flex-col md:flex-row gap-6 pb-6 border-b border-zinc-200 dark:border-zinc-800">
              <img
                src={selectedPart.ipfs_image}
                alt={selectedPart.part_name}
                className="w-full md:w-44 h-36 rounded-2xl object-cover border border-zinc-200 dark:border-zinc-800"
                onError={(e) => {
                  ;(e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
                }}
              />
              <div className="space-y-3 flex-1 text-left">
                <div>
                  <span className="text-[10px] font-bold bg-[#5B5FFF]/15 text-[#5B5FFF] px-2.5 py-0.5 rounded-full uppercase tracking-wider">
                    {selectedPart.product_name}
                  </span>
                  <h4 className="text-lg font-bold text-zinc-950 dark:text-white mt-1.5">{selectedPart.part_name}</h4>
                </div>
                
                <div className="grid grid-cols-2 gap-4 text-xs">
                  <div>
                    <span className="text-zinc-400 font-semibold uppercase block text-[10px] tracking-wide">Serial Code</span>
                    <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{selectedPart.part_code}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-semibold uppercase block text-[10px] tracking-wide">State Status</span>
                    <span className={`inline-block text-[9px] px-2 py-0.5 rounded-full font-bold uppercase mt-0.5 ${statusColor(selectedPart.status)}`}>
                      {selectedPart.status || 'active'}
                    </span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-semibold uppercase block text-[10px] tracking-wide">Ledger Creation Date</span>
                    <span className="font-medium text-zinc-800 dark:text-zinc-300">{new Date(selectedPart.created_at).toLocaleDateString()}</span>
                  </div>
                  <div>
                    <span className="text-zinc-400 font-semibold uppercase block text-[10px] tracking-wide">Audit Scan Count</span>
                    <span className="font-black text-[#5B5FFF]">{selectedPart.verified_count} times verified</span>
                  </div>
                </div>
              </div>
            </div>

            {/* Cryptographic Hash segment */}
            <div className="text-left space-y-1">
              <span className="text-[10px] font-bold uppercase tracking-wider text-zinc-400">Ledger Anchor Hash</span>
              <div className="p-3 bg-zinc-100 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-xl break-all font-mono text-[11px] text-zinc-600 dark:text-zinc-400 font-medium">
                {selectedPart.hash}
              </div>
            </div>

            {/* Historical Verification logs inside View Modal */}
            <div className="text-left space-y-3">
              <h5 className="font-bold text-xs text-zinc-950 dark:text-white uppercase tracking-wider flex items-center gap-1.5">
                <History className="w-4 h-4 text-indigo-500" /> Verification Trace Logs
              </h5>
              
              <div className="space-y-2.5 max-h-48 overflow-y-auto">
                {partLogs.length === 0 ? (
                  <p className="text-xs text-zinc-500 font-medium text-center py-4">No audit history scanned for this hash block.</p>
                ) : (
                  partLogs.map(log => (
                    <div key={log.id} className="p-3 bg-zinc-100/50 dark:bg-zinc-900/30 border border-zinc-200/30 dark:border-zinc-800/40 rounded-xl text-xs flex justify-between items-center">
                      <div>
                        <div className="flex items-center gap-1.5">
                          <span className={`w-2 h-2 rounded-full ${log.status === 'genuine' ? 'bg-emerald-500' : 'bg-red-500'}`}></span>
                          <span className="font-bold capitalize text-zinc-800 dark:text-zinc-200">{log.status}</span>
                        </div>
                        <span className="text-[10px] text-zinc-400 font-mono block mt-1">Audit wallet: {log.verifier_wallet}</span>
                      </div>
                      <span className="text-[10px] text-zinc-500">{new Date(log.verified_at).toLocaleDateString()}</span>
                    </div>
                  ))
                )}
              </div>
            </div>

            <Button variant="outline" className="w-full" onClick={() => setIsViewModalOpen(false)}>
              Close Specifications
            </Button>
          </div>
        )}
      </Modal>

      {/* Part Status Life Cycle Edit Modal */}
      <Modal
        isOpen={isEditModalOpen}
        onClose={() => setIsEditModalOpen(false)}
        title="Update Part Status"
      >
        {selectedPart && (
          <div className="space-y-6 text-left">
            <div>
              <h4 className="font-bold text-sm text-zinc-900 dark:text-white">{selectedPart.part_name}</h4>
              <p className="text-xs text-zinc-500 font-medium">Serial: {selectedPart.part_code}</p>
            </div>

            <div className="space-y-2">
              <label className="block text-xs font-bold text-zinc-500 uppercase tracking-wide">Status Lifecycle State</label>
              <select
                value={editStatus}
                onChange={(e) => setEditStatus(e.target.value as any)}
                className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] focus:border-transparent text-sm appearance-none cursor-pointer"
              >
                <option value="active">Active (Fully genuine and purchasable)</option>
                <option value="recalled">Recalled (Issues identified, flag counterfeit warnings)</option>
                <option value="discontinued">Discontinued (Obsolete, not actively manufactured)</option>
              </select>
            </div>

            <div className="flex gap-4">
              <Button variant="outline" className="flex-1" onClick={() => setIsEditModalOpen(false)}>
                Cancel
              </Button>
              <Button variant="gradient" className="flex-1 font-bold" onClick={handleSaveStatus}>
                Update State
              </Button>
            </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
