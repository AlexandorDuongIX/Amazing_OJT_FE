import axiosClient from './axiosClient'
import type { Order, OrderApiResponse } from '../types/order'
import { STATUS_FROM_NUMBER } from '../types/order'

const formatOrderDate = (iso: string) => {
  const date = new Date(iso)
  if (Number.isNaN(date.getTime())) return iso
  return date.toLocaleDateString('vi-VN', { day: '2-digit', month: '2-digit', year: 'numeric' })
}

const mapToOrder = (raw: OrderApiResponse): Order => ({
  id: String(raw.id),
  orderNumber: raw.orderNumber,
  date: formatOrderDate(raw.createdAt),
  status: STATUS_FROM_NUMBER[raw.status] ?? 'Pending',
  items: raw.items.map((item) => ({
    name: item.product?.name ?? '',
    image: item.product?.imageUrl ?? '',
    price: item.unitPrice,
    quantity: item.quantity,
  })),
  total: raw.totalPrice,
})

export const getMyOrders = async (): Promise<Order[]> => {
  const response = await axiosClient.get<OrderApiResponse[]>('/orders/my')
  const data = (response as any).data || response
  return (data as OrderApiResponse[]).map(mapToOrder)
}
