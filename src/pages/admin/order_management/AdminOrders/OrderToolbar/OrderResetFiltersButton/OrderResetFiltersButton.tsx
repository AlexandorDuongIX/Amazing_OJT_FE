interface OrderResetFiltersButtonProps {
  onReset: () => void
}

export default function OrderResetFiltersButton({ onReset }: OrderResetFiltersButtonProps) {
  return (
    <button
      onClick={onReset}
      aria-label="Đặt lại bộ lọc"
      className="flex items-center gap-2 bg-gold text-on-primary px-4 py-2 font-label text-label-md uppercase tracking-wider hover:opacity-90 transition-opacity cursor-pointer"
    >
      <span className="material-symbols-outlined text-[18px]">refresh</span>
      Đặt lại
    </button>
  )
}
