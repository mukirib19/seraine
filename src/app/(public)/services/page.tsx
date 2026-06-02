'use client'
import Link from 'next/link'
import { Printer, ImageIcon, Shirt, Coffee, BookOpen, Gift, PartyPopper, Palette, LayoutGrid } from 'lucide-react'

const SERVICES = [
  { icon: Printer, name: 'Large Format Printing', desc: 'Banners, posters, rollups, vinyl, and signage for maximum impact.', href: '/catalog?category=large-format' },
  { icon: BookOpen, name: 'Notebooks', desc: 'Custom branded notebooks, journals, and diaries for corporate and personal use.', href: '/catalog?category=notebooks' },
  { icon: PartyPopper, name: 'Event Planning', desc: 'Complete event stationery — invitations, programs, name tags, and decor.', href: '/catalog?category=event-planning' },
  { icon: Shirt, name: 'T-Shirt Printing', desc: 'Screen printing, DTF, heat press for custom apparel and uniforms.', href: '/catalog?category=t-shirt-printing' },
  { icon: Coffee, name: 'Mug Branding', desc: 'Sublimation printed mugs for gifts, promotions, and corporate events.', href: '/catalog?category=mug-branding' },
  { icon: Gift, name: 'Bouquets & Gifts', desc: 'Curated gift sets and bouquet arrangements for special occasions.', href: '/catalog?category=bouquets' },
  { icon: LayoutGrid, name: 'Event Decor', desc: 'Backdrops, table settings, and branded decor for events of all sizes.', href: '/catalog?category=event-decor' },
  { icon: Palette, name: 'Graphic Design', desc: 'Logo design, branding packages, and print-ready artwork.', href: '/contact' },
  { icon: ImageIcon, name: 'Bottle Branding', desc: 'Custom branded water bottles and drinkware for promotions.', href: '/catalog?category=bottle-branding' },
]

export default function ServicesPage() {
  return (
    <div className="container-wide section-padding">
      <div className="text-center mb-12 fade-in-up">
        <h1 className="mb-4">Our Services</h1>
        <p className="text-lg max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
        {SERVICES.map((s, i) => (
          <Link key={i} href={s.href} className="card-hover p-6 group">
            <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}>
              <s.icon className="w-6 h-6 transition-colors" style={{ color: 'var(--primary)' }} />
            </div>
            <h3 className="font-heading text-lg font-semibold mb-2">{s.name}</h3>
            <p className="text-sm leading-relaxed" style={{ color: 'var(--muted)' }}>{s.desc}</p>
          </Link>
        ))}
      </div>
    </div>
  )
}
