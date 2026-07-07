import { useMemo, useState } from 'react'
import type { AdminOrder, AdminOrderStatus } from '@/types/adminOrder'
import { MOCK_ORDERS } from './mockOrders'
import OrderFilterBar from './OrderToolbar/OrderFilterBar/OrderFilterBar'
import OrderSearchInput from './OrderToolbar/OrderSearchInput/OrderSearchInput'
import OrderPaymentFilter from './OrderToolbar/OrderPaymentFilter/OrderPaymentFilter'
import OrderSortSelect, { type OrderSortOption } from './OrderToolbar/OrderSortSelect/OrderSortSelect'
import OrderResetFiltersButton from './OrderToolbar/OrderResetFiltersButton/OrderResetFiltersButton'
import OrderTable from './OrderTable/OrderTable'
import OrderDetailModal from './OrderDetailModal/OrderDetailModal'

const PAGE_SIZE = 8

const parseDate = (value: string) => {
  const [day, month, year] = value.split('/').map(Number)
  return new Date(year, month - 1, day).getTime()
}

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()

export default function AdminOrders() {
  const [orders, setOrders] = useState<AdminOrder[]>(MOCK_ORDERS)
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | ''>('')
  const [paymentFilter, setPaymentFilter] = useState('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<OrderSortOption>('newest')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrders = useMemo(() => {
    let list = orders

    if (statusFilter) list = list.filter((order) => order.status === statusFilter)
    if (paymentFilter) list = list.filter((order) => order.paymentMethod === paymentFilter)

    if (searchQuery.trim()) {
      const keyword = normalize(searchQuery.trim())
      list = list.filter(
        (order) =>
          normalize(order.id).includes(keyword) ||
          normalize(order.customer.name).includes(keyword),
      )
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return parseDate(b.createdAt) - parseDate(a.createdAt)
      if (sortBy === 'oldest') return parseDate(a.createdAt) - parseDate(b.createdAt)
      if (sortBy === 'total-desc') return b.total - a.total
      return a.total - b.total
    })

    return list
  }, [orders, statusFilter, paymentFilter, searchQuery, sortBy])

  const totalPages = Math.max(1, Math.ceil(filteredOrders.length / PAGE_SIZE))

  const pagedOrders = useMemo(
    () => filteredOrders.slice((currentPage - 1) * PAGE_SIZE, currentPage * PAGE_SIZE),
    [filteredOrders, currentPage],
  )

  const selectedOrder = useMemo(
    () => orders.find((order) => order.id === selectedOrderId) ?? null,
    [orders, selectedOrderId],
  )

  const handleStatusChange = (id: string, status: AdminOrderStatus) => {
    setOrders((prev) => prev.map((order) => (order.id === id ? { ...order, status } : order)))
  }

  const handleStatusFilterChange = (next: AdminOrderStatus | '') => {
    setStatusFilter(next)
    setCurrentPage(1)
  }

  const handlePaymentFilterChange = (next: string) => {
    setPaymentFilter(next)
    setCurrentPage(1)
  }

  const handleSearchChange = (next: string) => {
    setSearchQuery(next)
    setCurrentPage(1)
  }

  const handleSortChange = (next: OrderSortOption) => {
    setSortBy(next)
    setCurrentPage(1)
  }

  const handleResetFilters = () => {
    setStatusFilter('')
    setPaymentFilter('')
    setSearchQuery('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-8">
      <div className="flex flex-col md:flex-row justify-between md:items-center gap-4">
        <h2 className="text-headline-md font-bold text-primary">Quản lý đơn hàng</h2>
        <div className="flex flex-wrap gap-3">
          <OrderSearchInput value={searchQuery} onChange={handleSearchChange} />
          <OrderFilterBar value={statusFilter} onChange={handleStatusFilterChange} />
          <OrderPaymentFilter value={paymentFilter} onChange={handlePaymentFilterChange} />
          <OrderSortSelect value={sortBy} onChange={handleSortChange} />
          <OrderResetFiltersButton onReset={handleResetFilters} />
        </div>
      </div>

      <OrderTable
        orders={pagedOrders}
        onStatusChange={handleStatusChange}
        onViewDetail={setSelectedOrderId}
        currentPage={currentPage}
        totalPages={totalPages}
        onPageChange={setCurrentPage}
      />

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
