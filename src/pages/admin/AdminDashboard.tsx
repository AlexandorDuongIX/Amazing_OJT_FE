import { Link } from 'react-router-dom'
import { useState, useEffect } from 'react'
import {
  XAxis,
  YAxis,
  CartesianGrid,
  Tooltip,
  ResponsiveContainer,
  Area,
  AreaChart
} from 'recharts'
import { dashboardApi } from '../../services/dashboardApi'
import type { AdminDashboardDto } from '../../services/dashboardApi'

/* ============================================================
   AdminDashboard — AMAZING Luxury Admin
   ============================================================ */

/* ---------- Status Badge Helper ---------- */
function getStatusStyle(status: string) {
  switch (status.toLowerCase()) {
    case 'processing':
    case 'pending':
      return 'bg-secondary-container text-on-secondary-container'
    case 'shipped':
      return 'bg-tertiary text-on-tertiary'
    case 'delivered':
    case 'completed':
      return 'bg-outline-variant text-on-surface-variant'
    case 'cancelled':
      return 'bg-error-container text-on-error-container'
    default:
      return 'bg-surface-container text-on-surface'
  }
}

/* ---------- KPI Card ---------- */
interface KpiCardProps {
  icon: string
  label: string
  value: string | number
  unit?: string
  badge?: string
  badgeColor?: string
}

function KpiCard({ icon, label, value, unit, badge, badgeColor = 'text-secondary' }: KpiCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-8 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-tertiary-container text-on-tertiary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        {badge && <span className={`${badgeColor} font-semibold text-caption`}>{badge}</span>}
      </div>
      <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </p>
      <h3 className="text-headline-md font-bold text-primary">
        {value}
        {unit && <span className="text-body-md font-normal"> {unit}</span>}
      </h3>
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
    </div>
  )
}

/* ---------- Quick Actions Panel ---------- */
function QuickActions() {
  type QuickAction = {
    icon: string
    label: string
    href?: string
  }

  const actions: QuickAction[] = [
    { icon: 'confirmation_number', label: 'Tạo Voucher mới' },
    { icon: 'edit_note', label: 'Quản lý nội dung', href: '/admin/content' },
    { icon: 'add_business', label: 'Thêm sản phẩm', href: '/admin/products' },
  ]

  return (
    <div className="bg-tertiary-container text-on-tertiary p-10 flex flex-col justify-between">
      <div>
        <h3 className="text-headline-md font-bold mb-8 text-on-tertiary">Thao tác nhanh</h3>
        <div className="space-y-4">
          {actions.map((action) => {
            if (action.href) {
              return (
                <Link
                  key={action.label}
                  to={action.href}
                  className="w-full flex items-center justify-between p-4 border border-on-tertiary/20 hover:border-secondary hover:text-secondary transition-all group cursor-pointer"
                >
                  <div className="flex items-center gap-4">
                    <span className="material-symbols-outlined">{action.icon}</span>
                    <span className="font-body text-label-md uppercase tracking-widest">
                      {action.label}
                    </span>
                  </div>
                  <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
                    chevron_right
                  </span>
                </Link>
              )
            }

            return (
              <button
                key={action.label}
                className="w-full flex items-center justify-between p-4 border border-on-tertiary/20 hover:border-secondary hover:text-secondary transition-all group cursor-pointer"
              >
                <div className="flex items-center gap-4">
                  <span className="material-symbols-outlined">{action.icon}</span>
                  <span className="font-body text-label-md uppercase tracking-widest">
                    {action.label}
                  </span>
                </div>
                <span className="material-symbols-outlined opacity-0 group-hover:opacity-100 transition-opacity">
                  chevron_right
                </span>
              </button>
            )
          })}
        </div>
      </div>

      <div className="mt-12 p-6 bg-secondary text-on-secondary-fixed">
        <p className="font-body text-caption font-bold uppercase tracking-widest mb-1">
          Cần hỗ trợ?
        </p>
        <p className="font-body text-label-md mb-4 opacity-80">
          Liên hệ đội ngũ kỹ thuật để được trợ giúp 24/7.
        </p>
        <button className="text-label-md font-bold border-b border-on-secondary-fixed hover:opacity-70 transition-opacity cursor-pointer">
          LIÊN HỆ NGAY
        </button>
      </div>
    </div>
  )
}

