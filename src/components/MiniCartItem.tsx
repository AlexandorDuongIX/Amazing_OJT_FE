import { useState } from 'react'
import type { CartItem } from '../types/cart'
import ConfirmDialog from './ConfirmDialog'

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

interface Props {
  item: CartItem
  onRemove: () => void
  onUpdateQty: (qty: number) => void
}

export default function MiniCartItem({ item, onRemove, onUpdateQty }: Props) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="flex gap-4 items-start relative">
      {/* Product image */}
      <div className="w-[72px] h-[90px] bg-surface-container-low shrink-0 overflow-hidden flex items-center justify-center">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-full h-full object-cover mix-blend-multiply"
        />
      </div>

      {/* Info */}
      <div className="flex flex-1 flex-col py-1 min-w-0 self-stretch">
        <p className="font-headline font-normal text-[14px] leading-[17.5px] text-on-surface mb-1">
          {item.name}
        </p>
        <p className="font-body font-normal text-[11px] leading-[16.5px] text-on-surface-variant mb-auto">
          Size: {item.size} / Màu: {item.color}
        </p>

        <div className="flex items-end justify-between mt-3">
          {/* Quantity stepper */}
          <div className="flex items-center h-[28px] w-[80px] border border-outline-variant">
            <button
              className="flex-1 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => item.quantity === 1 ? setShowConfirm(true) : onUpdateQty(item.quantity - 1)}
              aria-label="Giảm số lượng"
            >
              <span className="text-on-surface text-[16px] leading-none select-none">−</span>
            </button>
            <div className="flex-1 h-full flex items-center justify-center border-x border-outline-variant">
              <span className="font-label font-medium text-[12px] text-on-surface leading-[18px]">
                {item.quantity}
              </span>
            </div>
            <button
              className="flex-1 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
              onClick={() => onUpdateQty(item.quantity + 1)}
              aria-label="Tăng số lượng"
            >
              <span className="text-on-surface text-[16px] leading-none select-none">+</span>
            </button>
          </div>

          {/* Price */}
          <span className="font-label font-semibold text-[14px] text-on-surface tracking-[-0.35px] leading-[21px]">
            {formatVND(item.price * item.quantity)}
          </span>
        </div>
      </div>

      {/* Delete button */}
      <button
        className="absolute right-0 top-0 p-1 text-on-surface-variant hover:text-on-surface transition-colors cursor-pointer"
        onClick={() => setShowConfirm(true)}
        aria-label="Xóa sản phẩm"
      >
        <span className="material-symbols-outlined text-[16px]">delete</span>
      </button>

      <ConfirmDialog
        isOpen={showConfirm}
        productName={item.name}
        onConfirm={() => { setShowConfirm(false); onRemove() }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}
