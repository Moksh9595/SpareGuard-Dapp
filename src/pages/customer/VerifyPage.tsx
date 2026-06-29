import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { ProgressBar } from '../../components/Loader'
import {
  ShieldCheck,
  AlertTriangle,
  RefreshCw,
  Search,
  CheckCircle2,
  XCircle,
  Factory,
  Cpu,
  Calendar,
  Layers,
  ArrowRight,
  Info,
} from 'lucide-react'
import { VerificationLog } from '../../types'

interface VerifyFormInputs {
  part_code: string
  hash: string
}

export default function VerifyPage() {
  const navigate = useNavigate()
  const { account } = useAppContext()
  const { verifyPart, loading } = usePartAuth()
  
  const [verifyingProgress, setVerifyingProgress] = useState(0)
  const [isVerifying, setIsVerifying] = useState(false)
  const [result, setResult] = useState<VerificationLog | null>(null)
  
  const {
    register,
    handleSubmit,
    formState: { errors },
    reset,
  } = useForm<VerifyFormInputs>({
    defaultValues: {
      part_code: '',
      hash: '',
    },
  })

  const onSubmit = async (data: VerifyFormInputs) => {
    setIsVerifying(true)
    setResult(null)
    setVerifyingProgress(0)

    // Animate progress bar to simulate smart contract interaction delay
    const interval = setInterval(() => {
      setVerifyingProgress((prev) => {
        if (prev >= 100) {
          clearInterval(interval)
          return 100
        }
        return prev + 10
      })
    }, 180)

    try {
      const response = await verifyPart(account || 'GCST_CUSTOMER_AUDITOR_PUBLIC_KEY', data.part_code, data.hash)
      clearInterval(interval)
      setVerifyingProgress(100)
      
      // Delay slightly before showing result for smooth animation
      setTimeout(() => {
        setResult(response)
        setIsVerifying(false)
      }, 300)

    } catch (err: any) {
      clearInterval(interval)
      setIsVerifying(false)
      console.error(err)
      toast.error(err.message || 'Verification query failed')
    }
  }

  const handleReset = () => {
    setResult(null)
    reset()
  }

  return (
    <div className="space-y-8 max-w-3xl mx-auto">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Provenance Verification Portal
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Query Stellar consensus state to audit hardware authenticity.
        </p>
      </div>

      <AnimatePresence mode="wait">
        {/* Verification Form (Idle State) */}
        {!isVerifying && !result && (
          <motion.div
            key="verify-form"
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            className="glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80 shadow-2xl"
          >
            <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
              
              <div className="flex items-center gap-3 pb-3 border-b border-zinc-100 dark:border-zinc-800/80">
                <Search className="w-5 h-5 text-indigo-500" />
                <h3 className="font-bold text-sm text-zinc-950 dark:text-white uppercase tracking-wider">Part Identity Specs</h3>
              </div>

              <Input
                label="Part Serial Code"
                placeholder="E.g., REF-COMP-9021"
                error={errors.part_code?.message}
                {...register('part_code', { 
                  required: 'Part Serial Code is required',
                  pattern: {
                    value: /^[A-Z0-9-]+$/,
                    message: 'Part code must contain only uppercase letters, numbers, and hyphens'
                  }
                })}
              />

              <Input
                label="Cryptographic Verification Hash"
                placeholder="Enter 64-character SHA-256 hexadecimal hash"
                error={errors.hash?.message}
                {...register('hash', { 
                  required: 'Verification Hash is required',
                  minLength: {
                    value: 64,
                    message: 'SHA-256 checksum hash must be exactly 64 hexadecimal characters'
                  },
                  maxLength: {
                    value: 64,
                    message: 'SHA-256 checksum hash must be exactly 64 hexadecimal characters'
                  },
                  pattern: {
                    value: /^[a-fA-F0-9]{64}$/,
                    message: 'Must be a valid hex digest'
                  }
                })}
              />

              <div className="p-4 rounded-2xl bg-indigo-500/5 border border-indigo-500/10 text-xs text-zinc-500 dark:text-zinc-400 space-y-1.5 leading-relaxed flex items-start gap-2.5">
                <Info className="w-4.5 h-4.5 text-indigo-500 shrink-0 mt-0.5" />
                <div>
                  <span className="font-bold text-zinc-700 dark:text-zinc-300 block">Mock Testing Guide:</span>
                  Try using one of the pre-loaded inventory items to verify successfully (e.g. Serial: <code className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded font-bold text-indigo-500">REF-COMP-9021</code> and Hash: <code className="font-mono bg-zinc-200 dark:bg-zinc-800 px-1 rounded font-bold text-indigo-500">8f3c7d2e1b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d</code>). Typing random strings will demonstrate counterfeit triggers.
                </div>
              </div>

              <Button
                type="submit"
                variant="gradient"
                className="w-full py-4 font-bold text-sm"
                rightIcon={<ShieldCheck className="w-5 h-5" />}
              >
                Perform Blockchain Audit Check
              </Button>

            </form>
          </motion.div>
        )}

        {/* Loading Progress State */}
        {isVerifying && (
          <motion.div
            key="verifying-loader"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="glass-card rounded-3xl p-12 text-center border-zinc-200/60 dark:border-zinc-800/80 shadow-2xl space-y-6"
          >
            <div className="w-16 h-16 bg-indigo-500/10 text-indigo-500 rounded-2xl flex items-center justify-center mx-auto relative">
              <RefreshCw className="w-8 h-8 animate-spin" />
            </div>

            <div className="space-y-2">
              <h3 className="font-black text-lg text-zinc-950 dark:text-white">Querying Stellar Ledger</h3>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium">
                Scanning Soroban smart contract inventory nodes for matching credentials signatures...
              </p>
            </div>

            <div className="max-w-md mx-auto">
              <ProgressBar progress={verifyingProgress} label="Transaction validation trace status" />
            </div>
          </motion.div>
        )}

        {/* Genuine Validation Result (Success Card) */}
        {!isVerifying && result && result.status === 'genuine' && (
          <motion.div
            key="genuine-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-3xl p-6 md:p-8 border-[#22C55E]/40 dark:border-[#22C55E]/40 shadow-xl shadow-emerald-500/5 text-left relative overflow-hidden bg-gradient-to-br from-emerald-500/5 via-transparent to-transparent">
              
              {/* Status Header banner */}
              <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <div className="w-12 h-12 bg-emerald-500/10 text-emerald-500 rounded-2xl flex items-center justify-center glow-accent">
                  <CheckCircle2 className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-emerald-500 tracking-wider">Authentication Confirmed</span>
                  <h3 className="font-extrabold text-lg text-zinc-950 dark:text-white mt-0.5">Genuine Part Verified</h3>
                </div>
              </div>

              {/* Specification layout */}
              <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
                <div className="space-y-4">
                  <div className="grid grid-cols-2 gap-4 text-xs">
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase block text-[10px]">Product Brand</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5 mt-1">
                        <Factory className="w-4 h-4 text-indigo-500" /> {result.manufacturer_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase block text-[10px]">Asset Category</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100 flex items-center gap-1.5 mt-1">
                        <Layers className="w-4 h-4 text-purple-500" /> {result.product_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase block text-[10px]">Component Name</span>
                      <span className="font-bold text-zinc-800 dark:text-zinc-100 mt-1 block">
                        {result.part_name}
                      </span>
                    </div>
                    <div>
                      <span className="text-zinc-400 font-semibold uppercase block text-[10px]">Serial Code</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-100 mt-1 block">
                        {result.part_code}
                      </span>
                    </div>
                  </div>

                  <div className="space-y-1.5 text-xs text-zinc-500 bg-zinc-100/50 dark:bg-zinc-950/40 p-4 border border-zinc-200/50 dark:border-zinc-800/80 rounded-2xl">
                    <span className="font-bold text-zinc-700 dark:text-zinc-300 block mb-1">Stellar Verification Meta</span>
                    <div className="flex justify-between items-center text-[10px] pb-1 border-b border-zinc-200 dark:border-zinc-800">
                      <span>Verification Log</span>
                      <span className="font-mono font-bold text-zinc-800 dark:text-zinc-200">{result.id}</span>
                    </div>
                    <div className="flex justify-between items-center text-[10px] pt-1">
                      <span>Block Timestamp</span>
                      <span>{new Date(result.verified_at).toLocaleTimeString()}</span>
                    </div>
                  </div>
                </div>

                {/* Side media preview */}
                <div className="flex flex-col justify-center">
                  <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-40 bg-zinc-100 dark:bg-zinc-900 relative">
                    <img
                      src="https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80"
                      alt="Part Image"
                      className="w-full h-full object-cover"
                    />
                  </div>
                </div>
              </div>

              {/* Dynamic Action */}
              <div className="mt-8 flex gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Audit Another
                </Button>
                <Button 
                  variant="outline" 
                  className="flex-1" 
                  onClick={() => {
                    const url = result?.txHash 
                      ? `https://stellar.expert/explorer/testnet/tx/${result.txHash}`
                      : `https://stellar.expert/explorer/testnet/account/${account}`
                    window.open(url, '_blank')
                  }}
                >
                  View on Stellar
                </Button>
                <Button variant="gradient" className="flex-1" onClick={() => navigate('/customer')}>
                  Exit Dashboard
                </Button>
              </div>

            </div>
          </motion.div>
        )}

        {/* Counterfeit Validation Result (Failure Card) */}
        {!isVerifying && result && result.status === 'counterfeit' && (
          <motion.div
            key="counterfeit-result"
            initial={{ opacity: 0, scale: 0.95 }}
            animate={{ opacity: 1, scale: 1 }}
            exit={{ opacity: 0, scale: 0.95 }}
            className="space-y-6"
          >
            <div className="glass-card rounded-3xl p-6 md:p-8 border-[#EF4444]/40 dark:border-[#EF4444]/40 shadow-xl shadow-red-500/5 text-left relative overflow-hidden bg-gradient-to-br from-red-500/5 via-transparent to-transparent">
              
              <div className="flex items-center gap-3 pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <div className="w-12 h-12 bg-red-500/10 text-red-500 rounded-2xl flex items-center justify-center glow-primary">
                  <XCircle className="w-7 h-7" />
                </div>
                <div>
                  <span className="text-[10px] font-black uppercase text-red-500 tracking-wider">Security Warning Alert</span>
                  <h3 className="font-extrabold text-lg text-zinc-950 dark:text-white mt-0.5">Potential Counterfeit Detected</h3>
                </div>
              </div>

              <div className="space-y-6">
                <div className="p-4 rounded-2xl bg-red-500/5 border border-red-500/10 text-xs text-red-500 dark:text-red-400 space-y-1">
                  <span className="font-bold block">Verification Audit Failed:</span>
                  <p className="font-semibold">{result.failure_reason}</p>
                </div>

                <div className="space-y-3 text-xs text-zinc-500 leading-relaxed font-medium">
                  <p>
                    This signature code does not align with any valid block registered by certified manufacturers on Stellar Smart Contract registry.
                  </p>
                  <ul className="list-disc pl-4 space-y-1.5">
                    <li>Verify spelling/formatting of inputted checksum keys.</li>
                    <li>Contact distributor to trace source provenance.</li>
                    <li>Avoid installing this part as it might fail safety standards.</li>
                  </ul>
                </div>
              </div>

              <div className="mt-8 flex gap-4 border-t border-zinc-200 dark:border-zinc-800 pt-6">
                <Button variant="outline" className="flex-1" onClick={handleReset}>
                  Try Again
                </Button>
                <Button variant="danger" className="flex-1 font-bold" onClick={() => navigate('/customer')}>
                  Report Incident
                </Button>
              </div>

            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </div>
  )
}
