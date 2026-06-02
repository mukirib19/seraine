'use client'

import Link from 'next/link'
import { usePathname } from 'next/navigation'
import { useState } from 'react'
import { cn } from '@/lib/utils'
import { Avatar } from '@/components/ui/avatar'
import { useAuthStore } from '@/stores/auth.store'
import { ChevronLeft, ChevronRight, LogOut, X } from 'lucide-react'
import { AnimatePresence, motion } from 'framer-motion'
import { supabase } from '@/lib/supabase'
import { useRouter } from 'next/navigation'
import type { LucideIcon } from 'lucide-react'

export interface SidebarItem {
  label: string
  href: string
  icon: LucideIcon
  badge?: string | number
}

interface SidebarProps {
  items: SidebarItem[]
  mobileOpen: boolean
  onMobileClose: () => void
}

export function Sidebar({ items, mobileOpen, onMobileClose }: SidebarProps) {
  const pathname = usePathname()
  const router = useRouter()
  const { profile } = useAuthStore()
  const [collapsed, setCollapsed] = useState(false)

  const handleLogout = async () => {
    await supabase.auth.signOut()
    router.push('/login')
  }

  const sidebarContent = (
    <div className={cn(
      'flex flex-col h-full bg-white border-r border-border-subtle transition-all duration-200',
      collapsed ? 'w-16' : 'w-60'
    )}>
      {/* Logo */}
      <div className="flex items-center justify-between h-16 px-4 border-b border-border-subtle">
        {!collapsed && (
          <Link href="/" className="font-heading text-xl font-bold text-charcoal">
            Seraine
          </Link>
        )}
        <button
          onClick={() => setCollapsed(!collapsed)}
          className="hidden lg:flex w-8 h-8 items-center justify-center rounded-md text-muted hover:text-charcoal hover:bg-cream transition-colors"
          aria-label={collapsed ? 'Expand sidebar' : 'Collapse sidebar'}
        >
          {collapsed ? <ChevronRight className="w-4 h-4" /> : <ChevronLeft className="w-4 h-4" />}
        </button>
      </div>

      {/* Nav items */}
      <nav className="flex-1 py-4 px-2 space-y-1 overflow-y-auto">
        {items.map((item) => {
          const isActive = pathname === item.href || pathname.startsWith(item.href + '/')
          return (
            <Link
              key={item.href}
              href={item.href}
              className={cn(
                'flex items-center gap-3 px-3 py-2.5 rounded-md text-sm font-medium transition-colors min-h-[40px]',
                isActive
                  ? 'bg-burgundy/10 text-burgundy border-l-2 border-burgundy'
                  : 'text-muted hover:text-charcoal hover:bg-cream'
              )}
              title={collapsed ? item.label : undefined}
            >
              <item.icon className="w-5 h-5 flex-shrink-0" />
              {!collapsed && (
                <>
                  <span className="flex-1 truncate">{item.label}</span>
                  {item.badge && (
                    <span className="flex-shrink-0 w-5 h-5 rounded-full bg-burgundy text-white text-[10px] font-bold flex items-center justify-center">
                      {item.badge}
                    </span>
                  )}
                </>
              )}
            </Link>
          )
        })}
      </nav>

      {/* User info + Logout */}
      <div className="border-t border-border-subtle p-3">
        {profile && (
          <div className={cn('flex items-center gap-3 mb-3', collapsed && 'justify-center')}>
            <Avatar src={profile.avatar_url} name={profile.full_name} size="sm" />
            {!collapsed && (
              <div className="min-w-0">
                <p className="text-sm font-medium text-charcoal truncate">{profile.full_name}</p>
                <p className="text-xs text-muted truncate">{profile.display_id}</p>
              </div>
            )}
          </div>
        )}
        <button
          onClick={handleLogout}
          className={cn(
            'flex items-center gap-3 w-full px-3 py-2 rounded-md text-sm font-medium text-muted hover:text-error hover:bg-red-50 transition-colors',
            collapsed && 'justify-center'
          )}
          title="Sign out"
        >
          <LogOut className="w-4 h-4" />
          {!collapsed && <span>Sign out</span>}
        </button>
      </div>
    </div>
  )

  return (
    <>
      {/* Desktop sidebar */}
      <aside className="hidden lg:block fixed inset-y-0 left-0 z-30">
        {sidebarContent}
      </aside>

      {/* Mobile overlay */}
      <AnimatePresence>
        {mobileOpen && (
          <>
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-40 bg-charcoal/45 lg:hidden"
              onClick={onMobileClose}
            />
            <motion.aside
              initial={{ x: -300 }}
              animate={{ x: 0 }}
              exit={{ x: -300 }}
              transition={{ type: 'spring', damping: 25, stiffness: 200 }}
              className="fixed inset-y-0 left-0 z-50 w-72 lg:hidden"
            >
              <div className="relative h-full">
                <button
                  onClick={onMobileClose}
                  className="absolute top-4 right-4 w-8 h-8 rounded-full bg-cream flex items-center justify-center text-muted hover:text-charcoal z-10"
                  aria-label="Close menu"
                >
                  <X className="w-4 h-4" />
                </button>
                {sidebarContent}
              </div>
            </motion.aside>
          </>
        )}
      </AnimatePresence>
    </>
  )
}
