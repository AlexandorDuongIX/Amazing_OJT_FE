import type { AdminOrderItem } from '@/types/adminOrder'

interface OrderItemsListProps {
  items: AdminOrderItem[]
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

export default function OrderItemsList({ items }: OrderItemsListProps) {
  return (
    <div>
      <p className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-3">
        Sản phẩm trong đơn
      </p>
      <div className="space-y-4 max-h-[280px] overflow-y-auto pr-1">
        {items.map((item) => (
          <div key={`${item.productId}-${item.size}-${item.color}`} className="flex items-center gap-4">
            <img
              src={item.image}
              alt={item.name}
              className="w-16 h-20 object-cover bg-surface-container-low flex-shrink-0"
            />
            <div className="flex-1">
              <p className="font-body text-[14px] font-semibold text-primary">{item.name}</p>
              <p className="font-body text-[12px] text-on-surface-variant">
                {[item.size, item.color].filter(Boolean).join(' / ')} · SL: {item.quantity}
              </p>
            </div>
            <p className="font-body text-[14px] font-semibold text-primary">{formatVND(item.price)}</p>
          </div>
        ))}
      </div>
    </div>
  )
}
