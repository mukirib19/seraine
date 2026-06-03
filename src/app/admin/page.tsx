'use client'
import { useEffect, useState, useCallback } from 'react'
import { useRouter } from 'next/navigation'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { Input } from '@/components/ui/input'
import { Textarea } from '@/components/ui/textarea'
import { Button } from '@/components/ui/button'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Navbar } from '@/components/layout/navbar'
import { toast } from 'sonner'
import { Plus, Pencil, Trash2, Upload, Package, Image as ImageIcon, CalendarDays, Save, X } from 'lucide-react'

// ============================================================
// ADMIN PAGE — Products + Banners management
// ============================================================
export default function AdminPage() {
  const { user, role, isLoading, setLoading } = useAuthStore()
  const router = useRouter()
  const [timedOut, setTimedOut] = useState(false)

  useEffect(() => {
    const t = setTimeout(() => setTimedOut(true), 5000)
    return () => clearTimeout(t)
  }, [])

  useEffect(() => {
    if (isLoading) return // Wait for auth to finish loading
    if (!user) { router.push('/login'); return }
    if (user && role !== null && role !== 'admin') { router.push('/'); return }
  }, [user, role, isLoading, router])

  useEffect(() => {
    if (timedOut && isLoading) { setLoading(false) }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [timedOut, isLoading])

  // Still loading auth state
  if (isLoading && !timedOut) {
    return <div className="min-h-screen flex items-center justify-center"><span className="spinner w-8 h-8" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} /></div>
  }
  // Not logged in or not admin
  if (!user || (role !== null && role !== 'admin')) return null

  return (
    <>
      <Navbar />
      <main className="container-default py-10 min-h-screen">
        <div className="flex items-center gap-3 mb-8">
          <Image src="/assets/logo.png" alt="Seraine" width={36} height={36} className="w-9 h-9" />
          <h1 className="text-3xl">Admin Panel</h1>
        </div>
        <Tabs defaultValue="products">
          <TabsList>
            <TabsTrigger value="products"><Package className="w-4 h-4 mr-1.5" />Products</TabsTrigger>
            <TabsTrigger value="banners"><CalendarDays className="w-4 h-4 mr-1.5" />Banners</TabsTrigger>
          </TabsList>
          <TabsContent value="products"><ProductsManager /></TabsContent>
          <TabsContent value="banners"><BannersManager /></TabsContent>
        </Tabs>
      </main>
    </>
  )
}

