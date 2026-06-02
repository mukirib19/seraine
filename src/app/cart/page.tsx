'use client'
import { useCartStore } from '@/stores/cart.store'
import { formatCurrency } from '@/lib/utils'
import { Button } from '@/components/ui/button'
import { Navbar } from '@/components/layout/navbar'
import { Footer } from '@/components/layout/footer'
import { Minus, Plus, Trash2, ShoppingBag, ArrowRight } from 'lucide-react'
import Image from 'next/image'
import Link from 'next/link'

export default function CartPage() {
  const { items, removeItem, updateQuantity, getSubtotal, clearCart } = useCartStore()
  const subtotal = getSubtotal()

  return (
    <>
      <Navbar />
      <main className="container-wide py-10 min-h-screen">
        <h1 className="mb-8">Shopping Cart</h1>
        {items.length === 0 ? (
          <div className="text-center py-20"><ShoppingBag className="w-16 h-16 mx-auto mb-4 text-border" /><h3 className="font-heading text-xl mb-2">Your cart is empty</h3><p className="text-muted mb-6">Browse our catalog and add items to get started.</p><Link href="/catalog"><Button>Browse Catalog</Button></Link></div>
        ) : (
          <div className="grid lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2 space-y-4">
              {items.map(item => (
                <div key={item.id} className="bg-white rounded-lg border border-border-subtle p-4 flex gap-4">
                  <div className="w-20 h-20 rounded-md bg-cream flex-shrink-0 overflow-hidden">{item.image_url ? <Image src={item.image_url} alt={item.product_name} width={80} height={80} className="object-cover w-full h-full" /> : <div className="flex items-center justify-center h-full text-muted text-xs">No img</div>}</div>
                  <div className="flex-1 min-w-0">
                    <h3 className="font-medium text-charcoal truncate">{item.product_name}</h3>
                    <p className="text-sm text-muted">{formatCurrency(item.unit_price)} each</p>
                    <div className="flex items-center gap-3 mt-2">
                      <div className="flex items-center border border-border rounded-md">
                        <button onClick={() => updateQuantity(item.id, item.quantity - 1)} className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal"><Minus className="w-3 h-3" /></button>
                        <span className="w-8 text-center text-sm">{item.quantity}</span>
                        <button onClick={() => updateQuantity(item.id, item.quantity + 1)} className="w-8 h-8 flex items-center justify-center text-muted hover:text-charcoal"><Plus className="w-3 h-3" /></button>
                      </div>
                      <button onClick={() => removeItem(item.id)} className="text-muted hover:text-error transition-colors"><Trash2 className="w-4 h-4" /></button>
                    </div>
                  </div>
                  <p className="font-semibold text-charcoal whitespace-nowrap">{formatCurrency(item.unit_price * item.quantity)}</p>
                </div>
              ))}
              <button onClick={clearCart} className="text-sm text-muted hover:text-error transition-colors">Clear cart</button>
            </div>
            <div className="lg:col-span-1">
              <div className="bg-white rounded-lg border border-border-subtle p-6 sticky top-24">
                <h3 className="font-heading text-lg font-semibold mb-4">Order Summary</h3>
                <div className="space-y-3 mb-6">
                  <div className="flex justify-between text-sm"><span className="text-muted">Subtotal ({items.length} items)</span><span className="font-medium">{formatCurrency(subtotal)}</span></div>
                  <div className="flex justify-between text-sm"><span className="text-muted">Delivery</span><span className="text-muted">Calculated at checkout</span></div>
                  <div className="border-t border-border-subtle pt-3 flex justify-between font-semibold"><span>Total</span><span>{formatCurrency(subtotal)}</span></div>
                </div>
                <Button className="w-full" rightIcon={<ArrowRight className="w-4 h-4" />}>Proceed to Checkout</Button>
              </div>
            </div>
          </div>
        )}
      </main>
      <Footer />
    </>
  )
}
