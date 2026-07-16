import { useEffect } from 'react'
import { useCartStore } from '../pages/customer/cart/cartStore'

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

export default function CartToast() {
  const { toast, hideToast } = useCartStore()

  useEffect(() => {
    if (!toast.visible) return
    const timer = setTimeout(hideToast, 3000)
    return () => clearTimeout(timer)
  }, [toast.visible, hideToast])

  return (
    <div
      className={`fixed top-[90px] right-4 md:right-6 z-50 w-[300px] bg-surface-container-lowest border border-[#E8E8E8] rounded-[3px] shadow-[0px_4px_12px_rgba(0,0,0,0.08)] overflow-hidden transition-transform duration-300 ${
        toast.visible ? 'translate-x-0' : 'translate-x-[120%]'
      }`}
    >
      {/* Accent bar */}
      <div className="h-[3px] w-full bg-[#D4AF37]" />

      {/* Content */}
      <div className="flex gap-3 px-4 pt-[14px] pb-4">
        {/* Thumbnail */}
        <div className="w-12 h-[60px] shrink-0 bg-surface-container-low rounded-[2px] overflow-hidden">
          <img
            src={toast.productImage || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22150%22%20height%3D%22150%22%20viewBox%3D%220%200%20150%20150%22%3E%3Crect%20width%3D%22150%22%20height%3D%22150%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%2275%22%20y%3D%2275%22%20font-family%3D%22sans-serif%22%20font-size%3D%2214%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'}
            alt={toast.productName}
            className="w-full h-full object-cover"
          />
        </div>

        {/* Info */}
        <div className="flex flex-col gap-[3px] flex-1 min-w-0">
          <span className="font-label text-[10px] text-[#D4AF37] uppercase tracking-[0.1em]">
            Đã thêm vào giỏ hàng
          </span>
          <p className="font-headline text-[13px] text-on-surface leading-snug line-clamp-2">
            {toast.productName}
          </p>
          <span className="font-body text-[11px] text-on-surface-variant">
            {formatVND(toast.productPrice)}
          </span>
        </div>

        {/* Close */}
        <button
          onClick={hideToast}
          className="text-[#CCCCCC] hover:text-on-surface-variant transition-colors cursor-pointer shrink-0 self-start mt-[2px]"
          aria-label="Đóng"
        >
          <span className="text-[13px] leading-none">✕</span>
        </button>
      </div>

      {/* Progress bar */}
      {toast.visible && (
        <div className="mx-4 mb-[14px] h-[2px] bg-[#F0F0F0] rounded-full overflow-hidden">
          <div
            className="h-full bg-[#D4AF37] rounded-full"
            style={{ animation: 'toast-progress 3s linear forwards' }}
          />
        </div>
      )}
    </div>
  )
}
