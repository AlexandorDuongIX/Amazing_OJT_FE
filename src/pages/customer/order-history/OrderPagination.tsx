interface OrderPaginationProps {
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function OrderPagination({ currentPage, totalPages, onPageChange }: OrderPaginationProps) {
  return (
    <div className="flex justify-center items-center gap-2 pt-8">
      <button
        onClick={() => onPageChange(currentPage - 1)}
        disabled={currentPage === 1}
        className="w-8 h-8 flex items-center justify-center rounded-[4px] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
        aria-label="Trang trước"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M10 12L6 8L10 4" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>

      {Array.from({ length: totalPages }, (_, i) => i + 1).map(page => (
        <button
          key={page}
          onClick={() => onPageChange(page)}
          className={`w-8 h-8 flex items-center justify-center rounded-[4px] font-label text-[14px] cursor-pointer transition-colors ${
            page === currentPage
              ? 'bg-gold text-white'
              : 'bg-white border border-divider text-on-background hover:bg-surface-container'
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
        className="w-8 h-8 flex items-center justify-center rounded-[4px] disabled:opacity-30 cursor-pointer disabled:cursor-not-allowed hover:bg-surface-container transition-colors"
        aria-label="Trang tiếp"
      >
        <svg width="16" height="16" viewBox="0 0 16 16" fill="none" xmlns="http://www.w3.org/2000/svg">
          <path d="M6 4L10 8L6 12" stroke="currentColor" strokeWidth="1.5" strokeLinecap="round" strokeLinejoin="round" />
        </svg>
      </button>
    </div>
  )
}
