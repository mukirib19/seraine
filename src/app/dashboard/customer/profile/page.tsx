'use client'
import { useEffect, useState } from 'react'
import { useAuthStore } from '@/stores/auth.store'
import { supabase } from '@/lib/supabase'
import { Input } from '@/components/ui/input'
import { Button } from '@/components/ui/button'
import { Avatar } from '@/components/ui/avatar'
import { Separator } from '@/components/ui/separator'
import { toast } from 'sonner'
import { Save } from 'lucide-react'

export default function CustomerProfilePage() {
  const { profile, setProfile, user } = useAuthStore()
  const [form, setForm] = useState({ full_name: '', phone: '', business_name: '' })
  const [loading, setLoading] = useState(false)

  useEffect(() => {
    if (profile) setForm({ full_name: profile.full_name, phone: profile.phone || '', business_name: profile.business_name || '' })
  }, [profile])

  const handleSave = async () => {
    if (!user) return
    setLoading(true)
    const { data, error } = await supabase.from('profiles').update({ full_name: form.full_name, phone: form.phone || null, business_name: form.business_name || null }).eq('id', user.id).select().single()
    setLoading(false)
    if (error) { toast.error('Failed to update profile'); return }
    if (data) setProfile(data)
    toast.success('Profile updated')
  }

  return (
    <div className="space-y-6 max-w-2xl">
      <h1 className="text-2xl">Profile</h1>
      <div className="bg-white rounded-lg border border-border-subtle p-6">
        <div className="flex items-center gap-4 mb-6">
          <Avatar src={profile?.avatar_url} name={profile?.full_name || 'User'} size="lg" />
          <div><p className="font-heading text-lg font-semibold">{profile?.full_name}</p><p className="text-sm text-muted text-id">{profile?.display_id}</p></div>
        </div>
        <Separator className="mb-6" />
        <div className="space-y-4">
          <Input label="Full Name" value={form.full_name} onChange={e => setForm(f => ({ ...f, full_name: e.target.value }))} required />
          <Input label="Email" value={user?.email || ''} disabled />
          <Input label="Phone" value={form.phone} onChange={e => setForm(f => ({ ...f, phone: e.target.value }))} placeholder="+254 7XX XXX XXX" />
          {profile?.account_type === 'business' && <Input label="Business Name" value={form.business_name} onChange={e => setForm(f => ({ ...f, business_name: e.target.value }))} />}
          <Button onClick={handleSave} isLoading={loading} leftIcon={<Save className="w-4 h-4" />}>Save Changes</Button>
        </div>
      </div>
    </div>
  )
}
