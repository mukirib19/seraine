'use client'
import { useEffect, useState } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { OrderCard } from '@/components/cards/order-card'
import { Tabs, TabsList, TabsTrigger, TabsContent } from '@/components/ui/tabs'
import { Package } from 'lucide-react'

export default function CustomerOrdersPage() {
  const { user } = useAuthStore()
  const [orders, setOrders] = useState<any[]>([])
  const [loading, setLoading] = useState(true)
  const [tab, setTab] = useState('all')

  useEffect(() => {
    if (!user) return
    supabase.from('orders').select('*,order_items(id)').eq('user_id', user.id).order('created_at', { ascending: false }).then(({ data }) => { setOrders(data || []); setLoading(false) })
  }, [user])

  const filtered = tab === 'all' ? orders : tab === 'active' ? orders.filter(o => ['pending', 'confirmed', 'in_production', 'quality_check', 'ready', 'dispatched'].includes(o.status)) : orders.filter(o => ['delivered', 'cancelled', 'refunded'].includes(o.status))

  return (
    <div className="space-y-6">
      <h1 className="text-2xl">My Orders</h1>
      <Tabs value={tab} onValueChange={setTab}>
        <TabsList><TabsTrigger value="all">All</TabsTrigger><TabsTrigger value="active">Active</TabsTrigger><TabsTrigger value="completed">Completed</TabsTrigger></TabsList>
        <TabsContent value={tab}>
          {loading ? <div className="space-y-3">{Array.from({ length: 3 }).map((_, i) => <div key={i} className="h-24 skeleton rounded-lg" />)}</div> : filtered.length === 0 ? <div className="text-center py-16"><Package className="w-12 h-12 mx-auto mb-3 text-border" /><p className="text-muted">No orders found.</p></div> : <div className="space-y-3">{filtered.map(o => <OrderCard key={o.id} id={o.id} displayId={o.display_id || 'N/A'} status={o.status} createdAt={o.created_at} itemCount={o.order_items?.length || 0} totalAmount={o.total_amount} href={`/dashboard/customer/orders/${o.id}`} />)}</div>}
        </TabsContent>
      </Tabs>
    </div>
  )
}
