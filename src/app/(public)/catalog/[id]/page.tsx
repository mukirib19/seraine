'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/navigation'
import { supabase } from '@/lib/supabase'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { Button } from '@/components/ui/button'
import { toast } from 'sonner'
import { ShoppingCart, Heart, ArrowLeft, Package } from 'lucide-react'

export default function ProductDetailPage({ params }: { params: { id: string } }) {
  const router = useRouter()
  const [product, setProduct] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [quantity, setQuantity] = useState(1)
  const [addingToCart, setAddingToCart] = useState(false)
  const [activeImg, setActiveImg] = useState(0)
  const { addItem } = useCartStore()
  const { user } = useAuthStore()

  useEffect(() => {
    supabase.from('products').select('*').eq('id', params.id).single()
      .then(({ data, error }) => {
        if (error || !data) { router.push('/catalog'); return }
        setProduct(data)
        setLoading(false)
      })
  }, [params.id, router])

  const handleAddToCart = async () => {
    if (!product) return
    setAddingToCart(true)
    addItem({
      product_id: product.id,
      product_name: product.name,
      product_sku: product.sku || null,
      category_name: product.category || null,
      quantity,
      unit_price: product.price,
      variant_selections: {},
      image_url: product.images?.[0] || null,
    })
    // Sync to Supabase for logged-in users
    if (user) {
      const { data: existing } = await supabase.from('cart_items').select('id,quantity').eq('user_id', user.id).eq('product_id', product.id).single()
      if (existing) {
        await supabase.from('cart_items').update({ quantity: existing.quantity + quantity }).eq('id', existing.id)
      } else {
        await supabase.from('cart_items').insert({ user_id: user.id, product_id: product.id, quantity })
      }
    }
    setAddingToCart(false)
    toast.success('Added to cart!')
  }

  if (loading) {
    return (
      <div className="container-wide py-10">
        <div className="grid lg:grid-cols-2 gap-12">
          <div className="aspect-square skeleton rounded-2xl" />
          <div className="space-y-4">
            <div className="h-8 w-3/4 skeleton rounded" />
            <div className="h-6 w-1/3 skeleton rounded" />
            <div className="h-24 skeleton rounded" />
          </div>
        </div>
      </div>
    )
  }

  if (!product) return null
  const images: string[] = product.images || []

  return (
    <div className="container-wide py-10">
      <button onClick={() => router.back()} className="flex items-center gap-2 text-sm mb-8 transition-colors hover:opacity-80" style={{ color: 'var(--muted)' }}>
        <ArrowLeft className="w-4 h-4" /> Back to Catalog
      </button>

      <div className="grid lg:grid-cols-2 gap-12">
        {/* Images */}
        <div>
          <div className="aspect-square rounded-2xl overflow-hidden mb-3" style={{ backgroundColor: 'var(--light)', border: '0.5px solid var(--border)' }}>
            {images[activeImg] ? (
              <Image src={images[activeImg]} alt={product.name} width={600} height={600} className="w-full h-full object-cover" />
            ) : (
              <div className="w-full h-full flex items-center justify-center"><Package className="w-16 h-16" style={{ color: 'var(--muted)' }} /></div>
            )}
          </div>
          {images.length > 1 && (
            <div className="flex gap-2">
              {images.map((img, i) => (
                <button key={i} onClick={() => setActiveImg(i)} className="w-16 h-16 rounded-xl overflow-hidden flex-shrink-0 transition-all" style={{ border: i === activeImg ? '2px solid var(--primary)' : '0.5px solid var(--border)' }}>
                  <Image src={img} alt="" width={64} height={64} className="w-full h-full object-cover" />
                </button>
              ))}
            </div>
          )}
        </div>

        {/* Details */}
        <div>
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--primary)' }}>{product.category || 'General'}</span>
            {product.in_stock
              ? <span className="badge" style={{ backgroundColor: 'rgba(91,189,47,0.12)', color: '#5BBD2F' }}>In Stock</span>
              : <span className="badge" style={{ backgroundColor: 'rgba(232,35,26,0.12)', color: '#E8231A' }}>Out of Stock</span>}
          </div>

          <h1 className="text-3xl md:text-4xl mb-4" style={{ color: 'var(--text)' }}>{product.name}</h1>
          <p className="text-3xl font-bold mb-6" style={{ color: 'var(--cta)' }}>KES {product.price?.toLocaleString()}</p>

          {product.description && (
            <p className="mb-6 leading-relaxed" style={{ color: 'var(--muted)' }}>{product.description}</p>
          )}

          {product.sku && (
            <p className="text-xs mb-6 font-mono" style={{ color: 'var(--muted)' }}>SKU: {product.sku}</p>
          )}

          {/* Quantity */}
          <div className="flex items-center gap-4 mb-6">
            <span className="text-sm font-medium" style={{ color: 'var(--text)' }}>Quantity:</span>
            <div className="flex items-center gap-2">
              <button onClick={() => setQuantity(q => Math.max(1, q - 1))} className="w-9 h-9 rounded-pill flex items-center justify-center text-lg transition-colors" style={{ border: '0.5px solid var(--border)', color: 'var(--text)' }}>−</button>
              <span className="w-10 text-center font-medium" style={{ color: 'var(--text)' }}>{quantity}</span>
              <button onClick={() => setQuantity(q => q + 1)} className="w-9 h-9 rounded-pill flex items-center justify-center text-lg transition-colors" style={{ border: '0.5px solid var(--border)', color: 'var(--text)' }}>+</button>
            </div>
          </div>

          {/* Actions */}
          <div className="flex gap-3">
            <Button onClick={handleAddToCart} isLoading={addingToCart} disabled={!product.in_stock} leftIcon={!addingToCart ? <ShoppingCart className="w-4 h-4" /> : undefined}
              className="flex-1 btn-pill" style={{ backgroundColor: 'var(--cta)', color: '#fff', opacity: product.in_stock ? 1 : 0.5 }}>
              {product.in_stock ? 'Add to Cart' : 'Out of Stock'}
            </Button>
            <Link href="/contact" className="flex items-center justify-center h-11 px-6 rounded-pill text-sm font-medium transition-colors" style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              Get a Quote
            </Link>
          </div>

          {/* Contact note */}
          <p className="mt-4 text-xs" style={{ color: 'var(--muted)' }}>
            Need bulk pricing or custom specs? <Link href="/contact" className="underline" style={{ color: 'var(--primary)' }}>Contact us</Link>
          </p>
        </div>
      </div>
    </div>
  )
}
