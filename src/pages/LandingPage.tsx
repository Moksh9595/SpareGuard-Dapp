import React, { useState, useEffect } from 'react'
import { Link } from 'react-router-dom'
import { motion } from 'framer-motion'
import {
  ShieldCheck,
  CheckCircle,
  AlertTriangle,
  Database,
  ArrowRight,
  Cpu,
  Layers,
  ChevronDown,
  Code,
  Users,
  Compass,
} from 'lucide-react'
import { Button } from '../components/Button'

export default function LandingPage() {
  const [openFaq, setOpenFaq] = useState<number | null>(null)
  const [interactionCount, setInteractionCount] = useState(145892)

  useEffect(() => {
    const interval = setInterval(() => {
      // Simulate real-time interactions ticking up
      setInteractionCount(prev => prev + Math.floor(Math.random() * 3) + 1)
    }, 2500)
    return () => clearInterval(interval)
  }, [])

  const toggleFaq = (index: number) => {
    setOpenFaq(openFaq === index ? null : index)
  }

  const features = [
    {
      icon: Cpu,
      title: 'Cryptographic Hashing',
      desc: 'Each spare part is assigned a unique cryptographic digest generated from its manufacturing specs and registered directly in Soroban smart contracts.',
    },
    {
      icon: Layers,
      title: 'Stellar Smart Contracts',
      desc: 'Deploys decentralized ledger logic to verify the provenance and authenticity of parts in real-time, removing third-party authorities.',
    },
    {
      icon: Database,
      title: 'Decentralized IPFS Storage',
      desc: 'Part manuals, schematics, and images are stored securely on IPFS (InterPlanetary File System), ensuring censorship-resistant metadata access.',
    },
  ]

  const howItWorks = [
    {
      step: '01',
      title: 'Part Registration',
      desc: 'Manufacturers sign a transaction using their Freighter wallet to register a new part with its specs and IPFS hash on the Stellar ledger.',
    },
    {
      step: '02',
      title: 'Ledger Anchoring',
      desc: 'The Soroban smart contract validates the signature and stores the cryptographic hash of the product key, mapping it to the manufacturer.',
    },
    {
      step: '03',
      title: 'Point of Authentication',
      desc: 'Customers scan the QR code or enter the part credentials on our portal to execute an instant verification search query directly on-chain.',
    },
  ]

  const faqs = [
    {
      q: 'How does blockchain ensure a part is genuine?',
      a: 'When a part is manufactured, its specifications and serial codes are compiled into a unique cryptographic hash. This hash is signed and permanently written to the Stellar ledger. Any attempt to modify the serial code or replicate the part will result in a verification failure on-chain, exposing counterfeit components.',
    },
    {
      q: 'What wallet is required to run the DApp?',
      a: 'We support Freighter Wallet, the official non-custodial browser extension for Stellar network. It secures your private keys and lets you sign smart contract invocations.',
    },
    {
      q: 'Can customers verify parts without a wallet?',
      a: 'Yes, verifying parts does not require a paid transaction signature. While connecting a wallet provides optimal audit logs, our customer portal allows instant hash lookups without wallet extension requirements.',
    },
  ]

  const testimonials = [
    {
      quote: 'Integrating SpareGuard reduced counterfeit claims in our supply chain by 94% within the first two months.',
      author: 'David Chen',
      role: 'Head of Quality, Apex Automotive',
    },
    {
      quote: 'The gas efficiency of Stellar network coupled with Soroban contracts makes product verification practically free at scale.',
      author: 'Sarah Jenkins',
      role: 'Supply Chain Architect, Global Tech',
    },
  ]

  return (
    <div className="relative min-h-screen bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 overflow-hidden">
      
      {/* Background Animated Blobs */}
      <div className="absolute inset-0 pointer-events-none overflow-hidden">
        <div className="absolute top-1/4 left-1/4 w-96 h-96 bg-[#5B5FFF]/10 dark:bg-[#5B5FFF]/15 rounded-full filter blur-[100px] animate-blob" />
        <div className="absolute top-1/3 right-1/4 w-96 h-96 bg-[#7C3AED]/10 dark:bg-[#7C3AED]/15 rounded-full filter blur-[100px] animate-blob animation-delay-2000" />
        <div className="absolute bottom-1/4 left-1/3 w-96 h-96 bg-[#06B6D4]/10 dark:bg-[#06B6D4]/15 rounded-full filter blur-[100px] animate-blob animation-delay-4000" />
      </div>

      {/* Sticky Header inside page for Landing Page context */}
      <nav className="glass-nav sticky top-0 z-50 px-6 py-4 flex items-center justify-between">
        <div className="flex items-center gap-2">
          <ShieldCheck className="w-7 h-7 text-[#5B5FFF]" />
          <span className="font-bold text-lg text-zinc-950 dark:text-white tracking-tight">SpareGuard</span>
        </div>
        <div className="flex items-center gap-4">
          <Link to="/wallet">
            <Button variant="gradient" size="sm" rightIcon={<ArrowRight className="w-4 h-4" />}>
              Launch DApp
            </Button>
          </Link>
        </div>
      </nav>

      {/* Hero Section */}
      <section className="relative px-6 pt-16 pb-24 md:pt-28 md:pb-36 max-w-7xl mx-auto text-center">
        <motion.div
          initial={{ opacity: 0, y: 30 }}
          animate={{ opacity: 1, y: 0 }}
          transition={{ duration: 0.8 }}
          className="space-y-6"
        >
          <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-[#5B5FFF]/10 border border-[#5B5FFF]/20 text-xs font-bold text-[#5B5FFF]">
            <CheckCircle className="w-3.5 h-3.5" /> Empowering Trust in Manufacturing
          </div>
          
          <h1 className="text-4xl md:text-7xl font-extrabold tracking-tight text-zinc-950 dark:text-white max-w-4xl mx-auto leading-[1.1]">
            Next-Gen Spare Part Authentication using <span className="text-gradient">Stellar Blockchain</span>
          </h1>
          
          <p className="text-base md:text-lg text-zinc-500 dark:text-zinc-400 max-w-2xl mx-auto font-medium">
            Combat counterfeiting, protect brand integrity, and assure customers of item genuineness with cryptographic anchoring on Stellar smart contracts.
          </p>

          <div className="flex flex-col sm:flex-row items-center justify-center gap-4 pt-6">
            <Link to="/wallet">
              <Button variant="gradient" size="lg" rightIcon={<ArrowRight className="w-5 h-5" />}>
                Connect Wallet
              </Button>
            </Link>
            <Link to="/wallet" onClick={() => sessionStorage.setItem('sp_wallet_role', 'customer')}>
              <Button variant="outline" size="lg">
                Verify As Guest
              </Button>
            </Link>
          </div>
        </motion.div>

        {/* Dashboard Preview / Blockchain Illustration */}
        <motion.div
          initial={{ opacity: 0, scale: 0.95, y: 40 }}
          animate={{ opacity: 1, scale: 1, y: 0 }}
          transition={{ delay: 0.3, duration: 0.8 }}
          className="mt-16 md:mt-24 max-w-5xl mx-auto glass-card rounded-3xl p-2.5 overflow-hidden shadow-2xl relative"
        >
          <div className="absolute inset-0 bg-gradient-to-t from-zinc-50 dark:from-zinc-950 via-transparent to-transparent z-10" />
          <div className="bg-zinc-100 dark:bg-zinc-900 rounded-[22px] overflow-hidden border border-zinc-200/40 dark:border-zinc-800/40">
            {/* Mock Dashboard Preview */}
            <div className="px-4 py-3 bg-zinc-200/50 dark:bg-zinc-950/80 border-b border-zinc-300/30 dark:border-zinc-800/40 flex items-center gap-2">
              <div className="flex gap-1.5">
                <span className="w-3 h-3 rounded-full bg-red-400"></span>
                <span className="w-3 h-3 rounded-full bg-yellow-400"></span>
                <span className="w-3 h-3 rounded-full bg-green-400"></span>
              </div>
              <div className="mx-auto w-1/3 bg-zinc-300/60 dark:bg-zinc-900 rounded-lg h-5 flex items-center justify-center text-[10px] text-zinc-500 font-bold">
                https://spareguard.stellar.auth/dashboard
              </div>
            </div>
            <div className="h-64 md:h-[400px] bg-zinc-900 flex items-center justify-center relative p-8">
              {/* Architecture Diagram Visualization */}
              <div className="grid grid-cols-3 gap-4 w-full max-w-3xl items-center relative z-20 text-zinc-300">
                <div className="glass-card p-5 rounded-2xl border-indigo-500/20 bg-zinc-950/80 shadow-indigo-500/5 hover:border-indigo-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-indigo-500/10 flex items-center justify-center text-indigo-400 mb-3 mx-auto">
                    <Users className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Manufacturer Client</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Registers specs, triggers cryptographic hash key generation.</p>
                </div>
                
                <div className="flex flex-col items-center">
                  <div className="w-full border-t-2 border-dashed border-indigo-500/30 flex items-center justify-center py-2 text-xs font-bold text-indigo-400">
                    Freighter Sign
                  </div>
                  <div className="bg-gradient-to-br from-indigo-500 to-purple-600 p-6 rounded-3xl text-white shadow-xl glow-primary">
                    <Code className="w-8 h-8" />
                    <span className="block text-[10px] uppercase font-bold mt-2">Soroban Contract</span>
                  </div>
                  <div className="w-full border-b-2 border-dashed border-indigo-500/30 flex items-center justify-center py-2 text-xs font-bold text-indigo-400">
                    Verify Query
                  </div>
                </div>

                <div className="glass-card p-5 rounded-2xl border-cyan-500/20 bg-zinc-950/80 shadow-cyan-500/5 hover:border-cyan-500/40 transition-colors">
                  <div className="w-10 h-10 rounded-xl bg-cyan-500/10 flex items-center justify-center text-cyan-400 mb-3 mx-auto">
                    <Compass className="w-5 h-5" />
                  </div>
                  <h4 className="font-bold text-sm text-white">Consumer Audit</h4>
                  <p className="text-[10px] text-zinc-400 mt-1">Queries smart contract state ledger for matching hash key.</p>
                </div>
              </div>
            </div>
          </div>
        </motion.div>
      </section>

      {/* Features Grid Section */}
      <section className="px-6 py-20 max-w-7xl mx-auto border-t border-zinc-200/50 dark:border-zinc-900">
        <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white">Core Technology Layer</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm md:text-base">
            Engineered with modern cryptographic systems and distributed consensus algorithms to build foolproof hardware authenticity records.
          </p>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-8">
          {features.map((feat, idx) => {
            const Icon = feat.icon
            return (
              <motion.div
                key={idx}
                whileHover={{ y: -8 }}
                className="glass-card glass-card-hover p-8 rounded-3xl relative overflow-hidden"
              >
                <div className="w-12 h-12 bg-[#5B5FFF]/10 rounded-2xl flex items-center justify-center text-[#5B5FFF] mb-6">
                  <Icon className="w-6 h-6" />
                </div>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white mb-3">{feat.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{feat.desc}</p>
              </motion.div>
            )
          })}
        </div>
      </section>

      {/* How it Works Workflow Section */}
      <section className="px-6 py-20 bg-zinc-100/50 dark:bg-zinc-900/30 border-y border-zinc-200/40 dark:border-zinc-900/80">
        <div className="max-w-7xl mx-auto">
          <div className="text-center max-w-2xl mx-auto mb-16 space-y-3">
            <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white">Workflow Pipeline</h2>
            <p className="text-zinc-500 dark:text-zinc-400 text-sm">
              Discover how SpareGuard connects manufacturers and customers on the Stellar network.
            </p>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-12 relative">
            {howItWorks.map((step, idx) => (
              <div key={idx} className="relative space-y-4">
                <span className="text-6xl font-black text-[#5B5FFF]/10 dark:text-[#5B5FFF]/20 select-none block">
                  {step.step}
                </span>
                <h3 className="text-lg font-bold text-zinc-950 dark:text-white">{step.title}</h3>
                <p className="text-sm text-zinc-500 dark:text-zinc-400 leading-relaxed font-medium">{step.desc}</p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* Real-time Interaction Counter */}
      <section className="px-6 py-20 max-w-7xl mx-auto text-center">
        <div className="text-center max-w-2xl mx-auto mb-12">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white">Live Platform Activity</h2>
          <p className="text-zinc-500 dark:text-zinc-400 text-sm mt-4 font-medium">
            Real-time verification and registration queries executed across the network.
          </p>
        </div>

        <div className="glass-card max-w-xl mx-auto p-12 rounded-[2.5rem] border-zinc-200/60 dark:border-zinc-800/60 relative overflow-hidden shadow-2xl shadow-[#5B5FFF]/5">
          <div className="absolute inset-0 bg-gradient-to-br from-[#5B5FFF]/10 via-transparent to-[#7C3AED]/10 opacity-50" />
          <motion.div
            key={interactionCount}
            initial={{ scale: 0.97, opacity: 0.8 }}
            animate={{ scale: 1, opacity: 1 }}
            transition={{ type: 'spring', stiffness: 300, damping: 20 }}
            className="relative"
          >
            <h3 className="text-6xl md:text-[5.5rem] font-black text-transparent bg-clip-text bg-gradient-to-r from-[#5B5FFF] to-[#7C3AED] tracking-tight">
              {interactionCount.toLocaleString()}
            </h3>
            <div className="mt-6 flex items-center justify-center gap-2 text-xs uppercase tracking-widest font-bold text-zinc-500 dark:text-zinc-400">
              <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
              Total Global Interactions
            </div>
          </motion.div>
        </div>
      </section>

      {/* FAQ Section */}
      <section className="px-6 py-20 max-w-4xl mx-auto border-t border-zinc-200/50 dark:border-zinc-900">
        <div className="text-center mb-12 space-y-3">
          <h2 className="text-3xl md:text-5xl font-extrabold text-zinc-950 dark:text-white font-sans">Frequently Asked Questions</h2>
          <p className="text-zinc-500 text-sm">Everything you need to understand the platform.</p>
        </div>

        <div className="space-y-4">
          {faqs.map((faq, idx) => {
            const isOpen = openFaq === idx
            return (
              <div key={idx} className="glass-card rounded-2xl overflow-hidden border border-zinc-200/50 dark:border-zinc-800/50">
                <button
                  onClick={() => toggleFaq(idx)}
                  className="w-full px-6 py-5 flex items-center justify-between text-left hover:bg-zinc-100/40 dark:hover:bg-zinc-900/40 transition-colors"
                >
                  <span className="font-bold text-sm text-zinc-950 dark:text-white">{faq.q}</span>
                  <ChevronDown className={`w-5 h-5 text-zinc-500 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                </button>
                
                <motion.div
                  initial={{ height: 0 }}
                  animate={{ height: isOpen ? 'auto' : 0 }}
                  transition={{ duration: 0.3 }}
                  className="overflow-hidden bg-zinc-50/50 dark:bg-zinc-900/10"
                >
                  <div className="px-6 pb-6 pt-2 text-sm text-zinc-500 dark:text-zinc-400 font-medium leading-relaxed">
                    {faq.a}
                  </div>
                </motion.div>
              </div>
            )
          })}
        </div>
      </section>

      {/* Footer */}
      <footer className="border-t border-zinc-200/50 dark:border-zinc-900 px-6 py-12 bg-white/30 dark:bg-zinc-950/30 backdrop-blur-md">
        <div className="max-w-7xl mx-auto flex flex-col md:flex-row items-center justify-between gap-6">
          <div className="flex items-center gap-2">
            <ShieldCheck className="w-6 h-6 text-[#5B5FFF]" />
            <span className="font-bold text-sm text-zinc-950 dark:text-white">SpareGuard</span>
          </div>
          <p className="text-xs text-zinc-500">
            &copy; {new Date().getFullYear()} SpareGuard Inc. Built on Stellar. All rights reserved.
          </p>
          <div className="flex gap-4 text-xs font-bold text-zinc-500">
            <a href="#" className="hover:text-[#5B5FFF]">Stellar Ledger</a>
            <a href="#" className="hover:text-[#5B5FFF]">Privacy</a>
            <a href="#" className="hover:text-[#5B5FFF]">Docs</a>
          </div>
        </div>
      </footer>
    </div>
  )
}
