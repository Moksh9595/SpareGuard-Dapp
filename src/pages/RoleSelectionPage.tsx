import React, { useState } from 'react'
import { useNavigate } from 'react-router-dom'
import { motion } from 'framer-motion'
import { useAppContext } from '../contexts/AppContext'
import { Button } from '../components/Button'
import { Factory, ShieldCheck, ArrowRight, UserCheck, Settings, Users } from 'lucide-react'
import { usePartAuth } from '../hooks/usePartAuth'
import toast from 'react-hot-toast'

export default function RoleSelectionPage() {
  const { account, role, setRole, manufacturerName, setManufacturerName } = useAppContext()
  const { isManufacturer, registerManufacturer, loading } = usePartAuth()
  const [selected, setSelected] = useState<'manufacturer' | 'customer' | null>(role)
  const [mfgInput, setMfgInput] = useState(manufacturerName)
  const [showMfgSetup, setShowMfgSetup] = useState(false)
  const navigate = useNavigate()

  // Guard routing
  React.useEffect(() => {
    if (!account) {
      navigate('/error/wallet-not-connected')
    }
  }, [account, navigate])

  const handleContinue = async () => {
    if (!selected) {
      toast.error('Please select a system access role first.')
      return
    }

    if (selected === 'manufacturer') {
      if (!account) return

      const isRegistered = await isManufacturer(account)
      if (isRegistered) {
        setRole('manufacturer')
        toast.success('Welcome back! Manufacturer verified on Stellar Ledger.')
        navigate('/manufacturer')
      } else {
        if (!showMfgSetup) {
          setShowMfgSetup(true)
        } else {
          const registered = await registerManufacturer(account, mfgInput || 'Stellar Electrics')
          if (registered) {
            setRole('manufacturer')
            setManufacturerName(mfgInput || 'Stellar Electrics')
            navigate('/manufacturer')
          }
        }
      }
    } else {
      setRole('customer')
      toast.success('Access granted as Customer Auditor')
      navigate('/customer')
    }
  }

  return (
    <div className="min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 py-12 px-6 flex items-center justify-center relative overflow-hidden">
      
      {/* Background blobs */}
      <div className="absolute top-1/4 left-1/3 w-96 h-96 bg-[#5B5FFF]/10 dark:bg-[#5B5FFF]/15 rounded-full filter blur-[100px] pointer-events-none" />
      <div className="absolute bottom-1/4 right-1/3 w-96 h-96 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 rounded-full filter blur-[100px] pointer-events-none" />

      <div className="w-full max-w-3xl relative z-10 space-y-10 text-center">
        <div className="space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold tracking-tight text-zinc-950 dark:text-white">Choose Access Gateway</h2>
          <p className="text-zinc-500 dark:text-zinc-400 max-w-md mx-auto text-sm">
            Configure your interaction layer. Manufacturers write cryptograms, customers execute provenance audit lookups.
          </p>
        </div>

        {!showMfgSetup ? (
          /* Main Choice Screen */
          <div className="space-y-8">
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6 max-w-2xl mx-auto">
              
              {/* Manufacturer Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => setSelected('manufacturer')}
                className={`glass-card p-8 rounded-3xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px]
                  ${
                    selected === 'manufacturer'
                      ? 'border-[#5B5FFF] ring-2 ring-[#5B5FFF]/20 dark:bg-zinc-900/80'
                      : 'border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors
                    ${selected === 'manufacturer' ? 'bg-[#5B5FFF]/15 text-[#5B5FFF]' : 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500'}`}
                  >
                    <Factory className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Manufacturer Portal</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Register hardware designs, generate unique product hash identifiers, and monitor product authenticity reports.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#5B5FFF]">
                  <span>Sign Registry Contracts</span>
                </div>
              </motion.div>

              {/* Customer Card */}
              <motion.div
                whileHover={{ y: -6, scale: 1.01 }}
                onClick={() => setSelected('customer')}
                className={`glass-card p-8 rounded-3xl text-left border cursor-pointer transition-all duration-300 relative overflow-hidden flex flex-col justify-between min-h-[260px]
                  ${
                    selected === 'customer'
                      ? 'border-[#7C3AED] ring-2 ring-[#7C3AED]/20 dark:bg-zinc-900/80'
                      : 'border-zinc-200/60 dark:border-zinc-800/80 hover:border-zinc-300 dark:hover:border-zinc-700'
                  }`}
              >
                <div>
                  <div className={`w-12 h-12 rounded-2xl flex items-center justify-center mb-6 transition-colors
                    ${selected === 'customer' ? 'bg-[#7C3AED]/15 text-[#7C3AED]' : 'bg-zinc-200/50 dark:bg-zinc-800/50 text-zinc-500'}`}
                  >
                    <ShieldCheck className="w-6 h-6" />
                  </div>
                  <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-2">Customer Audit Portal</h3>
                  <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">
                    Perform instant cryptographic checksum checks on parts without code compilation or transaction signing.
                  </p>
                </div>
                <div className="mt-6 flex items-center gap-1.5 text-xs font-bold text-[#7C3AED]">
                  <span>Verify Part Provenance</span>
                </div>
              </motion.div>

            </div>

            <div className="max-w-2xl mx-auto flex justify-between items-center pt-4">
              <Button variant="ghost" className="text-xs" onClick={() => navigate('/wallet')}>
                Back to Wallet
              </Button>
              <Button
                variant="gradient"
                className="px-8 py-3.5 text-sm font-bold"
                rightIcon={<ArrowRight className="w-4 h-4" />}
                onClick={handleContinue}
                disabled={!selected || loading}
                isLoading={loading}
              >
                {selected === 'manufacturer' && !role ? 'Configure Company profile' : 'Enter Dashboard'}
              </Button>
            </div>
          </div>
        ) : (
          /* Manufacturer Company Setup Step */
          <motion.div
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            className="glass-card rounded-3xl p-8 max-w-md mx-auto text-left space-y-6 shadow-2xl border-zinc-200/80 dark:border-zinc-800/80"
          >
            <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
              <Factory className="w-5 h-5 text-indigo-500" />
              <h3 className="font-bold text-base text-zinc-950 dark:text-white">Manufacturer Details</h3>
            </div>

            <div className="space-y-4">
              <div className="text-left">
                <label className="block mb-1.5 text-xs font-semibold text-zinc-500 uppercase tracking-wider">Manufacturer / Brand Name</label>
                <input
                  type="text"
                  value={mfgInput}
                  onChange={(e) => setMfgInput(e.target.value)}
                  placeholder="E.g., Stellar Electrics, Apex Motors"
                  className="w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] focus:border-transparent text-sm"
                />
              </div>

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-zinc-500 dark:text-zinc-400 space-y-1">
                <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">DApp Protocol Requirement:</span>
                This brand name will be logged on-chain with your wallet signature for all registered parts.
              </div>
            </div>

            <div className="flex gap-4 pt-2">
              <Button variant="outline" className="flex-1" onClick={() => setShowMfgSetup(false)}>
                Go Back
              </Button>
              <Button variant="gradient" className="flex-1" onClick={handleContinue} isLoading={loading}>
                Sign in
              </Button>
            </div>
          </motion.div>
        )}
      </div>
    </div>
  )
}
