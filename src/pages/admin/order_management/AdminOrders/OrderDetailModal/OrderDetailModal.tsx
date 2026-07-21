import type { AdminOrder, AdminOrderStatus } from '@/types/adminOrder'
import OrderStatusSelect from '../OrderStatusSelect/OrderStatusSelect'
import OrderCustomerInfo from './OrderCustomerInfo/OrderCustomerInfo'
import OrderItemsList from './OrderItemsList/OrderItemsList'
import { formatOrderDate } from '../orderFormat'

interface OrderDetailModalProps {
  order: AdminOrder | null
  onClose: () => void
  onStatusChange: (id: string, status: AdminOrderStatus) => void
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

export default function OrderDetailModal({ order, onClose, onStatusChange }: OrderDetailModalProps) {
  if (!order) return null

  return (
    <div className="fixed inset-0 z-[70] flex items-center justify-center p-4">
      <div className="absolute inset-0 bg-tertiary/50 backdrop-blur-sm" onClick={onClose} />

      <div className="relative bg-surface-container-lowest border border-outline-variant w-full max-w-[640px] max-h-[85vh] overflow-y-auto p-8">
        <div className="flex items-start justify-between mb-6">
          <div>
            <h3 className="font-headline text-[20px] font-bold text-primary">{order.orderNumber}</h3>
            <p className="font-body text-[13px] text-on-surface-variant">{formatOrderDate(order.createdAt)}</p>
          </div>
          <button
            onClick={onClose}
            aria-label="Đóng"
            className="text-on-surface-variant hover:text-primary transition-colors cursor-pointer"
          >
            <span className="material-symbols-outlined">close</span>
          </button>
        </div>

        <div className="mb-6">
          <p className="font-label text-[11px] font-semibold uppercase tracking-widest text-on-surface-variant mb-2">
            Trạng thái
          </p>
          <OrderStatusSelect status={order.status} onChange={(next) => onStatusChange(order.id, next)} />
        </div>

        <div className="mb-6 pb-6 border-b border-outline-variant">
          <OrderCustomerInfo customer={order.customer} />
        </div>

        <div className="mb-6">
          <OrderItemsList items={order.items} />
        </div>

        <div className="flex justify-between items-center pt-4 border-t border-outline-variant">
          <span className="font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
            Tổng tiền
          </span>
          <span className="font-headline text-[18px] font-bold text-primary">{formatVND(order.total)}</span>
        </div>
      </div>
    </div>
  )
}
