'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'
import { useTheme } from '@/components/providers/theme-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Save, Moon, Sun, Heart, Trash2, LogOut, Shield, User } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, setProfile, logout, role, isLoading } = useAuthStore()
  const { clearCart } = useCartStore()
  const { theme, toggle } = useTheme()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [loggingOut, setLoggingOut] = useState(false)
  const [favourites, setFavourites] = useState<any[]>([])
  const [deleting, setDeleting] = useState(false)
  const [mounted, setMounted] = useState(false)

  useEffect(() => { setMounted(true) }, [])

  useEffect(() => {
    // Wait for both: component mounted AND auth fully loaded before redirecting
    if (!mounted || isLoading) return
    if (!user) { router.push('/login'); return }
    if (profile) setForm({ full_name: profile.full_name || '', phone: profile.phone || '' })
  }, [user, profile, router, mounted, isLoading])

  useEffect(() => {
    if (!user) return
    supabase.from('favourites')
      .select('*, products:product_id(id,name,images,price)')
      .eq('user_id', user.id)
      .then(({ data }) => setFavourites(data || []))
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { data, error } = await supabase
      .from('profiles')
      .update({ full_name: form.full_name, phone: form.phone || null })
      .eq('id', user.id)
      .select()
      .single()
    setSaving(false)
    if (error) { toast.error('Failed to save'); return }
    if (data) setProfile(data)
    toast.success('Profile saved!')
  }

  const handleToggleDarkMode = async () => {
    toggle()
    if (user) await supabase.from('profiles').update({ dark_mode: theme === 'light' }).eq('id', user.id)
  }

  const handleLogout = async () => {
    setLoggingOut(true)
    await supabase.auth.signOut()
    clearCart()   // Clear this user's cart from memory
    logout()
    toast.success('Logged out')
    window.location.href = '/'
  }

  const handleDeleteAccount = async () => {
    if (!window.confirm('Are you sure? This cannot be undone.')) return
    setDeleting(true)
    const { error } = await supabase.rpc('delete_user_account')
    setDeleting(false)
    if (error) { toast.error('Failed to delete account. Contact support.'); return }
    await supabase.auth.signOut()
    clearCart()
    logout()
    toast.success('Account deleted')
    window.location.href = '/'
  }

  const removeFavourite = async (favId: string) => {
    await supabase.from('favourites').delete().eq('id', favId)
    setFavourites(f => f.filter(x => x.id !== favId))
    toast.success('Removed from favourites')
  }

  if (!mounted || isLoading) return (
    <div className="min-h-screen flex items-center justify-center">
      <span className="spinner w-8 h-8" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
    </div>
  )
  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="container-default py-12 space-y-6 min-h-screen">
        {/* Header */}
        <div className="flex items-center gap-4">
          <div className="w-16 h-16 rounded-full flex items-center justify-center text-white text-xl font-bold"
            style={{ backgroundColor: 'var(--primary)' }}>
            {(profile?.full_name || user.email)?.[0]?.toUpperCase() || <User className="w-6 h-6" />}
          </div>
          <div>
            <h1 className="text-2xl font-heading font-bold" style={{ color: 'var(--text)' }}>
              {profile?.full_name || 'My Profile'}
            </h1>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{user.email}</p>
            {role === 'admin' && (
              <Link href="/admin" className="text-xs font-medium mt-1 inline-block" style={{ color: 'var(--cta)' }}>
                → Admin Panel
              </Link>
            )}
          </div>
        </div>

        {/* Account Details */}
        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <h3 className="font-heading text-lg font-semibold flex items-center gap-2">
            <Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} /> Account Details
          </h3>
          <Input label="Display Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} placeholder="Your full name" />
          <Input label="Email" value={user.email} disabled />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="e.g. 0705525890" />
          <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="w-4 h-4" />}
            className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>
            Save Changes
          </Button>
        </div>

        {/* Dark Mode */}
        <div className="rounded-2xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {theme === 'dark'
              ? <Moon className="w-5 h-5" style={{ color: 'var(--primary)' }} />
              : <Sun className="w-5 h-5" style={{ color: 'var(--promo)' }} />}
            <div>
              <p className="font-medium" style={{ color: 'var(--text)' }}>Dark Mode</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>Toggle dark/light theme</p>
            </div>
          </div>
          <button onClick={handleToggleDarkMode} className="w-12 h-7 rounded-full relative transition-colors"
            style={{ backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--border)' }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all"
              style={{ left: theme === 'dark' ? '26px' : '2px' }} />
          </button>
        </div>

        {/* Favourites */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <h3 className="font-heading text-lg font-semibold flex items-center gap-2 mb-4">
            <Heart className="w-5 h-5" style={{ color: 'var(--danger)' }} /> Favourites
          </h3>
          {favourites.length === 0
            ? <p className="text-sm" style={{ color: 'var(--muted)' }}>No favourites yet. Browse the catalog!</p>
            : (
              <div className="space-y-3">
                {favourites.map(f => (
                  <div key={f.id} className="flex items-center justify-between p-3 rounded-xl" style={{ border: '0.5px solid var(--border)' }}>
                    <div className="flex items-center gap-3">
                      {f.products?.images?.[0] && (
                        <div className="w-12 h-12 rounded-lg overflow-hidden relative">
                          <Image src={f.products.images[0]} alt="" fill className="object-cover" sizes="48px" />
                        </div>
                      )}
                      <div>
                        <p className="font-medium text-sm" style={{ color: 'var(--text)' }}>{f.products?.name || 'Product'}</p>
                        <p className="text-xs" style={{ color: 'var(--muted)' }}>KES {f.products?.price || 0}</p>
                      </div>
                    </div>
                    <button onClick={() => removeFavourite(f.id)} className="p-2 rounded-full hover:bg-red-50 transition-colors">
                      <Trash2 className="w-4 h-4" style={{ color: 'var(--danger)' }} />
                    </button>
                  </div>
                ))}
              </div>
            )}
        </div>

        <Separator />

        {/* Legal links */}
        <div className="flex gap-4 text-sm" style={{ color: 'var(--muted)' }}>
          <Link href="/terms" className="hover:underline">Terms of Service</Link>
          <Link href="/privacy" className="hover:underline">Privacy Policy</Link>
        </div>

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-3">
          <button onClick={handleLogout} disabled={loggingOut}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-pill font-medium transition-all disabled:opacity-60"
            style={{ border: '1px solid var(--border)', color: 'var(--text)' }}>
            {loggingOut
              ? <span className="spinner w-4 h-4" style={{ borderColor: 'var(--text)', borderTopColor: 'transparent' }} />
              : <LogOut className="w-4 h-4" />}
            {loggingOut ? 'Logging out…' : 'Log Out'}
          </button>
          <button onClick={handleDeleteAccount} disabled={deleting}
            className="inline-flex items-center justify-center gap-2 h-11 px-6 rounded-pill font-medium transition-all disabled:opacity-60 text-sm"
            style={{ color: 'var(--danger)' }}>
            {deleting ? <span className="spinner w-4 h-4" style={{ borderColor: 'var(--danger)', borderTopColor: 'transparent' }} /> : <Trash2 className="w-4 h-4" />}
            Delete Account
          </button>
        </div>
      </main>
      <Footer />
    </>
  )
}
