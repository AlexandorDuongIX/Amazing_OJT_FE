export type OrderSortOption = 'newest' | 'oldest' | 'total-desc' | 'total-asc'

interface OrderSortSelectProps {
  value: OrderSortOption
  onChange: (next: OrderSortOption) => void
}

const SORT_OPTIONS: { value: OrderSortOption; label: string }[] = [
  { value: 'newest', label: 'Mới nhất' },
  { value: 'oldest', label: 'Cũ nhất' },
  { value: 'total-desc', label: 'Tổng tiền: Cao → Thấp' },
  { value: 'total-asc', label: 'Tổng tiền: Thấp → Cao' },
]

export default function OrderSortSelect({ value, onChange }: OrderSortSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value as OrderSortOption)}
        aria-label="Sắp xếp đơn hàng"
        className="bg-transparent border border-outline-variant px-4 py-2 font-body text-label-md uppercase tracking-wider text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer"
      >
        {SORT_OPTIONS.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}
