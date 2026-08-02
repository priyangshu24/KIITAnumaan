'use client'

import { ReactNode } from 'react'
import { motion } from 'framer-motion'
import { LucideIcon } from 'lucide-react'
import { pageTransition } from '@/lib/animations'
import { cn } from '@/lib/utils'

interface PageHeaderProps {
  title: string
  description?: string
  icon?: LucideIcon
  iconColor?: string
  iconBg?: string
  action?: ReactNode
  badge?: string
  badgeColor?: string
  className?: string
}

export default function PageHeader({
  title,
  description,
  icon: Icon,
  iconColor = 'text-[var(--primary)]',
  iconBg = 'bg-[var(--primary-light)]',
  action,
  badge,
  badgeColor = 'bg-[var(--primary-light)] text-[var(--primary)]',
  className,
}: PageHeaderProps) {
  return (
    <div className={cn('flex items-start justify-between gap-4 mb-8', className)}>
      <div className="flex items-center gap-4">
        {Icon && (
          <div className={cn('w-12 h-12 rounded-2xl flex items-center justify-center flex-shrink-0', iconBg)}>
            <Icon size={22} className={iconColor} strokeWidth={2} />
          </div>
        )}
        <div>
          <div className="flex items-center gap-2.5 flex-wrap">
            <h1 className="text-2xl font-bold text-[var(--text)] tracking-tight">{title}</h1>
            {badge && (
              <span className={cn('text-xs font-semibold px-2.5 py-1 rounded-full', badgeColor)}>
                {badge}
              </span>
            )}
          </div>
          {description && (
            <p className="text-sm text-[var(--text-muted)] mt-0.5 font-medium">{description}</p>
          )}
        </div>
      </div>
      {action && <div className="flex-shrink-0">{action}</div>}
    </div>
  )
}
