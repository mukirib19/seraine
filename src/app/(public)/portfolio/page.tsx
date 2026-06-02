'use client'
import Image from 'next/image'
import { useState } from 'react'
import { ExternalLink } from 'lucide-react'

// Static portfolio with real working Unsplash images
const PORTFOLIO = [
  { id: 1, title: 'Large Format Banner', category: 'Large Format', src: 'https://images.unsplash.com/photo-1588412079929-790b9f593d8e?w=600&q=80', span: 'row-span-2' },
  { id: 2, title: 'Corporate Notebooks', category: 'Notebooks', src: 'https://images.unsplash.com/photo-1531346878377-a5be20888e57?w=600&q=80', span: '' },
  { id: 3, title: 'Event Decor Setup', category: 'Event Decor', src: 'https://images.unsplash.com/photo-1464366400600-7168b8af9bc3?w=600&q=80', span: '' },
  { id: 4, title: 'Custom T-Shirts', category: 'T-Shirt Printing', src: 'https://images.unsplash.com/photo-1503341733017-1901578f9f1e?w=600&q=80', span: 'row-span-2' },
  { id: 5, title: 'Branded Mugs', category: 'Mug Branding', src: 'https://images.unsplash.com/photo-1509042239860-f550ce710b93?w=600&q=80', span: '' },
  { id: 6, title: 'Wedding Invitations', category: 'Event Planning', src: 'https://images.unsplash.com/photo-1519225421980-715cb0215aed?w=600&q=80', span: '' },
  { id: 7, title: 'Flower Bouquets', category: 'Bouquets', src: 'https://images.unsplash.com/photo-1490750967868-88df5691cc84?w=600&q=80', span: '' },
  { id: 8, title: 'Vinyl Signage', category: 'Large Format', src: 'https://images.unsplash.com/photo-1611532736597-de2d4265fba3?w=600&q=80', span: '' },
  { id: 9, title: 'Brand Identity', category: 'Graphic Design', src: 'https://images.unsplash.com/photo-1572044162444-ad60f128bdea?w=600&q=80', span: 'row-span-2' },
]

const CATS = ['All', 'Large Format', 'Notebooks', 'Event Planning', 'T-Shirt Printing', 'Mug Branding', 'Bouquets', 'Event Decor', 'Graphic Design']

export default function PortfolioPage() {
  const [active, setActive] = useState('All')
  const [lightbox, setLightbox] = useState<typeof PORTFOLIO[0] | null>(null)

  const filtered = active === 'All' ? PORTFOLIO : PORTFOLIO.filter(p => p.category === active)

  return (
    <div className="container-wide section-padding">
      <div className="text-center mb-12">
        <h1 className="mb-3" style={{ color: 'var(--text)' }}>Our Portfolio</h1>
        <p className="max-w-xl mx-auto" style={{ color: 'var(--muted)' }}>A showcase of our finest work — from large format printing to bespoke event decor.</p>
      </div>

      {/* Filter tabs */}
      <div className="flex flex-wrap gap-2 justify-center mb-10">
        {CATS.map(cat => (
          <button key={cat} onClick={() => setActive(cat)}
            className="px-4 py-2 rounded-pill text-sm font-medium transition-all"
            style={{
              backgroundColor: active === cat ? 'var(--primary)' : 'transparent',
              color: active === cat ? '#fff' : 'var(--muted)',
              border: `0.5px solid ${active === cat ? 'var(--primary)' : 'var(--border)'}`,
            }}>
            {cat}
          </button>
        ))}
      </div>

      {/* Masonry grid */}
      <div className="columns-1 sm:columns-2 lg:columns-3 gap-4 space-y-4">
        {filtered.map(item => (
          <div key={item.id} onClick={() => setLightbox(item)}
            className="break-inside-avoid group relative overflow-hidden rounded-xl cursor-pointer"
            style={{ border: '0.5px solid var(--border)' }}>
            <Image
              src={item.src} alt={item.title}
              width={600} height={400}
              className="w-full h-auto object-cover transition-transform duration-500 group-hover:scale-105"
            />
            <div className="absolute inset-0 flex flex-col justify-end p-4 opacity-0 group-hover:opacity-100 transition-opacity duration-300"
              style={{ background: 'linear-gradient(to top, rgba(28,28,28,0.85) 0%, transparent 60%)' }}>
              <span className="text-xs font-medium uppercase tracking-wide mb-1" style={{ color: 'rgba(255,255,255,0.6)' }}>{item.category}</span>
              <p className="text-white font-heading font-semibold text-base">{item.title}</p>
            </div>
          </div>
        ))}
      </div>

      {filtered.length === 0 && (
        <div className="text-center py-20" style={{ color: 'var(--muted)' }}>No portfolio items in this category yet.</div>
      )}

      {/* CTA */}
      <div className="text-center mt-14">
        <p className="mb-4" style={{ color: 'var(--muted)' }}>Like what you see? Let&apos;s work together.</p>
        <a href="/contact" className="inline-flex items-center gap-2 h-12 px-8 rounded-pill font-medium transition-all hover:opacity-90"
          style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>
          <ExternalLink className="w-4 h-4" /> Get a Quote
        </a>
      </div>

      {/* Lightbox */}
      {lightbox && (
        <div className="fixed inset-0 z-50 flex items-center justify-center p-4"
          style={{ backgroundColor: 'rgba(0,0,0,0.85)' }}
          onClick={() => setLightbox(null)}>
          <div className="relative max-w-3xl w-full" onClick={e => e.stopPropagation()}>
            <button onClick={() => setLightbox(null)}
              className="absolute -top-10 right-0 text-white/70 hover:text-white text-sm font-medium">
              ✕ Close
            </button>
            <Image src={lightbox.src} alt={lightbox.title} width={900} height={600} className="w-full h-auto rounded-xl" />
            <div className="mt-3 text-center">
              <p className="text-white font-heading font-semibold">{lightbox.title}</p>
              <p className="text-white/50 text-sm">{lightbox.category}</p>
            </div>
          </div>
        </div>
      )}
    </div>
  )
}
