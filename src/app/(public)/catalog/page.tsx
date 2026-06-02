'use client'
import { useState, useEffect, useCallback } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { Search } from 'lucide-react'
import { cn } from '@/lib/utils'

const CATEGORIES = ['All', 'Large Format', 'Notebooks', 'Event Planning', 'T-Shirt Printing', 'Mug Branding', 'Bouquets', 'Event Decor']

interface Product {
  id: string
  name: string
  description: string | null
  price: number
  category: string | null
  images: string[] | null
  in_stock: boolean
}

export default function CatalogPage() {
  const [products, setProducts] = useState<Product[]>([])
  const [activeCategory, setActiveCategory] = useState('All')
  const [search, setSearch] = useState('')
  const [loading, setLoading] = useState(true)

  const fetchProducts = useCallback(async () => {
    setLoading(true)
    let q = supabase.from('products').select('id,name,description,price,category,images,in_stock').eq('in_stock', true)
    if (activeCategory !== 'All') q = q.eq('category', activeCategory)
    if (search) q = q.ilike('name', `%${search}%`)
    const { data } = await q.order('created_at', { ascending: false })
    setProducts((data as Product[]) || [])
    setLoading(false)
  }, [activeCategory, search])

  useEffect(() => { fetchProducts() }, [fetchProducts])

  return (
    <div className="container-wide py-10">
      <h1 className="mb-2" style={{ color: 'var(--text)' }}>Our Catalog</h1>
      <p className="mb-8" style={{ color: 'var(--muted)' }}>Browse our full range of printing and creative services.</p>

      <div className="flex flex-col lg:flex-row gap-8">
        {/* Sidebar */}
        <aside className="lg:w-56 flex-shrink-0">
          {/* Search */}
          <div className="relative mb-4">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4" style={{ color: 'var(--muted)' }} />
            <input
              value={search} onChange={e => setSearch(e.target.value)}
              placeholder="Search products..."
              className="w-full h-10 pl-9 pr-3 rounded-xl text-sm focus:outline-none"
              style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text)', border: '0.5px solid var(--border)' }}
            />
          </div>
          {/* Categories */}
          <div className="space-y-1">
            {CATEGORIES.map(cat => (
              <button key={cat} onClick={() => setActiveCategory(cat)}
                className={cn('block w-full text-left px-3 py-2 rounded-xl text-sm font-medium transition-colors')}
                style={{
                  backgroundColor: activeCategory === cat ? 'rgba(37,99,196,0.1)' : 'transparent',
                  color: activeCategory === cat ? 'var(--primary)' : 'var(--muted)',
                }}>
                {cat}
              </button>
            ))}
          </div>
        </aside>

        {/* Grid */}
        <div className="flex-1">
          {loading ? (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {Array.from({ length: 6 }).map((_, i) => (
                <div key={i} className="space-y-3">
                  <div className="aspect-[4/3] skeleton rounded-xl" />
                  <div className="h-4 w-20 skeleton rounded" />
                  <div className="h-5 w-3/4 skeleton rounded" />
                </div>
              ))}
            </div>
          ) : products.length === 0 ? (
            <div className="text-center py-20">
              <p className="text-lg font-medium mb-2" style={{ color: 'var(--text)' }}>No products found</p>
              <p className="text-sm mb-4" style={{ color: 'var(--muted)' }}>Try a different category or search term.</p>
              <button onClick={() => { setActiveCategory('All'); setSearch('') }}
                className="px-6 py-2 rounded-pill text-sm font-medium transition-colors"
                style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
                Reset Filters
              </button>
            </div>
          ) : (
            <div className="grid sm:grid-cols-2 xl:grid-cols-3 gap-6">
              {products.map(p => (
                <Link key={p.id} href={`/catalog/${p.id}`} className="card-hover group overflow-hidden">
                  <div className="aspect-[4/3] overflow-hidden" style={{ backgroundColor: 'var(--light)' }}>
                    {p.images?.[0] ? (
                      <Image
                        src={p.images[0]} alt={p.name}
                        width={400} height={300}
                        className="w-full h-full object-cover transition-transform duration-300 group-hover:scale-105"
                      />
                    ) : (
                      <div className="w-full h-full flex items-center justify-center text-sm" style={{ color: 'var(--muted)' }}>No Image</div>
                    )}
                  </div>
                  <div className="p-4">
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-xs font-medium uppercase tracking-wide" style={{ color: 'var(--primary)' }}>{p.category || 'General'}</span>
                      <span className="badge text-xs" style={{ backgroundColor: p.in_stock ? 'rgba(91,189,47,0.12)' : 'rgba(232,35,26,0.12)', color: p.in_stock ? '#5BBD2F' : '#E8231A' }}>
                        {p.in_stock ? 'In Stock' : 'Out of Stock'}
                      </span>
                    </div>
                    <h3 className="font-heading text-base font-semibold mb-1 truncate" style={{ color: 'var(--text)' }}>{p.name}</h3>
                    <p className="text-sm truncate-2 mb-3" style={{ color: 'var(--muted)' }}>{p.description || ''}</p>
                    <p className="font-heading text-lg font-bold" style={{ color: 'var(--cta)' }}>KES {p.price?.toLocaleString()}</p>
                  </div>
                </Link>
              ))}
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
