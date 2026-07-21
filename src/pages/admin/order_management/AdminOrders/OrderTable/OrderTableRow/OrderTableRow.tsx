import type { AdminOrder, AdminOrderStatus } from '@/types/adminOrder'
import OrderStatusSelect from '../../OrderStatusSelect/OrderStatusSelect'
import { formatOrderDate } from '../../orderFormat'

interface OrderTableRowProps {
  order: AdminOrder
  onStatusChange: (id: string, status: AdminOrderStatus) => void
  onViewDetail: (id: string) => void
}

const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

export default function OrderTableRow({ order, onStatusChange, onViewDetail }: OrderTableRowProps) {
  return (
    <tr
      onClick={() => onViewDetail(order.id)}
      className="transition-colors duration-300 hover:bg-surface-container-low cursor-pointer group"
    >
      <td
        className="p-4 font-bold truncate border-l-2 border-transparent group-hover:border-secondary transition-colors"
        title={order.orderNumber}
      >
        {order.orderNumber}
      </td>
      <td className="p-4 truncate" title={order.customer.name}>{order.customer.name}</td>
      <td className="p-4 truncate">{formatOrderDate(order.createdAt)}</td>
      <td className="p-4">
        <OrderStatusSelect status={order.status} onChange={(next) => onStatusChange(order.id, next)} />
      </td>
      <td className="p-4 text-right font-bold truncate">{formatVND(order.total)}</td>
    </tr>
  )
}
