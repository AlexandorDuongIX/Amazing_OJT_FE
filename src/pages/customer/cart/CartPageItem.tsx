import { useState } from 'react'
import type { CartItem } from '../../../types/cart'
import ConfirmDialog from '../../../components/ConfirmDialog'

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

interface CartPageItemProps {
  item: CartItem
  checked: boolean
  onToggle: () => void
  onUpdateQty: (qty: number) => void
  onRemove: () => void
}

export default function CartPageItem({ item, checked, onToggle, onUpdateQty, onRemove }: CartPageItemProps) {
  const [showConfirm, setShowConfirm] = useState(false)

  return (
    <div className="grid grid-cols-[40px_1fr_140px_120px] items-center border-b border-primary-fixed py-6">
      {/* Checkbox */}
      <button
        onClick={onToggle}
        className={`w-5 h-5 border flex items-center justify-center cursor-pointer transition-colors ${
          checked ? 'bg-on-surface border-on-surface' : 'border-on-surface bg-transparent'
        }`}
        aria-label={checked ? 'Bỏ chọn sản phẩm' : 'Chọn sản phẩm'}
      >
        {checked && (
          <span className="text-on-primary text-[10px] leading-none select-none">✓</span>
        )}
      </button>

      {/* Product info */}
      <div className="flex gap-4 items-start pr-6">
        <img
          src={item.imageUrl}
          alt={item.name}
          className="w-20 h-[90px] object-cover rounded-[2px] shrink-0"
        />
        <div className="flex flex-col pt-1 min-w-0">
          <p className="font-headline text-[15px] text-on-surface leading-snug mb-1">
            {item.name}
          </p>
          <p className="font-label text-[11px] uppercase text-on-primary-container tracking-[0.05em] mb-1">
            Size: {item.size} / Màu: {item.color}
          </p>
          <p className="font-label text-[12px] text-on-primary-container mb-2">
            {formatVND(item.price)}
          </p>
          <button
            onClick={() => setShowConfirm(true)}
            className="font-label text-[11px] uppercase text-on-primary-container underline self-start hover:text-on-surface transition-colors cursor-pointer"
          >
            XÓA
          </button>
        </div>
      </div>

      {/* Quantity stepper */}
      <div className="flex justify-center">
        <div className="flex items-center h-8 border border-outline-variant">
          <button
            className="w-8 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
            onClick={() => item.quantity === 1 ? setShowConfirm(true) : onUpdateQty(item.quantity - 1)}
            aria-label="Giảm số lượng"
          >
            <span className="font-label text-[16px] text-on-surface leading-none select-none">−</span>
          </button>
          <div className="w-8 h-full flex items-center justify-center border-x border-outline-variant">
            <span className="font-label text-[12px] text-on-surface">{item.quantity}</span>
          </div>
          <button
            className="w-8 h-full flex items-center justify-center hover:bg-surface-container-low transition-colors cursor-pointer"
            onClick={() => onUpdateQty(item.quantity + 1)}
            aria-label="Tăng số lượng"
          >
            <span className="font-label text-[16px] text-on-surface leading-none select-none">+</span>
          </button>
        </div>
      </div>

      {/* Price */}
      <div className="text-right">
        <span className="font-label font-medium text-[14px] text-on-surface">
          {formatVND(item.price * item.quantity)}
        </span>
      </div>

      <ConfirmDialog
        isOpen={showConfirm}
        productName={item.name}
        onConfirm={() => { setShowConfirm(false); onRemove() }}
        onCancel={() => setShowConfirm(false)}
      />
    </div>
  )
}
