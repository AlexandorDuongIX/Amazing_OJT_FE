import { create } from 'zustand'
import type { AdminOrder, AdminOrderStatus } from '@/types/adminOrder'
import { getAllOrders, updateOrderStatus } from '@/services/orderApi'

interface AdminOrderStore {
  orders: AdminOrder[]
  loading: boolean
  error: string | null
  fetchOrders: () => Promise<void>
  updateStatus: (id: string, status: AdminOrderStatus) => Promise<void>
}

export const useAdminOrderStore = create<AdminOrderStore>((set) => ({
  orders: [],
  loading: false,
  error: null,

  fetchOrders: async () => {
    set({ loading: true, error: null })
    try {
      const orders = await getAllOrders()
      set({ orders, loading: false })
    } catch {
      set({ error: 'Không tải được danh sách đơn hàng.', loading: false })
    }
  },

  updateStatus: async (id, status) => {
    try {
      const updated = await updateOrderStatus(Number(id), status)
      set((state) => ({
        orders: state.orders.map((order) => (order.id === id ? updated : order)),
      }))
    } catch {
      set({ error: 'Không cập nhật được trạng thái đơn hàng.' })
    }
  },
}))
