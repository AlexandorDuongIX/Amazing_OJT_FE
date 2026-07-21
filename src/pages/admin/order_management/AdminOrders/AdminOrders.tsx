import { useEffect, useMemo, useState } from 'react'
import type { AdminOrderStatus } from '@/types/adminOrder'
import { useAdminOrderStore } from './adminOrderStore'
import OrderFilterBar from './OrderToolbar/OrderFilterBar/OrderFilterBar'
import OrderSearchInput from './OrderToolbar/OrderSearchInput/OrderSearchInput'
import OrderSortSelect, { type OrderSortOption } from './OrderToolbar/OrderSortSelect/OrderSortSelect'
import OrderResetFiltersButton from './OrderToolbar/OrderResetFiltersButton/OrderResetFiltersButton'
import OrderTable from './OrderTable/OrderTable'
import OrderDetailModal from './OrderDetailModal/OrderDetailModal'

const PAGE_SIZE = 8

const normalize = (value: string) =>
  value
    .normalize('NFD')
    .replace(/[̀-ͯ]/g, '')
    .replace(/đ/g, 'd')
    .replace(/Đ/g, 'D')
    .toLowerCase()

export default function AdminOrders() {
  const { orders, loading, error, fetchOrders, updateStatus } = useAdminOrderStore()
  const [statusFilter, setStatusFilter] = useState<AdminOrderStatus | ''>('')
  const [searchQuery, setSearchQuery] = useState('')
  const [sortBy, setSortBy] = useState<OrderSortOption>('newest')
  const [selectedOrderId, setSelectedOrderId] = useState<string | null>(null)
  const [currentPage, setCurrentPage] = useState(1)

  useEffect(() => {
    fetchOrders()
  }, [fetchOrders])

  const filteredOrders = useMemo(() => {
    let list = orders

    if (statusFilter) list = list.filter((order) => order.status === statusFilter)

    if (searchQuery.trim()) {
      const keyword = normalize(searchQuery.trim())
      list = list.filter(
        (order) =>
          normalize(order.orderNumber).includes(keyword) ||
          normalize(order.customer.name).includes(keyword),
      )
    }

    list = [...list].sort((a, b) => {
      if (sortBy === 'newest') return new Date(b.createdAt).getTime() - new Date(a.createdAt).getTime()
      if (sortBy === 'oldest') return new Date(a.createdAt).getTime() - new Date(b.createdAt).getTime()
      if (sortBy === 'total-desc') return b.total - a.total
      return a.total - b.total
    })

    return list
  }, [orders, statusFilter, searchQuery, sortBy])

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
    updateStatus(id, status)
  }

  const handleStatusFilterChange = (next: AdminOrderStatus | '') => {
    setStatusFilter(next)
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
    setSearchQuery('')
    setSortBy('newest')
    setCurrentPage(1)
  }

  return (
    <div className="flex flex-col gap-8">
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div className="shrink-0">
          <h1 className="font-serif text-4xl font-medium leading-tight text-black whitespace-nowrap">Quản lý Đơn hàng</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
            Trang chủ &nbsp;/&nbsp; <strong className="text-black">ORDERS</strong>
          </p>
        </div>
        <div className="flex flex-wrap gap-3">
          <OrderSearchInput value={searchQuery} onChange={handleSearchChange} />
          <OrderFilterBar value={statusFilter} onChange={handleStatusFilterChange} />
          <OrderSortSelect value={sortBy} onChange={handleSortChange} />
          <OrderResetFiltersButton onReset={handleResetFilters} />
        </div>
      </header>

      {error && (
        <p className="font-body text-[13px] text-error bg-error-subtle px-4 py-3">{error}</p>
      )}

      {loading ? (
        <p className="font-body text-on-surface-variant text-[14px] py-16 text-center">Đang tải danh sách đơn hàng...</p>
      ) : (
        <OrderTable
          orders={pagedOrders}
          onStatusChange={handleStatusChange}
          onViewDetail={setSelectedOrderId}
          currentPage={currentPage}
          totalPages={totalPages}
          onPageChange={setCurrentPage}
        />
      )}

      <OrderDetailModal
        order={selectedOrder}
        onClose={() => setSelectedOrderId(null)}
        onStatusChange={handleStatusChange}
      />
    </div>
  )
}
