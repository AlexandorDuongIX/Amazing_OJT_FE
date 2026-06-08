import { useState } from 'react'

/* ============================================================
   AdminDashboard — AMAZING Luxury Admin
   ============================================================
   Sections:
   1. Welcome Header + Date Filter
   2. KPI Cards (Revenue, Orders, Customers, Products)
   3. Revenue Chart + Quick Actions (Bento layout)
   4. Recent Orders Table
   ============================================================ */

/* ---------- Types ---------- */
interface Order {
  id: string
  customer: string
  avatar: string
  date: string
  status: 'Processing' | 'Shipped' | 'Delivered'
  total: string
}

/* ---------- Mock Data ---------- */
const ORDERS: Order[] = [
  { id: '#AMZ-9902', customer: 'Nguyễn Anh Quân', avatar: 'N', date: '12/12/2024', status: 'Processing', total: '4.250.000 VNĐ' },
  { id: '#AMZ-9901', customer: 'Trần Thị Mai', avatar: 'T', date: '11/12/2024', status: 'Shipped', total: '8.100.000 VNĐ' },
  { id: '#AMZ-9899', customer: 'Lê Hoàng Nam', avatar: 'L', date: '11/12/2024', status: 'Delivered', total: '12.500.000 VNĐ' },
]

/* ---------- Status Badge Helper ---------- */
function getStatusStyle(status: Order['status']) {
  switch (status) {
    case 'Processing':
      return 'bg-secondary-container text-on-secondary-container'
    case 'Shipped':
      return 'bg-tertiary text-on-tertiary'
    case 'Delivered':
      return 'bg-outline-variant text-on-surface-variant'
  }
}

/* ---------- KPI Card ---------- */
interface KpiCardProps {
  icon: string
  label: string
  value: string
  unit?: string
  badge: string
  badgeColor?: string
}

function KpiCard({ icon, label, value, unit, badge, badgeColor = 'text-secondary' }: KpiCardProps) {
  return (
    <div className="bg-surface-container-lowest border border-outline-variant p-8 relative overflow-hidden group">
      <div className="flex justify-between items-start mb-6">
        <div className="p-3 bg-tertiary-container text-on-tertiary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className={`${badgeColor} font-semibold text-caption`}>{badge}</span>
      </div>
      <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-2">
        {label}
      </p>
      <h3 className="text-headline-md font-bold text-primary">
        {value}
        {unit && <span className="text-body-md font-normal"> {unit}</span>}
      </h3>
      {/* Hover gold bar animation */}
      <div className="absolute bottom-0 left-0 h-1 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
    </div>
  )
}

/* ---------- Revenue Chart (SVG) ---------- */
function RevenueChart() {
  return (
    <div className="lg:col-span-2 bg-surface-container-lowest border border-outline-variant p-10">
      <div className="flex justify-between items-center mb-10">
        <h3 className="text-headline-md font-bold text-primary">Xu hướng doanh thu</h3>
        <div className="flex gap-2">
          <button className="px-4 py-1.5 border border-primary bg-primary text-on-primary font-body text-caption uppercase tracking-wider transition-colors hover:bg-tertiary cursor-pointer">
            VNĐ
          </button>
          <button className="px-4 py-1.5 border border-outline-variant text-on-surface-variant font-body text-caption uppercase tracking-wider hover:border-primary transition-colors cursor-pointer">
            USD
          </button>
        </div>
      </div>
      <div className="h-80 w-full relative overflow-hidden" style={{ background: 'linear-gradient(180deg, rgba(115, 92, 0, 0.08) 0%, rgba(115, 92, 0, 0) 100%)' }}>
        {/* Grid Lines */}
        <div className="absolute inset-0 flex flex-col justify-between py-4 opacity-20">
          <div className="w-full h-[1px] bg-outline-variant" />
          <div className="w-full h-[1px] bg-outline-variant" />
          <div className="w-full h-[1px] bg-outline-variant" />
          <div className="w-full h-[1px] bg-outline-variant" />
        </div>

        {/* SVG Wave Area Chart */}
        <svg
          className="absolute bottom-0 left-0 w-full h-full"
          viewBox="0 0 1000 100"
          preserveAspectRatio="none"
        >
          <defs>
            <linearGradient id="waveGradient" x1="0%" y1="0%" x2="0%" y2="100%">
              <stop offset="0%" stopColor="#735c00" stopOpacity="0.3" />
              <stop offset="100%" stopColor="#735c00" stopOpacity="0" />
            </linearGradient>
          </defs>
          {/* Area Fill */}
          <path
            d="M0,80 C150,70 250,40 400,50 C550,60 650,20 800,30 C900,40 1000,10 1000,10 L1000,100 L0,100 Z"
            fill="url(#waveGradient)"
          />
          {/* Stroke Line */}
          <path
            d="M0,80 C150,70 250,40 400,50 C550,60 650,20 800,30 C900,40 1000,10 1000,10"
            fill="none"
            stroke="#735c00"
            strokeWidth="2"
          />
          {/* Data Points */}
          <circle cx="0" cy="80" r="4" fill="#000000" />
          <circle cx="400" cy="50" r="4" fill="#000000" />
          <circle cx="800" cy="30" r="4" fill="#000000" />
          <circle cx="1000" cy="10" r="4" fill="#000000" />
        </svg>

        {/* X-Axis Labels */}
        <div className="absolute bottom-2 left-0 w-full flex justify-between px-4">
          <span className="font-body text-caption text-on-surface-variant">T7</span>
          <span className="font-body text-caption text-on-surface-variant">T8</span>
          <span className="font-body text-caption text-on-surface-variant">T9</span>
          <span className="font-body text-caption text-on-surface-variant">T10</span>
          <span className="font-body text-caption text-on-surface-variant">T11</span>
          <span className="font-body text-caption text-primary font-bold">T12</span>
        </div>
      </div>
    </div>
  )
}

