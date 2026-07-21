import axiosClient from './axiosClient'
import type { AdminOrder, AdminOrderStatus, OrderApiResponse } from '../types/adminOrder'
import { STATUS_FROM_NUMBER, STATUS_TO_NUMBER } from '../types/adminOrder'

const mapToAdminOrder = (raw: OrderApiResponse): AdminOrder => {
  const user = raw.user
  const address = [raw.shippingAddress, raw.city, raw.state, raw.postalCode, raw.country]
    .filter(Boolean)
    .join(', ')

  return {
    id: String(raw.id),
    orderNumber: raw.orderNumber,
    createdAt: raw.createdAt,
    status: STATUS_FROM_NUMBER[raw.status] ?? 'Pending',
    customer: {
      name: user ? `${user.firstName} ${user.lastName}`.trim() : '',
      email: user?.email ?? '',
      phone: raw.phoneNumber ?? user?.phoneNumber ?? '',
      address,
    },
    items: raw.items.map((item) => ({
      productId: String(item.productId),
      name: item.product?.name ?? '',
      image: item.product?.imageUrl ?? '',
      price: item.unitPrice,
      quantity: item.quantity,
      size: item.size ?? undefined,
      color: item.color ?? undefined,
    })),
    total: raw.totalPrice,
  }
}

export const getAllOrders = async (): Promise<AdminOrder[]> => {
  const response = await axiosClient.get<OrderApiResponse[]>('/orders')
  const data = (response as any).data || response
  return (data as OrderApiResponse[]).map(mapToAdminOrder)
}

export const getOrderById = async (id: number): Promise<AdminOrder> => {
  const response = await axiosClient.get<OrderApiResponse>(`/orders/${id}`)
  const data = (response as any).data || response
  return mapToAdminOrder(data as OrderApiResponse)
}

export const updateOrderStatus = async (id: number, status: AdminOrderStatus): Promise<AdminOrder> => {
  const response = await axiosClient.put<OrderApiResponse>(`/orders/${id}/status`, {
    status: STATUS_TO_NUMBER[status],
  })
  const data = (response as any).data || response
  return mapToAdminOrder(data as OrderApiResponse)
}
