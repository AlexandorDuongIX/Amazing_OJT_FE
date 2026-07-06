interface OrderSearchInputProps {
  value: string
  onChange: (next: string) => void
}

export default function OrderSearchInput({ value, onChange }: OrderSearchInputProps) {
  return (
    <div className="relative">
      <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-on-surface-variant">
        search
      </span>
      <input
        type="text"
        value={value}
        onChange={(e) => onChange(e.target.value)}
        placeholder="Tìm mã đơn / tên khách hàng"
        aria-label="Tìm kiếm đơn hàng"
        className="bg-transparent border border-outline-variant pl-9 pr-4 py-2 font-body text-body-md text-on-surface placeholder:text-on-surface-variant focus:outline-none focus:border-primary w-full md:w-[260px]"
      />
    </div>
  )
}
