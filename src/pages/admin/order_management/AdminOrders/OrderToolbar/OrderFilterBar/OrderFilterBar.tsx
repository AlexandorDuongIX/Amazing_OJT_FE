import type { AdminOrderStatus } from '@/types/adminOrder'

interface OrderFilterBarProps {
  value: AdminOrderStatus | ''
  onChange: (next: AdminOrderStatus | '') => void
}

const STATUS_OPTIONS: { value: AdminOrderStatus; label: string }[] = [
  { value: 'Pending', label: 'Pending' },
  { value: 'Confirmed', label: 'Confirmed' },
  { value: 'Shipping', label: 'Shipping' },
  { value: 'Delivered', label: 'Delivered' },
  { value: 'Cancelled', label: 'Cancelled' },
]

export default function OrderFilterBar({ value, onChange }: OrderFilterBarProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as AdminOrderStatus | '')}
        aria-label="Lọc theo trạng thái"
        className="bg-transparent border border-outline-variant px-4 py-2 font-body text-label-md uppercase tracking-wider text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer"
      >
        <option value="">Tất cả trạng thái</option>
        {STATUS_OPTIONS.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}
