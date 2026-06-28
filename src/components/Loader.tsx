import React from 'react'
import { motion } from 'framer-motion'

export const Loader: React.FC = () => {
  return (
    <div className="flex items-center justify-center p-8">
      <motion.div
        className="w-12 h-12 border-4 border-t-[#5B5FFF] border-r-transparent border-l-transparent border-b-[#7C3AED] rounded-full"
        animate={{ rotate: 360 }}
        transition={{ duration: 1, repeat: Infinity, ease: 'linear' }}
      />
    </div>
  )
}

export const SkeletonCard: React.FC = () => {
  return (
    <div className="glass-card p-6 rounded-3xl animate-pulse space-y-4">
      <div className="h-6 w-1/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      <div className="h-10 w-2/3 bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
      <div className="h-4 w-full bg-zinc-200 dark:bg-zinc-800 rounded-lg"></div>
    </div>
  )
}

export const SkeletonRow: React.FC = () => {
  return (
    <div className="flex items-center space-x-4 p-4 animate-pulse">
      <div className="w-12 h-12 bg-zinc-200 dark:bg-zinc-800 rounded-full"></div>
      <div className="flex-1 space-y-2">
        <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/4"></div>
        <div className="h-3 bg-zinc-200 dark:bg-zinc-800 rounded-md w-1/2"></div>
      </div>
      <div className="h-4 bg-zinc-200 dark:bg-zinc-800 rounded-md w-12"></div>
    </div>
  )
}

interface ProgressBarProps {
  progress: number
  label?: string
}

export const ProgressBar: React.FC<ProgressBarProps> = ({ progress, label }) => {
  return (
    <div className="w-full">
      {label && (
        <div className="flex justify-between mb-1.5 text-xs font-semibold text-zinc-500">
          <span>{label}</span>
          <span>{Math.round(progress)}%</span>
        </div>
      )}
      <div className="w-full h-2.5 bg-zinc-200 dark:bg-zinc-800 rounded-full overflow-hidden">
        <motion.div
          className="h-full bg-gradient-to-r from-[#5B5FFF] via-[#7C3AED] to-[#06B6D4]"
          initial={{ width: 0 }}
          animate={{ width: `${progress}%` }}
          transition={{ duration: 0.3 }}
        />
      </div>
    </div>
  )
}
