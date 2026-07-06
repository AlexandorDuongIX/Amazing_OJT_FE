export type OrderStatus = 'Đang xử lý' | 'Đã giao' | 'Đã hủy' | 'Trả hàng/Hoàn tiền'

export interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
}
