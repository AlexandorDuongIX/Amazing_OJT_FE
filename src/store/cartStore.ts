import { create } from 'zustand'
import { persist } from 'zustand/middleware'
import type { CartItem } from '../types/cart'

interface CartState {
  items: CartItem[]
  isOpen: boolean
  addItem: (item: CartItem) => void
  removeItem: (id: number, size: string, color: string) => void
  updateQuantity: (id: number, size: string, color: string, qty: number) => void
  clearCart: () => void
  openCart: () => void
  closeCart: () => void
  toggleCart: () => void
}

export const useCartStore = create<CartState>()(
  persist(
    (set) => ({
      items: [],
      isOpen: false,

      addItem: (item) =>
        set((state) => {
          const existing = state.items.find(
            (i) => i.id === item.id && i.size === item.size && i.color === item.color
          )
          if (existing) {
            return {
              items: state.items.map((i) =>
                i.id === item.id && i.size === item.size && i.color === item.color
                  ? { ...i, quantity: i.quantity + item.quantity }
                  : i
              ),
            }
          }
          return { items: [...state.items, item] }
        }),

      removeItem: (id, size, color) =>
        set((state) => ({
          items: state.items.filter(
            (i) => !(i.id === id && i.size === size && i.color === color)
          ),
        })),

      updateQuantity: (id, size, color, qty) =>
        set((state) => {
          if (qty < 1) {
            return {
              items: state.items.filter(
                (i) => !(i.id === id && i.size === size && i.color === color)
              ),
            }
          }
          return {
            items: state.items.map((i) =>
              i.id === id && i.size === size && i.color === color
                ? { ...i, quantity: qty }
                : i
            ),
          }
        }),

      clearCart: () => set({ items: [] }),
      openCart: () => set({ isOpen: true }),
      closeCart: () => set({ isOpen: false }),
      toggleCart: () => set((state) => ({ isOpen: !state.isOpen })),
    }),
    {
      name: 'amazing-cart',
      partialize: (state) => ({ items: state.items }),
    }
  )
)
