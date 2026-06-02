'use client'
import { useEffect, useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { LogIn, Eye, EyeOff } from 'lucide-react'

export default function LoginPage() {
  const router = useRouter()
  const [email, setEmail] = useState('')
  const [password, setPassword] = useState('')
  const [showPw, setShowPw] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!email || !password) { toast.error('Email and password required'); return }
    setLoading(true)
    const { data, error } = await supabase.auth.signInWithPassword({ email, password })
    if (error) { toast.error(error.message); setLoading(false); return }

    const { data: profile } = await supabase.from('profiles').select('role').eq('id', data.user.id).single()
    toast.success('Welcome back!')
    const role = profile?.role || 'user'

    // Hard redirect — ensures full page reload with new auth state
    if (role === 'admin') {
      window.location.href = '/admin'
    } else {
      window.location.href = '/'
    }
  }

  const handleGoogle = async () => {
    setGoogleLoading(true)
    const { error } = await supabase.auth.signInWithOAuth({
      provider: 'google',
      options: { redirectTo: `${window.location.origin}/` },
    })
    if (error) { toast.error(error.message); setGoogleLoading(false) }
  }

  return (
    <div className="min-h-screen flex items-center justify-center px-4" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="w-full max-w-md">
        <div className="text-center mb-8">
          <Link href="/">
            <Image src="/assets/logo.png" alt="Seraine Creations" width={180} height={180} className="mx-auto w-44 h-auto object-contain" priority />
          </Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>Sign in to your account</p>
        </div>

        <form onSubmit={handleLogin} className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <Input label="Email" type="email" value={email} onChange={e => setEmail(e.target.value)} required placeholder="you@example.com" />

          <div className="relative">
            <Input label="Password" type={showPw ? 'text' : 'password'} value={password} onChange={e => setPassword(e.target.value)} required placeholder="••••••••" />
            <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] p-1 rounded" style={{ color: 'var(--muted)' }} tabIndex={-1}>
              {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
            </button>
          </div>

          <div className="text-right">
            <Link href="/forgot-password" className="text-sm font-medium hover:underline" style={{ color: 'var(--primary)' }}>Forgot password?</Link>
          </div>

          <Button type="submit" isLoading={loading} className="w-full btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }} rightIcon={!loading ? <LogIn className="w-4 h-4" /> : undefined}>
            Sign In
          </Button>

          <div className="relative my-4">
            <div className="absolute inset-0 flex items-center"><div className="w-full border-t" style={{ borderColor: 'var(--border)' }} /></div>
            <div className="relative flex justify-center text-xs"><span className="px-2" style={{ backgroundColor: 'var(--card-bg)', color: 'var(--muted)' }}>or</span></div>
          </div>

          <button type="button" onClick={handleGoogle} disabled={googleLoading}
            className="w-full flex items-center justify-center gap-3 h-11 rounded-pill text-sm font-medium transition-colors disabled:opacity-50"
            style={{ border: '1px solid var(--border)', color: 'var(--text)', backgroundColor: 'var(--card-bg)' }}>
            {googleLoading ? <span className="spinner" /> : (
              <svg width="18" height="18" viewBox="0 0 18 18"><path d="M16.51 8H8.98v3h4.3c-.18 1-.74 1.48-1.6 2.04v2.01h2.6a7.8 7.8 0 0 0 2.38-5.88c0-.57-.05-.99-.15-1.17z" fill="#4285F4"/><path d="M8.98 17c2.16 0 3.97-.72 5.3-1.94l-2.6-2.01c-.72.48-1.63.77-2.7.77-2.08 0-3.83-1.4-4.46-3.29H1.87v2.07A8 8 0 0 0 8.98 17z" fill="#34A853"/><path d="M4.52 10.53a4.8 4.8 0 0 1 0-3.06V5.4H1.87a8 8 0 0 0 0 7.2l2.65-2.07z" fill="#FBBC05"/><path d="M8.98 3.58c1.17 0 2.23.4 3.06 1.2l2.3-2.3A8 8 0 0 0 1.87 5.4l2.65 2.07c.63-1.89 2.38-3.29 4.46-3.89z" fill="#EA4335"/></svg>
            )}
            Continue with Google
          </button>
        </form>

        <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
          Don&apos;t have an account?{' '}
          <Link href="/signup" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>Sign up</Link>
        </p>
      </div>
    </div>
  )
}
