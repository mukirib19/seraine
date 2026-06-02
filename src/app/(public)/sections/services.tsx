import Link from 'next/link'
import { Printer, Maximize2, Shirt, Coffee, BookOpen, Gift, LayoutGrid, Palette, Droplets } from 'lucide-react'

const SERVICES = [
  { icon: Maximize2, name: 'Large Format Printing', desc: 'Banners, posters, rollups, vinyl signage.', href: '/catalog?category=Large Format' },
  { icon: BookOpen, name: 'Notebooks', desc: 'Custom branded notebooks and journals.', href: '/catalog?category=Notebooks' },
  { icon: LayoutGrid, name: 'Event Planning', desc: 'Invitations, programs, event stationery.', href: '/catalog?category=Event Planning' },
  { icon: Shirt, name: 'T-Shirt Printing', desc: 'DTF, heat press, screen printing.', href: '/catalog?category=T-Shirt Printing' },
  { icon: Coffee, name: 'Mug Branding', desc: 'Sublimation mugs for gifts and promos.', href: '/catalog?category=Mug Branding' },
  { icon: Gift, name: 'Bouquets & Gifts', desc: 'Curated gifts and bouquet arrangements.', href: '/catalog?category=Bouquets' },
  { icon: LayoutGrid, name: 'Event Decor', desc: 'Backdrops, setups, branded decor.', href: '/catalog?category=Event Decor' },
  { icon: Palette, name: 'Graphic Design', desc: 'Logos, branding, print-ready artwork.', href: '/contact' },
  { icon: Droplets, name: 'Bottle Branding', desc: 'Custom branded water bottles.', href: '/catalog?category=Bottle Branding' },
]

export function ServicesSection() {
  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--light)' }}>
      <div className="container-wide">
        <div className="text-center mb-12">
          <h2 className="mb-3" style={{ color: 'var(--dark)' }}>What We Do</h2>
          <p className="max-w-2xl mx-auto" style={{ color: 'var(--muted)' }}>
            From concept to creation — DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR
          </p>
        </div>
        <div className="grid sm:grid-cols-2 lg:grid-cols-3 gap-6">
          {SERVICES.map((s, i) => (
            <Link key={i} href={s.href} className="card-hover group p-6">
              <div className="w-12 h-12 rounded-xl flex items-center justify-center mb-4 transition-colors" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}>
                <s.icon className="w-6 h-6" style={{ color: 'var(--primary)' }} />
              </div>
              <h3 className="font-heading text-lg font-semibold mb-2" style={{ color: 'var(--dark)' }}>{s.name}</h3>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{s.desc}</p>
            </Link>
          ))}
        </div>
      </div>
    </section>
  )
}