/* ---------- Quick Actions Panel ---------- */
function QuickActions() {
  return (
    <div className="bg-tertiary-container text-on-tertiary p-10 flex flex-col justify-between">
      <div>
        <h3 className="text-headline-md font-bold mb-8 text-on-tertiary">Thao tác nhanh</h3>
        <div className="space-y-4">
          {[
            { icon: 'confirmation_number', label: 'Tạo Voucher mới' },
            { icon: 'edit_note', label: 'Đăng bài Blog' },
            { icon: 'add_business', label: 'Thêm sản phẩm' },
          ].map((action) => (
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
          ))}
        </div>
      </div>

      {/* Support Card */}
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
  const [_timePeriod, setTimePeriod] = useState('this-month')

  return (
    <div className="flex flex-col gap-0">
      {/* ===== Welcome Header ===== */}
      <section className="flex flex-col md:flex-row justify-between items-start md:items-end gap-12 mb-12">
        <div>
          <h2 className="text-display-lg-mobile md:text-headline-lg font-bold text-primary mb-6">
            Chào mừng trở lại, Admin
          </h2>

        </div>
        <div className="flex items-center gap-4 bg-surface-container-low px-4 py-2 border border-outline-variant">
          <span className="material-symbols-outlined text-secondary">calendar_today</span>
          <select
            value={_timePeriod}
            onChange={(e) => setTimePeriod(e.target.value)}
            className="bg-transparent border-none focus:ring-0 focus:outline-none font-body text-label-md uppercase tracking-wider cursor-pointer"
          >
            <option value="this-month">Tháng này (Tháng 12, 2024)</option>
            <option value="last-month">Tháng trước</option>
            <option value="quarter">Quý này</option>
          </select>
        </div>
      </section>

      {/* ===== KPI Cards Grid ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        <KpiCard
          icon="payments"
          label="Doanh thu tổng"
          value="1.250.000.000"
          unit="VNĐ"
          badge="+12% vs tháng trước"
        />
        <KpiCard
          icon="shopping_cart"
          label="Tổng đơn hàng"
          value="458"
          badge="+5% vs tháng trước"
        />
        <KpiCard
          icon="person_add"
          label="Khách hàng mới"
          value="124"
          badge="Mục tiêu: 150"
          badgeColor="text-on-surface-variant/40"
        />
        <KpiCard
          icon="apparel"
          label="Sản phẩm đang bán"
          value="86"
          badge="8 mẫu mới"
          badgeColor="text-on-surface-variant/40"
        />
      </section>

      {/* ===== Revenue Chart & Quick Actions ===== */}
      <section className="grid grid-cols-1 lg:grid-cols-3 gap-8 mb-12">
        <RevenueChart />
        <QuickActions />
      </section>

      {/* ===== Recent Orders Table ===== */}
      <section className="bg-surface-container-lowest border border-outline-variant mb-12">
        <div className="p-8 border-b border-outline-variant flex justify-between items-center">
          <h3 className="text-headline-md font-bold text-primary">Đơn hàng gần đây</h3>
          <button className="font-body text-label-md uppercase tracking-widest text-secondary hover:underline transition-all cursor-pointer">
            Xem tất cả
          </button>
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
              {ORDERS.map((order) => (
                <tr
                  key={order.id}
                  className="hover:bg-surface-container-low transition-all duration-300 cursor-pointer group"
                  style={{ transition: 'transform 0.3s ease, background-color 0.2s' }}
                  onMouseEnter={(e) => {
                    ; (e.currentTarget as HTMLElement).style.transform = 'translateX(8px)'
                  }}
                  onMouseLeave={(e) => {
                    ; (e.currentTarget as HTMLElement).style.transform = 'translateX(0px)'
                  }}
                >
                  <td className="p-6 font-bold">{order.id}</td>
                  <td className="p-6">
                    <div className="flex items-center gap-3">
                      <div className="w-8 h-8 bg-surface-container-highest flex items-center justify-center text-on-surface-variant">
                        {order.avatar}
                      </div>
                      <span>{order.customer}</span>
                    </div>
                  </td>
                  <td className="p-6">{order.date}</td>
                  <td className="p-6">
                    <span
                      className={`inline-block px-3 py-1 text-caption font-bold uppercase tracking-wider ${getStatusStyle(order.status)}`}
                    >
                      {order.status}
                    </span>
                  </td>
                  <td className="p-6 text-right font-bold">{order.total}</td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>
    </div>
  )
}
