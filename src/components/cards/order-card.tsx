'use client'

import Link from 'next/link'
import { cn, formatCurrency, formatDate, formatStatus, ORDER_STATUS_COLORS } from '@/lib/utils'
import { Package, ChevronRight } from 'lucide-react'

interface OrderCardProps {
  id: string
  displayId: string
  status: string
  createdAt: string
  itemCount: number
  totalAmount: number
  currency?: string
  href?: string
}

export function OrderCard({
  id,
  displayId,
  status,
  createdAt,
  itemCount,
  totalAmount,
  currency = 'KES',
  href,
}: OrderCardProps) {
  const colors = ORDER_STATUS_COLORS[status] || ORDER_STATUS_COLORS.pending

  const content = (
    <div className="bg-white rounded-lg border border-border-subtle p-4 card-hover cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
            <Package className="w-5 h-5 text-burgundy" />
          </div>
          <div className="min-w-0">
            <p className="text-id text-charcoal font-semibold">{displayId}</p>
            <p className="text-sm text-muted">{formatDate(createdAt)}</p>
          </div>
        </div>
        <div className="flex items-center gap-2 flex-shrink-0">
          <span className={cn('badge', colors.bg, colors.text)}>
            <span className={cn('w-1.5 h-1.5 rounded-full', colors.dot)} />
            {formatStatus(status)}
          </span>
          <ChevronRight className="w-4 h-4 text-muted" />
        </div>
      </div>

      <div className="mt-3 pt-3 border-t border-border-subtle flex items-center justify-between">
        <span className="text-sm text-muted">
          {itemCount} {itemCount === 1 ? 'item' : 'items'}
        </span>
        <span className="text-sm font-semibold text-charcoal">
          {formatCurrency(totalAmount, currency)}
        </span>
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
