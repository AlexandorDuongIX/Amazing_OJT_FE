import type { OrderStatus } from '@/types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

export const STATUS_LABELS: Record<OrderStatus, string> = {
  Pending: 'Chờ xử lý',
  Processing: 'Đang xử lý',
  Shipped: 'Đã giao vận',
  Delivered: 'Đã giao',
  Cancelled: 'Đã hủy',
  Returned: 'Trả hàng/Hoàn tiền',
}

const statusStyles: Record<OrderStatus, string> = {
  Pending: 'bg-surface-variant text-on-surface-variant',
  Processing: 'bg-surface-variant text-on-surface-variant',
  Shipped: 'bg-info-subtle text-info',
  Delivered: 'bg-gold-subtle text-secondary',
  Cancelled: 'bg-error-subtle text-error',
  Returned: 'bg-info-subtle text-info',
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`${statusStyles[status]} rounded-full px-3 py-1 font-label text-[12px] font-bold whitespace-nowrap`}>
      {STATUS_LABELS[status]}
    </span>
  )
}
