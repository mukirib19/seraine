'use client'

import Link from 'next/link'
import { cn, formatStatus } from '@/lib/utils'
import { Truck, MapPin, ChevronRight, User } from 'lucide-react'

const DELIVERY_STATUS_COLORS: Record<string, { bg: string; text: string; dot: string }> = {
  pending:     { bg: 'bg-amber-50',     text: 'text-amber-800',    dot: 'bg-amber-500' },
  assigned:    { bg: 'bg-blue-50',      text: 'text-info',         dot: 'bg-info' },
  picked_up:   { bg: 'bg-purple-50',    text: 'text-purple-800',   dot: 'bg-purple-500' },
  in_transit:  { bg: 'bg-orange-50',    text: 'text-orange-800',   dot: 'bg-orange-500' },
  delivered:   { bg: 'bg-emerald-50',   text: 'text-success',      dot: 'bg-success' },
  failed:      { bg: 'bg-red-50',       text: 'text-error',        dot: 'bg-error' },
  reassigned:  { bg: 'bg-gray-100',     text: 'text-muted',        dot: 'bg-muted' },
}

interface DeliveryCardProps {
  id: string
  displayId: string
  status: string
  customerName?: string
  address: string
  agentName?: string
  agentDisplayId?: string
  href?: string
}

export function DeliveryCard({
  id,
  displayId,
  status,
  customerName,
  address,
  agentName,
  agentDisplayId,
  href,
}: DeliveryCardProps) {
  const colors = DELIVERY_STATUS_COLORS[status] || DELIVERY_STATUS_COLORS.pending

  const content = (
    <div className="bg-white rounded-lg border border-border-subtle p-4 card-hover cursor-pointer">
      <div className="flex items-start justify-between gap-3">
        <div className="flex items-center gap-3 min-w-0">
          <div className="w-10 h-10 rounded-lg bg-cream flex items-center justify-center flex-shrink-0">
            <Truck className="w-5 h-5 text-burgundy" />
          </div>
          <div className="min-w-0">
            <p className="text-id text-charcoal font-semibold">{displayId}</p>
            {customerName && (
              <p className="text-sm text-muted truncate">{customerName}</p>
            )}
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

      <div className="mt-3 pt-3 border-t border-border-subtle space-y-2">
        <div className="flex items-center gap-2 text-sm text-muted">
          <MapPin className="w-3.5 h-3.5 flex-shrink-0" />
          <span className="truncate">{address}</span>
        </div>
        {agentName && (
          <div className="flex items-center gap-2 text-sm text-muted">
            <User className="w-3.5 h-3.5 flex-shrink-0" />
            <span className="truncate">{agentName}</span>
            {agentDisplayId && (
              <span className="text-id text-xs">{agentDisplayId}</span>
            )}
          </div>
        )}
      </div>
    </div>
  )

  if (href) {
    return <Link href={href}>{content}</Link>
  }

  return content
}
