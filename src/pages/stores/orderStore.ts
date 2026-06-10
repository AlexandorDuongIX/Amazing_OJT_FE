import { create } from 'zustand'

export interface Order {
  id: string
  total: number
  paymentStatus: string
  createdAt: string
}

interface OrderStore {
  orders: Order[]

  addOrder: (order: Order) => void

  clearOrders: () => void
}

export const useOrderStore =
  create<OrderStore>((set) => ({
    orders: [],

    addOrder: (order: Order) =>
      set((state) => ({
        orders: [...state.orders, order],
      })),

    clearOrders: () =>
      set({
        orders: [],
      }),
  }))