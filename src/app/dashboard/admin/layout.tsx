'use client'
import { useState } from 'react'
import { Sidebar, type SidebarItem } from '@/components/layout/sidebar'
import { Menu } from 'lucide-react'
import { LayoutDashboard, Package, Clock, Settings, Users, ShoppingCart, BarChart3, Layers, Truck, Bell, FileText, Star, Warehouse, Calendar } from 'lucide-react'
import { cn } from '@/lib/utils'

const adminItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard/admin', icon: LayoutDashboard },
  { label: 'Orders', href: '/dashboard/admin/orders', icon: Package },
  { label: 'Products', href: '/dashboard/admin/products', icon: Layers },
  { label: 'Customers', href: '/dashboard/admin/customers', icon: Users },
  { label: 'Production', href: '/dashboard/admin/production', icon: Clock },
  { label: 'Deliveries', href: '/dashboard/admin/deliveries', icon: Truck },
  { label: 'Inventory', href: '/dashboard/admin/inventory', icon: Warehouse },
  { label: 'Reviews', href: '/dashboard/admin/reviews', icon: Star },
  { label: 'Analytics', href: '/dashboard/admin/analytics', icon: BarChart3 },
  { label: 'Staff', href: '/dashboard/admin/staff', icon: Users },
  { label: 'Attendance', href: '/dashboard/admin/attendance', icon: Calendar },
  { label: 'Notifications', href: '/dashboard/admin/notifications', icon: Bell },
  { label: 'Settings', href: '/dashboard/admin/settings', icon: Settings },
]

export default function AdminLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar items={adminItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-60 transition-all">
        <header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-border-subtle flex items-center px-4 lg:px-6">
          <button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-muted hover:text-charcoal"><Menu className="w-5 h-5" /></button>
          <div className="flex-1" />
        </header>
        <main className="p-4 lg:p-6">{children}</main>
      </div>
    </div>
  )
}
