import type { Order } from '@/types/order'
import OrderStatusBadge from '../../../components/OrderStatusBadge'

interface OrderCardProps {
  order: Order
  onViewDetail: (order: Order) => void
}

export default function OrderCard({ order, onViewDetail }: OrderCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-divider rounded-[10px] p-[29px] flex flex-col gap-6 shadow-[0px_10px_15px_rgba(0,0,0,0.04)]">
      {/* Header */}
      <div className="flex justify-between items-start border-b border-divider pb-4">
        <div className="flex flex-col gap-1">
          <span className="font-label text-[16px] font-bold text-on-background">{order.orderNumber}</span>
          <span className="font-label text-[14px] text-muted">Ngày đặt: {order.date}</span>
        </div>
        <OrderStatusBadge status={order.status} />
      </div>

      {/* Products */}
      <div className="flex flex-col gap-5 max-h-[320px] overflow-y-auto">
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

      {/* Footer */}
      <div className="flex justify-between items-center border-t border-divider pt-4">
        <div className="flex items-center gap-2">
          <span className="font-label text-[14px] text-muted">Tổng tiền:</span>
          <span className="font-label text-[20px] font-bold text-on-background">
            {order.total.toLocaleString('vi-VN')} ₫
          </span>
        </div>
        <button
          onClick={() => onViewDetail(order)}
          className="bg-primary text-on-primary font-label text-[16px] uppercase px-6 py-[8.5px] cursor-pointer hover:opacity-80 transition-opacity"
        >
          XEM CHI TIẾT
        </button>
      </div>
    </div>
  )
}
