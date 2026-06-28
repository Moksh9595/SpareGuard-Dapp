import React, { useState } from 'react'
import { useAppContext } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from '../components/Button'
import { Input } from '../components/Input'
import {
  Sun,
  Moon,
  Globe,
  User,
  Wallet,
  Settings,
  ShieldCheck,
  CheckCircle,
} from 'lucide-react'
import toast from 'react-hot-toast'

export default function SettingsPage() {
  const { account, role, balance, manufacturerName, setManufacturerName } = useAppContext()
  const { theme, toggleTheme } = useTheme()
  
  const [mfgName, setMfgName] = useState(manufacturerName)
  const [lang, setLang] = useState('English')

  const handleSaveProfile = (e: React.FormEvent) => {
    e.preventDefault()
    setManufacturerName(mfgName)
    toast.success('Company profile updated successfully!')
  }

  return (
    <div className="space-y-8 max-w-2xl mx-auto text-left">
      
      {/* Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          System Settings
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Configure interface options, profile details, and blockchain nodes.
        </p>
      </div>

      <div className="space-y-6">
        
        {/* Profile Card (Only for Manufacturers) */}
        {role === 'manufacturer' && (
          <div className="glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80 shadow-xl space-y-6">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
              <User className="w-4.5 h-4.5 text-indigo-500" /> Manufacturer Profile
            </h3>
            
            <form onSubmit={handleSaveProfile} className="space-y-4">
              <Input
                label="Company / Brand Name"
                value={mfgName}
                onChange={(e) => setMfgName(e.target.value)}
                placeholder="E.g., Stellar Electrics"
              />
              <Button type="submit" variant="primary" size="sm">
                Save Profile
              </Button>
            </form>
          </div>
        )}

        {/* Display Settings Card */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80 shadow-xl space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Globe className="w-4.5 h-4.5 text-purple-500" /> Interface Preferences
          </h3>
          
          <div className="space-y-6">
            
            {/* Theme Toggle option */}
            <div className="flex items-center justify-between">
              <div>
                <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 block">Dark Mode</span>
                <span className="text-xs text-zinc-400">Optimize interface styling for dark environments.</span>
              </div>
              <button
                onClick={toggleTheme}
                className="p-2.5 rounded-xl bg-zinc-100 dark:bg-zinc-900 border border-zinc-200 dark:border-zinc-800 text-zinc-700 dark:text-yellow-500 hover:scale-105 active:scale-95 transition-all"
              >
                {theme === 'dark' ? <Sun className="w-5 h-5" /> : <Moon className="w-5 h-5 text-zinc-700" />}
              </button>
            </div>

            {/* Language option */}
            <div className="flex items-center justify-between border-t border-zinc-100 dark:border-zinc-800/60 pt-6">
              <div>
                <span className="font-bold text-sm text-zinc-800 dark:text-zinc-200 block">System Language</span>
                <span className="text-xs text-zinc-400">Select language interface preferences.</span>
              </div>
              <select
                value={lang}
                onChange={(e) => {
                  setLang(e.target.value)
                  toast.success(`Language set to ${e.target.value} (simulated)`)
                }}
                className="px-3 py-2 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-900 text-zinc-700 dark:text-zinc-300 text-xs focus:ring-2 focus:ring-[#5B5FFF] focus:outline-none"
              >
                <option value="English">English</option>
                <option value="Spanish">Spanish (Español)</option>
                <option value="German">German (Deutsch)</option>
                <option value="French">French (Français)</option>
              </select>
            </div>

          </div>
        </div>

        {/* Ledger & Wallet Card */}
        <div className="glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80 shadow-xl space-y-6">
          <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5 border-b border-zinc-100 dark:border-zinc-800/80 pb-3">
            <Wallet className="w-4.5 h-4.5 text-cyan-500" /> Stellar Ledger Configuration
          </h3>
          
          <div className="space-y-4 text-xs font-semibold text-zinc-500">
            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <span>Node Horizon Server</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 font-bold">https://horizon-testnet.stellar.org</span>
            </div>
            <div className="flex justify-between border-b border-zinc-100 dark:border-zinc-800/60 pb-3">
              <span>System Role Gateway</span>
              <span className="capitalize font-bold text-indigo-500">{role || 'Not set'}</span>
            </div>
            <div className="flex justify-between">
              <span>Stellar Account Wallet</span>
              <span className="font-mono text-zinc-800 dark:text-zinc-300 truncate max-w-[50%]">{account || 'Disconnected'}</span>
            </div>
          </div>
        </div>

      </div>

    </div>
  )
}
