'use client'

import { ReactNode } from 'react'
import { cn } from '@/lib/utils'

interface CardProps {
  children: ReactNode
  className?: string
  hoverLift?: boolean
  onClick?: () => void
}

export default function Card({ children, className, hoverLift = true, onClick }: CardProps) {
  return (
    <div
      onClick={onClick}
      className={cn(
        'glass rounded-[16px] p-6 text-white',
        hoverLift && 'glass-card cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
