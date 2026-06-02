'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/components/providers/theme-provider'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Save, Moon, Sun, Heart, Trash2, LogOut, Shield } from 'lucide-react'
import { useRouter } from 'next/navigation'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'

export default function ProfilePage() {
  const router = useRouter()
  const { user, profile, setProfile, logout } = useAuthStore()
  const { theme, toggle } = useTheme()
  const [form, setForm] = useState({ full_name: '', phone: '' })
  const [saving, setSaving] = useState(false)
  const [favourites, setFavourites] = useState<any[]>([])
  const [deleting, setDeleting] = useState(false)
  const [confirmDelete, setConfirmDelete] = useState(false)

  useEffect(() => {
    if (!user) { router.push('/login'); return }
    if (profile) setForm({ full_name: profile.full_name, phone: profile.phone || '' })
  }, [user, profile, router])

  useEffect(() => {
    if (!user) return
    supabase.from('favourites').select('*, products:product_id(id,name,images,price)').eq('user_id', user.id)
      .then(({ data }) => setFavourites(data || []))
  }, [user])

  const handleSave = async () => {
    if (!user) return
    setSaving(true)
    const { data, error } = await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone || null }).eq('id', user.id).select().single()
    setSaving(false)
    if (error) { toast.error('Failed to save'); return }
    if (data) setProfile(data)
    toast.success('Profile saved')
  }

  const handleToggleDarkMode = async () => {
    toggle()
    if (user) await supabase.from('profiles').update({ dark_mode: theme === 'light' }).eq('id', user.id)
  }

  const handleDeleteAccount = async () => {
    if (!confirmDelete) { setConfirmDelete(true); toast('Type DELETE to confirm account deletion'); return }
    setDeleting(true)
    const { error } = await supabase.rpc('delete_user_account')
    setDeleting(false)
    if (error) { toast.error('Failed to delete account. Contact support.'); return }
    await supabase.auth.signOut()
    logout()
    toast.success('Account deleted')
    router.push('/')
  }

  const removeFavourite = async (favId: string) => {
    await supabase.from('favourites').delete().eq('id', favId)
    setFavourites(f => f.filter(x => x.id !== favId))
    toast.success('Removed from favourites')
  }

  const handleLogout = async () => {
    await supabase.auth.signOut()
    logout()
    toast.success('Logged out')
    router.push('/')
  }

  if (!user) return null

  return (
    <>
      <Navbar />
      <main className="container-default py-12 space-y-8 min-h-screen">
        <h1 className="text-3xl">My Profile</h1>

        {/* Account Details */}
        <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <h3 className="font-heading text-xl font-semibold flex items-center gap-2"><Shield className="w-5 h-5" style={{ color: 'var(--primary)' }} />Account Details</h3>
          <Input label="Display Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          <Input label="Email" value={user.email} disabled />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="0705525890" />
          <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="w-4 h-4" />} className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Save Changes</Button>
        </div>

        {/* Dark Mode */}
        <div className="rounded-2xl p-6 flex items-center justify-between" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <div className="flex items-center gap-3">
            {theme === 'dark' ? <Moon className="w-5 h-5" style={{ color: 'var(--primary)' }} /> : <Sun className="w-5 h-5" style={{ color: 'var(--promo)' }} />}
            <div><p className="font-medium">Dark Mode</p><p className="text-sm" style={{ color: 'var(--muted)' }}>Toggle dark/light theme</p></div>
          </div>
          <button onClick={handleToggleDarkMode} className="w-12 h-7 rounded-full relative transition-colors" style={{ backgroundColor: theme === 'dark' ? 'var(--primary)' : 'var(--border)' }}>
            <div className="w-5 h-5 rounded-full bg-white absolute top-1 transition-all" style={{ left: theme === 'dark' ? '26px' : '2px' }} />
          </button>
        </div>

        {/* Favourites */}
        <div className="rounded-2xl p-6" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <h3 className="font-heading text-xl font-semibold flex items-center gap-2 mb-4"><Heart className="w-5 h-5" style={{ color: 'var(--danger)' }} />Favourites</h3>
          {favourites.length === 0 ? <p className="text-sm" style={{ color: 'var(--muted)' }}>No favourites yet.</p> : (
            <div className="space-y-3">{favourites.map(f => (
              <div key={f.id} className="flex items-center justify-between p-3 rounded-xl" style={{ border: '0.5px solid var(--border)' }}>
                <div className="flex items-center gap-3">
                  {f.products?.images?.[0] && <img src={f.products.images[0]} alt="" className="w-12 h-12 rounded-lg object-cover" loading="lazy" />}
                  <div><p className="font-medium text-sm">{f.products?.name || 'Product'}</p><p className="text-xs" style={{ color: 'var(--muted)' }}>KES {f.products?.price || 0}</p></div>
                </div>
                <button onClick={() => removeFavourite(f.id)} className="p-2 rounded-full hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4" style={{ color: 'var(--danger)' }} /></button>
              </div>
            ))}</div>
          )}
        </div>

        <Separator />

        {/* Actions */}
        <div className="flex flex-col sm:flex-row gap-4">
          <Button onClick={handleLogout} variant="secondary" leftIcon={<LogOut className="w-4 h-4" />} className="btn-pill">Log Out</Button>
          <Button onClick={handleDeleteAccount} isLoading={deleting} variant="ghost" className="btn-pill text-danger hover:bg-danger/10" leftIcon={<Trash2 className="w-4 h-4" />}>Delete Account</Button>
        </div>
      </main>
      <Footer />
    </>
  )
}
