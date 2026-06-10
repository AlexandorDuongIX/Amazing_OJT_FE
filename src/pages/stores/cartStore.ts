import { create } from 'zustand'

export interface CartItem {
  id: string
  name: string
  image: string
  price: number
  quantity: number
}

interface CartStore {
  items: CartItem[]

  addItem: (item: CartItem) => void

  removeItem: (id: string) => void

  clearCart: () => void
}

export const useCartStore =
  create<CartStore>((set) => ({
    items: [],

    addItem: (item: CartItem) =>
      set((state) => ({
        items: [...state.items, item],
      })),

    removeItem: (id: string) =>
      set((state) => ({
        items: state.items.filter(
          (item) => item.id !== id
        ),
      })),

    clearCart: () =>
      set({
        items: [],
      }),
  }))