/* ---------- AdminDashboard Main ---------- */
export default function AdminDashboard() {
  const [timePeriod, setTimePeriod] = useState('this-month')
  const [loading, setLoading] = useState(true)
  const [data, setData] = useState<AdminDashboardDto | null>(null)

  useEffect(() => {
    const fetchDashboard = async () => {
      try {
        setLoading(true)
        // Simulate fetching based on timePeriod (can calculate fromDate/toDate here)
        const response = await dashboardApi.getAdminDashboard()
        setData(response)
      } catch (error) {
        console.error("Failed to fetch admin dashboard", error)
      } finally {
        setLoading(false)
      }
    }
    fetchDashboard()
  }, [timePeriod])

  if (loading) {
    return (
      <div className="flex justify-center items-center h-64">
        <div className="animate-spin rounded-full h-12 w-12 border-b-2 border-primary"></div>
      </div>
    )
  }

  if (!data) {
    return (
      <div className="flex justify-center items-center h-64 text-error">
        Không thể tải dữ liệu Dashboard
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-0">
      {/* ===== Welcome Header ===== */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-black uppercase">CHÀO MỪNG TRỞ LẠI, ADMIN</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
            Trang chủ &nbsp;/&nbsp; <strong className="text-black">DASHBOARD</strong>
          </p>
        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 border border-outline-variant">
          <span className="material-symbols-outlined text-secondary">calendar_today</span>
          <select
            value={timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-transparent border-none focus:ring-0 focus:outline-none font-body text-label-md uppercase tracking-wider cursor-pointer"
          >
            <option value="this-month">Tháng này</option>
            <option value="last-month">Tháng trước</option>
            <option value="quarter">Quý này</option>
          </select>
        </div>
      </header>

      {/* ===== KPI Cards Grid ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard
          icon="payments"
          label="Doanh thu tổng"
          value={data.summary.totalRevenue.toLocaleString()}
          unit="VNĐ"
        />
        <KpiCard
          icon="shopping_cart"
          label="Tổng đơn hàng"
          value={data.summary.totalOrders.toLocaleString()}
        />
        <KpiCard
          icon="person_add"
          label="Khách hàng mới"
          value={data.summary.totalCustomers.toLocaleString()}
          badgeColor="text-on-surface-variant/40"
        />
        <KpiCard
          icon="apparel"
          label="Sản phẩm đang bán"
          value={data.summary.activeProducts.toLocaleString()}
          badge={`${data.summary.lowStockProducts} cảnh báo kho`}
          badgeColor="text-error"
        />
      </section>

      {/* ===== Revenue Chart & Quick Actions ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant p-10">
          <div className="flex justify-between items-center mb-10">
            <h3 className="text-headline-md font-bold text-primary">Xu hướng doanh thu</h3>
          </div>
          <div className="h-80 w-full relative">
            <ResponsiveContainer width="100%" height="100%">
              <AreaChart data={data.revenueTrend}>
                <defs>
                  <linearGradient id="colorRevenue" x1="0" y1="0" x2="0" y2="1">
                    <stop offset="5%" stopColor="#735c00" stopOpacity={0.3}/>
                    <stop offset="95%" stopColor="#735c00" stopOpacity={0}/>
                  </linearGradient>
                </defs>
                <CartesianGrid strokeDasharray="3 3" vertical={false} stroke="#e0e0e0" />
                <XAxis dataKey="label" tick={{fontFamily: 'inherit', fontSize: 12}} />
                <YAxis 
                  tickFormatter={(val) => (val / 1000000) + 'M'} 
                  tick={{fontFamily: 'inherit', fontSize: 12}} 
                  width={60}
                />
                <Tooltip 
                  formatter={(value: number) => [value.toLocaleString() + ' VNĐ', 'Doanh thu']}
                  labelStyle={{color: '#000'}}
                />
                <Area type="monotone" dataKey="revenue" stroke="#735c00" fillOpacity={1} fill="url(#colorRevenue)" />
              </AreaChart>
            </ResponsiveContainer>
          </div>
        </div>
        <QuickActions />
      </section>

      {/* ===== Top Products & Stock Alerts ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-2 gap-8 mb-12">
        {/* Top Products */}
        <div className="bg-surface-container-lowest border border-outline-variant">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-md font-bold text-primary flex items-center gap-2">
              <span className="material-symbols-outlined text-secondary">trending_up</span>
              Sản phẩm bán chạy
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container-low">
                  <th className="p-4 font-semibold">Sản phẩm</th>
                  <th className="p-4 font-semibold text-right">Đã bán</th>
                  <th className="p-4 font-semibold text-right">Doanh thu</th>
                </tr>
              </thead>
              <tbody className="font-body text-body-md divide-y divide-outline-variant">
                {data.topProducts && data.topProducts.length > 0 ? (
                  data.topProducts.map((p) => (
                    <tr key={p.productId} className="hover:bg-surface-container-low">
                      <td className="p-4">
                        <p className="font-bold">{p.productName}</p>
                        <p className="text-caption text-on-surface-variant">{p.sku}</p>
                      </td>
                      <td className="p-4 text-right font-bold">{p.totalSold}</td>
                      <td className="p-4 text-right font-bold text-secondary">{p.revenue.toLocaleString()} đ</td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-on-surface-variant">Không có dữ liệu</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>

        {/* Stock Alerts */}
        <div className="bg-surface-container-lowest border border-outline-variant">
          <div className="p-6 border-b border-outline-variant flex justify-between items-center">
            <h3 className="text-headline-md font-bold text-error flex items-center gap-2">
              <span className="material-symbols-outlined">warning</span>
              Cảnh báo tồn kho
            </h3>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead>
                <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container-low">
                  <th className="p-4 font-semibold">Sản phẩm</th>
                  <th className="p-4 font-semibold text-right">Tồn kho</th>
                  <th className="p-4 font-semibold">Danh mục</th>
                </tr>
              </thead>
              <tbody className="font-body text-body-md divide-y divide-outline-variant">
                {data.stockAlerts && data.stockAlerts.length > 0 ? (
                  data.stockAlerts.map((p) => (
                    <tr key={p.productId} className="hover:bg-error-container/20">
                      <td className="p-4">
                        <p className="font-bold">{p.productName}</p>
                        <p className="text-caption text-on-surface-variant">{p.sku}</p>
                      </td>
                      <td className="p-4 text-right font-bold text-error">
                        {p.availableQuantity}
                      </td>
                      <td className="p-4">
                        <span className="inline-block px-2 py-1 bg-surface-container-highest text-caption rounded">
                          {p.categoryName || 'N/A'}
                        </span>
                      </td>
                    </tr>
                  ))
                ) : (
                  <tr>
                    <td colSpan={3} className="p-6 text-center text-on-surface-variant">Không có cảnh báo tồn kho</td>
                  </tr>
                )}
              </tbody>
            </table>
          </div>
        </div>
      </section>

      {/* ===== Recent Orders Table ===== */}
      <section className="bg-surface-container-lowest border border-outline-variant mb-12">
        <div className="p-8 border-b border-outline-variant flex justify-between items-center">
          <h3 className="text-headline-md font-bold text-primary flex items-center gap-2">
            <span className="material-symbols-outlined text-secondary">receipt_long</span>
            Đơn hàng gần đây
          </h3>
          <Link to="/admin/orders" className="font-body text-label-md uppercase tracking-widest text-secondary hover:underline transition-all cursor-pointer">
            Xem tất cả
          </Link>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container-low">
                <th className="p-6 font-semibold">Mã đơn hàng</th>
                <th className="p-6 font-semibold">Khách hàng</th>
                <th className="p-6 font-semibold">Ngày đặt</th>
                <th className="p-6 font-semibold">Trạng thái</th>
                <th className="p-6 font-semibold text-right">Tổng tiền</th>
              </tr>
            </thead>
            <tbody className="font-body text-body-md divide-y divide-outline-variant">
              {data.recentOrders && data.recentOrders.length > 0 ? (
                data.recentOrders.map((order) => (
                  <tr
                    key={order.id}
                    className="transform transition-all duration-300 hover:translate-x-2 hover:bg-surface-container-low cursor-pointer group"
                  >
                    <td className="p-6 font-bold">{order.orderNumber}</td>
                    <td className="p-6">
                      <div className="flex items-center gap-3">
                        <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center text-on-surface-variant uppercase font-bold">
                          {order.customerName.charAt(0)}
                        </div>
                        <div>
                          <span>{order.customerName}</span>
                          <p className="text-caption text-on-surface-variant">{order.customerEmail}</p>
                        </div>
                      </div>
                    </td>
                    <td className="p-6">{new Date(order.createdAt).toLocaleDateString('vi-VN')}</td>
                    <td className="p-6">
                      <span
                        className={`inline-block px-3 py-1 text-caption font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}
                      >
                        {order.status}
                      </span>
                    </td>
                    <td className="p-6 text-right font-bold">{order.totalPrice.toLocaleString()} đ</td>
                  </tr>
                ))
              ) : (
                <tr>
                  <td colSpan={5} className="p-6 text-center text-on-surface-variant">Không có đơn hàng nào gần đây</td>
                </tr>
              )}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
