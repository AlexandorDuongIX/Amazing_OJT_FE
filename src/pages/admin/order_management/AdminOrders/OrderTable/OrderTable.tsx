import type { AdminOrder, AdminOrderStatus } from '@/types/adminOrder'
import OrderTableRow from './OrderTableRow/OrderTableRow'
import OrderPagination from './OrderPagination/OrderPagination'

interface OrderTableProps {
  orders: AdminOrder[]
  onStatusChange: (id: string, status: AdminOrderStatus) => void
  onViewDetail: (id: string) => void
  currentPage: number
  totalPages: number
  onPageChange: (page: number) => void
}

export default function OrderTable({
  orders,
  onStatusChange,
  onViewDetail,
  currentPage,
  totalPages,
  onPageChange,
}: OrderTableProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant">
      <div className="overflow-x-auto">
        <table className="w-full table-fixed text-left border-collapse">
          <thead>
            <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container-low">
              <th className="p-4 font-semibold w-[18%]">Mã đơn hàng</th>
              <th className="p-4 font-semibold w-[24%]">Khách hàng</th>
              <th className="p-4 font-semibold w-[14%]">Ngày đặt</th>
              <th className="p-4 font-semibold w-[24%]">Trạng thái</th>
              <th className="p-4 font-semibold text-right w-[20%]">Tổng tiền</th>
            </tr>
          </thead>
          <tbody className="font-body text-body-md divide-y divide-outline-variant">
            {orders.map((order) => (
              <OrderTableRow
                key={order.id}
                order={order}
                onStatusChange={onStatusChange}
                onViewDetail={onViewDetail}
              />
            ))}
          </tbody>
        </table>
      </div>

      {orders.length === 0 && (
        <div className="text-center py-16">
          <p className="font-body text-on-surface-variant text-[14px]">
            Không có đơn hàng nào phù hợp.
          </p>
        </div>
      )}

      <OrderPagination currentPage={currentPage} totalPages={totalPages} onPageChange={onPageChange} />
    </div>
  )
}
