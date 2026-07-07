const PAYMENT_OPTIONS = ['COD', 'Banking', 'Momo']

interface OrderPaymentFilterProps {
  value: string
  onChange: (next: string) => void
}

export default function OrderPaymentFilter({ value, onChange }: OrderPaymentFilterProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        aria-label="Lọc theo phương thức thanh toán"
        className="bg-transparent border border-outline-variant px-4 py-2 font-body text-label-md uppercase tracking-wider text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer"
      >
        <option value="">Tất cả thanh toán</option>
        {PAYMENT_OPTIONS.map((option) => (
          <option key={option} value={option}>
            {option}
          </option>
        ))}
      </select>
    </div>
  )
}
