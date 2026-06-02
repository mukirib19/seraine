'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { ProductCard } from '@/components/cards/product-card'
import { Heart } from 'lucide-react'
import { toast } from 'sonner'

export default function FavouritesPage() {
  const { user } = useAuthStore()
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function loadFavourites() {
      if (!user) return
      const { data } = await supabase.from('favorites').select('product_id, products:product_id(id,name,slug,base_price,currency,is_available,product_categories(name),product_images(public_url,is_thumbnail))').eq('user_id', user.id)
      setProducts((data?.map((f: any) => f.products).filter(Boolean) as any[]) || [])
      setLoading(false)
    }
    loadFavourites()
  }, [user])

  const handleRemove = async (productId: string) => {
    if (!user) return
    await supabase.from('favorites').delete().eq('user_id', user.id).eq('product_id', productId)
    setProducts(p => p.filter(x => x.id !== productId))
    toast.success('Removed from favourites')
  }

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">My Favourites</h1>
      {loading ? <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-64 skeleton rounded-lg" />)}</div> : products.length === 0 ? <div className="text-center py-16"><Heart className="w-12 h-12 mx-auto mb-3 text-border" /><p className="text-muted">No favourites yet. Browse the catalog and save items you love.</p></div> : (
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">{products.map(p => { const thumb = p.product_images?.find((i: any) => i.is_thumbnail) || p.product_images?.[0]; return <ProductCard key={p.id} id={p.id} name={p.name} slug={p.slug} category={p.product_categories?.name || ''} price={p.base_price} currency={p.currency} imageUrl={thumb?.public_url || null} isAvailable={p.is_available} isFavourited onToggleFavourite={handleRemove} /> })}</div>
      )}
    </div>
  )
}
