import { 
  Contract, 
  rpc, 
  Horizon, 
  TransactionBuilder, 
  Account, 
  nativeToScVal, 
  scValToNative, 
  TimeoutInfinite
} from '@stellar/stellar-sdk'
import { signTransaction } from '@stellar/freighter-api'
import { CONFIG } from '../config'
import { PartRecord, VerificationLog, WalletTransaction } from '../types'
import { INITIAL_PARTS, INITIAL_VERIFICATION_LOGS, INITIAL_TRANSACTIONS } from '../data/mockData'

const PARTS_KEY = 'sp_auth_parts'
const LOGS_KEY = 'sp_auth_logs'
const TXS_KEY = 'sp_auth_txs'

const rpcServer = new rpc.Server(CONFIG.rpcUrl)
const horizonServer = new Horizon.Server(CONFIG.horizonUrl)

// Local fallback helpers
const loadFromStorage = <T>(key: string, initialData: T[]): T[] => {
  if (typeof window === 'undefined') return initialData
  const data = localStorage.getItem(key)
  if (!data) {
    localStorage.setItem(key, JSON.stringify(initialData))
    return initialData
  }
  try {
    return JSON.parse(data)
  } catch {
    return initialData
  }
}

const saveToStorage = <T>(key: string, data: T[]) => {
  if (typeof window !== 'undefined') {
    localStorage.setItem(key, JSON.stringify(data))
  }
}

// Convert ScVal responses to PartRecord type
const mapScValToPart = (rawPart: any): PartRecord => {
  return {
    id: typeof rawPart.id === 'bigint' ? Number(rawPart.id) : Number(rawPart.id || 0),
    manufacturer_wallet: rawPart.manufacturer_wallet || rawPart.manufacturer,
    manufacturer_name: rawPart.manufacturer_name || 'Verified Manufacturer',
    product_name: rawPart.product_name,
    part_name: rawPart.part_name,
    part_code: rawPart.part_code,
    ipfs_image: rawPart.ipfs_image || rawPart.ipfs_url || '',
    hash: rawPart.hash,
    created_at: typeof rawPart.created_at === 'bigint' ? Number(rawPart.created_at) * 1000 : Number(rawPart.created_at || Date.now()),
    verified_count: typeof rawPart.verified_count === 'bigint' ? Number(rawPart.verified_count) : Number(rawPart.verified_count || 0),
    status: rawPart.status || 'active',
  }
}

// Helper to execute read-only calls via simulation
const queryContract = async (method: string, args: any[] = []): Promise<any> => {
  // Use a dummy account for read-only simulations
  const dummyPublicKey = 'GD3A5TSTELLARAUTHENTICATEPARTDAPPKEY777REPRESENTATIVEADDRESS'
  const source = new Account(dummyPublicKey, '0')
  const contract = new Contract(CONFIG.contractId)
  
  const op = contract.call(method, ...args.map(val => {
    if (typeof val === 'string' && val.length === 56 && val.startsWith('G')) {
      return nativeToScVal(val, { type: 'address' })
    }
    return nativeToScVal(val)
  }))
  const tx = new TransactionBuilder(source, {
    fee: '100',
    networkPassphrase: CONFIG.networkPassphrase
  })
    .addOperation(op)
    .setTimeout(TimeoutInfinite)
    .build()

  const sim = await rpcServer.simulateTransaction(tx)
  if (rpc.Api.isSimulationSuccess(sim) && (sim as any).result) {
    return scValToNative((sim as any).result.retval)
  }
  throw new Error(`Simulation failed for ${method}`)
}

