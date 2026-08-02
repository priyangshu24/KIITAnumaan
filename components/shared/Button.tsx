'use client'

import { ReactNode, ButtonHTMLAttributes } from 'react'
import Link from 'next/link'
import { cn } from '@/lib/utils'

export interface ButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost'
  size?: 'sm' | 'md' | 'lg'
  fullWidth?: boolean
  href?: string
}

const sizeClasses = {
  sm: 'h-9 px-4 text-xs font-semibold rounded-lg gap-1.5',
  md: 'h-12 px-6 text-sm font-semibold rounded-xl gap-2',
  lg: 'h-14 px-8 text-base font-bold rounded-xl gap-2.5',
}

const variantClasses = {
  primary:
    'bg-[#FF3B30] text-white hover:bg-[#E03126] shadow-[0_0_20px_rgba(255,59,48,0.25)] active:scale-95 transition-all duration-200',
  secondary:
    'bg-[#FF5A4D] text-white hover:bg-[#FF3B30] active:scale-95 transition-all duration-200',
  outline:
    'border border-[rgba(255,255,255,0.08)] bg-[#151515] text-[#FFFFFF] hover:bg-[#1A1A1A] hover:border-[#FF3B30]/50 transition-all duration-200',
  ghost:
    'text-[#A1A1AA] hover:bg-[#1A1A1A] hover:text-[#FFFFFF] transition-all duration-200',
}

export default function Button({
  children,
  variant = 'primary',
  size = 'md',
  fullWidth = false,
  href,
  className,
  disabled,
  ...props
}: ButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center tracking-wide uppercase transition-all duration-200 cursor-pointer disabled:opacity-50 disabled:cursor-not-allowed disabled:pointer-events-none select-none',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    className
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {children}
      </Link>
    )
  }

  return (
    <button className={classes} disabled={disabled} {...props}>
      {children}
    </button>
  )
}
