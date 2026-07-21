import { create } from 'zustand'
import type { Order } from '@/types/order'
import { getMyOrders } from '@/services/orderApi'

interface OrderHistoryStore {
  orders: Order[]
  loading: boolean
  error: string | null
  fetchMyOrders: () => Promise<void>
}

export const useOrderHistoryStore = create<OrderHistoryStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchMyOrders: async () => {
    set({ loading: true, error: null })
    try {
      const orders = await getMyOrders()
      set({ orders, loading: false })
    } catch {
      set({ error: 'Không tải được lịch sử đơn hàng.', loading: false })
    }
  },
}))
