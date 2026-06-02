import { cva, type VariantProps } from 'class-variance-authority'
import { cn } from '@/lib/utils'

const badgeVariants = cva(
  'inline-flex items-center gap-1 px-2.5 py-0.5 text-xs font-medium rounded-full whitespace-nowrap',
  {
    variants: {
      variant: {
        default: 'bg-cream text-charcoal',
        secondary: 'bg-charcoal/5 text-charcoal',
        outline: 'border border-border text-charcoal',
        success: 'bg-emerald-50 text-success',
        warning: 'bg-amber-50 text-warning',
        error: 'bg-red-50 text-error',
        info: 'bg-blue-50 text-info',
        burgundy: 'bg-burgundy/10 text-burgundy',
        gold: 'bg-amber-50 text-gold',
        // Order statuses
        pending: 'bg-amber-50 text-amber-800',
        confirmed: 'bg-blue-50 text-info',
        in_production: 'bg-burgundy/10 text-burgundy',
        quality_check: 'bg-purple-50 text-purple-800',
        ready: 'bg-teal-50 text-teal-800',
        dispatched: 'bg-orange-50 text-orange-800',
        delivered: 'bg-emerald-50 text-success',
        cancelled: 'bg-red-50 text-error',
        refunded: 'bg-gray-100 text-muted',
        // Payment
        processing: 'bg-blue-50 text-info',
        failed: 'bg-red-50 text-error',
        // Proof
        pending_review: 'bg-amber-50 text-amber-800',
        approved: 'bg-emerald-50 text-success',
        revision_requested: 'bg-orange-50 text-orange-800',
        // User
        active: 'bg-emerald-50 text-success',
        deactivated: 'bg-red-50 text-error',
        invited: 'bg-gray-100 text-muted',
        // Delivery
        assigned: 'bg-blue-50 text-info',
        picked_up: 'bg-purple-50 text-purple-800',
        in_transit: 'bg-orange-50 text-orange-800',
        reassigned: 'bg-gray-100 text-muted',
      },
    },
    defaultVariants: {
      variant: 'default',
    },
  }
)

export interface BadgeProps
  extends React.HTMLAttributes<HTMLSpanElement>,
    VariantProps<typeof badgeVariants> {
  dot?: boolean
  dotColor?: string
}

function Badge({ className, variant, dot, dotColor, children, ...props }: BadgeProps) {
  return (
    <span className={cn(badgeVariants({ variant }), className)} {...props}>
      {dot && (
        <span className={cn('w-1.5 h-1.5 rounded-full flex-shrink-0', dotColor || 'bg-current')} />
      )}
      {children}
    </span>
  )
}

export { Badge, badgeVariants }
