'use client'
import { useState } from 'react'
import { useRouter } from 'next/navigation'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { Eye, EyeOff, CheckCircle } from 'lucide-react'

export default function SignupPage() {
  const router = useRouter()
  const [step, setStep] = useState(1)
  const [form, setForm] = useState({ fullName: '', email: '', phone: '', password: '', confirm: '' })
  const [showPw, setShowPw] = useState(false)
  const [showConfirm, setShowConfirm] = useState(false)
  const [loading, setLoading] = useState(false)
  const [googleLoading, setGoogleLoading] = useState(false)

  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const next = () => {
    if (step === 1 && (!form.fullName || !form.email)) { toast.error('Name and email are required'); return }
    if (step === 2) {
      if (form.password.length < 8) { toast.error('Password must be at least 8 characters'); return }
      if (form.password !== form.confirm) { toast.error('Passwords do not match'); return }
    }
    setStep(s => Math.min(s + 1, 3))
  }

  const handleSignup = async () => {
    setLoading(true)
    try {
      const { data, error } = await supabase.auth.signUp({
        email: form.email,
        password: form.password,
        options: {
          data: { full_name: form.fullName },
          // Email verification disabled — user can login immediately
          emailRedirectTo: `${window.location.origin}/`,
        },
      })
      if (error) { toast.error(error.message); return }
      if (data.user) {
        // Save full profile including phone
        await supabase.from('profiles').upsert({
          id: data.user.id,
          full_name: form.fullName,
          email: form.email,
          phone: form.phone || null,
          role: 'user',
        })
      }
      toast.success('Account created! Signing you in...')
      // Sign in immediately (no email verification gate)
      const { error: loginErr } = await supabase.auth.signInWithPassword({ email: form.email, password: form.password })
      if (loginErr) {
        // If auto-login fails (e.g. email confirm required), just redirect to login
        router.replace('/login')
      } else {
        router.replace('/')
      }
    } catch (err: any) {
      toast.error(err.message || 'Signup failed')
    } finally {
      setLoading(false)
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
          <Link href="/"><Image src="/assets/logo.png" alt="Seraine Creations" width={180} height={180} className="mx-auto w-44 h-auto object-contain" priority /></Link>
          <p className="mt-3 text-sm" style={{ color: 'var(--muted)' }}>Create your account</p>
        </div>

        {/* Step indicator */}
        <div className="flex items-center justify-center gap-2 mb-6">
          {[1, 2].map(n => (
            <div key={n} className="flex items-center gap-2">
              <div className="w-7 h-7 rounded-full flex items-center justify-center text-xs font-bold transition-all"
                style={{ backgroundColor: step >= n ? 'var(--primary)' : 'var(--border)', color: step >= n ? '#fff' : 'var(--muted)' }}>
                {n}
              </div>
              {n < 2 && <div className="w-8 h-px" style={{ backgroundColor: step > n ? 'var(--primary)' : 'var(--border)' }} />}
            </div>
          ))}
        </div>

        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          {step === 1 && (
            <>
              <Input label="Full Name" value={form.fullName} onChange={e => u('fullName', e.target.value)} required placeholder="Your name" />
              <Input label="Email" type="email" value={form.email} onChange={e => u('email', e.target.value)} required placeholder="you@example.com" />
              <Input label="Phone Number" value={form.phone} onChange={e => u('phone', e.target.value)} placeholder="+254 7XX XXX XXX" />
              <p className="text-xs" style={{ color: 'var(--muted)' }}>Your phone number will be saved to your profile for order updates.</p>
              <Button onClick={next} className="w-full btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Continue</Button>
            </>
          )}

          {step === 2 && (
            <>
              <div className="relative">
                <Input label="Password" type={showPw ? 'text' : 'password'} value={form.password} onChange={e => u('password', e.target.value)} required placeholder="Min 8 characters" />
                <button type="button" onClick={() => setShowPw(!showPw)} className="absolute right-3 top-[38px] p-1" style={{ color: 'var(--muted)' }} tabIndex={-1}>
                  {showPw ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="relative">
                <Input label="Confirm Password" type={showConfirm ? 'text' : 'password'} value={form.confirm} onChange={e => u('confirm', e.target.value)} required placeholder="••••••••" />
                <button type="button" onClick={() => setShowConfirm(!showConfirm)} className="absolute right-3 top-[38px] p-1" style={{ color: 'var(--muted)' }} tabIndex={-1}>
                  {showConfirm ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                </button>
              </div>
              <div className="flex gap-3">
                <Button variant="secondary" onClick={() => setStep(1)} className="flex-1 btn-pill">Back</Button>
                <Button onClick={handleSignup} isLoading={loading} className="flex-1 btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Create Account</Button>
              </div>
            </>
          )}

          {step < 3 && (
            <>
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
            </>
          )}
        </div>

        {step < 3 && (
          <p className="text-center text-sm mt-6" style={{ color: 'var(--muted)' }}>
            Already have an account?{' '}
            <Link href="/login" className="font-medium hover:underline" style={{ color: 'var(--primary)' }}>Sign in</Link>
          </p>
        )}
      </div>
    </div>
  )
}
