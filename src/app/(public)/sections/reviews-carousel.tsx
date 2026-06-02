'use client'
import { useState } from 'react'
import { Star, ChevronLeft, ChevronRight, Quote } from 'lucide-react'
import { cn } from '@/lib/utils'

// Static testimonials — no reviews table needed
const REVIEWS = [
  { id: '1', name: 'James Mwangi', rating: 5, title: 'Exceptional Quality!', body: 'The t-shirt printing quality is outstanding. Colors are vibrant and the fabric feels premium. Will definitely order again for our team.' },
  { id: '2', name: 'Amina Hassan', rating: 5, title: 'Fast & Professional', body: 'Ordered custom mugs for our office event. They delivered within 2 days and the branding was perfect. Very impressed!' },
  { id: '3', name: 'David Kamau', rating: 5, title: 'Best Printing in Nairobi', body: 'Our event banners looked absolutely stunning. The large format printing detail was crisp and exact to our design specifications.' },
  { id: '4', name: 'Grace Wanjiku', rating: 5, title: 'Highly Recommend', body: 'Used them for our wedding invitations and event decor. Everything was perfect and delivered on time. Thank you Seraine Creations!' },
  { id: '5', name: 'Peter Ochieng', rating: 5, title: 'Great Value for Money', body: 'The notebook printing was top-notch. Custom branding with our logo looked professional. Competitive pricing too.' },
]

export function ReviewsCarousel() {
  const [current, setCurrent] = useState(0)

  const prev = () => setCurrent(c => (c === 0 ? REVIEWS.length - 1 : c - 1))
  const next = () => setCurrent(c => (c === REVIEWS.length - 1 ? 0 : c + 1))

  return (
    <section className="section-padding" style={{ backgroundColor: 'var(--bg)' }}>
      <div className="container-narrow">
        <div className="text-center mb-12">
          <h2 className="mb-3" style={{ color: 'var(--text)' }}>What Our Clients Say</h2>
          <p style={{ color: 'var(--muted)' }}>Trusted by businesses and individuals across Nairobi.</p>
        </div>

        <div className="relative max-w-xl mx-auto">
          <Quote className="w-10 h-10 mx-auto mb-6" style={{ color: 'rgba(37,99,196,0.2)' }} />

          <div className="text-center min-h-[140px]">
            <div className="flex items-center justify-center gap-1 mb-4">
              {Array.from({ length: 5 }).map((_, i) => (
                <Star key={i} className={cn('w-5 h-5', i < REVIEWS[current].rating ? 'fill-current' : '')} style={{ color: i < REVIEWS[current].rating ? '#F5A800' : 'var(--border)' }} />
              ))}
            </div>
            <h4 className="font-heading text-lg font-semibold mb-2" style={{ color: 'var(--text)' }}>{REVIEWS[current].title}</h4>
            <p className="leading-relaxed mb-4" style={{ color: 'var(--muted)' }}>{REVIEWS[current].body}</p>
            <p className="text-sm font-medium" style={{ color: 'var(--text)' }}>— {REVIEWS[current].name}</p>
          </div>

          <div className="flex items-center justify-center gap-4 mt-8">
            <button onClick={prev} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ border: '0.5px solid var(--border)', color: 'var(--muted)' }} aria-label="Previous">
              <ChevronLeft className="w-5 h-5" />
            </button>
            <div className="flex gap-2">
              {REVIEWS.map((_, i) => (
                <button key={i} onClick={() => setCurrent(i)} className="h-2 rounded-full transition-all" style={{ width: i === current ? '24px' : '8px', backgroundColor: i === current ? 'var(--primary)' : 'var(--border)' }} aria-label={`Review ${i + 1}`} />
              ))}
            </div>
            <button onClick={next} className="w-10 h-10 rounded-full flex items-center justify-center transition-colors" style={{ border: '0.5px solid var(--border)', color: 'var(--muted)' }} aria-label="Next">
              <ChevronRight className="w-5 h-5" />
            </button>
          </div>
        </div>
      </div>
    </section>
  )
}
