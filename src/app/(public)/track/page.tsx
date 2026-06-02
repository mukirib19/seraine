'use client'
import { useState } from 'react'
import { supabase } from '@/lib/supabase'
import { Search, Package, Clock } from 'lucide-react'
import { toast } from 'sonner'

export default function TrackOrderPage() {
  const [query, setQuery] = useState('')
  const [order, setOrder] = useState<any>(null)
  const [loading, setLoading] = useState(false)
  const [notFound, setNotFound] = useState(false)

  const handleSearch = async (e: React.FormEvent) => {
    e.preventDefault()
    if (!query.trim()) return
    setLoading(true); setNotFound(false); setOrder(null)
    const { data } = await supabase.from('orders').select('*').eq('display_id', query.toUpperCase().trim()).single()
    setLoading(false)
    if (data) setOrder(data)
    else { setNotFound(true); toast.error('No order found with that ID') }
  }

  return (
    <div className="container-narrow py-16">
      <div className="text-center mb-10">
        <h1 className="mb-3" style={{ color: 'var(--text)' }}>Track Your Order</h1>
        <p style={{ color: 'var(--muted)' }}>Enter your order ID to check the current status.</p>
      </div>

      {/* Search form — icon and label with proper spacing */}
      <form onSubmit={handleSearch} className="flex gap-3 max-w-md mx-auto mb-10">
        <div className="flex-1 relative">
          <input
            value={query}
            onChange={e => setQuery(e.target.value)}
            placeholder="e.g. ORD-0001"
            className="w-full h-12 pl-4 pr-4 rounded-xl font-mono text-sm focus:outline-none"
            style={{ backgroundColor: 'var(--card-bg)', color: 'var(--text)', border: '0.5px solid var(--border)' }}
          />
        </div>
        <button type="submit" disabled={loading}
          className="h-12 px-6 rounded-pill font-medium flex items-center gap-2 transition-all disabled:opacity-60"
          style={{ backgroundColor: 'var(--cta)', color: '#fff' }}>
          {loading
            ? <span className="spinner" />
            : <><Search className="w-4 h-4" /><span>Track</span></>
          }
        </button>
      </form>

      {notFound && (
        <div className="text-center py-10">
          <Package className="w-12 h-12 mx-auto mb-3" style={{ color: 'var(--border)' }} />
          <p className="font-medium mb-1" style={{ color: 'var(--text)' }}>Order not found</p>
          <p className="text-sm" style={{ color: 'var(--muted)' }}>Double-check your order ID and try again.</p>
        </div>
      )}

      {order && (
        <div className="rounded-2xl p-6 max-w-md mx-auto" style={{ backgroundColor: 'var(--card-bg)', border: '0.5px solid var(--border)' }}>
          <div className="flex items-center justify-between mb-4">
            <div>
              <p className="font-mono font-semibold text-lg" style={{ color: 'var(--text)' }}>{order.display_id}</p>
              <p className="text-sm" style={{ color: 'var(--muted)' }}>{new Date(order.created_at).toLocaleDateString()}</p>
            </div>
            <span className="px-3 py-1 rounded-pill text-xs font-medium capitalize"
              style={{ backgroundColor: 'rgba(37,99,196,0.1)', color: 'var(--primary)' }}>
              {order.status?.replace(/_/g, ' ')}
            </span>
          </div>

          {order.total_amount && (
            <div className="pt-4 border-t flex justify-between font-semibold" style={{ borderColor: 'var(--border)' }}>
              <span style={{ color: 'var(--text)' }}>Total</span>
              <span style={{ color: 'var(--cta)' }}>KES {Number(order.total_amount).toLocaleString()}</span>
            </div>
          )}

          <div className="mt-4 pt-4 border-t flex items-center gap-2 text-sm" style={{ borderColor: 'var(--border)', color: 'var(--muted)' }}>
            <Clock className="w-4 h-4" />
            <span>For updates, call us on <a href="tel:0705525890" className="font-medium" style={{ color: 'var(--primary)' }}>0705525890</a></span>
          </div>
        </div>
      )}
    </div>
  )
}
