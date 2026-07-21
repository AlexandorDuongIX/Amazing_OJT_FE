import type { Order } from '@/types/order'
import OrderStatusBadge from '../../../components/OrderStatusBadge'

interface OrderDetailModalProps {
  order: Order | null
  onClose: () => void
}

export default function OrderDetailModal({ order, onClose }: OrderDetailModalProps) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-black/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest border border-divider w-full max-w-[560px] max-h-[85vh] overflow-y-auto p-8 rounded-[10px]">
        <div className="flex items-start justify-between mb-6">
          <div className="flex flex-col gap-1">
            <span className="font-label text-[16px] font-bold text-on-background">{order.orderNumber}</span>
            <span className="font-label text-[14px] text-muted">Ngày đặt: {order.date}</span>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-muted hover:text-on-background transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6">
          <OrderStatusBadge status={order.status} />
        </div>

        <div className="flex flex-col gap-5 max-h-[320px] overflow-y-auto pb-6 border-b border-divider">
          {order.items.map((item, index) => (
            <div key={index} className="flex flex-row gap-6 items-center">
              <img
                src={item.image}
                alt={item.name}
                className="w-16 h-16 rounded-[4px] object-cover flex-shrink-0"
              />
              <div className="flex-1 min-w-0">
                <p className="font-label text-[16px] text-on-background truncate">{item.name}</p>
                <p className="font-label text-[12px] font-medium text-muted tracking-[0.6px]">
                  {item.price.toLocaleString('vi-VN')} ₫
                </p>
              </div>
              <span className="font-label text-[14px] text-muted flex-shrink-0">x{item.quantity}</span>
            </div>
          ))}
        </div>

        <div className="flex justify-between items-center pt-4">
          <span className="font-label text-[14px] text-muted">Tổng tiền:</span>
          <span className="font-label text-[20px] font-bold text-on-background">
            {order.total.toLocaleString('vi-VN')} ₫
          </span>
        </div>
      </div>
    </div>
  )
}
