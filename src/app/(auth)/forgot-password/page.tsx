'use client'
import { useState } from 'react'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ForgotPasswordPage() {
  const [email, setEmail] = useState('')
  const [loading, setLoading] = useState(false)
  const [sent, setSent] = useState(false)

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault(); setLoading(true)
    const { error } = await supabase.auth.resetPasswordForEmail(email, { redirectTo: `${window.location.origin}/reset-password` })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    setSent(true)
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="absolute top-20 -left-32 w-96 h-96 blob blob-burgundy" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8"><Link href="/" className="font-heading text-3xl font-bold text-charcoal">Seraine</Link></div>
        <div className="bg-white rounded-lg border border-border-subtle p-6 shadow-sm">
          {sent ? (
            <div className="text-center py-4"><h3 className="font-heading text-xl font-semibold mb-2">Check Your Email</h3><p className="text-muted text-sm">We sent a password reset link to <strong>{email}</strong></p><Link href="/login" className="inline-block mt-6 text-sm text-burgundy font-medium hover:underline">Back to Login</Link></div>
          ) : (
            <form onSubmit={handleSubmit} className="space-y-4">
              <h3 className="font-heading text-xl font-semibold text-center">Forgot Password</h3>
              <p className="text-sm text-muted text-center">Enter your email and we&apos;ll send you a reset link.</p>
              <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />
              <Button type="submit" isLoading={loading} className="w-full">Send Reset Link</Button>
              <p className="text-center text-sm"><Link href="/login" className="text-burgundy hover:underline">Back to Login</Link></p>
            </form>
          )}
        </div>
      </div>
    </div>
  )
}
