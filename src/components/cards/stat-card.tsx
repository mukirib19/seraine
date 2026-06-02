'use client'

import { cn } from '@/lib/utils'
import { TrendingUp, TrendingDown, Minus } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

interface StatCardProps {
  label: string
  value: string | number
  icon: LucideIcon
  trend?: {
    value: number
    label: string
  }
  className?: string
}

export function StatCard({ label, value, icon: Icon, trend, className }: StatCardProps) {
  const trendDirection = trend ? (trend.value > 0 ? 'up' : trend.value < 0 ? 'down' : 'flat') : null

  return (
    <div className={cn('bg-white rounded-lg border border-border-subtle p-5', className)}>
      <div className="flex items-start justify-between">
        <div>
          <p className="text-sm text-muted font-medium">{label}</p>
          <p className="mt-1 text-2xl font-bold text-charcoal font-heading">{value}</p>
        </div>
        <div className="w-10 h-10 rounded-lg bg-burgundy/10 flex items-center justify-center flex-shrink-0">
          <Icon className="w-5 h-5 text-burgundy" />
        </div>
      </div>

      {trend && (
        <div className="mt-3 flex items-center gap-1.5">
          {trendDirection === 'up' && (
            <TrendingUp className="w-4 h-4 text-success" />
          )}
          {trendDirection === 'down' && (
            <TrendingDown className="w-4 h-4 text-error" />
          )}
          {trendDirection === 'flat' && (
            <Minus className="w-4 h-4 text-muted" />
          )}
          <span
            className={cn(
              'text-sm font-medium',
              trendDirection === 'up' && 'text-success',
              trendDirection === 'down' && 'text-error',
              trendDirection === 'flat' && 'text-muted'
            )}
          >
            {trend.value > 0 ? '+' : ''}{trend.value}%
          </span>
          <span className="text-sm text-muted">{trend.label}</span>
        </div>
      )}
    </div>
  )
}
