'use client'
import { Clock, MapPin, Phone } from 'lucide-react'

// Static availability banner — no DB queries needed
export function AvailabilityBanner() {
  return (
    <section className="py-5" style={{ backgroundColor: 'rgba(37,99,196,0.05)' }}>
      <div className="container-wide">
        <div className="flex flex-wrap items-center justify-center gap-6 text-sm">
          <div className="flex items-center gap-2">
            <div className="w-2.5 h-2.5 rounded-full animate-pulse" style={{ backgroundColor: '#5BBD2F' }} />
            <span className="font-medium" style={{ color: '#5BBD2F' }}>Open Mon – Sat</span>
          </div>
          <div className="flex items-center gap-2" style={{ color: 'var(--muted)' }}>
            <Clock className="w-4 h-4" />
            <span>8:00 AM — 6:00 PM</span>
          </div>
          <div className="hidden sm:flex items-center gap-2" style={{ color: 'var(--muted)' }}>
            <MapPin className="w-4 h-4" />
            <span>AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A</span>
          </div>
          <a href="tel:0705525890" className="flex items-center gap-2 font-medium" style={{ color: 'var(--primary)' }}>
            <Phone className="w-4 h-4" />
            <span>0705525890</span>
          </a>
        </div>
      </div>
    </section>
  )
}
