import type { AdminOrderStatus } from '@/types/adminOrder'

interface OrderStatusBadgeProps {
  status: AdminOrderStatus
}

const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  Pending: 'Pending',
  Confirmed: 'Confirmed',
  Shipping: 'Shipping',
  Delivered: 'Delivered',
  Cancelled: 'Cancelled',
}

const STATUS_STYLES: Record<AdminOrderStatus, string> = {
  Pending: 'bg-surface-variant text-on-surface-variant',
  Confirmed: 'bg-secondary-container text-on-secondary-container',
  Shipping: 'bg-tertiary text-on-tertiary',
  Delivered: 'bg-gold-subtle text-secondary',
  Cancelled: 'bg-error-subtle text-error',
}

export default function OrderStatusBadge({ status }: OrderStatusBadgeProps) {
  return (
    <span
      className={`inline-block px-3 py-1 text-caption font-bold uppercase tracking-wider ${STATUS_STYLES[status]}`}
    >
      {STATUS_LABELS[status]}
    </span>
  )
}
