import { cn } from '@/lib/utils'

interface MarqueeProps {
  items?: string[]
  className?: string
  speed?: number
}

const DEFAULT_ITEMS = [
  'T-Shirt Printing',
  'Mug Branding',
  'Large Format',
  'Engraving',
  'Notebooks',
  'Bottle Branding',
  'Event Stationery',
  'Graphic Design',
]

export function Marquee({
  items = DEFAULT_ITEMS,
  className,
  speed = 60,
}: MarqueeProps) {
  const separator = ' \u00B7 '
  const marqueeText = items.join(separator) + separator

  return (
    <div
      className={cn(
        'marquee-container py-4 bg-cream border-y border-border-subtle group',
        className
      )}
      aria-hidden="true"
    >
      <div
        className="marquee-content group-hover:[animation-play-state:paused]"
        style={{ animationDuration: `${speed}s` }}
      >
        {/* First copy */}
        <span className="text-sm uppercase tracking-widest text-muted font-medium whitespace-nowrap">
          {marqueeText}
        </span>
        {/* Second copy for seamless loop */}
        <span className="text-sm uppercase tracking-widest text-muted font-medium whitespace-nowrap">
          {marqueeText}
        </span>
      </div>
    </div>
  )
}
