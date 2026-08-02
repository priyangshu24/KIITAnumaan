'use client'

import { ReactNode, ButtonHTMLAttributes, AnchorHTMLAttributes } from 'react'
import Link from 'next/link'
import { motion } from 'framer-motion'
import { cn } from '@/lib/utils'

interface GradientButtonProps extends ButtonHTMLAttributes<HTMLButtonElement> {
  children: ReactNode
  size?: 'sm' | 'md' | 'lg'
  variant?: 'primary' | 'secondary' | 'outline' | 'ghost' | 'danger'
  href?: string
  leftIcon?: ReactNode
  rightIcon?: ReactNode
  loading?: boolean
  fullWidth?: boolean
}

const sizeClasses = {
  sm: 'px-3.5 py-2 text-xs gap-1.5',
  md: 'px-4 py-2.5 text-sm gap-2',
  lg: 'px-6 py-3 text-sm gap-2',
}

const variantClasses = {
  primary: 'gradient-primary text-white shadow-[var(--shadow-primary)] hover:shadow-[0_6px_20px_0_rgb(108_99_255_/_0.35)] hover:brightness-105',
  secondary: 'bg-[var(--secondary)] text-white hover:bg-[var(--secondary-hover)]',
  outline: 'border border-[var(--border)] bg-[var(--card)] text-[var(--text)] hover:bg-[var(--hover)] hover:border-[var(--primary)] hover:text-[var(--primary)]',
  ghost: 'text-[var(--text-muted)] hover:bg-[var(--hover)] hover:text-[var(--text)]',
  danger: 'bg-[var(--danger)] text-white hover:bg-red-600',
}

export default function GradientButton({
  children,
  size = 'md',
  variant = 'primary',
  href,
  leftIcon,
  rightIcon,
  loading = false,
  fullWidth = false,
  className,
  disabled,
  ...props
}: GradientButtonProps) {
  const classes = cn(
    'inline-flex items-center justify-center font-semibold rounded-xl transition-all duration-150 cursor-pointer flex-shrink-0',
    sizeClasses[size],
    variantClasses[variant],
    fullWidth && 'w-full',
    (disabled || loading) && 'opacity-60 cursor-not-allowed pointer-events-none',
    className
  )

  const content = (
    <>
      {loading ? (
        <svg className="animate-spin w-4 h-4" fill="none" viewBox="0 0 24 24">
          <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4" />
          <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4z" />
        </svg>
      ) : leftIcon}
      {children}
      {!loading && rightIcon}
    </>
  )

  if (href) {
    return (
      <Link href={href} className={classes}>
        {content}
      </Link>
    )
  }

  return (
    <motion.button
      whileHover={!disabled && !loading ? { scale: 1.01, y: -0.5 } : {}}
      whileTap={!disabled && !loading ? { scale: 0.98 } : {}}
      transition={{ duration: 0.12 }}
      className={classes}
      disabled={disabled || loading}
      {...(props as any)}
    >
      {content}
    </motion.button>
  )
}