// Helper to build, simulate, prepare, sign, and submit write transactions
const executeContract = async (walletAddress: string, method: string, args: any[] = []): Promise<{ data: any, txHash: string }> => {
  // Fetch fresh source account sequence number
  const sourceAccount = await horizonServer.loadAccount(walletAddress)
  const contract = new Contract(CONFIG.contractId)
  const op = contract.call(method, ...args.map(val => {
    if (typeof val === 'string' && val.length === 56 && val.startsWith('G')) {
      return nativeToScVal(val, { type: 'address' })
    }
    return nativeToScVal(val)
  }))
  
  const tx = new TransactionBuilder(sourceAccount, {
    fee: '100',
    networkPassphrase: CONFIG.networkPassphrase
  })
    .addOperation(op)
    .setTimeout(30)
    .build()

  // Simulate to calculate footprint & resource fees
  const sim = await rpcServer.simulateTransaction(tx)
  if (!rpc.Api.isSimulationSuccess(sim)) {
    throw new Error(`Simulation failed: ${(sim as any).result?.retval ? scValToNative((sim as any).result.retval) : 'Unknown error'}`)
  }

  // Assemble footprint into tx
  const preparedTx = await rpcServer.prepareTransaction(tx)
  
  // Request user signature via Freighter wallet extension
  const signedTxResult = await signTransaction(preparedTx.toXDR(), {
    network: CONFIG.network.toUpperCase(),
    networkPassphrase: CONFIG.networkPassphrase
  } as any)

  const signedTxXdr = typeof signedTxResult === 'string' ? signedTxResult : (signedTxResult as any).signedTxXdr || (signedTxResult as any).transaction
  const signedTx = TransactionBuilder.fromXDR(signedTxXdr, CONFIG.networkPassphrase)
  const sendResponse = await rpcServer.sendTransaction(signedTx)
  
  if (sendResponse.status === 'ERROR') {
    throw new Error((sendResponse as any).errorResultXdr || (sendResponse as any).errorResult || 'Transaction submission failed')
  }

  // Poll transaction status from ledger
  let response = await rpcServer.getTransaction(sendResponse.hash)
  let attempts = 0
  while ((response.status as any) === 'PENDING' && attempts < 15) {
    await new Promise((resolve) => setTimeout(resolve, 1000))
    response = await rpcServer.getTransaction(sendResponse.hash)
    attempts++
  }

  if ((response.status as any) === 'SUCCESS') {
    return {
      data: (response as any).returnValue ? scValToNative((response as any).returnValue) : null,
      txHash: sendResponse.hash
    }
  }
  
  throw new Error('Transaction execution failed or timed out')
}