// ============================================================
// PRODUCTS MANAGER
// ============================================================
function ProductsManager() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [editing, setEditing] = useState<any | null>(null)
  const [showForm, setShowForm] = useState(false)

  const loadProducts = useCallback(async () => {
    const { data } = await supabase.from('products').select('*').order('created_at', { ascending: false })
    setProducts(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { loadProducts() }, [loadProducts])

  const handleDelete = async (id: string) => {
    if (!confirm('Delete this product?')) return
    await supabase.from('products').delete().eq('id', id)
    setProducts(p => p.filter(x => x.id !== id))
    toast.success('Product deleted')
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{products.length} Products</h2>
        <Button onClick={() => { setEditing(null); setShowForm(true) }} leftIcon={<Plus className="w-4 h-4" />} className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Add Product</Button>
      </div>

      {showForm && <ProductForm product={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); loadProducts() }} />}

      {loading ? <div className="space-y-3">{[1,2,3].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}</div> : products.length === 0 ? <p style={{ color: 'var(--muted)' }}>No products yet. Add your first product.</p> : (
        <div className="space-y-3">{products.map(p => (
          <div key={p.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
            {p.images?.[0] ? <img src={p.images[0]} alt="" className="w-16 h-16 rounded-lg object-cover" loading="lazy" /> : <div className="w-16 h-16 rounded-lg flex items-center justify-center" style={{ backgroundColor: 'var(--light)' }}><ImageIcon className="w-6 h-6" style={{ color: 'var(--muted)' }} /></div>}
            <div className="flex-1 min-w-0">
              <div className="flex items-center gap-2">
                <p className="font-medium truncate">{p.name}</p>
                {p.in_stock ? <span className="badge text-xs" style={{ backgroundColor: 'rgba(91,189,47,0.15)', color: '#5BBD2F' }}>In Stock</span> : <span className="badge text-xs" style={{ backgroundColor: 'rgba(232,35,26,0.15)', color: '#E8231A' }}>Out of Stock</span>}
              </div>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{p.category} · KES {p.price} · SKU: {p.sku}</p>
            </div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditing(p); setShowForm(true) }} className="p-2 rounded-full hover:bg-primary/10 transition-colors"><Pencil className="w-4 h-4" style={{ color: 'var(--primary)' }} /></button>
              <button onClick={() => handleDelete(p.id)} className="p-2 rounded-full hover:bg-danger/10 transition-colors"><Trash2 className="w-4 h-4" style={{ color: 'var(--danger)' }} /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  )
}

// ============================================================
// PRODUCT FORM
// ============================================================
function ProductForm({ product, onClose, onSaved }: { product: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ name: product?.name || '', description: product?.description || '', price: product?.price || '', category: product?.category || '', video_url: product?.video_url || '', in_stock: product?.in_stock ?? true })
  const [images, setImages] = useState<string[]>(product?.images || [])
  const [uploading, setUploading] = useState(false)
  const [saving, setSaving] = useState(false)

  const u = (k: string, v: any) => setForm(f => ({ ...f, [k]: v }))

  const uploadImages = async (files: FileList) => {
    setUploading(true)
    const urls: string[] = []
    for (const file of Array.from(files)) {
      const path = `products/${Date.now()}-${file.name}`
      const { error } = await supabase.storage.from('product-images').upload(path, file)
      if (!error) {
        const { data: urlData } = supabase.storage.from('product-images').getPublicUrl(path)
        urls.push(urlData.publicUrl)
      }
    }
    setImages(prev => [...prev, ...urls])
    setUploading(false)
    if (urls.length) toast.success(`${urls.length} image(s) uploaded`)
  }

  const handleSave = async () => {
    if (!form.name || !form.price) { toast.error('Name and price are required'); return }
    setSaving(true)
    const payload = { name: form.name, description: form.description, price: parseFloat(form.price as string), category: form.category, images, video_url: form.video_url || null, in_stock: form.in_stock }

    if (product) {
      const { error } = await supabase.from('products').update(payload).eq('id', product.id)
      if (error) { toast.error('Update failed'); setSaving(false); return }
      toast.success('Product updated')
    } else {
      const { error } = await supabase.from('products').insert(payload)
      if (error) { toast.error('Create failed'); setSaving(false); return }
      toast.success('Product created')
    }
    setSaving(false)
    onSaved()
  }

  const removeImage = (idx: number) => setImages(prev => prev.filter((_, i) => i !== idx))

  return (
    <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid var(--primary)', borderColor: 'rgba(37,99,196,0.3)' }}>
      <div className="flex items-center justify-between"><h3 className="font-heading text-lg font-semibold">{product ? 'Edit Product' : 'New Product'}</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Name" value={form.name} onChange={e => u('name', e.target.value)} required />
        <Input label="Price (KES)" type="number" value={form.price} onChange={e => u('price', e.target.value)} required />
        <Input label="Category" value={form.category} onChange={e => u('category', e.target.value)} placeholder="e.g. T-Shirt Printing" />
        <Input label="Video URL (optional)" value={form.video_url} onChange={e => u('video_url', e.target.value)} placeholder="https://..." />
      </div>
      <Textarea label="Description" value={form.description} onChange={e => u('description', e.target.value)} rows={3} />

      {/* Images */}
      <div>
        <label className="block text-sm font-medium mb-2">Images</label>
        <div className="flex flex-wrap gap-3">
          {images.map((url, i) => (
            <div key={i} className="relative w-20 h-20 rounded-lg overflow-hidden" style={{ border: '0.5px solid var(--border)' }}>
              <img src={url} alt="" className="w-full h-full object-cover" loading="lazy" />
              <button onClick={() => removeImage(i)} className="absolute top-0.5 right-0.5 w-5 h-5 rounded-full bg-danger text-white flex items-center justify-center text-xs">×</button>
            </div>
          ))}
          <label className="w-20 h-20 rounded-lg flex items-center justify-center cursor-pointer transition-colors hover:bg-primary/5" style={{ border: '1px dashed var(--border)' }}>
            {uploading ? <span className="spinner" /> : <Upload className="w-5 h-5" style={{ color: 'var(--muted)' }} />}
            <input type="file" multiple accept="image/*" className="hidden" onChange={e => e.target.files && uploadImages(e.target.files)} />
          </label>
        </div>
      </div>

      {/* Stock toggle */}
      <div className="flex items-center gap-3">
        <button onClick={() => u('in_stock', !form.in_stock)} className="w-10 h-6 rounded-full relative transition-colors" style={{ backgroundColor: form.in_stock ? 'var(--success)' : 'var(--border)' }}>
          <div className="w-4 h-4 rounded-full bg-white absolute top-1 transition-all" style={{ left: form.in_stock ? '22px' : '2px' }} />
        </button>
        <span className="text-sm font-medium">{form.in_stock ? 'In Stock' : 'Out of Stock'}</span>
      </div>

      <div className="flex gap-3 pt-2">
        <Button onClick={onClose} variant="secondary" className="btn-pill">Cancel</Button>
        <Button onClick={handleSave} isLoading={saving} leftIcon={<Save className="w-4 h-4" />} className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>{product ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  )
}

// ============================================================
// BANNERS MANAGER
// ============================================================
function BannersManager() {
  const [banners, setBanners] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [showForm, setShowForm] = useState(false)
  const [editing, setEditing] = useState<any | null>(null)

  const load = useCallback(async () => {
    const { data } = await supabase.from('banners').select('*').order('created_at', { ascending: false })
    setBanners(data || [])
    setLoading(false)
  }, [])

  useEffect(() => { load() }, [load])

  const handleDelete = async (id: string) => {
    await supabase.from('banners').delete().eq('id', id)
    setBanners(b => b.filter(x => x.id !== id))
    toast.success('Banner deleted')
  }

  return (
    <div className="mt-6 space-y-4">
      <div className="flex items-center justify-between">
        <h2 className="text-xl font-semibold">{banners.length} Banners</h2>
        <Button onClick={() => { setEditing(null); setShowForm(true) }} leftIcon={<Plus className="w-4 h-4" />} className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>Add Banner</Button>
      </div>

      {showForm && <BannerForm banner={editing} onClose={() => setShowForm(false)} onSaved={() => { setShowForm(false); load() }} />}

      {loading ? <div className="space-y-3">{[1,2].map(i => <div key={i} className="h-20 skeleton rounded-xl" />)}</div> : banners.length === 0 ? <p style={{ color: 'var(--muted)' }}>No banners yet.</p> : (
        <div className="space-y-3">{banners.map(b => (
          <div key={b.id} className="flex items-center gap-4 p-4 rounded-xl" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
            {b.image_url && <img src={b.image_url} alt="" className="w-24 h-14 rounded-lg object-cover" loading="lazy" />}
            <div className="flex-1"><p className="font-medium">{b.title}</p><p className="text-xs" style={{ color: 'var(--muted)' }}>{b.start_date} → {b.end_date}</p></div>
            <div className="flex items-center gap-1">
              <button onClick={() => { setEditing(b); setShowForm(true) }} className="p-2 rounded-full hover:bg-primary/10"><Pencil className="w-4 h-4" style={{ color: 'var(--primary)' }} /></button>
              <button onClick={() => handleDelete(b.id)} className="p-2 rounded-full hover:bg-danger/10"><Trash2 className="w-4 h-4" style={{ color: 'var(--danger)' }} /></button>
            </div>
          </div>
        ))}</div>
      )}
    </div>
  )
}

function BannerForm({ banner, onClose, onSaved }: { banner: any | null; onClose: () => void; onSaved: () => void }) {
  const [form, setForm] = useState({ title: banner?.title || '', image_url: banner?.image_url || '', video_url: banner?.video_url || '', link: banner?.link || '', start_date: banner?.start_date || '', end_date: banner?.end_date || '' })
  const [saving, setSaving] = useState(false)
  const u = (k: string, v: string) => setForm(f => ({ ...f, [k]: v }))

  const handleSave = async () => {
    if (!form.title) { toast.error('Title is required'); return }
    setSaving(true)
    const payload = { ...form }
    if (banner) {
      await supabase.from('banners').update(payload).eq('id', banner.id)
      toast.success('Banner updated')
    } else {
      await supabase.from('banners').insert(payload)
      toast.success('Banner created')
    }
    setSaving(false)
    onSaved()
  }

  return (
    <div className="rounded-2xl p-6 space-y-4" style={{ backgroundColor: 'var(--card-bg)', border: '1px solid rgba(37,99,196,0.3)' }}>
      <div className="flex items-center justify-between"><h3 className="font-heading text-lg font-semibold">{banner ? 'Edit Banner' : 'New Banner'}</h3><button onClick={onClose}><X className="w-5 h-5" /></button></div>
      <div className="grid sm:grid-cols-2 gap-4">
        <Input label="Title" value={form.title} onChange={e => u('title', e.target.value)} required />
        <Input label="Link (optional)" value={form.link} onChange={e => u('link', e.target.value)} placeholder="https://..." />
        <Input label="Image URL" value={form.image_url} onChange={e => u('image_url', e.target.value)} />
        <Input label="Video URL" value={form.video_url} onChange={e => u('video_url', e.target.value)} />
        <Input label="Start Date" type="date" value={form.start_date} onChange={e => u('start_date', e.target.value)} />
        <Input label="End Date" type="date" value={form.end_date} onChange={e => u('end_date', e.target.value)} />
      </div>
      <div className="flex gap-3 pt-2">
        <Button onClick={onClose} variant="secondary" className="btn-pill">Cancel</Button>
        <Button onClick={handleSave} isLoading={saving} className="btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>{banner ? 'Update' : 'Create'}</Button>
      </div>
    </div>
  )
}
