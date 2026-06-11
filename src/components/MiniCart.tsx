import { Link } from 'react-router-dom'
import { useCartStore } from '../store/cartStore'
import MiniCartItem from './MiniCartItem'

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

export default function MiniCart() {
  const { items, isOpen, closeCart, removeItem, updateQuantity } = useCartStore()

  const totalItems = items.reduce((sum, i) => sum + i.quantity, 0)
  const totalPrice = items.reduce((sum, i) => sum + i.price * i.quantity, 0)

  if (!isOpen) return null

  return (
    <>
      {/* Backdrop */}
      <div className="fixed inset-0 z-30" onClick={closeCart} />

      {/* Panel */}
      <div className="fixed top-[80px] right-0 md:right-20 z-40 w-[380px] max-w-[calc(100vw-8px)] bg-surface-container-lowest border border-primary-fixed shadow-[0px_8px_16px_rgba(0,0,0,0.12)] flex flex-col">
        {/* Header */}
        <div className="flex items-baseline justify-between px-6 py-5 border-b border-primary-fixed shrink-0">
          <span className="font-label font-semibold text-[12px] text-on-surface uppercase tracking-[3px]">
            GIỎ HÀNG
          </span>
          <span className="font-body font-normal text-[16px] text-on-surface-variant tracking-[0.16px]">
            ({totalItems} sản phẩm)
          </span>
        </div>

        {/* Item list */}
        <div className="overflow-auto max-h-[420px] px-6 flex flex-col divide-y divide-primary-fixed">
          {items.length === 0 ? (
            <p className="text-center text-on-surface-variant py-10 text-[14px] font-body">
              Giỏ hàng trống
            </p>
          ) : (
            items.map((item) => (
              <div key={`${item.id}-${item.size}-${item.color}`} className="py-4">
                <MiniCartItem
                  item={item}
                  onRemove={() => removeItem(item.id, item.size, item.color)}
                  onUpdateQty={(qty) => updateQuantity(item.id, item.size, item.color, qty)}
                />
              </div>
            ))
          )}
        </div>

        {/* Sticky footer */}
        <div className="border-t border-primary-fixed px-6 pt-[25px] pb-6 flex flex-col gap-2 shrink-0">
          {/* Subtotal */}
          <div className="flex items-center justify-between">
            <span className="font-body font-normal text-[13px] text-on-surface-variant leading-[19.5px]">
              Tạm tính
            </span>
            <span className="font-label font-semibold text-[16px] text-on-surface tracking-[-0.4px] leading-[24px]">
              {formatVND(totalPrice)}
            </span>
          </div>

          {/* Free shipping note */}
          <p className="font-body italic font-normal text-[10px] text-on-surface-variant text-center leading-[15px]">
            Giá tiền chưa bao gồm phí vận chuyển và chưa áp dụng mã
            giảm giá
          </p>

          {/* Action buttons */}
          <div className="flex flex-col gap-3 pt-3">
            <button className="w-full h-[48px] bg-[#d4af37] flex items-center justify-center font-label font-semibold text-[12px] text-on-surface uppercase tracking-[1px] hover:brightness-95 transition-all cursor-pointer">
              THANH TOÁN
            </button>
            <Link
              to="/cart"
              onClick={closeCart}
              className="w-full h-[48px] border border-on-surface flex items-center justify-center font-label font-semibold text-[12px] text-on-surface uppercase tracking-[1px] hover:bg-surface-container-low transition-colors"
            >
              XEM GIỎ HÀNG
            </Link>
          </div>
        </div>
      </div>
    </>
  )
}
