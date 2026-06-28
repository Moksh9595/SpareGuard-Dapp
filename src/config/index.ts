export const CONFIG = {
  rpcUrl: (import.meta as any).env.VITE_RPC_URL || 'https://soroban-testnet.stellar.org',
  horizonUrl: (import.meta as any).env.VITE_HORIZON_URL || 'https://horizon-testnet.stellar.org',
  networkPassphrase: (import.meta as any).env.VITE_NETWORK_PASSPHRASE || 'Test SDF Network ; September 2015',
  contractId: (import.meta as any).env.VITE_CONTRACT_ID || 'CCTCP3IDLYLZN7BDGZB2L64ADV3GAJURF6I443CALD3LQIEWRHBAOBKC',
  network: (import.meta as any).env.VITE_NETWORK || 'testnet',
} as const
