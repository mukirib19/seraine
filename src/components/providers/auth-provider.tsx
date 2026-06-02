'use client'
import { useEffect, useState } from 'react'
import Image from 'next/image'
import Link from 'next/link'
import { supabase } from '@/lib/supabase'
import { useAuthStore } from '@/stores/auth.store'
import { useCartStore } from '@/stores/cart.store'

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const { setUser, setProfile, setLoading } = useAuthStore()
  const { items, addItem } = useCartStore()

  const syncCart = async (userId: string) => {
    try {
      const { data } = await supabase
        .from('cart_items')
        .select('*, products:product_id(id,name,sku,category,price,images)')
        .eq('user_id', userId)
      if (!data) return
      data.forEach((item: any) => {
        if (!item.products) return
        const exists = items.find(i => i.product_id === item.product_id)
        if (!exists) {
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
        }
      })
    } catch (_) {}
  }

  useEffect(() => {
    let mounted = true

    const init = async () => {
      try {
        const { data: { session } } = await supabase.auth.getSession()
        if (!mounted) return
        if (session?.user) {
          setUser({ id: session.user.id, email: session.user.email || '' })
          const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
          if (profile && mounted) setProfile(profile)
          await syncCart(session.user.id)
        }
      } catch (_) {}
      if (mounted) setLoading(false)
    }

    init()

    const { data: { subscription } } = supabase.auth.onAuthStateChange(async (event, session) => {
      if (!mounted) return
      if (session?.user) {
        setUser({ id: session.user.id, email: session.user.email || '' })
        const { data: profile } = await supabase.from('profiles').select('*').eq('id', session.user.id).single()
        if (profile && mounted) setProfile(profile)
        if (event === 'SIGNED_IN') await syncCart(session.user.id)
      } else {
        setUser(null)
        setProfile(null)
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
