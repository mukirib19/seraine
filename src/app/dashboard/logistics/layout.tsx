'use client'
import { useState } from 'react'
import { Sidebar, type SidebarItem } from '@/components/layout/sidebar'
import { Menu, LayoutDashboard, Truck, Users, MapPin, Bell, Settings } from 'lucide-react'

const logisticsItems: SidebarItem[] = [
  { label: 'Dashboard', href: '/dashboard/logistics', icon: LayoutDashboard },
  { label: 'Deliveries', href: '/dashboard/logistics/deliveries', icon: Truck },
  { label: 'Agents', href: '/dashboard/logistics/agents', icon: Users },
  { label: 'Zones', href: '/dashboard/logistics/zones', icon: MapPin },
  { label: 'Notifications', href: '/dashboard/logistics/notifications', icon: Bell },
  { label: 'Profile', href: '/dashboard/logistics/profile', icon: Settings },
]

export default function LogisticsLayout({ children }: { children: React.ReactNode }) {
  const [mobileOpen, setMobileOpen] = useState(false)
  return (
    <div className="min-h-screen bg-cream">
      <Sidebar items={logisticsItems} mobileOpen={mobileOpen} onMobileClose={() => setMobileOpen(false)} />
      <div className="lg:pl-60"><header className="sticky top-0 z-20 h-16 bg-white/95 backdrop-blur-md border-b border-border-subtle flex items-center px-4 lg:px-6"><button onClick={() => setMobileOpen(true)} className="lg:hidden w-10 h-10 flex items-center justify-center rounded-md text-muted hover:text-charcoal"><Menu className="w-5 h-5" /></button></header><main className="p-4 lg:p-6">{children}</main></div>
    </div>
  )
}
