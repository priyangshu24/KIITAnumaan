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
        'bg-[#151515] border border-[rgba(255,255,255,0.08)] rounded-[16px] p-6 text-white',
        hoverLift && 'card-hover-lift cursor-pointer',
        className
      )}
    >
      {children}
    </div>
  )
}