export const blockchainService = {
  getParts: async (): Promise<PartRecord[]> => {
    try {
      const rawParts = await queryContract('get_all_parts')
      if (Array.isArray(rawParts)) {
        return rawParts.map(mapScValToPart)
      }
      return []
    } catch (e) {
      console.warn('Failing back to mock storage for parts lookup:', e)
      return loadFromStorage<PartRecord>(PARTS_KEY, INITIAL_PARTS)
    }
  },

  getPartByHash: async (hash: string): Promise<PartRecord | null> => {
    try {
      const parts = await blockchainService.getParts()
      return parts.find((p) => p.hash === hash) || null
    } catch {
      return null
    }
  },

  registerPart: async (
    wallet: string,
    manufacturerName: string,
    part: Omit<PartRecord, 'id' | 'manufacturer_wallet' | 'manufacturer_name' | 'created_at' | 'verified_count'>
  ): Promise<PartRecord> => {
    // If it's the mock client address, keep it mock local for quick testing
    if (wallet.includes('AUTHENTICATEPARTDAPPKEY777')) {
      const parts = loadFromStorage<PartRecord>(PARTS_KEY, INITIAL_PARTS)
      const newPart: PartRecord = {
        ...part,
        id: parts.length + 1,
        manufacturer_wallet: wallet,
        manufacturer_name: manufacturerName,
        created_at: Date.now(),
        verified_count: 0,
        status: 'active',
      }
      saveToStorage(PARTS_KEY, [newPart, ...parts])
      return newPart
    }

    const isRegistered = await blockchainService.isManufacturer(wallet)
    if (!isRegistered) {
      try {
        await executeContract(wallet, 'register_manufacturer', [wallet, manufacturerName])
      } catch (e) {
        console.warn('Failed to auto-register manufacturer, continuing...', e)
      }
    }

    const rawResult = await executeContract(wallet, 'add_part', [
      wallet,
      part.product_name,
      part.part_name,
      part.part_code,
      part.ipfs_image,
      part.hash
    ])
    const newPart = mapScValToPart(rawResult.data)
    newPart.txHash = rawResult.txHash
    return newPart
  },

  verifyPart: async (
    verifierWallet: string,
    partCode: string,
    hash: string
  ): Promise<VerificationLog> => {
    if (verifierWallet.includes('AUTHENTICATEPARTDAPPKEY777')) {
      const parts = loadFromStorage<PartRecord>(PARTS_KEY, INITIAL_PARTS)
      const logs = loadFromStorage<VerificationLog>(LOGS_KEY, INITIAL_VERIFICATION_LOGS)
      const matched = parts.find((p) => p.hash === hash && p.part_code === partCode)

      let log: VerificationLog
      if (matched) {
        matched.verified_count += 1
        saveToStorage(PARTS_KEY, parts)
        log = {
          id: `V-${1000 + logs.length + 1}`,
          part_code: partCode,
          hash: hash,
          status: 'genuine',
          verified_at: Date.now(),
          verifier_wallet: verifierWallet,
          manufacturer_name: matched.manufacturer_name,
          product_name: matched.product_name,
          part_name: matched.part_name,
        }
      } else {
        log = {
          id: `V-${1000 + logs.length + 1}`,
          part_code: partCode,
          hash: hash,
          status: 'counterfeit',
          verified_at: Date.now(),
          verifier_wallet: verifierWallet,
          failure_reason: 'Cryptographic hash mismatch. Record not found on Stellar ledger.',
        }
      }
      saveToStorage(LOGS_KEY, [log, ...logs])
      return log
    }

    const result = await executeContract(verifierWallet, 'verify_part', [
      verifierWallet,
      partCode,
      hash
    ])
    const isGenuine = result.data

    const logs = loadFromStorage<VerificationLog>(LOGS_KEY, INITIAL_VERIFICATION_LOGS)
    const parts = await blockchainService.getParts()
    const matchedPart = parts.find(p => p.part_code === partCode)

    const log: VerificationLog = {
      id: `V-${1000 + logs.length + 1}`,
      part_code: partCode,
      hash: hash,
      status: isGenuine ? 'genuine' : 'counterfeit',
      verified_at: Date.now(),
      verifier_wallet: verifierWallet,
      manufacturer_name: matchedPart?.manufacturer_name,
      product_name: matchedPart?.product_name,
      part_name: matchedPart?.part_name,
      failure_reason: isGenuine ? undefined : 'On-chain verification checksum check rejected.',
      txHash: result.txHash
    }

    saveToStorage(LOGS_KEY, [log, ...logs])
    return log
  },

  getLogs: async (): Promise<VerificationLog[]> => {
    return loadFromStorage<VerificationLog>(LOGS_KEY, INITIAL_VERIFICATION_LOGS)
  },

  getTransactions: async (): Promise<WalletTransaction[]> => {
    return loadFromStorage<WalletTransaction>(TXS_KEY, INITIAL_TRANSACTIONS)
  },

  deletePart: async (id: number): Promise<boolean> => {
    const parts = loadFromStorage<PartRecord>(PARTS_KEY, INITIAL_PARTS)
    const filtered = parts.filter((p) => p.id !== id)
    saveToStorage(PARTS_KEY, filtered)
    return true
  },

  updatePartStatus: async (id: number, status: 'active' | 'recalled' | 'discontinued'): Promise<PartRecord | null> => {
    const parts = loadFromStorage<PartRecord>(PARTS_KEY, INITIAL_PARTS)
    const index = parts.findIndex((p) => p.id === id)
    if (index === -1) return null
    parts[index].status = status
    saveToStorage(PARTS_KEY, parts)
    return parts[index]
  },

  isManufacturer: async (walletAddress: string): Promise<boolean> => {
    if (walletAddress.includes('AUTHENTICATEPARTDAPPKEY777')) {
      return true
    }
    try {
      const res = await queryContract('is_manufacturer', [walletAddress])
      return !!res
    } catch {
      return false
    }
  },

  registerManufacturer: async (walletAddress: string, name: string): Promise<boolean> => {
    // Directly bypass wallet popup for sign-in as per user request
    return true
  }
}
