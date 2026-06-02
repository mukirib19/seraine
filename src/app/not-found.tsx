import Link from 'next/link'
import Image from 'next/image'
import { Home, Search } from 'lucide-react'

export const metadata = {
  title: '404 — Page Not Found | Seraine Creations',
}

export default function NotFound() {
  return (
    <div className="min-h-screen flex flex-col items-center justify-center px-4 text-center" style={{ backgroundColor: 'var(--bg)' }}>
      <Image src="/assets/logo.png" alt="Seraine Creations" width={80} height={80} className="w-20 h-20 object-contain mb-8 opacity-60" />

      <h1 className="text-8xl font-heading font-bold mb-4" style={{ color: 'var(--primary)' }}>404</h1>
      <h2 className="text-2xl font-heading font-semibold mb-3" style={{ color: 'var(--text)' }}>Page Not Found</h2>
      <p className="mb-8 max-w-md" style={{ color: 'var(--muted)' }}>
        The page you&apos;re looking for doesn&apos;t exist or has been moved. Let&apos;s get you back on track.
      </p>

      <div className="flex flex-col sm:flex-row gap-3">
        <Link href="/" className="inline-flex items-center gap-2 h-12 px-8 rounded-pill font-medium transition-all"
          style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>
          <Home className="w-4 h-4" /> Back to Home
        </Link>
        <Link href="/catalog" className="inline-flex items-center gap-2 h-12 px-8 rounded-pill font-medium transition-all"
          style={{ border: '1px solid var(--primary)', color: 'var(--primary)' }}>
          <Search className="w-4 h-4" /> Browse Catalog
        </Link>
      </div>

      <p className="mt-12 text-sm" style={{ color: 'var(--muted)' }}>
        Need help?{' '}
        <a href="tel:0705525890" className="underline" style={{ color: 'var(--primary)' }}>Call us: 0705525890</a>
      </p>
    </div>
  )
}
