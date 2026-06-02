'use client'
import * as React from 'react'
import * as SwitchPrimitive from '@radix-ui/react-switch'
import { cn } from '@/lib/utils'

const Switch = React.forwardRef<React.ElementRef<typeof SwitchPrimitive.Root>, React.ComponentPropsWithoutRef<typeof SwitchPrimitive.Root> & { label?: string }>(
  ({ className, label, id, ...props }, ref) => {
    const switchId = id || label?.toLowerCase().replace(/\s+/g, '-')
    return (
      <div className="flex items-center gap-3">
        <SwitchPrimitive.Root ref={ref} id={switchId} className={cn('peer inline-flex h-6 w-11 shrink-0 cursor-pointer items-center rounded-full border-2 border-transparent transition-colors focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-burgundy focus-visible:ring-offset-2 focus-visible:ring-offset-cream disabled:cursor-not-allowed disabled:opacity-50 data-[state=checked]:bg-burgundy data-[state=unchecked]:bg-border', className)} {...props}>
          <SwitchPrimitive.Thumb className="pointer-events-none block h-5 w-5 rounded-full bg-white shadow-sm transition-transform data-[state=checked]:translate-x-5 data-[state=unchecked]:translate-x-0" />
        </SwitchPrimitive.Root>
        {label && <label htmlFor={switchId} className="text-sm font-medium text-charcoal cursor-pointer">{label}</label>}
      </div>
    )
  }
)
Switch.displayName = SwitchPrimitive.Root.displayName
export { Switch }
