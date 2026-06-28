import React, { useState } from 'react'
import { Link, useNavigate, useLocation } from 'react-router-dom'
import { useAppContext } from '../contexts/AppContext'
import { useTheme } from '../contexts/ThemeContext'
import { Button } from '../components/Button'
import {
  LayoutDashboard,
  PlusCircle,
  Package,
  History,
  Settings,
  HelpCircle,
  Menu,
  X,
  Sun,
  Moon,
  Wallet,
  Bell,
  LogOut,
  ShieldCheck,
  Zap,
} from 'lucide-react'
import { motion, AnimatePresence } from 'framer-motion'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout: React.FC<DashboardLayoutProps> = ({ children }) => {
  const { account, balance, role, disconnectWallet, manufacturerName } = useAppContext()
  const { theme, toggleTheme } = useTheme()
  const [isSidebarOpen, setIsSidebarOpen] = useState(false)
  const [isNotificationsOpen, setIsNotificationsOpen] = useState(false)
  const navigate = useNavigate()
  const location = useLocation()

  // Verify wallet is connected
  React.useEffect(() => {
    if (!account) {
      navigate('/error/wallet-not-connected')
    }
  }, [account, navigate])

  const menuItems = role === 'manufacturer' 
    ? [
        { label: 'Dashboard', path: '/manufacturer', icon: LayoutDashboard },
        { label: 'Add Part', path: '/manufacturer/add', icon: PlusCircle },
        { label: 'Added Products', path: '/manufacturer/products', icon: Package },
        { label: 'Verification Logs', path: '/manufacturer/logs', icon: History },
        { label: 'Settings', path: '/manufacturer/settings', icon: Settings },
      ]
    : [
        { label: 'Dashboard', path: '/customer', icon: LayoutDashboard },
        { label: 'Verify Part', path: '/customer/verify', icon: ShieldCheck },
        { label: 'Settings', path: '/customer/settings', icon: Settings },
      ]

  const formatAddress = (addr: string | null) => {
    if (!addr) return ''
    return `${addr.substring(0, 6)}...${addr.substring(addr.length - 4)}`
  }

  const mockNotifications = [
    { id: 1, title: 'Genuine Part verified', desc: 'Inverter Compressor Gen-3 was verified.', time: '2m ago' },
    { id: 2, title: 'Counterfeit detected', desc: 'Invalid hash query found on refrigerator part.', time: '1h ago' },
    { id: 3, title: 'Smart contract updated', desc: 'Gas optimization rules applied.', time: '1d ago' },
  ]

  return (
    <div className="min-h-screen flex bg-zinc-50 dark:bg-zinc-950 text-zinc-800 dark:text-zinc-200 transition-colors duration-300">
      
      {/* Sidebar - Desktop */}
      <aside className="hidden lg:flex flex-col w-64 border-r border-zinc-200/50 dark:border-zinc-800/50 bg-white/40 dark:bg-zinc-950/40 backdrop-blur-xl h-screen sticky top-0">
        <div className="p-6 flex items-center gap-2.5 border-b border-zinc-200/50 dark:border-zinc-800/50">
          <div className="bg-indigo-600 p-2 rounded-xl text-white">
            <ShieldCheck className="w-6 h-6 animate-pulse" />
          </div>
          <div>
            <span className="font-bold text-base tracking-tight text-zinc-900 dark:text-white">SpareGuard</span>
            <span className="block text-[10px] text-zinc-500 font-bold uppercase tracking-wider">Blockchain Auth</span>
          </div>
        </div>

        <nav className="flex-1 px-4 py-6 space-y-1">
          {menuItems.map((item) => {
            const isActive = location.pathname === item.path
            const Icon = item.icon
            return (
              <Link
                key={item.path}
                to={item.path}
                className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                  isActive
                    ? 'bg-[#5B5FFF] text-white shadow-lg shadow-indigo-500/10'
                    : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-200/40 dark:hover:bg-zinc-800/40 hover:text-zinc-900 dark:hover:text-white'
                }`}
              >
                <Icon className="w-5 h-5" />
                {item.label}
              </Link>
            )
          })}
        </nav>

        <div className="p-4 border-t border-zinc-200/50 dark:border-zinc-800/50 space-y-4">
          {/* User profile preview */}
          <div className="flex items-center gap-3 px-2 py-1">
            <div className="w-10 h-10 rounded-full bg-gradient-to-tr from-[#5B5FFF] to-[#7C3AED] flex items-center justify-center text-white font-bold shadow-md">
              {role === 'manufacturer' ? manufacturerName[0] : 'C'}
            </div>
            <div className="flex-1 min-w-0">
              <p className="text-xs font-bold text-zinc-900 dark:text-white truncate">
                {role === 'manufacturer' ? manufacturerName : 'Customer Portal'}
              </p>
              <p className="text-[10px] text-zinc-500 font-medium truncate uppercase">
                {role}
              </p>
            </div>
          </div>

          <Button
            variant="outline"
            size="sm"
            className="w-full text-zinc-600 dark:text-zinc-400 justify-start hover:text-red-500"
            leftIcon={<LogOut className="w-4 h-4" />}
            onClick={() => {
              disconnectWallet()
              navigate('/')
            }}
          >
            Disconnect
          </Button>
        </div>
      </aside>

      {/* Main Content Area */}
      <div className="flex-1 flex flex-col min-w-0 min-h-screen">
        
        {/* Top Navbar */}
        <header className="sticky top-0 z-30 glass-nav h-16 flex items-center justify-between px-4 md:px-8">
          <div className="flex items-center gap-4">
            <button
              onClick={() => setIsSidebarOpen(true)}
              className="p-2 -ml-2 rounded-xl lg:hidden hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
            >
              <Menu className="w-6 h-6" />
            </button>
            
            <div className="hidden lg:flex items-center gap-2 px-3 py-1.5 rounded-full bg-indigo-500/10 text-indigo-600 dark:text-indigo-400 border border-indigo-500/20 text-xs font-semibold">
              <Zap className="w-3.5 h-3.5 fill-current" />
              Stellar Testnet Ledger Active
            </div>
          </div>

          <div className="flex items-center gap-3">
            {/* Theme Toggle */}
            <button
              onClick={toggleTheme}
              className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400"
            >
              {theme === 'dark' ? <Sun className="w-5 h-5 text-yellow-500" /> : <Moon className="w-5 h-5 text-zinc-700" />}
            </button>

            {/* Notifications Dropdown */}
            <div className="relative">
              <button
                onClick={() => setIsNotificationsOpen(!isNotificationsOpen)}
                className="p-2.5 rounded-xl hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors text-zinc-600 dark:text-zinc-400 relative"
              >
                <Bell className="w-5 h-5" />
                <span className="absolute top-2 right-2 w-2 h-2 bg-[#EF4444] rounded-full"></span>
              </button>

              <AnimatePresence>
                {isNotificationsOpen && (
                  <>
                    <div className="fixed inset-0 z-40" onClick={() => setIsNotificationsOpen(false)} />
                    <motion.div
                      initial={{ opacity: 0, y: 10, scale: 0.95 }}
                      animate={{ opacity: 1, y: 0, scale: 1 }}
                      exit={{ opacity: 0, y: 10, scale: 0.95 }}
                      className="absolute right-0 mt-2 w-80 glass-card rounded-2xl shadow-xl border border-zinc-200 dark:border-zinc-800 p-4 z-50"
                    >
                      <div className="flex items-center justify-between pb-3 border-b border-zinc-100 dark:border-zinc-800/80 mb-3">
                        <span className="font-bold text-sm text-zinc-900 dark:text-white">Notifications</span>
                        <span className="text-[10px] text-zinc-400 font-medium">Mark all read</span>
                      </div>
                      <div className="space-y-3">
                        {mockNotifications.map((notif) => (
                          <div key={notif.id} className="text-left hover:bg-zinc-100/50 dark:hover:bg-zinc-900/50 p-2 rounded-xl transition-all">
                            <p className="text-xs font-semibold text-zinc-900 dark:text-zinc-100">{notif.title}</p>
                            <p className="text-[10px] text-zinc-500 dark:text-zinc-400 line-clamp-1">{notif.desc}</p>
                            <span className="text-[9px] text-zinc-400">{notif.time}</span>
                          </div>
                        ))}
                      </div>
                    </motion.div>
                  </>
                )}
              </AnimatePresence>
            </div>

            {/* Wallet Address Display */}
            <div className="hidden sm:flex items-center gap-2.5 px-4 py-2 rounded-full glass-card border-zinc-200/80 dark:border-zinc-800/80 text-xs font-semibold text-zinc-700 dark:text-zinc-300">
              <Wallet className="w-4 h-4 text-indigo-500" />
              <span>{formatAddress(account)}</span>
              <span className="text-zinc-400">|</span>
              <span className="text-emerald-500 font-bold">{balance ? parseFloat(balance).toFixed(2) : '0.00'} XLM</span>
            </div>
          </div>
        </header>

        {/* Dynamic content scrollable area */}
        <main className="flex-1 overflow-y-auto p-4 md:p-8 max-w-7xl w-full mx-auto">
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -15 }}
            transition={{ duration: 0.3 }}
          >
            {children}
          </motion.div>
        </main>
      </div>

      {/* Sidebar - Mobile Drawer */}
      <AnimatePresence>
        {isSidebarOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              onClick={() => setIsSidebarOpen(false)}
              className="fixed inset-0 bg-black/60 backdrop-blur-sm z-40 lg:hidden"
            />
            
            <motion.aside
              initial={{ x: '-100%' }}
              animate={{ x: 0 }}
              exit={{ x: '-100%' }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed top-0 bottom-0 left-0 w-72 bg-white dark:bg-zinc-950 border-r border-zinc-200 dark:border-zinc-800 z-50 flex flex-col p-6 lg:hidden"
            >
              <div className="flex items-center justify-between pb-6 border-b border-zinc-200 dark:border-zinc-800 mb-6">
                <div className="flex items-center gap-2">
                  <ShieldCheck className="w-6 h-6 text-indigo-600" />
                  <span className="font-bold text-lg text-zinc-900 dark:text-white">SpareGuard</span>
                </div>
                <button
                  onClick={() => setIsSidebarOpen(false)}
                  className="p-2 rounded-full hover:bg-zinc-100 dark:hover:bg-zinc-900 transition-colors"
                >
                  <X className="w-5 h-5" />
                </button>
              </div>

              <nav className="flex-1 space-y-1">
                {menuItems.map((item) => {
                  const isActive = location.pathname === item.path
                  const Icon = item.icon
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      onClick={() => setIsSidebarOpen(false)}
                      className={`flex items-center gap-3 px-4 py-3 rounded-2xl text-sm font-medium transition-all duration-200 ${
                        isActive
                          ? 'bg-[#5B5FFF] text-white shadow-lg'
                          : 'text-zinc-600 dark:text-zinc-400 hover:bg-zinc-100 dark:hover:bg-zinc-900 hover:text-zinc-900 dark:hover:text-white'
                      }`}
                    >
                      <Icon className="w-5 h-5" />
                      {item.label}
                    </Link>
                  )
                })}
              </nav>

              <div className="pt-4 border-t border-zinc-200 dark:border-zinc-800 space-y-4">
                <div className="px-2 py-1">
                  <p className="text-xs font-bold text-zinc-900 dark:text-white">
                    {role === 'manufacturer' ? manufacturerName : 'Customer Portal'}
                  </p>
                  <p className="text-[10px] text-zinc-500 uppercase">{role}</p>
                </div>
                
                <div className="flex items-center gap-2 p-3 rounded-xl bg-zinc-100 dark:bg-zinc-900 text-xs font-bold text-zinc-700 dark:text-zinc-300">
                  <Wallet className="w-4 h-4 text-indigo-500" />
                  <span className="truncate">{formatAddress(account)}</span>
                  <span className="text-indigo-600 dark:text-indigo-400 font-bold ml-auto">{balance ? parseFloat(balance).toFixed(2) : '0.00'} XLM</span>
                </div>

                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-zinc-600 dark:text-zinc-400 justify-start hover:text-red-500"
                  leftIcon={<LogOut className="w-4 h-4" />}
                  onClick={() => {
                    setIsSidebarOpen(false)
                    disconnectWallet()
                    navigate('/')
                  }}
                >
                  Disconnect
                </Button>
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </div>
  )
}
