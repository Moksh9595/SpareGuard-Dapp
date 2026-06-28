export type PartRecord = {
  id: number
  manufacturer_wallet: string
  manufacturer_name: string
  product_name: string // E.g., "Refrigerator", "Washing Machine"
  part_name: string // E.g., "Compressor", "Water Pump"
  part_code: string // E.g., "REF-COMP-123"
  ipfs_image: string
  hash: string // Generated SHA-256 hash representation
  created_at: number
  verified_count: number
  status?: 'active' | 'recalled' | 'discontinued'
  txHash?: string
}

export type VerificationLog = {
  id: string
  part_code: string
  hash: string
  status: 'genuine' | 'counterfeit'
  verified_at: number
  verifier_wallet: string
  manufacturer_name?: string
  product_name?: string
  part_name?: string
  failure_reason?: string
  txHash?: string
}

export type WalletTransaction = {
  id: string
  type: 'Register Part' | 'Verify Part' | 'Contract Interaction' | 'Role Change'
  hash: string
  status: 'success' | 'failed'
  timestamp: number
  fee: string
}
