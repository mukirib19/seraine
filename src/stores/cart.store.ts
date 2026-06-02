import { create } from 'zustand'
import { persist } from 'zustand/middleware'

export interface CartItem {
  id: string
  product_id: string
  product_name: string
  product_sku: string | null
  category_name: string | null
  quantity: number
  unit_price: number
  variant_selections: Record<string, string>
  image_url: string | null
}

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: Omit<CartItem, 'id'>) => void
  removeItem: (id: string) => void
  updateQuantity: (id: string, quantity: number) => void
  clearCart: () => void
  toggleCart: () => void
  setCartOpen: (open: boolean) => void
  getSubtotal: () => number
  getItemCount: () => number
}

export const useCartStore = create<CartState>()(
  persist(
    (set, get) => ({
      items: [],
      isOpen: false,

      addItem: (item) => {
        const items = get().items
        const existingIndex = items.findIndex(
          (i) =>
            i.product_id === item.product_id &&
            JSON.stringify(i.variant_selections) === JSON.stringify(item.variant_selections)
        )

        if (existingIndex >= 0) {
          const updated = [...items]
          updated[existingIndex] = {
            ...updated[existingIndex],
            quantity: updated[existingIndex].quantity + item.quantity,
          }
          set({ items: updated })
        } else {
          const id = `cart_${Date.now()}_${Math.random().toString(36).slice(2, 9)}`
          set({ items: [...items, { ...item, id }] })
        }
      },

      removeItem: (id) => {
        set({ items: get().items.filter((i) => i.id !== id) })
      },

      updateQuantity: (id, quantity) => {
        if (quantity < 1) return
        set({
          items: get().items.map((i) =>
            i.id === id ? { ...i, quantity } : i
          ),
        })
      },

      clearCart: () => set({ items: [] }),

      toggleCart: () => set({ isOpen: !get().isOpen }),

      setCartOpen: (open) => set({ isOpen: open }),

      getSubtotal: () => {
        return get().items.reduce((sum, item) => sum + item.unit_price * item.quantity, 0)
      },

      getItemCount: () => {
        return get().items.reduce((sum, item) => sum + item.quantity, 0)
      },
    }),
    {
      name: 'seraine-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
