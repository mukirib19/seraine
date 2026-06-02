'use client'

import { useEffect, useState } from 'react'
import Link from 'next/link'
import Image from 'next/image'
import { supabase } from '@/lib/supabase'
import { ArrowRight } from 'lucide-react'

interface PortfolioItem {
  id: string
  title: string
  public_url: string
  client_name: string | null
}

export function PortfolioTeaser() {
  const [items, setItems] = useState<PortfolioItem[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function fetchPortfolio() {
      const { data } = await supabase
        .from('portfolio_items')
        .select('id, title, public_url, client_name')
        .eq('is_published', true)
        .order('display_order')
        .limit(6)

      if (data) setItems(data)
      setLoading(false)
    }
    fetchPortfolio()
  }, [])

  return (
    <section className="py-20 bg-cream">
      <div className="container-wide">
        <div className="flex items-end justify-between mb-10">
          <div>
            <h2 className="text-charcoal mb-2 italic">Our work speaks.</h2>
            <p className="text-muted">A glimpse of what we create for our clients.</p>
          </div>
          <Link
            href="/portfolio"
            className="hidden sm:inline-flex items-center gap-2 text-sm font-medium text-burgundy link-underline"
          >
            View full portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>

        {loading ? (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4">
            {Array.from({ length: 6 }).map((_, i) => (
              <div key={i} className="flex-shrink-0 w-72 aspect-[3/4] skeleton rounded-lg" />
            ))}
          </div>
        ) : items.length > 0 ? (
          <div className="flex gap-4 overflow-x-auto pb-4 -mx-4 px-4 snap-x snap-mandatory scrollbar-none">
            {items.map((item) => (
              <div
                key={item.id}
                className="flex-shrink-0 w-72 group relative aspect-[3/4] rounded-lg overflow-hidden bg-border-subtle"
              >
                <Image
                  src={item.public_url}
                  alt={item.title}
                  fill
                  className="object-cover transition-transform duration-500 group-hover:scale-105"
                  sizes="288px"
                />
                <div className="absolute inset-0 bg-gradient-to-t from-charcoal/60 via-transparent to-transparent opacity-0 group-hover:opacity-100 transition-opacity duration-300" />
                <div className="absolute bottom-0 left-0 right-0 p-4 translate-y-full group-hover:translate-y-0 transition-transform duration-300">
                  <p className="text-white font-heading font-semibold">{item.title}</p>
                  {item.client_name && (
                    <p className="text-white/70 text-sm mt-0.5">{item.client_name}</p>
                  )}
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="text-center py-16 text-muted">
            <p>Portfolio coming soon.</p>
          </div>
        )}

        <div className="mt-6 sm:hidden text-center">
          <Link
            href="/portfolio"
            className="inline-flex items-center gap-2 text-sm font-medium text-burgundy"
          >
            View full portfolio
            <ArrowRight className="w-4 h-4" />
          </Link>
        </div>
      </div>
    </section>
  )
}
