export type AdminOrderStatus = 'Pending' | 'Confirmed' | 'Shipping' | 'Delivered' | 'Cancelled'

export interface AdminOrderItem {
  productId: string
  name: string
  image: string
  price: number
  quantity: number
  size?: string
  color?: string
}

export interface AdminOrderCustomer {
  name: string
  email: string
  phone: string
  address: string
}

export interface AdminOrder {
  id: string
  createdAt: string
  status: AdminOrderStatus
  customer: AdminOrderCustomer
  paymentMethod: string
  items: AdminOrderItem[]
  total: number
}
