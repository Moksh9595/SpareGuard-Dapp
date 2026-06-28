import { createContext, useContext, useEffect, useMemo, useState, type ReactNode } from 'react'
import toast from 'react-hot-toast'
import { getBalance, getPublicKey, isFreighterAvailable } from '../services/freighter'

type AppContextState = {
  account: string | null
  balance: string | null
  role: 'manufacturer' | 'customer' | null
  manufacturerName: string
  connectWallet: (type?: 'mock' | 'freighter') => Promise<void>
  disconnectWallet: () => void
  setRole: (role: 'manufacturer' | 'customer' | null) => void
  setManufacturerName: (name: string) => void
  isConnecting: boolean
}

const AppContext = createContext<AppContextState | undefined>(undefined)

export function AppProvider({ children }: { children: ReactNode }) {
  const [account, setAccount] = useState<string | null>(null)
  const [balance, setBalance] = useState<string | null>(null)
  const [role, setRole] = useState<'manufacturer' | 'customer' | null>(null)
  const [manufacturerName, setManufacturerName] = useState<string>('Stellar Electrics')
  const [isConnecting, setIsConnecting] = useState<boolean>(false)

  // Load from local session storage on initial render
  useEffect(() => {
    const savedAccount = sessionStorage.getItem('sp_wallet_account')
    const savedBalance = sessionStorage.getItem('sp_wallet_balance')
    const savedRole = sessionStorage.getItem('sp_wallet_role') as 'manufacturer' | 'customer' | null
    const savedName = sessionStorage.getItem('sp_manufacturer_name')

    if (savedAccount) setAccount(savedAccount)
    if (savedBalance) setBalance(savedBalance)
    if (savedRole) setRole(savedRole)
    if (savedName) setManufacturerName(savedName)
  }, [])

  const connectWallet = async (type: 'mock' | 'freighter' = 'mock') => {
    setIsConnecting(true)
    const toastId = toast.loading('Connecting wallet via secure channel...')
    
    // Simulate minor network delay
    await new Promise((resolve) => setTimeout(resolve, 1000))

    if (type === 'freighter') {


      try {
        const address = await getPublicKey()
        if (!address) throw new Error('Wallet connection rejected by user')
        
        setAccount(address)
        sessionStorage.setItem('sp_wallet_account', address)

        let accountBalance = '100.0000000'
        try {
          const fetchedBalance = await getBalance()
          if (fetchedBalance) accountBalance = fetchedBalance
        } catch {
          // Fallback if ledger offline
        }
        
        setBalance(accountBalance)
        sessionStorage.setItem('sp_wallet_balance', accountBalance)

        toast.dismiss(toastId)
        toast.success('Connected via Freighter Wallet!')
      } catch (error: any) {
        toast.dismiss(toastId)
        toast.error(error.message || 'Unable to connect Freighter Wallet. Please check extension permissions.')
        console.error(error)
      } finally {
        setIsConnecting(false)
      }
    } else {
      // Mock Connection (standard for quick hacking/showcasing)
      const mockAddress = 'GCSTSTELLARAUTHENTICATEPARTDAPPKEY777REPRESENTATIVEADDRESS'
      const mockBalance = '750.4851290'
      
      setAccount(mockAddress)
      setBalance(mockBalance)
      
      sessionStorage.setItem('sp_wallet_account', mockAddress)
      sessionStorage.setItem('sp_wallet_balance', mockBalance)

      toast.dismiss(toastId)
      toast.success('Connected via Mock Stellar Wallet!')
      setIsConnecting(false)
    }
  }

  const disconnectWallet = () => {
    setAccount(null)
    setBalance(null)
    setRole(null)
    sessionStorage.removeItem('sp_wallet_account')
    sessionStorage.removeItem('sp_wallet_balance')
    sessionStorage.removeItem('sp_wallet_role')
    toast.success('Wallet disconnected')
  }

  const updateRole = (newRole: 'manufacturer' | 'customer' | null) => {
    setRole(newRole)
    if (newRole) {
      sessionStorage.setItem('sp_wallet_role', newRole)
    } else {
      sessionStorage.removeItem('sp_wallet_role')
    }
  }

  const updateManufacturerName = (name: string) => {
    setManufacturerName(name)
    sessionStorage.setItem('sp_manufacturer_name', name)
  }

  const contextValue = useMemo(
    () => ({
      account,
      balance,
      role,
      manufacturerName,
      connectWallet,
      disconnectWallet,
      setRole: updateRole,
      setManufacturerName: updateManufacturerName,
      isConnecting,
    }),
    [account, balance, role, manufacturerName, isConnecting],
  )

  return <AppContext.Provider value={contextValue}>{children}</AppContext.Provider>
}

export function useAppContext() {
  const context = useContext(AppContext)
  if (!context) {
    throw new Error('useAppContext must be used within AppProvider')
  }
  return context
}
