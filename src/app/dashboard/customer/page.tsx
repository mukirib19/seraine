'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { StatCard } from '@/components/cards/stat-card'
import { OrderCard } from '@/components/cards/order-card'
import { Package, Heart, Clock, FileText } from 'lucide-react'
import Link from 'next/link'
import { Button } from '@/components/ui/button'

export default function CustomerDashboardPage() {
  const { user, profile } = useAuthStore()
  const [stats, setStats] = useState({ orders: 0, pending: 0, favourites: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (!user) return
    async function load() {
      const [ordersRes, pendingRes, favsRes, recentRes] = await Promise.all([
        supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('orders').select('id', { count: 'exact' }).eq('user_id', user!.id).in('status', ['pending', 'confirmed', 'in_production']),
        supabase.from('favorites').select('id', { count: 'exact' }).eq('user_id', user!.id),
        supabase.from('orders').select('*,order_items(id)').eq('user_id', user!.id).order('created_at', { ascending: false }).limit(3),
      ])
      setStats({ orders: ordersRes.count || 0, pending: pendingRes.count || 0, favourites: favsRes.count || 0 })
      setRecentOrders(recentRes.data || [])
      setLoading(false)
    }
    load()
  }, [user])

  if (loading) return <div className="space-y-4"><div className="h-8 w-48 skeleton" /><div className="grid sm:grid-cols-3 gap-4">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-28 skeleton rounded-lg" />)}</div></div>

  return (
    <div className="space-y-6">
      <div><h1 className="text-2xl lg:text-3xl">Welcome back{profile ? `, ${profile.full_name.split(' ')[0]}` : ''}</h1><p className="text-muted mt-1">Here&apos;s what&apos;s happening with your orders.</p></div>
      <div className="grid sm:grid-cols-3 gap-4">
        <StatCard label="Total Orders" value={stats.orders} icon={Package} />
        <StatCard label="In Progress" value={stats.pending} icon={Clock} />
        <StatCard label="Favourites" value={stats.favourites} icon={Heart} />
      </div>
      <div>
        <div className="flex items-center justify-between mb-4"><h3 className="font-heading text-lg font-semibold">Recent Orders</h3><Link href="/dashboard/customer/orders" className="text-sm text-burgundy font-medium hover:underline">View all</Link></div>
        {recentOrders.length === 0 ? <div className="text-center py-10 bg-white rounded-lg border border-border-subtle"><Package className="w-10 h-10 mx-auto mb-3 text-border" /><p className="text-muted mb-4">No orders yet</p><Link href="/catalog"><Button variant="secondary">Browse Catalog</Button></Link></div> : (
          <div className="space-y-3">{recentOrders.map(o => <OrderCard key={o.id} id={o.id} displayId={o.display_id || 'N/A'} status={o.status} createdAt={o.created_at} itemCount={o.order_items?.length || 0} totalAmount={o.total_amount} href={`/dashboard/customer/orders/${o.id}`} />)}</div>
        )}
      </div>
    </div>
  )
}
