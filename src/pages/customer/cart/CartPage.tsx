import { useState } from 'react'
import { Link } from 'react-router-dom'
import { useCartStore } from './cartStore'
import type { CartItem } from './types'
import CartPageItem from './CartPageItem'
import CartSummary from './CartSummary'

const itemKey = (item: CartItem) => `${item.id}-${item.size}-${item.color}`

export default function CartPage() {
  const { items, removeItem, updateQuantity } = useCartStore()
  const [deselectedKeys, setDeselectedKeys] = useState<Set<string>>(new Set())

  const isSelected = (key: string) => !deselectedKeys.has(key)

  const handleToggleAll = () => {
    const allSelected = items.length > 0 && items.every(i => isSelected(itemKey(i)))
    if (allSelected) {
      setDeselectedKeys(new Set(items.map(itemKey)))
    } else {
      setDeselectedKeys(new Set())
    }
  }

  const handleToggleItem = (key: string) => {
    setDeselectedKeys(prev => {
      const next = new Set(prev)
      if (next.has(key)) next.delete(key)
      else next.add(key)
      return next
    })
  }

  const selectedItems = items.filter(i => isSelected(itemKey(i)))
  const total = selectedItems.reduce((sum, i) => sum + i.price * i.quantity, 0)
  const selectedCount = selectedItems.length
  const allSelected = items.length > 0 && selectedCount === items.length

  if (items.length === 0) {
    return (
      <div className="max-w-[1440px] mx-auto px-margin-desktop py-section-gap text-center">
        <h1 className="font-headline text-[48px] text-on-surface mb-6">Giỏ hàng</h1>
        <p className="font-body text-[16px] text-on-surface-variant mb-10">
          Giỏ hàng của bạn đang trống.
        </p>
        <Link
          to="/collections/all"
          className="inline-flex items-center justify-center h-[52px] px-10 border border-on-surface font-label text-[12px] uppercase tracking-[0.15em] text-on-surface hover:bg-surface-container-low transition-colors"
        >
          TIẾP TỤC MUA SẮM
        </Link>
      </div>
    )
  }

  return (
    <div className="max-w-[1440px] mx-auto px-margin-desktop py-section-gap">
      <h1 className="font-headline text-[48px] text-on-surface mb-12">Giỏ hàng</h1>

      <div className="flex gap-10 items-start">
        {/* Left: product list */}
        <div className="flex-1 min-w-0">
          {/* Column headers */}
          <div className="grid grid-cols-[40px_1fr_140px_120px] items-center border-b border-primary-fixed pb-3">
            <button
              onClick={handleToggleAll}
              className={`w-5 h-5 border flex items-center justify-center cursor-pointer transition-colors ${allSelected ? 'bg-on-surface border-on-surface' : 'border-on-surface bg-transparent'
                }`}
              aria-label={allSelected ? 'Bỏ chọn tất cả' : 'Chọn tất cả'}
            >
              {allSelected && (
                <span className="text-on-primary text-[10px] leading-none select-none">✓</span>
              )}
            </button>
            <span className="font-label text-[12px] uppercase text-on-primary-container tracking-[0.05em]">
              SẢN PHẨM
            </span>
            <span className="font-label text-[12px] uppercase text-on-primary-container tracking-[0.05em] text-center">
              SỐ LƯỢNG
            </span>
            <span className="font-label text-[12px] uppercase text-on-primary-container tracking-[0.05em] text-right">
              THÀNH TIỀN
            </span>
          </div>

          {/* Items */}
          {items.map((item) => {
            const key = itemKey(item)
            return (
              <CartPageItem
                key={key}
                item={item}
                checked={isSelected(key)}
                onToggle={() => handleToggleItem(key)}
                onUpdateQty={(qty) => updateQuantity(item.id, item.size, item.color, qty)}
                onRemove={() => removeItem(item.id, item.size, item.color)}
              />
            )
          })}
        </div>

        <CartSummary total={total} selectedCount={selectedCount} />
      </div>
    </div>
  )
}
