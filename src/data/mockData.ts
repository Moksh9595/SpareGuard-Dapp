import { PartRecord, VerificationLog, WalletTransaction } from '../types'

export const PRODUCT_CATEGORIES = [
  'Refrigerator',
  'Washing Machine',
  'Microwave',
  'Television',
  'Air Conditioner',
  'Dishwasher',
  'Mixer',
  'Water Purifier',
  'Ceiling Fan',
] as const

export const MOCK_MANUFACTURERS = [
  { id: 1, name: 'Stellar Electrics', wallet: 'GABR...T6J2', verified: true },
  { id: 2, name: 'Apex Manufacturing', wallet: 'GCXD...5W3Y', verified: true },
  { id: 3, name: 'Titan Industries', wallet: 'GD2S...LMPO', verified: true },
]

export const INITIAL_PARTS: PartRecord[] = [
  {
    id: 1,
    manufacturer_wallet: 'GABR...T6J2',
    manufacturer_name: 'Stellar Electrics',
    product_name: 'Refrigerator',
    part_name: 'Inverter Compressor Gen-3',
    part_code: 'REF-COMP-9021',
    ipfs_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80',
    hash: '8f3c7d2e1b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d',
    created_at: 1719482400000, // June 27, 2024
    verified_count: 142,
    status: 'active',
  },
  {
    id: 2,
    manufacturer_wallet: 'GABR...T6J2',
    manufacturer_name: 'Stellar Electrics',
    product_name: 'Washing Machine',
    part_name: 'Direct Drive Smart Motor',
    part_code: 'WSH-MTR-8812',
    ipfs_image: 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400&q=80',
    hash: 'a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b6c7d8e9f0a1b2',
    created_at: 1719396000000,
    verified_count: 85,
    status: 'active',
  },
  {
    id: 3,
    manufacturer_wallet: 'GCXD...5W3Y',
    manufacturer_name: 'Apex Manufacturing',
    product_name: 'Air Conditioner',
    part_name: 'Titanium Condenser Coil',
    part_code: 'AC-COIL-4402',
    ipfs_image: 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&q=80',
    hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    created_at: 1719223200000,
    verified_count: 219,
    status: 'active',
  },
  {
    id: 4,
    manufacturer_wallet: 'GD2S...LMPO',
    manufacturer_name: 'Titan Industries',
    product_name: 'Television',
    part_name: 'Quantum Dot LED Backlight Panel',
    part_code: 'TV-PANEL-1099',
    ipfs_image: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80',
    hash: '5d4c3b2a1f0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c',
    created_at: 1718877600000,
    verified_count: 53,
    status: 'discontinued',
  },
]

export const INITIAL_VERIFICATION_LOGS: VerificationLog[] = [
  {
    id: 'V-1001',
    part_code: 'REF-COMP-9021',
    hash: '8f3c7d2e1b6a5c4d3e2f1a0b9c8d7e6f5a4b3c2d1e0f9a8b7c6d5e4f3a2b1c0d',
    status: 'genuine',
    verified_at: 1719504000000,
    verifier_wallet: 'GCST...R8P2',
    manufacturer_name: 'Stellar Electrics',
    product_name: 'Refrigerator',
    part_name: 'Inverter Compressor Gen-3',
  },
  {
    id: 'V-1002',
    part_code: 'FAKE-PART-999',
    hash: '9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f9f',
    status: 'counterfeit',
    verified_at: 1719493200000,
    verifier_wallet: 'GD3A...XY12',
    failure_reason: 'Hash mismatch: Part registration record not found on Stellar Ledger.',
  },
  {
    id: 'V-1003',
    part_code: 'AC-COIL-4402',
    hash: '3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f',
    status: 'genuine',
    verified_at: 1719489600000,
    verifier_wallet: 'GD3A...XY12',
    manufacturer_name: 'Apex Manufacturing',
    product_name: 'Air Conditioner',
    part_name: 'Titanium Condenser Coil',
  },
]

export const INITIAL_TRANSACTIONS: WalletTransaction[] = [
  {
    id: 'tx_a8f9c1d0',
    type: 'Register Part',
    hash: '5d4c3b...5d4c',
    status: 'success',
    timestamp: 1719500000000,
    fee: '0.00001 XLM',
  },
  {
    id: 'tx_b1e2f3a4',
    type: 'Verify Part',
    hash: '8f3c7d...1c0d',
    status: 'success',
    timestamp: 1719498000000,
    fee: '0.00001 XLM',
  },
  {
    id: 'tx_c7d8e9f0',
    type: 'Role Change',
    hash: '09ab3f...ef21',
    status: 'success',
    timestamp: 1719480000000,
    fee: '0.00012 XLM',
  },
]
