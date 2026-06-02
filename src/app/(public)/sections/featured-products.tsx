'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'

export function FeaturedProducts() {
  const [products, setProducts] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    supabase.from('products').select('*').eq('in_stock', true)
      .order('created_at', { ascending: false }).limit(6)
      .then(({ data }) => { setProducts(data || []); setLoading(false) })
  }, [])

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="mb-3" style={{ color: 'var(--text)' }}>Featured Products</h2>
          <p style={{ color: 'var(--muted)' }}>Quality printing and branding solutions</p>
        </div>

        {loading ? (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {[1,2,3,4,5,6].map(i => <div key={i} className="h-72 skeleton rounded-xl" />)}
          </div>
        ) : products.length === 0 ? (
          <div className="text-center py-10" style={{ color: 'var(--muted)' }}>
            <p>No products yet. Add some from the admin panel.</p>
          </div>
        ) : (
          <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
            {products.map(p => (
              <Link href={`/catalog/${p.id}`} key={p.id} className="card-hover group overflow-hidden">
                <div className="h-48 overflow-hidden relative" style={{ backgroundColor: 'var(--light)' }}>
                  {p.images?.[0] ? (
                    <Image
                      src={p.images[0]} alt={p.name}
                      fill sizes="(max-width:640px) 100vw,(max-width:1024px) 50vw,33vw"
                      className="object-cover transition-transform duration-300 group-hover:scale-105"
                    />
                  ) : (
                    <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>No Image</div>
                  )}
                </div>
                <div className="p-5">
                  <div className="flex items-center justify-between mb-2">
                    <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--primary)' }}>{p.category || 'General'}</span>
                    <span className="text-xs px-2 py-0.5 rounded-pill font-medium"
                      style={{ backgroundColor: p.in_stock ? 'rgba(91,189,47,0.12)' : 'rgba(232,35,26,0.12)', color: p.in_stock ? '#5BBD2F' : '#E8231A' }}>
                      {p.in_stock ? 'In Stock' : 'Out of Stock'}
                    </span>
                  </div>
                  <h3 className="font-heading text-lg font-semibold mb-1 truncate" style={{ color: 'var(--text)' }}>{p.name}</h3>
                  <p className="text-sm mb-3 line-clamp-2" style={{ color: 'var(--muted)' }}>{p.description || ''}</p>
                  <p className="font-heading text-xl font-bold" style={{ color: 'var(--cta)' }}>KES {p.price?.toLocaleString()}</p>
                </div>
              </Link>
            ))}
          </div>
        )}

        {products.length > 0 && (
          <div className="text-center mt-10">
            <Link href="/catalog" className="inline-flex items-center gap-2 h-12 px-8 rounded-pill font-medium transition-all"
              style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
              View All Products <ArrowRight className="w-4 h-4" />
            </Link>
          </div>
        )}
      </div>
    </section>
  )
}
