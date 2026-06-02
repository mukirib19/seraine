import { cn } from '@/lib/utils'

type BlobVariant = 'auth' | 'hero' | 'error'

interface BlobBackgroundProps {
  variant: BlobVariant
  className?: string
}

const BLOB_POSITIONS: Record<
  BlobVariant,
  { blob1: string; blob2: string }
> = {
  auth: {
    blob1: 'top-1/4 -left-20 w-72 h-72 md:w-96 md:h-96',
    blob2: 'bottom-1/4 -right-16 w-64 h-64 md:w-80 md:h-80',
  },
  hero: {
    blob1: '-top-16 right-1/4 w-80 h-80 md:w-[480px] md:h-[480px]',
    blob2: 'top-1/2 -left-24 w-72 h-72 md:w-[400px] md:h-[400px]',
  },
  error: {
    blob1: 'top-1/3 left-1/4 w-64 h-64 md:w-80 md:h-80',
    blob2: 'bottom-1/3 right-1/4 w-56 h-56 md:w-72 md:h-72',
  },
}

export function BlobBackground({ variant, className }: BlobBackgroundProps) {
  const positions = BLOB_POSITIONS[variant]

  return (
    <div
      className={cn(
        'absolute inset-0 overflow-hidden pointer-events-none z-0',
        className
      )}
      aria-hidden="true"
    >
      {/* Burgundy blob */}
      <div
        className={cn(
          'blob blob-burgundy',
          positions.blob1
        )}
        style={{ animationDelay: '0s' }}
      />

      {/* Gold blob */}
      <div
        className={cn(
          'blob blob-gold',
          positions.blob2
        )}
        style={{ animationDelay: '2s' }}
      />
    </div>
  )
}
