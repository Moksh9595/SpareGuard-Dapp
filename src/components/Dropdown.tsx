import React, { forwardRef } from 'react'
import { motion, AnimatePresence } from 'framer-motion'
import { ChevronDown } from 'lucide-react'

interface DropdownProps extends React.SelectHTMLAttributes<HTMLSelectElement> {
  label?: string
  options: readonly string[] | string[]
  error?: string
}

export const Dropdown = forwardRef<HTMLSelectElement, DropdownProps>(
  ({ label, options, error, className = '', ...props }, ref) => {
    return (
      <div className="w-full text-left">
        {label && (
          <label className="block mb-1.5 text-xs font-semibold text-zinc-500 dark:text-zinc-400 tracking-wide uppercase">
            {label}
          </label>
        )}
        <div className="relative rounded-xl shadow-sm">
          <select
            ref={ref}
            className={`w-full px-4 py-3 rounded-xl border border-zinc-200 dark:border-zinc-800 bg-white/50 dark:bg-zinc-950/50 text-zinc-800 dark:text-zinc-200 focus:outline-none focus:ring-2 focus:ring-[#5B5FFF] focus:border-transparent transition-all duration-200 text-sm appearance-none cursor-pointer backdrop-blur-sm
              ${error ? 'border-[#EF4444] focus:ring-[#EF4444]' : ''} 
              ${className}`}
            {...props}
          >
            <option value="" className="text-zinc-400 dark:text-zinc-700 bg-white dark:bg-zinc-950">
              Select an option...
            </option>
            {options.map((option) => (
              <option key={option} value={option} className="bg-white dark:bg-zinc-950">
                {option}
              </option>
            ))}
          </select>
          <div className="absolute inset-y-0 right-0 pr-3.5 flex items-center pointer-events-none text-zinc-400 dark:text-zinc-500">
            <ChevronDown className="w-4 h-4" />
          </div>
        </div>
        <AnimatePresence>
          {error && (
            <motion.p
              initial={{ opacity: 0, y: -4 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -4 }}
              className="mt-1 text-xs text-[#EF4444] font-medium flex items-center"
            >
              <span className="inline-block w-1 h-1 rounded-full bg-[#EF4444] mr-1.5"></span>
              {error}
            </motion.p>
          )}
        </AnimatePresence>
      </div>
    )
  }
)

Dropdown.displayName = 'Dropdown'
