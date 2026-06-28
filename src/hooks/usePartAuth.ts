import { useState, useCallback } from 'react'
import { blockchainService } from '../services/blockchainService'
import { PartRecord, VerificationLog, WalletTransaction } from '../types'
import toast from 'react-hot-toast'

export function usePartAuth() {
  const [loading, setLoading] = useState<boolean>(false)
  const [error, setError] = useState<string | null>(null)

  const getParts = useCallback(async (): Promise<PartRecord[]> => {
    setLoading(true)
    setError(null)
    try {
      return await blockchainService.getParts()
    } catch (err: any) {
      const msg = err.message || 'Failed to fetch parts from ledger'
      setError(msg)
      toast.error(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const registerPart = useCallback(async (
    wallet: string,
    manufacturerName: string,
    partData: Omit<PartRecord, 'id' | 'manufacturer_wallet' | 'manufacturer_name' | 'created_at' | 'verified_count'>
  ): Promise<PartRecord | null> => {
    setLoading(true)
    setError(null)
    try {
      const result = await blockchainService.registerPart(wallet, manufacturerName, partData)
      toast.success(`Part "${result.part_name}" registered successfully on Stellar!`)
      return result
    } catch (err: any) {
      const msg = err.message || 'Failed to register part on smart contract'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const verifyPart = useCallback(async (
    verifierWallet: string,
    partCode: string,
    hash: string
  ): Promise<VerificationLog | null> => {
    setLoading(true)
    setError(null)
    try {
      const log = await blockchainService.verifyPart(verifierWallet, partCode, hash)
      if (log.status === 'genuine') {
        toast.success('Verification Complete: Genuine Spare Part Verified!')
      } else {
        toast.error('Verification Alert: Potential Counterfeit Detected!')
      }
      return log
    } catch (err: any) {
      const msg = err.message || 'Verification transaction failed'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const getLogs = useCallback(async (): Promise<VerificationLog[]> => {
    setLoading(true)
    setError(null)
    try {
      return await blockchainService.getLogs()
    } catch (err: any) {
      const msg = err.message || 'Failed to retrieve verification logs'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const getTransactions = useCallback(async (): Promise<WalletTransaction[]> => {
    setLoading(true)
    setError(null)
    try {
      return await blockchainService.getTransactions()
    } catch (err: any) {
      const msg = err.message || 'Failed to retrieve transactions'
      setError(msg)
      return []
    } finally {
      setLoading(false)
    }
  }, [])

  const deletePart = useCallback(async (id: number): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const success = await blockchainService.deletePart(id)
      if (success) {
        toast.success('Part revoked successfully.')
      }
      return success
    } catch (err: any) {
      const msg = err.message || 'Failed to delete part'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const updatePartStatus = useCallback(async (id: number, status: 'active' | 'recalled' | 'discontinued'): Promise<PartRecord | null> => {
    setLoading(true)
    setError(null)
    try {
      const updated = await blockchainService.updatePartStatus(id, status)
      if (updated) {
        toast.success(`Part status updated to ${status}`)
      }
      return updated
    } catch (err: any) {
      const msg = err.message || 'Failed to update part status'
      setError(msg)
      toast.error(msg)
      return null
    } finally {
      setLoading(false)
    }
  }, [])

  const isManufacturer = useCallback(async (wallet: string): Promise<boolean> => {
    setLoading(true)
    try {
      return await blockchainService.isManufacturer(wallet)
    } catch {
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  const registerManufacturer = useCallback(async (wallet: string, name: string): Promise<boolean> => {
    setLoading(true)
    setError(null)
    try {
      const success = await blockchainService.registerManufacturer(wallet, name)
      if (success) {
        toast.success('Manufacturer registered successfully on Stellar!')
      }
      return success
    } catch (err: any) {
      const msg = err.message || 'Failed to register manufacturer'
      setError(msg)
      toast.error(msg)
      return false
    } finally {
      setLoading(false)
    }
  }, [])

  return {
    loading,
    error,
    getParts,
    registerPart,
    verifyPart,
    getLogs,
    getTransactions,
    deletePart,
    updatePartStatus,
    isManufacturer,
    registerManufacturer
  }
}
