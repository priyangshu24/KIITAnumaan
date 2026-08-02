'use client'

import { InputHTMLAttributes, forwardRef } from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
  helperText?: string
}

const Input = forwardRef<HTMLInputElement, InputProps>(
  ({ label, error, helperText, className, type = 'text', ...props }, ref) => {
    return (
      <div className="w-full space-y-2">
        {label && (
          <label className="block text-xs font-semibold uppercase tracking-wider text-[#A1A1AA]">
            {label}
          </label>
        )}
        <input
          ref={ref}
          type={type}
          className={cn(
            'w-full h-12 rounded-xl border border-[rgba(255,255,255,0.08)] bg-[#151515] px-4 text-sm text-white placeholder:#71717A outline-none transition-all duration-200 focus:border-[#FF3B30] focus:ring-2 focus:ring-[#FF3B30]/20 disabled:cursor-not-allowed disabled:opacity-50',
            error && 'border-[#EF4444] focus:border-[#EF4444] focus:ring-[#EF4444]/20',
            className
          )}
          {...props}
        />
        {error ? (
          <p className="text-xs font-medium text-[#EF4444]">{error}</p>
        ) : helperText ? (
          <p className="text-xs text-[#71717A]">{helperText}</p>
        ) : null}
      </div>
    )
  }
)

Input.displayName = 'Input'
export default Input
