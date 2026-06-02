'use client'
import { cn } from '@/lib/utils'

export function StepProgress({ steps, currentStep }: { steps: string[]; currentStep: number }) {
  return (
    <div className="flex items-center w-full">
      {steps.map((step, i) => (
        <div key={i} className={cn('flex items-center', i < steps.length - 1 && 'flex-1')}>
          <div className="flex flex-col items-center">
            <div className={cn('w-8 h-8 rounded-full flex items-center justify-center text-sm font-medium border-2 transition-all',
              i < currentStep ? 'bg-burgundy border-burgundy text-white' :
              i === currentStep ? 'border-burgundy text-burgundy animate-pulse' :
              'border-border-subtle text-muted'
            )}>{i + 1}</div>
            <span className={cn('mt-1.5 text-xs font-medium hidden sm:block', i <= currentStep ? 'text-charcoal' : 'text-muted')}>{step}</span>
          </div>
          {i < steps.length - 1 && <div className={cn('flex-1 h-0.5 mx-2', i < currentStep ? 'bg-burgundy' : 'bg-border-subtle')} />}
        </div>
      ))}
    </div>
  )
}
