import { ChevronLeft, ChevronRight } from 'lucide-react'

interface ProductPaginationProps {
  page: number
  pageSize: number
  totalItems: number
  onPageChange: (page: number) => void
}

export default function ProductPagination({ page, pageSize, totalItems, onPageChange }: ProductPaginationProps) {
  const totalPages = Math.max(1, Math.ceil(totalItems / pageSize))
  const start = totalItems === 0 ? 0 : (page - 1) * pageSize + 1
  const end = Math.min(page * pageSize, totalItems)

  return (
    <div className="flex flex-col gap-4 border-t border-[#c4c7c7]/30 bg-[#f5f3f3] px-5 py-6 text-xs uppercase tracking-[0.12em] text-[#444748] sm:flex-row sm:items-center sm:justify-between sm:px-8">
      <p>Hiển thị {start} - {end} của {totalItems.toLocaleString('vi-VN')} sản phẩm</p>
      <div className="flex items-center gap-2">
        <button
          type="button"
          aria-label="Previous page"
          disabled={page <= 1}
          onClick={() => onPageChange(page - 1)}
          className="grid size-10 place-items-center border border-[#c4c7c7] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-black"
        >
          <ChevronLeft size={16} />
        </button>
        <span aria-current="page" className="grid size-10 place-items-center bg-black font-bold text-white">{page}</span>
        <span className="px-2 normal-case tracking-normal text-[#747878]">of {totalPages}</span>
        <button
          type="button"
          aria-label="Next page"
          disabled={page >= totalPages}
          onClick={() => onPageChange(page + 1)}
          className="grid size-10 place-items-center border border-[#c4c7c7] disabled:cursor-not-allowed disabled:opacity-40 focus-visible:outline-2 focus-visible:outline-black"
        >
          <ChevronRight size={16} />
        </button>
      </div>
    </div>
  )
}
