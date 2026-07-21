export type OrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'

export const STATUS_FROM_NUMBER: Record<number, OrderStatus> = {
  0: 'Pending',
  1: 'Processing',
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled',
  5: 'Returned',
}

export interface OrderItem {
  name: string
  price: number
  quantity: number
  image: string
}

export interface Order {
  id: string
  orderNumber: string
  date: string
  status: OrderStatus
  items: OrderItem[]
  total: number
}

// Raw shape trả về từ backend (không có DTO, đây là entity thô) — chỉ dùng nội bộ trong service layer
export interface OrderProductApiResponse {
  name: string
  imageUrl?: string | null
}

export interface OrderItemApiResponse {
  productId: number
  quantity: number
  unitPrice: number
  size?: string | null
  color?: string | null
  product?: OrderProductApiResponse | null
}

export interface OrderApiResponse {
  id: number
  orderNumber: string
  status: number
  totalPrice: number
  createdAt: string
  items: OrderItemApiResponse[]
}
