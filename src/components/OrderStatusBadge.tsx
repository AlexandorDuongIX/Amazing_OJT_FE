import type { OrderStatus } from '@/types/order'

interface OrderStatusBadgeProps {
  status: OrderStatus
}

const statusStyles: Record<OrderStatus, string> = {
  'Đã giao': 'bg-gold-subtle text-secondary',
  'Đang xử lý': 'bg-surface-variant text-on-surface-variant',
  'Đã hủy': 'bg-error-subtle text-error',
  'Trả hàng/Hoàn tiền': 'bg-info-subtle text-info',
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span className={`${statusStyles[status]} rounded-full px-3 py-1 font-label text-[12px] font-bold whitespace-nowrap`}>
      {status}
    </span>
  )
}
