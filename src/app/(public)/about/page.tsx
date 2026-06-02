import { Heart, Shield, Sparkles, Users } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function AboutPage() {
  return (
    <div className="container-wide section-padding">
      <div className="max-w-3xl mx-auto text-center mb-16 fade-in-up">
        <Image src="/assets/logo.png" alt="Seraine Creations" width={120} height={120} className="mx-auto mb-6 w-28 h-auto" />
        <h1 className="mb-4">About Seraine Creations</h1>
        <p className="text-lg" style={{ color: 'var(--muted)' }}>We are a Nairobi-based printing and creative services company dedicated to bringing your ideas to life with precision, quality, and care.</p>
        <p className="text-sm mt-3 font-medium" style={{ color: 'var(--primary)' }}>DESIGN | PRINTING | BRANDING | GIFTS | EVENT DECOR</p>
      </div>
      <div className="grid sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
        {[{ icon: Sparkles, title: 'Quality First', desc: 'Premium materials and meticulous attention to detail on every project.' },
          { icon: Users, title: 'Customer Focused', desc: 'Your vision drives everything we do. We listen, collaborate, and deliver.' },
          { icon: Shield, title: 'Reliable', desc: 'On-time delivery, consistent quality, and transparent pricing.' },
          { icon: Heart, title: 'Passionate', desc: 'We love what we do and it shows in every piece we produce.' }
        ].map((v, i) => (
          <div key={i} className="text-center p-6 card-hover">
            <div className="w-14 h-14 mx-auto mb-4 rounded-full flex items-center justify-center" style={{ backgroundColor: 'rgba(37,99,196,0.1)' }}><v.icon className="w-6 h-6" style={{ color: 'var(--primary)' }} /></div>
            <h3 className="font-heading text-lg font-semibold mb-2">{v.title}</h3>
            <p className="text-sm" style={{ color: 'var(--muted)' }}>{v.desc}</p>
          </div>
        ))}
      </div>
      <div className="rounded-2xl p-10 text-center text-white" style={{ backgroundColor: 'var(--dark)' }}>
        <h2 className="text-white mb-3">Ready to start your project?</h2>
        <p className="text-white/60 mb-2 max-w-lg mx-auto">Get in touch with us today and let&apos;s bring your vision to life.</p>
        <p className="text-white/40 text-sm mb-6">📲 0705525890 · 📧 seraine.creation@gmail.com</p>
        <Link href="/contact" className="inline-flex items-center h-12 px-8 rounded-pill font-medium transition-all hover:opacity-90" style={{ backgroundColor: '#A020C8', color: '#fff' }}>Contact Us</Link>
      </div>
    </div>
  )
}
