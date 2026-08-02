'use client'

import { cn } from '@/lib/utils'

type StatusType = 'success' | 'danger' | 'warning' | 'info' | 'neutral' | 'primary'

interface StatusBadgeProps {
  status: StatusType
  label: string
  dot?: boolean
  size?: 'sm' | 'md'
}

const statusStyles: Record<StatusType, string> = {
  success: 'bg-[var(--success-light)] text-[var(--success)]',
  danger: 'bg-[var(--danger-light)] text-[var(--danger)]',
  warning: 'bg-[var(--warning-light)] text-[var(--warning)]',
  info: 'bg-[var(--info-light)] text-[var(--info)]',
  neutral: 'bg-[var(--hover)] text-[var(--text-muted)]',
  primary: 'bg-[var(--primary-light)] text-[var(--primary)]',
}

const dotStyles: Record<StatusType, string> = {
  success: 'bg-[var(--success)]',
  danger: 'bg-[var(--danger)]',
  warning: 'bg-[var(--warning)]',
  info: 'bg-[var(--info)]',
  neutral: 'bg-[var(--text-muted)]',
  primary: 'bg-[var(--primary)]',
}

export default function StatusBadge({ status, label, dot = false, size = 'md' }: StatusBadgeProps) {
  return (
    <span
      className={cn(
        'inline-flex items-center gap-1.5 font-semibold rounded-full',
        statusStyles[status],
        size === 'sm' ? 'px-2 py-0.5 text-[10px]' : 'px-2.5 py-1 text-xs',
      )}
    >
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotStyles[status])} />
      )}
      {label}
    </span>
  )
}
