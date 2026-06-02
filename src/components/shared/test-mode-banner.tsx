import { AlertTriangle } from 'lucide-react'
import { cn } from '@/lib/utils'

interface TestModeBannerProps {
  isTestMode: boolean
  className?: string
}

export function TestModeBanner({ isTestMode, className }: TestModeBannerProps) {
  if (!isTestMode) return null

  return (
    <div
      className={cn(
        'bg-amber-100 border-b border-amber-300 text-amber-900 z-[60]',
        className
      )}
      role="status"
      aria-live="polite"
    >
      <div className="container-default flex items-center justify-center gap-2 py-2 px-4">
        <AlertTriangle className="w-4 h-4 flex-shrink-0 text-amber-600" />
        <p className="text-xs sm:text-sm font-medium text-center">
          Test Mode Active &mdash; Payment integrations are using test credentials
        </p>
      </div>
    </div>
  )
}
