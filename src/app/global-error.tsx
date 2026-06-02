'use client'
import { Button } from '@/components/ui/button'

export default function GlobalError({ error, reset }: { error: Error; reset: () => void }) {
  return (
    <html><body className="min-h-screen flex items-center justify-center bg-cream font-body">
      <div className="text-center px-4">
        <h1 className="text-6xl font-heading font-bold text-error mb-4">500</h1>
        <h2 className="text-2xl font-heading mb-3">Something went wrong</h2>
        <p className="text-muted mb-8">An unexpected error occurred. Please try again.</p>
        <Button onClick={reset}>Try Again</Button>
      </div>
    </body></html>
  )
}
