'use client'

import { cn } from '@/lib/utils'

type StatusType = 'success' | 'warning' | 'danger' | 'primary' | 'neutral'

interface BadgeProps {
  status?: StatusType
  label: string
  dot?: boolean
  className?: string
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-[#22C55E]/10 text-[#22C55E] border-[#22C55E]/30',
  warning: 'bg-[#F59E0B]/10 text-[#F59E0B] border-[#F59E0B]/30',
  danger: 'bg-[#EF4444]/10 text-[#EF4444] border-[#EF4444]/30',
  primary: 'bg-[#FF3B30]/10 text-[#FF3B30] border-[#FF3B30]/30',
  neutral: 'bg-[#1A1A1A] text-[#A1A1AA] border-[rgba(255,255,255,0.08)]',
}

const dotStyles: Record<StatusType, string> = {
  success: 'bg-[#22C55E]',
  warning: 'bg-[#F59E0B]',
  danger: 'bg-[#EF4444]',
  primary: 'bg-[#FF3B30]',
  neutral: 'bg-[#71717A]',
}

export default function Badge({ status = 'primary', label, dot = true, className }: BadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 px-2.5 py-1 text-[11px] font-bold uppercase tracking-wider rounded-md border',
        statusStyles[status],
        className
      )}
    >
      {dot && <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[status])} />}
      {label}
    </span>
  )
}
