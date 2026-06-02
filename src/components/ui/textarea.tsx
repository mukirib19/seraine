import * as React from 'react'
import { cn } from '@/lib/utils'

export interface TextareaProps extends React.TextareaHTMLAttributes<HTMLTextAreaElement> {
  label?: string
  error?: string
}

const Textarea = React.forwardRef<HTMLTextAreaElement, TextareaProps>(
  ({ className, label, error, required, id, ...props }, ref) => {
    const textareaId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label htmlFor={textareaId} className="block text-sm font-medium text-charcoal mb-1.5">
            {label}
            {required && <span className="text-burgundy ml-0.5">•</span>}
          </label>
        )}
        <textarea
          id={textareaId}
          className={cn(
            'flex w-full min-h-[88px] rounded-md border bg-white px-3 py-2 text-sm font-body text-charcoal placeholder:text-muted/60 transition-colors resize-y',
            'focus:outline-none focus:ring-0',
            error ? 'border-2 border-error' : 'border border-border focus:border-2 focus:border-burgundy',
            'disabled:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:text-muted',
            className
          )}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          {...props}
        />
        {error && <p className="mt-1.5 text-sm text-error">{error}</p>}
      </div>
    )
  }
)
Textarea.displayName = 'Textarea'

export { Textarea }
