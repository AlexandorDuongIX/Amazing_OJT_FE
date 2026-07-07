interface OrderPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function OrderPagination({ currentPage, totalPages, onPageChange }: OrderPaginationProps) {
  if (totalPages <= 1) return null

  return (
    <div className="flex justify-center items-center gap-2 py-6">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
        aria-label="Trang trước"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_left</span>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map((page) => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center font-label text-[13px] cursor-pointer transition-colors ${
            page === currentPage
              ? 'bg-gold text-on-primary'
              : 'border border-outline-variant text-on-surface-variant hover:bg-surface-container-low'
          }`}
          aria-label={`Trang ${page}`}
          aria-current={page === currentPage ? 'page' : undefined}
        >
          {page}
        </button>
      ))}

      <button
        onClick={() => onPageChange(currentPage + 1)}
        disabled={currentPage === totalPages}
        className="w-8 h-8 flex items-center justify-center disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container-low transition-colors"
        aria-label="Trang tiếp"
      >
        <span className="material-symbols-outlined text-[18px]">chevron_right</span>
      </button>
    </div>
  )
}
