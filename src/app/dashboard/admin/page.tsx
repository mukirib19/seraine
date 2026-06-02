'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { StatCard } from '@/components/cards/stat-card'
import { OrderCard } from '@/components/cards/order-card'
import { formatCurrency } from '@/lib/utils'
import { Package, DollarSign, Users, TrendingUp, Clock, AlertTriangle } from 'lucide-react'

export default function AdminDashboardPage() {
  const [stats, setStats] = useState({ orders: 0, revenue: 0, customers: 0, pending: 0 })
  const [recentOrders, setRecentOrders] = useState<any[]>([])
  const [lowStock, setLowStock] = useState<any[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    async function load() {
      const [ordersRes, profilesRes, pendingRes, recentRes, stockRes] = await Promise.all([
        supabase.from('orders').select('total_amount', { count: 'exact' }),
        supabase.from('profiles').select('id', { count: 'exact' }).eq('role', 'customer'),
        supabase.from('orders').select('id', { count: 'exact' }).eq('status', 'pending'),
        supabase.from('orders').select('*,order_items(id)').order('created_at', { ascending: false }).limit(5),
        supabase.from('v_low_stock').select('*').limit(5),
      ])
      const revenue = ordersRes.data?.reduce((s: number, o: any) => s + (o.total_amount || 0), 0) || 0
      setStats({ orders: ordersRes.count || 0, revenue, customers: profilesRes.count || 0, pending: pendingRes.count || 0 })
      setRecentOrders(recentRes.data || [])
      setLowStock(stockRes.data || [])
      setLoading(false)
    }
    load()
  }, [])

  if (loading) return <div className="space-y-6"><div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">{Array.from({ length: 4 }).map((_, i) => <div key={i} className="h-28 skeleton rounded-lg" />)}</div></div>

  return (
    <div className="space-y-6">
      <h1 className="text-2xl lg:text-3xl">Dashboard</h1>
      <div className="grid sm:grid-cols-2 xl:grid-cols-4 gap-4">
        <StatCard label="Total Orders" value={stats.orders} icon={Package} />
        <StatCard label="Revenue" value={formatCurrency(stats.revenue)} icon={DollarSign} />
        <StatCard label="Customers" value={stats.customers} icon={Users} />
        <StatCard label="Pending Orders" value={stats.pending} icon={Clock} />
      </div>
      <div className="grid lg:grid-cols-3 gap-6">
        <div className="lg:col-span-2">
          <h3 className="font-heading text-lg font-semibold mb-4">Recent Orders</h3>
          <div className="space-y-3">{recentOrders.map(o => <OrderCard key={o.id} id={o.id} displayId={o.display_id || 'N/A'} status={o.status} createdAt={o.created_at} itemCount={o.order_items?.length || 0} totalAmount={o.total_amount} href={`/dashboard/admin/orders/${o.id}`} />)}</div>
        </div>
        <div>
          <h3 className="font-heading text-lg font-semibold mb-4">Low Stock Alerts</h3>
          {lowStock.length === 0 ? <p className="text-sm text-muted">No low stock items.</p> : (
            <div className="space-y-3">{lowStock.map((item: any) => <div key={item.id} className="bg-white rounded-lg border border-border-subtle p-3 flex items-center gap-3"><AlertTriangle className="w-4 h-4 text-warning flex-shrink-0" /><div className="min-w-0"><p className="text-sm font-medium truncate">{item.name}</p><p className="text-xs text-muted">{item.stock_quantity} left (min: {item.low_stock_threshold})</p></div></div>)}</div>
          )}
        </div>
      </div>
    </div>
  )
}
