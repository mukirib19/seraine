'use client'
import { useState } from 'react'
import { Sidebar, type SidebarItem } from '@/components/layout/sidebar'
import { Menu, LayoutDashboard, Package, Clock, Layers, Bell, Settings } from 'lucide-react'

const staffItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard/staff', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/staff/orders', icon: Package },
  { label: 'Production Queue', href: '/dashboard/staff/production', icon: Clock },
  { label: 'Products', href: '/dashboard/staff/products', icon: Layers },
  { label: 'Notifications', href: '/dashboard/staff/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/staff/profile', icon: Settings },
]

export default function StaffLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar items={staffItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-60"><header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-border-subtle flex items-center px-4 lg:px-6"><button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-muted hover:text-charcoal"><Menu className="w-5 h-5" /></button></header><main className="p-4 lg:p-6">{children}</main></div>
    </div>
  )
}
