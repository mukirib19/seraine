import Link from 'next/link'
import Image from 'next/image'
import { Instagram, Linkedin, Phone, Mail, MapPin } from 'lucide-react'

const INSTAGRAM_URL = 'https://www.instagram.com/seraine_creations?utm_source=ig_web_button_share_sheet&igsh=ZDNlZDc0MzIxNw=='
const LINKEDIN_URL = 'https://www.linkedin.com/in/seraine-creation-1b83a3377/?lipi=urn%3Ali%3Apage%3Ad_flagship3_profile_view_base_contact_details%3BzXIstFK3SkynmlG00N2ORg%3D%3D'

const FOOTER_LINKS = {
  company: [
    { label: 'About', href: '/about' },
    { label: 'Contact', href: '/contact' },
    { label: 'Portfolio', href: '/portfolio' },
  ],
  services: [
    { label: 'Large Format Printing', href: '/catalog?category=large-format' },
    { label: 'T-Shirt Printing', href: '/catalog?category=t-shirt-printing' },
    { label: 'Mug Branding', href: '/catalog?category=mug-branding' },
    { label: 'Event Decor', href: '/catalog?category=event-decor' },
    { label: 'Notebooks', href: '/catalog?category=notebooks' },
  ],
  support: [
    { label: 'Track Order', href: '/track' },
    { label: 'Terms & Conditions', href: '/terms' },
    { label: 'Privacy Policy', href: '/privacy' },
  ],
}

export function Footer() {
  return (
    <footer style={{ backgroundColor: 'var(--dark)', color: 'rgba(255,255,255,0.8)' }}>
      <div className="container-wide section-padding">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-10">
          {/* Brand */}
          <div className="col-span-2 md:col-span-1">
            <Link href="/" className="flex items-center gap-2 mb-3">
              <Image src="/assets/logo.png" alt="Seraine Creations" width={36} height={36} className="w-9 h-9 object-contain" />
              <span className="font-heading text-xl font-bold text-white">Seraine Creations</span>
            </Link>
            <p className="text-sm text-white/50 leading-relaxed mb-1">Printing Perfected</p>
            <p className="text-xs text-white/40 leading-relaxed">DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR</p>
            <div className="flex items-center gap-3 mt-6">
              <a href={INSTAGRAM_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary/30 transition-colors" aria-label="Instagram">
                <Instagram className="w-4 h-4" />
              </a>
              <a href={LINKEDIN_URL} target="_blank" rel="noopener noreferrer" className="w-9 h-9 rounded-full bg-white/10 flex items-center justify-center hover:bg-primary/30 transition-colors" aria-label="LinkedIn">
                <Linkedin className="w-4 h-4" />
              </a>
            </div>
          </div>

          {/* Company */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Company</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.company.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Services */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Services</h4>
            <ul className="space-y-2.5">
              {FOOTER_LINKS.services.map((link) => (
                <li key={link.href}><Link href={link.href} className="text-sm text-white/50 hover:text-white transition-colors">{link.label}</Link></li>
              ))}
            </ul>
          </div>

          {/* Contact */}
          <div>
            <h4 className="text-sm font-semibold text-white uppercase tracking-wider mb-4">Contact</h4>
            <ul className="space-y-3">
              <li className="flex items-start gap-2 text-sm text-white/50"><Phone className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>0705525890</span></li>
              <li className="flex items-start gap-2 text-sm text-white/50"><Mail className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>seraine.creation@gmail.com</span></li>
              <li className="flex items-start gap-2 text-sm text-white/50"><MapPin className="w-4 h-4 mt-0.5 flex-shrink-0" /><span>AFYA BUSINESS PLAZA, KOJA 5th Floor Rm 506A</span></li>
            </ul>
          </div>
        </div>
      </div>

      <div className="border-t border-white/10">
        <div className="container-wide py-5 flex flex-col sm:flex-row items-center justify-between gap-3">
          <p className="text-xs text-white/40">&copy; {new Date().getFullYear()} Seraine Creations. All rights reserved.</p>
          <p className="text-xs text-white/40">Printing Perfected</p>
        </div>
      </div>
    </footer>
  )
}
