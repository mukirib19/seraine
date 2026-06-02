import * as React from 'react'
import { cn } from '@/lib/utils'

export interface InputProps extends React.InputHTMLAttributes<HTMLInputElement> {
  label?: string
  error?: string
}

const Input = React.forwardRef<HTMLInputElement, InputProps>(
  ({ className, type, label, error, required, id, ...props }, ref) => {
    const inputId = id || label?.toLowerCase().replace(/\s+/g, '-')

    return (
      <div className="w-full">
        {label && (
          <label
            htmlFor={inputId}
            className="block text-sm font-medium text-charcoal mb-1.5"
          >
            {label}
            {required && <span className="text-burgundy ml-0.5">•</span>}
          </label>
        )}
        <input
          type={type}
          id={inputId}
          className={cn(
            'flex w-full min-h-[44px] rounded-md border bg-white px-3 py-2 text-sm font-body text-charcoal placeholder:text-muted/60 transition-colors',
            'focus:outline-none focus:ring-0',
            error
              ? 'border-2 border-error'
              : 'border border-border focus:border-2 focus:border-burgundy',
            'disabled:bg-[#F5F3EF] disabled:cursor-not-allowed disabled:text-muted',
            className
          )}
          ref={ref}
          required={required}
          aria-invalid={!!error}
          aria-describedby={error ? `${inputId}-error` : undefined}
          {...props}
        />
        {error && (
          <p id={`${inputId}-error`} className="mt-1.5 text-sm text-error">
            {error}
          </p>
        )}
      </div>
    )
  }
)
Input.displayName = 'Input'

export { Input }
