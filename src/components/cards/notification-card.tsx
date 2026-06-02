'use client'

import { cn, formatRelativeDate } from '@/lib/utils'
import { X, Bell, Package, Truck, FileCheck, AlertTriangle } from 'lucide-react'
import type { LucideIcon } from 'lucide-react'

const TYPE_ICONS: Record<string, LucideIcon> = {
  order_placed: Package,
  order_status: Package,
  proof_ready: FileCheck,
  delivery_assigned: Truck,
  delivery_update: Truck,
  low_stock: AlertTriangle,
  default: Bell,
}

interface NotificationCardProps {
  id: string
  type: string
  title: string
  body: string
  isRead: boolean
  createdAt: string
  actionUrl?: string | null
  onDismiss?: (id: string) => void
  onRead?: (id: string) => void
}

export function NotificationCard({
  id,
  type,
  title,
  body,
  isRead,
  createdAt,
  actionUrl,
  onDismiss,
  onRead,
}: NotificationCardProps) {
  const Icon = TYPE_ICONS[type] || TYPE_ICONS.default

  return (
    <div
      className={cn(
        'relative bg-white rounded-lg border p-4 transition-colors',
        isRead ? 'border-border-subtle' : 'border-burgundy/30 bg-burgundy/[0.02]'
      )}
      onClick={() => !isRead && onRead?.(id)}
      role={!isRead ? 'button' : undefined}
      tabIndex={!isRead ? 0 : undefined}
    >
      <div className="flex gap-3">
        {/* Unread dot */}
        {!isRead && (
          <div className="absolute top-4 left-4 w-2 h-2 rounded-full bg-burgundy" />
        )}

        {/* Icon */}
        <div className={cn(
          'w-9 h-9 rounded-full flex items-center justify-center flex-shrink-0',
          !isRead ? 'bg-burgundy/10' : 'bg-cream'
        )}>
          <Icon className={cn('w-4 h-4', !isRead ? 'text-burgundy' : 'text-muted')} />
        </div>

        {/* Content */}
        <div className="flex-1 min-w-0">
          <p className={cn(
            'text-sm',
            !isRead ? 'font-semibold text-charcoal' : 'font-medium text-charcoal'
          )}>
            {title}
          </p>
          <p className="text-sm text-muted mt-0.5 truncate-2">{body}</p>
          <p className="text-xs text-muted mt-1.5">{formatRelativeDate(createdAt)}</p>
        </div>

        {/* Dismiss */}
        {onDismiss && (
          <button
            onClick={(e) => {
              e.stopPropagation()
              onDismiss(id)
            }}
            className="w-7 h-7 rounded-full flex items-center justify-center text-muted hover:text-charcoal hover:bg-cream transition-colors flex-shrink-0"
            aria-label="Dismiss notification"
          >
            <X className="w-3.5 h-3.5" />
          </button>
        )}
      </div>
    </div>
  )
}
