import React, { useState } from 'react'
import { useForm } from 'react-hook-form'
import { useNavigate } from 'react-router-dom'
import { motion, AnimatePresence } from 'framer-motion'
import { usePartAuth } from '../../hooks/usePartAuth'
import { useAppContext } from '../../contexts/AppContext'
import { PRODUCT_CATEGORIES } from '../../data/mockData'
import { uploadFileToPinata } from '../../services/pinata'
import { Button } from '../../components/Button'
import { Input } from '../../components/Input'
import { Dropdown } from '../../components/Dropdown'
import { Modal } from '../../components/Modal'
import {
  FileCode,
  Image,
  Cpu,
  CheckCircle,
  Copy,
  PlusCircle,
  Hash,
  Info,
  Clock,
  Sparkles,
  Upload,
} from 'lucide-react'
import toast from 'react-hot-toast'

interface AddPartFormInputs {
  product_name: string
  part_name: string
  part_code: string
  ipfs_image: string
}

export default function AddPartPage() {
  const { account, manufacturerName } = useAppContext()
  const { registerPart, loading } = usePartAuth()
  const navigate = useNavigate()

  const [generatedHash, setGeneratedHash] = useState<string>('')
  const [isCopied, setIsCopied] = useState(false)
  const [successModalOpen, setSuccessModalOpen] = useState(false)
  const [registeredResult, setRegisteredResult] = useState<any>(null)
  const [isUploading, setIsUploading] = useState(false)
  
  const {
    register,
    handleSubmit,
    setValue,
    watch,
    formState: { errors },
  } = useForm<AddPartFormInputs>({
    defaultValues: {
      product_name: '',
      part_name: '',
      part_code: '',
      ipfs_image: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80', // default stock placeholder
    },
  })

  const watchFields = watch()

  const generateMockHash = () => {
    const { product_name, part_name, part_code } = watchFields
    if (!product_name || !part_name || !part_code) {
      toast.error('Please fill in Product Category, Part Name, and Part Code first.')
      return
    }

    const inputStr = `${product_name}-${part_name}-${part_code}-${Date.now()}`
    
    // Simulate simple sha-256 calculation representation
    let hash = ''
    for (let i = 0; i < 64; i++) {
      hash += Math.floor(Math.random() * 16).toString(16)
    }
    
    setGeneratedHash(hash)
    toast.success('Mock hash generated successfully!')
  }

  const handleCopyHash = () => {
    if (generatedHash) {
      navigator.clipboard.writeText(generatedHash)
      setIsCopied(true)
      toast.success('Hash copied!')
      setTimeout(() => setIsCopied(false), 2000)
    }
  }

  const onSubmit = async (data: AddPartFormInputs) => {
    if (!generatedHash) {
      toast.error('Please generate the cryptographic hash code before writing to ledger.')
      return
    }

    try {
      const result = await registerPart(account!, manufacturerName, {
        product_name: data.product_name,
        part_name: data.part_name,
        part_code: data.part_code,
        ipfs_image: data.ipfs_image,
        hash: generatedHash,
      })

      if (result) {
        setRegisteredResult(result)
        setSuccessModalOpen(true)
      }
    } catch (err: any) {
      console.error(err)
    }
  }

  const selectQuickImage = (category: string) => {
    const images: { [key: string]: string } = {
      Refrigerator: 'https://images.unsplash.com/photo-1584622650111-993a426fbf0a?w=400&q=80',
      'Washing Machine': 'https://images.unsplash.com/photo-1517646287270-a5a9ca602e5c?w=400&q=80',
      Television: 'https://images.unsplash.com/photo-1593305841991-05c297ba4575?w=400&q=80',
      'Air Conditioner': 'https://images.unsplash.com/photo-1621905252507-b354bc25edac?w=400&q=80',
    }
    
    // Only set default if no image is already uploaded
    if (!watchFields.ipfs_image || watchFields.ipfs_image.includes('unsplash')) {
      const url = images[category] || 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
      setValue('ipfs_image', url)
    }
  }

  const handleFileUpload = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0]
    if (!file) return

    setIsUploading(true)
    const toastId = toast.loading('Uploading file to Pinata IPFS...')
    try {
      const ipfsUrl = await uploadFileToPinata(file)
      setValue('ipfs_image', ipfsUrl, { shouldValidate: true })
      toast.success('Successfully uploaded to IPFS!', { id: toastId })
    } catch (error) {
      toast.error('Failed to upload to IPFS. Please check your credentials.', { id: toastId })
    } finally {
      setIsUploading(false)
    }
  }

  return (
    <div className="space-y-8 max-w-4xl mx-auto">
      
      {/* Page Header */}
      <div>
        <h1 className="text-2xl md:text-3xl font-extrabold tracking-tight text-zinc-950 dark:text-white">
          Register Spare Part
        </h1>
        <p className="text-sm text-zinc-500 font-medium">
          Anchors a physical product record with signature directly to Stellar smart contracts.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Form panel */}
        <div className="lg:col-span-2 glass-card rounded-3xl p-6 md:p-8 border-zinc-200/60 dark:border-zinc-800/80">
          <form onSubmit={handleSubmit(onSubmit)} className="space-y-6">
            
            <Dropdown
              label="Product Category"
              options={PRODUCT_CATEGORIES}
              error={errors.product_name?.message}
              {...register('product_name', { 
                required: 'Product Category is required',
                onChange: (e) => selectQuickImage(e.target.value)
              })}
            />

            <Input
              label="Part Name"
              placeholder="E.g., Inverter Compressor Gen-3"
              error={errors.part_name?.message}
              {...register('part_name', { required: 'Part Name is required' })}
            />

            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <Input
                label="Manufacturer"
                value={manufacturerName}
                disabled
                className="bg-zinc-100 dark:bg-zinc-900 cursor-not-allowed opacity-75 font-semibold text-zinc-600"
              />

              <Input
                label="Part Serial Code"
                placeholder="E.g., REF-COMP-9021"
                error={errors.part_code?.message}
                {...register('part_code', { 
                  required: 'Part Code is required',
                  pattern: {
                    value: /^[A-Z0-9-]+$/,
                    message: 'Part code must contain only uppercase letters, numbers, and hyphens'
                  }
                })}
              />
            </div>

            <div className="space-y-2">
              <label className="block text-sm font-bold text-zinc-950 dark:text-white">
                Part Image (IPFS Upload)
              </label>
              <div className="flex items-center gap-4">
                <Button 
                  type="button" 
                  variant="outline" 
                  onClick={() => document.getElementById('ipfs-upload')?.click()}
                  isLoading={isUploading}
                  leftIcon={!isUploading && <Upload className="w-4 h-4" />}
                >
                  Upload File
                </Button>
                <input 
                  id="ipfs-upload" 
                  type="file" 
                  accept="image/*" 
                  className="hidden" 
                  onChange={handleFileUpload}
                  disabled={isUploading}
                />
                <span className="text-xs text-zinc-500 font-mono truncate max-w-xs">
                  {watchFields.ipfs_image && !watchFields.ipfs_image.includes('unsplash') 
                    ? watchFields.ipfs_image 
                    : 'No file uploaded (using placeholder)'}
                </span>
              </div>
              
              {/* Hidden input to keep form validation working */}
              <input type="hidden" {...register('ipfs_image', { required: 'Image link is required' })} />
              {errors.ipfs_image?.message && (
                <p className="text-xs text-red-500 font-semibold">{errors.ipfs_image.message}</p>
              )}
            </div>

            {/* Action buttons */}
            <div className="flex gap-4 pt-4 border-t border-zinc-100 dark:border-zinc-800/80">
              <Button
                type="button"
                variant="outline"
                className="flex-1"
                leftIcon={<Hash className="w-4 h-4" />}
                onClick={generateMockHash}
              >
                Compile Hash Key
              </Button>
              
              <Button
                type="submit"
                variant="gradient"
                className="flex-1 font-bold text-sm"
                isLoading={loading}
              >
                Broadcast to Ledger
              </Button>
            </div>

          </form>
        </div>

        {/* Preview Panel */}
        <div className="space-y-6">
          
          {/* Cryptographic Hash Card */}
          <div className="glass-card rounded-3xl p-6 border-zinc-200/60 dark:border-zinc-800/80 space-y-4">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Cpu className="w-4 h-4 text-indigo-500" /> Cryptographic Signatures
            </h3>
            
            {generatedHash ? (
              <div className="space-y-3">
                <div className="p-4 bg-zinc-100/50 dark:bg-zinc-950/60 border border-zinc-200 dark:border-zinc-800 rounded-2xl break-all">
                  <span className="font-mono text-xs text-zinc-800 dark:text-zinc-300 font-medium block">
                    {generatedHash}
                  </span>
                </div>
                <Button
                  variant="outline"
                  size="sm"
                  className="w-full text-xs"
                  leftIcon={isCopied ? <CheckCircle className="w-3.5 h-3.5 text-emerald-500" /> : <Copy className="w-3.5 h-3.5" />}
                  onClick={handleCopyHash}
                >
                  {isCopied ? 'Hash Key Copied' : 'Copy Hash Key'}
                </Button>
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center space-y-2">
                <FileCode className="w-8 h-8 text-zinc-400 mx-auto" />
                <p className="text-xs text-zinc-500 font-medium">No hash compiled yet. Fill details and click "Compile Hash Key".</p>
              </div>
            )}
          </div>

          {/* Image Preview Card */}
          <div className="glass-card rounded-3xl p-6 border-zinc-200/60 dark:border-zinc-800/80 space-y-4 text-left">
            <h3 className="text-xs font-bold uppercase tracking-wider text-zinc-400 flex items-center gap-1.5">
              <Image className="w-4 h-4 text-purple-500" /> IPFS Media Preview
            </h3>
            
            {watchFields.ipfs_image && watchFields.ipfs_image.match(/^https?:\/\//) ? (
              <div className="rounded-2xl overflow-hidden border border-zinc-200 dark:border-zinc-800 h-40 bg-zinc-100 dark:bg-zinc-900 relative group">
                <img
                  src={watchFields.ipfs_image}
                  alt="Asset Preview"
                  className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                  onError={(e) => {
                    ;(e.target as any).src = 'https://images.unsplash.com/photo-1581092160607-ee22621dd758?w=400&q=80'
                  }}
                />
              </div>
            ) : (
              <div className="p-8 border-2 border-dashed border-zinc-200 dark:border-zinc-800 rounded-2xl text-center">
                <p className="text-xs text-zinc-500 font-medium">Please enter a valid HTTP image url link.</p>
              </div>
            )}
          </div>

        </div>

      </div>

      {/* Success Dialog Modal */}
      <Modal
        isOpen={successModalOpen}
        onClose={() => setSuccessModalOpen(false)}
        title="Broadcast Successful"
      >
        {registeredResult && (
          <div className="text-center space-y-6 py-2">
            <div className="w-16 h-16 bg-emerald-500/10 rounded-full flex items-center justify-center text-emerald-500 mx-auto glow-accent">
              <CheckCircle className="w-10 h-10 animate-bounce" />
            </div>

            <div className="space-y-2">
              <h4 className="font-extrabold text-lg text-zinc-950 dark:text-white">Part Registered on Stellar</h4>
              <p className="text-xs text-zinc-500 max-w-sm mx-auto font-medium">
                The smart contract verified the manufacturer signature. The cryptographic metadata has been permanently committed.
              </p>
            </div>

            {/* Block Transaction Data Box */}
            <div className="glass-card rounded-2xl p-4 text-left border-zinc-200 dark:border-zinc-800 bg-zinc-100/50 dark:bg-zinc-950/60 space-y-3">
              <div className="flex justify-between text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-500">Operation Hash</span>
                <span className="font-mono text-zinc-800 dark:text-zinc-300 font-bold truncate max-w-[60%]">
                  {registeredResult.hash.substring(0, 16)}...
                </span>
              </div>
              <div className="flex justify-between text-xs border-b border-zinc-200 dark:border-zinc-800 pb-2">
                <span className="font-semibold text-zinc-500">Part Code</span>
                <span className="font-bold text-zinc-800 dark:text-zinc-200">{registeredResult.part_code}</span>
              </div>
              <div className="flex justify-between text-xs">
                <span className="font-semibold text-zinc-500">Ledger Gas Fee</span>
                <span className="font-mono font-bold text-indigo-500">0.00001 XLM</span>
              </div>
            </div>

              <div className="flex gap-4">
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => setSuccessModalOpen(false)}
                >
                  Add Another
                </Button>
                <Button
                  variant="outline"
                  className="flex-1"
                  onClick={() => window.open(`https://stellar.expert/explorer/testnet/account/${account}`, '_blank')}
                >
                  View on Stellar
                </Button>
                <Button
                  variant="gradient"
                  className="flex-1"
                  onClick={() => {
                    setSuccessModalOpen(false)
                    navigate('/manufacturer/products')
                  }}
                >
                  View Inventory
                </Button>
              </div>
          </div>
        )}
      </Modal>

    </div>
  )
}
