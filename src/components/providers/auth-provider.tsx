'use client'
import { useEffect } from 'react'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()
  const { addItem, clearCart } = useCartStore()

  const loadCartFromSupabase = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('cart_items')
        .select('*, products:product_id(id,name,sku,category,price,images)')
        .eq('user_id', userId)
      if (!data) return
      // Replace local cart with this user's Supabase cart
      clearCart()
      data.forEach((item: any) => {
        if (!item.products) return
        addItem({
          product_id: item.product_id,
          product_name: item.products.name,
          product_sku: item.products.sku || null,
          category_name: item.products.category || null,
          quantity: item.quantity,
          unit_price: item.products.price,
          variant_selections: {},
          image_url: item.products.images?.[0] || null,
        })
      })
    } catch (_) {}
  }

  const fetchOrCreateProfile = async (userId: string, email: string, meta?: any) => {
    const { data: profile } = await supabase
      .from('profiles')
      .select('*')
      .eq('id', userId)
      .single()

    if (profile) return profile

    // Profile doesn't exist (new Google/OAuth user) — create it
    const fullName = meta?.full_name || meta?.name || email.split('@')[0]
    const { data: newProfile } = await supabase
      .from('profiles')
      .upsert({ id: userId, full_name: fullName, email, role: 'user' })
      .select()
      .single()

    return newProfile
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return

        if (session?.user) {
          const u = session.user
          setUser({ id: u.id, email: u.email || '' })
          const profile = await fetchOrCreateProfile(u.id, u.email || '', u.user_metadata)
          if (profile && mounted) setProfile(profile)
          await loadCartFromSupabase(u.id)
        }
      } catch (_) {}
      if (mounted) setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return

      if (session?.user) {
        const u = session.user
        setUser({ id: u.id, email: u.email || '' })
        const profile = await fetchOrCreateProfile(u.id, u.email || '', u.user_metadata)
        if (profile && mounted) setProfile(profile)

        if (event === 'SIGNED_IN') {
          await loadCartFromSupabase(u.id)
        }
      } else {
        setUser(null)
        setProfile(null)
        clearCart() // Clear cart on logout — next user gets clean cart
      }
      if (mounted) setLoading(false)
    })

    return () => {
      mounted = false
      subscription.unsubscribe()
    }
  // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [])

  return <>{children}</>
}
