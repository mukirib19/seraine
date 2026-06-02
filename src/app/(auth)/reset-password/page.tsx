'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'

export default function ResetPasswordPage() {
  const router = useRouter()
  const [password, setPassword] = useState('')
  const [confirm, setConfirm] = useState('')
  const [loading, setLoading] = useState(false)

  const handleReset = async (e: React.FormEvent) => {
    e.preventDefault()
    if (password !== confirm) { toast.error('Passwords do not match'); return }
    if (password.length < 8) { toast.error('Password must be at least 8 characters'); return }
    setLoading(true)
    const { error } = await supabase.auth.updateUser({ password })
    setLoading(false)
    if (error) { toast.error(error.message); return }
    toast.success('Password updated successfully')
    router.push('/login')
  }

  return (
    <div className="min-h-screen flex items-center justify-center bg-cream px-4">
      <div className="absolute top-20 -left-32 w-96 h-96 blob blob-burgundy" />
      <div className="relative z-10 w-full max-w-md">
        <div className="text-center mb-8"><Link href="/" className="font-heading text-3xl font-bold text-charcoal">Seraine</Link></div>
        <form onSubmit={handleReset} className="bg-white rounded-lg border border-border-subtle p-6 space-y-4 shadow-sm">
          <h3 className="font-heading text-xl font-semibold text-center">Set New Password</h3>
          <Input label="New Password" type="password" value={password} onChange={e => setPassword(e.target.value)} required placeholder="Min 8 characters" />
          <Input label="Confirm Password" type="password" value={confirm} onChange={e => setConfirm(e.target.value)} required placeholder="••••••••" />
          <Button type="submit" isLoading={loading} className="w-full">Update Password</Button>
        </form>
      </div>
    </div>
  )
}
