import { Link } from 'react-router-dom'

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

interface CartSummaryProps {
  total: number
  selectedCount: number
}

export default function CartSummary({ total, selectedCount }: CartSummaryProps) {
  return (
    <div className="w-[320px] shrink-0 border border-primary-fixed p-8 flex flex-col gap-5">
      <h2 className="font-headline text-[24px] text-on-surface">Đơn hàng</h2>

      <div className="flex justify-between items-center">
        <span className="font-label text-[13px] text-on-surface-variant">
          Tổng cộng ({selectedCount} sp)
        </span>
        <span className="font-label font-semibold text-[18px] text-on-surface tracking-[-0.4px]">
          {formatVND(total)}
        </span>
      </div>

      <p className="font-body italic text-[11px] text-on-surface-variant text-center leading-relaxed">
        Giá tiền chưa bao gồm phí vận chuyển và chưa áp dụng mã giảm giá
      </p>

      <div className="flex flex-col gap-3 pt-2">
        <Link
          to="/checkout"
          aria-disabled={selectedCount === 0}
          className={`w-full h-[52px] flex items-center justify-center font-label text-[12px] uppercase tracking-[0.15em] transition-all ${
            selectedCount > 0
              ? 'bg-[#D4AF37] text-on-surface hover:brightness-95 cursor-pointer'
              : 'bg-surface-container text-on-surface-variant pointer-events-none'
          }`}
        >
          THANH TOÁN
        </Link>
        <Link
          to="/collections/all"
          className="w-full h-[52px] border border-on-surface flex items-center justify-center font-label text-[12px] uppercase tracking-[0.15em] text-on-surface hover:bg-surface-container-low transition-colors cursor-pointer"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    </div>
  )
}
