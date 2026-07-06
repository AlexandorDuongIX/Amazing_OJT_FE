import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Order } from '@/types/order'
import { MOCK_ORDERS } from './mockOrders'
import OrderCard from './OrderCard'
import OrderFilterTabs from './OrderFilterTabs'
import OrderPagination from './OrderPagination'

const PAGE_SIZE = 6

export default function OrderHistoryPage() {
  const [activeTab, setActiveTab] = useState('Tất cả')
  const [currentPage, setCurrentPage] = useState(1)

  const filteredOrders =
    activeTab === 'Tất cả'
      ? MOCK_ORDERS
      : MOCK_ORDERS.filter(o => o.status === activeTab)

  const totalPages = Math.ceil(filteredOrders.length / PAGE_SIZE)
  const displayedOrders = filteredOrders.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  )

  function handleTabChange(tab: string) {
    setActiveTab(tab)
    setCurrentPage(1)
  }

  function handleViewDetail(_order: Order) {
    // TODO: open order detail modal
  }

  return (
    <div className="px-[40px] py-[40px]">
      <div className="max-w-[1200px] mx-auto flex flex-col gap-[40px]">

        {/* 2a. Header & Breadcrumbs */}
        <div className="flex flex-col gap-3">
          <nav className="flex items-center gap-1 font-label text-[12px] text-muted">
            <Link to="/" className="hover:text-on-background transition-colors">Trang chủ</Link>
            <span className="mx-1">›</span>
            <span>Tài khoản</span>
            <span className="mx-1">›</span>
            <span className="text-on-background">Lịch sử đơn hàng</span>
          </nav>
          <div className="flex flex-col gap-2">
            <h1 className="font-headline text-[36px] leading-[54px] font-semibold text-on-background">
              Lịch sử đơn hàng
            </h1>
            <div className="w-[48px] h-[2px] bg-gold" />
          </div>
        </div>

        {/* 2b–2d. Filter + List + Pagination */}
        <div className="flex flex-col">
          <OrderFilterTabs activeTab={activeTab} onTabChange={handleTabChange} />

          {displayedOrders.length === 0 ? (
            <div className="py-20 flex flex-col items-center gap-3 text-center">
              <span className="material-symbols-outlined text-[48px] text-muted">inbox</span>
              <p className="font-label text-[16px] text-muted">Không có đơn hàng nào</p>
            </div>
          ) : (
            <div className="flex flex-col gap-4 pt-6">
              {displayedOrders.map(order => (
                <OrderCard
                  key={order.id}
                  order={order}
                  onViewDetail={handleViewDetail}
                />
              ))}
            </div>
          )}

          {totalPages > 1 && (
            <OrderPagination
              currentPage={currentPage}
              totalPages={totalPages}
              onPageChange={setCurrentPage}
            />
          )}
        </div>

      </div>
    </div>
  )
}
