import type { AdminOrderStatus } from '@/types/adminOrder'

interface OrderStatusSelectProps {
  status: AdminOrderStatus
  onChange: (next: AdminOrderStatus) => void
}

const STATUS_OPTIONS: AdminOrderStatus[] = ['Pending', 'Processing', 'Shipped', 'Delivered', 'Cancelled', 'Returned']

export const STATUS_LABELS: Record<AdminOrderStatus, string> = {
  Pending: 'Chờ xử lý',
  Processing: 'Đang xử lý',
  Shipped: 'Đã giao vận',
  Delivered: 'Đã giao hàng',
  Cancelled: 'Đã hủy',
  Returned: 'Trả hàng',
}

const SELECT_STYLES: Record<AdminOrderStatus, string> = {
  Pending: 'bg-surface-variant text-on-surface-variant',
  Processing: 'bg-secondary-container text-on-secondary-container',
  Shipped: 'bg-tertiary text-on-tertiary',
  Delivered: 'bg-gold-subtle text-secondary',
  Cancelled: 'bg-error-subtle text-error',
  Returned: 'bg-error-subtle text-error',
}

export default function OrderStatusSelect({ status, onChange }: OrderStatusSelectProps) {
  return (
    <select
      value={status}
      onChange={(e) => {
        e.stopPropagation()
        onChange(e.target.value as AdminOrderStatus)
      }}
      onClick={(e) => e.stopPropagation()}
      aria-label="Đổi trạng thái đơn hàng"
      className={`px-3 py-1 text-caption font-bold uppercase tracking-wider border-none focus:outline-none cursor-pointer ${SELECT_STYLES[status]}`}
    >
      {STATUS_OPTIONS.map((option) => (
        <option key={option} value={option} className="bg-surface text-on-surface normal-case font-normal">
          {STATUS_LABELS[option]}
        </option>
      ))}
    </select>
  )
}
