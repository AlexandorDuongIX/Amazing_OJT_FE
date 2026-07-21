export type AdminOrderStatus = 'Pending' | 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled' | 'Returned'

export const STATUS_FROM_NUMBER: Record<number, AdminOrderStatus> = {
  0: 'Pending',
  1: 'Processing',
  2: 'Shipped',
  3: 'Delivered',
  4: 'Cancelled',
  5: 'Returned',
}

export const STATUS_TO_NUMBER: Record<AdminOrderStatus, number> = {
  Pending: 0,
  Processing: 1,
  Shipped: 2,
  Delivered: 3,
  Cancelled: 4,
  Returned: 5,
}

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
  orderNumber: string
  createdAt: string
  status: AdminOrderStatus
  customer: AdminOrderCustomer
  items: AdminOrderItem[]
  total: number
}

// Raw shapes trả về từ backend (không có DTO, đây là entity thô) — chỉ dùng nội bộ trong service layer
export interface OrderUserApiResponse {
  firstName: string
  lastName: string
  email: string
  phoneNumber?: string | null
}

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
  shippingAddress?: string | null
  city?: string | null
  state?: string | null
  postalCode?: string | null
  country?: string | null
  phoneNumber?: string | null
  createdAt: string
  user?: OrderUserApiResponse | null
  items: OrderItemApiResponse[]
}
