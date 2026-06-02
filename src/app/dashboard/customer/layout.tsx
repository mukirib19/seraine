'use client'
import { useState } from 'react'
import { Sidebar, type SidebarItem } from '@/components/layout/sidebar'
import { BottomNav } from '@/components/layout/bottom-nav'
import { Menu } from 'lucide-react'
import { LayoutDashboard, Package, Heart, MapPin, FileText, Settings, Bell } from 'lucide-react'

const customerItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard/customer', icon: LayoutDashboard },
  { label: 'My Orders', href: '/dashboard/customer/orders', icon: Package },
  { label: 'Favourites', href: '/dashboard/customer/favourites', icon: Heart },
  { label: 'Addresses', href: '/dashboard/customer/addresses', icon: MapPin },
  { label: 'Invoices', href: '/dashboard/customer/invoices', icon: FileText },
  { label: 'Notifications', href: '/dashboard/customer/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/customer/profile', icon: Settings },
]

export default function CustomerLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-cream pb-16 lg:pb-0">
      <Sidebar items={customerItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-60 transition-all">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-border-subtle flex items-center px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-muted hover:text-charcoal"><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
      <BottomNav />
    </div>
  )
}
