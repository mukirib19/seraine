'use client'
import Link from 'next/link'
import Image from 'next/image'
import { usePathname, useRouter } from 'next/navigation'
import { useState, useEffect } from 'react'
import { Menu, X, ShoppingBag, User, Moon, Sun } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useCartStore } from '@/stores/cart.store'
import { useAuthStore } from '@/stores/auth.store'
import { useTheme } from '@/components/providers/theme-provider'
import { AnimatePresence, motion } from 'framer-motion'

const NAV_LINKS = [
  { label: 'Home', href: '/' },
  { label: 'Catalog', href: '/catalog' },
  { label: 'Services', href: '/services' },
  { label: 'Portfolio', href: '/portfolio' },
  { label: 'About', href: '/about' },
  { label: 'Contact', href: '/contact' },
  { label: 'Track Order', href: '/track' },
]

export function Navbar() {
  const pathname = usePathname()
  const router = useRouter()
  const [mobileOpen, setMobileOpen] = useState(false)
  const [scrolled, setScrolled] = useState(false)
  const [mounted, setMounted] = useState(false)
  const [navLoading, setNavLoading] = useState<string | null>(null)

  // Only read cart count client-side to avoid hydration mismatch
  const itemCount = useCartStore((s) => s.getItemCount())
  const { isAuthenticated, role } = useAuthStore()
  const { theme, toggle } = useTheme()

  useEffect(() => {
    setMounted(true)
    const h = () => setScrolled(window.scrollY > 10)
    window.addEventListener('scroll', h, { passive: true })
    return () => window.removeEventListener('scroll', h)
  }, [])

  useEffect(() => { setMobileOpen(false); setNavLoading(null) }, [pathname])

  const handleNavClick = (href: string) => {
    if (pathname === href) return
    setNavLoading(href)
    router.push(href)
  }

  // Always link profile icon to /profile — that page handles the auth redirect.
  // This prevents the navbar from wrongly sending logged-in users to /login
  // before the Zustand auth store has hydrated from Supabase.
  const profileHref = '/profile'

  return (
    <header className={cn(
      'sticky top-0 z-40 transition-all duration-200',
      scrolled ? 'border-b backdrop-blur-md' : '',
    )} style={{ backgroundColor: scrolled ? 'var(--card-bg)' : 'var(--bg)', borderColor: 'var(--border)' }}>
      <nav className="container-wide">
        <div className="flex items-center justify-between h-16 lg:h-[72px]">
          {/* Logo */}
          <Link href="/" className="flex items-center gap-2 transition-transform hover:scale-[1.03]">
            <Image src="/assets/logo.png" alt="Seraine Creations" width={40} height={40} className="w-10 h-10 object-contain" priority unoptimized />
            <span className="font-heading text-xl font-bold hidden sm:block" style={{ color: 'var(--text)' }}>Seraine Creations</span>
          </Link>

          {/* Desktop Nav Links */}
          <div className="hidden lg:flex items-center gap-1">
            {NAV_LINKS.map((link) => {
              const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
              return (
                <button key={link.href} onClick={() => handleNavClick(link.href)}
                  className={cn('px-3 py-2 text-sm font-medium rounded-pill transition-colors flex items-center gap-1.5', isActive ? '' : 'hover:opacity-80')}
                  style={{ color: isActive ? 'var(--primary)' : 'var(--text)' }}>
                  {navLoading === link.href && <span className="spinner w-3 h-3 inline-block" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />}
                  {link.label}
                </button>
              )
            })}
          </div>

          {/* Right actions */}
          <div className="flex items-center gap-1">
            {/* Dark mode toggle */}
            <button onClick={toggle} className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-primary/10" aria-label="Toggle dark mode">
              {theme === 'dark' ? <Sun className="w-5 h-5" style={{ color: 'var(--promo)' }} /> : <Moon className="w-5 h-5" style={{ color: 'var(--text)' }} />}
            </button>

            {/* Cart — suppress hydration warning on badge since count is client-only */}
            <Link href="/cart" className="relative w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-primary/10" aria-label="Shopping cart">
              <ShoppingBag className="w-5 h-5" style={{ color: 'var(--text)' }} />
              {mounted && itemCount > 0 && (
                <span className="absolute -top-0.5 -right-0.5 w-5 h-5 rounded-full text-white text-[10px] font-bold flex items-center justify-center"
                  style={{ backgroundColor: 'var(--cta)' }}>
                  {itemCount > 9 ? '9+' : itemCount}
                </span>
              )}
            </Link>

            {/* Profile icon — always goes to /profile, which redirects to /login if not authenticated */}
            <Link href={profileHref} className="w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-primary/10" aria-label="Account">
              <User className="w-5 h-5" style={{ color: 'var(--text)' }} />
            </Link>

            {/* Mobile hamburger */}
            <button onClick={() => setMobileOpen(!mobileOpen)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-full transition-colors hover:bg-primary/10" aria-label="Toggle menu">
              {mobileOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
            </button>
          </div>
        </div>
      </nav>

      {/* Mobile menu */}
      <AnimatePresence>
        {mobileOpen && (
          <motion.div initial={{ opacity: 0, y: -10 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -10 }} transition={{ duration: 0.2 }}
            className="lg:hidden absolute top-full left-0 right-0 border-b" style={{ backgroundColor: 'var(--card-bg)', borderColor: 'var(--border)' }}>
            <div className="container-wide py-4 space-y-1">
              {NAV_LINKS.map((link) => {
                const isActive = link.href === '/' ? pathname === '/' : pathname.startsWith(link.href)
                const isNavigating = navLoading === link.href
                return (
                  <button key={link.href} onClick={() => handleNavClick(link.href)}
                    className={cn('w-full text-left flex items-center gap-3 px-4 py-3 text-base font-medium rounded-xl transition-colors', isActive ? 'bg-primary/5' : '')}
                    style={{ color: isActive ? 'var(--primary)' : 'var(--text)' }}>
                    {isNavigating
                      ? <span className="spinner w-4 h-4 flex-shrink-0" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />
                      : <span className="w-4 h-4 flex-shrink-0" />
                    }
                    {link.label}
                  </button>
                )
              })}
              <div className="pt-3 border-t mt-3" style={{ borderColor: 'var(--border)' }}>
                <button onClick={() => handleNavClick(profileHref)} className="w-full text-left flex items-center gap-3 px-4 py-3 text-base font-medium" style={{ color: 'var(--primary)' }}>
                  {navLoading === profileHref && <span className="spinner w-4 h-4" style={{ borderColor: 'var(--primary)', borderTopColor: 'transparent' }} />}
                  {mounted && isAuthenticated ? 'My Account' : 'Login / Sign Up'}
                </button>
              </div>
            </div>
          </motion.div>
        )}
      </AnimatePresence>
    </header>
  )
}
