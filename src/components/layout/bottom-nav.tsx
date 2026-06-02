'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { Home, Grid3X3, Package, Heart, User } from 'lucide-react'
import { cn } from '@/lib/utils'

const TABS = [
  { label: 'Home', href: '/dashboard/customer', icon: Home },
  { label: 'Catalog', href: '/catalog', icon: Grid3X3 },
  { label: 'Orders', href: '/dashboard/customer/orders', icon: Package },
  { label: 'Favourites', href: '/dashboard/customer/favourites', icon: Heart },
  { label: 'Account', href: '/dashboard/customer/profile', icon: User },
]

export function BottomNav() {
  const pathname = usePathname()

  return (
    <nav className="fixed bottom-0 left-0 right-0 z-40 bg-white border-t border-border-subtle lg:hidden safe-area-bottom">
      <div className="flex items-center justify-around h-16">
        {TABS.map((tab) => {
          const isActive = tab.href === '/dashboard/customer'
            ? pathname === '/dashboard/customer'
            : pathname.startsWith(tab.href)
          return (
            <Link
              key={tab.href}
              href={tab.href}
              className={cn(
                'flex flex-col items-center justify-center gap-0.5 w-full h-full text-xs font-medium transition-colors',
                isActive ? 'text-burgundy' : 'text-muted'
              )}
            >
              <tab.icon className={cn('w-5 h-5', isActive && 'fill-burgundy/10')} />
              <span>{tab.label}</span>
            </Link>
          )
        })}
      </div>
    </nav>
  )
}
