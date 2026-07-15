import { useState, useEffect } from 'react'

/* ============================================================
   ReportManagementPage — AMAZING Luxury Admin
   ============================================================
   Sections:
   1. Header + Description
   2. Report Type Selector (4 cards)
   3. Date Range Filter + Presets
   4. KPI Summary Cards
   5. Data Preview Table
   6. Export Actions (PDF / Excel / CSV)
   ============================================================ */

/* ---------- Types ---------- */
type ReportType = 'revenue' | 'orders' | 'inventory' | 'customers'

interface ReportOption {
  key: ReportType
  label: string
  icon: string
  description: string
}

/* ---------- Report Options ---------- */
const REPORT_OPTIONS: ReportOption[] = [
  { key: 'revenue', label: 'Doanh thu', icon: 'payments', description: 'Doanh thu theo ngày, hoàn trả và doanh thu ròng' },
  { key: 'orders', label: 'Đơn hàng', icon: 'shopping_bag', description: 'Chi tiết đơn hàng, trạng thái và giá trị' },
  { key: 'inventory', label: 'Tồn kho', icon: 'inventory_2', description: 'Số lượng tồn kho, đã bán và trạng thái' },
  { key: 'customers', label: 'Khách hàng', icon: 'group', description: 'Thông tin khách hàng và mức chi tiêu' },
]

/* ---------- Mock KPI Data ---------- */
const KPI_DATA: Record<ReportType, { label: string; value: string; icon: string; badge: string }[]> = {
  revenue: [
    { label: 'Tổng doanh thu', value: '2.450.000.000 VNĐ', icon: 'trending_up', badge: '+18.2%' },
    { label: 'Doanh thu ròng', value: '2.180.500.000 VNĐ', icon: 'account_balance', badge: '+15.6%' },
    { label: 'Hoàn trả', value: '269.500.000 VNĐ', icon: 'undo', badge: '11%' },
    { label: 'Giá trị TB / Đơn', value: '3.850.000 VNĐ', icon: 'receipt_long', badge: '+8.3%' },
  ],
  orders: [
    { label: 'Tổng đơn hàng', value: '636', icon: 'shopping_cart', badge: '+22%' },
    { label: 'Đang xử lý', value: '48', icon: 'pending_actions', badge: '7.5%' },
    { label: 'Đã giao', value: '541', icon: 'local_shipping', badge: '85.1%' },
    { label: 'Đã huỷ', value: '47', icon: 'cancel', badge: '7.4%' },
  ],
  inventory: [
    { label: 'Tổng SKU', value: '324', icon: 'category', badge: '+12 mới' },
    { label: 'Tồn kho', value: '8.642', icon: 'inventory', badge: 'units' },
    { label: 'Sắp hết hàng', value: '18', icon: 'warning', badge: 'Cần nhập' },
    { label: 'Hết hàng', value: '7', icon: 'block', badge: 'Ngưng bán' },
  ],
  customers: [
    { label: 'Tổng khách hàng', value: '1.248', icon: 'people', badge: '+86 mới' },
    { label: 'Khách hoạt động', value: '892', icon: 'person', badge: '71.5%' },
    { label: 'Khách VIP', value: '124', icon: 'star', badge: '9.9%' },
    { label: 'Chi tiêu TB', value: '4.250.000 VNĐ', icon: 'wallet', badge: '+12%' },
  ],
}

/* ---------- Mock Table Data ---------- */
const TABLE_COLUMNS: Record<ReportType, string[]> = {
  revenue: ['Ngày', 'Số đơn hàng', 'Doanh thu', 'Hoàn trả', 'Doanh thu ròng'],
  orders: ['Mã đơn', 'Khách hàng', 'Ngày đặt', 'Trạng thái', 'Tổng tiền'],
  inventory: ['Mã SKU', 'Tên sản phẩm', 'Tồn kho', 'Đã bán', 'Trạng thái'],
  customers: ['Mã KH', 'Tên khách hàng', 'Email', 'Tổng đơn', 'Tổng chi tiêu'],
}

const TABLE_DATA: Record<ReportType, string[][]> = {
  revenue: [
    ['01/07/2026', '28', '112.500.000 VNĐ', '8.200.000 VNĐ', '104.300.000 VNĐ'],
    ['02/07/2026', '35', '148.200.000 VNĐ', '12.500.000 VNĐ', '135.700.000 VNĐ'],
    ['03/07/2026', '22', '86.400.000 VNĐ', '4.100.000 VNĐ', '82.300.000 VNĐ'],
    ['04/07/2026', '41', '175.800.000 VNĐ', '15.300.000 VNĐ', '160.500.000 VNĐ'],
    ['05/07/2026', '19', '72.600.000 VNĐ', '3.800.000 VNĐ', '68.800.000 VNĐ'],
    ['06/07/2026', '33', '138.900.000 VNĐ', '9.600.000 VNĐ', '129.300.000 VNĐ'],
    ['07/07/2026', '45', '198.500.000 VNĐ', '18.200.000 VNĐ', '180.300.000 VNĐ'],
  ],
  orders: [
    ['#AMZ-10021', 'Nguyễn Minh Anh', '07/07/2026', 'Đã giao', '5.250.000 VNĐ'],
    ['#AMZ-10020', 'Trần Bảo Ngọc', '07/07/2026', 'Đang giao', '3.800.000 VNĐ'],
    ['#AMZ-10019', 'Lê Hoàng Phúc', '06/07/2026', 'Đang xử lý', '12.400.000 VNĐ'],
    ['#AMZ-10018', 'Phạm Thu Hà', '06/07/2026', 'Đã giao', '8.900.000 VNĐ'],
    ['#AMZ-10017', 'Đỗ Quang Huy', '05/07/2026', 'Đã huỷ', '2.100.000 VNĐ'],
    ['#AMZ-10016', 'Vũ Thanh Tùng', '05/07/2026', 'Đã giao', '6.750.000 VNĐ'],
    ['#AMZ-10015', 'Hoàng Thị Lan', '04/07/2026', 'Đã giao', '4.320.000 VNĐ'],
  ],
  inventory: [
    ['SKU-AO-001', 'Áo Polo Luxury Knit', '124', '286', 'Còn hàng'],
    ['SKU-AO-002', 'Áo Sơ mi Oxford Premium', '8', '412', 'Sắp hết'],
    ['SKU-QU-001', 'Quần Tây Slim Fit Italian', '67', '198', 'Còn hàng'],
    ['SKU-AO-003', 'Áo Khoác Bomber Suede', '0', '85', 'Hết hàng'],
    ['SKU-PK-001', 'Thắt lưng Da Bò Handmade', '45', '167', 'Còn hàng'],
    ['SKU-AO-004', 'Áo Vest Casual Linen', '3', '92', 'Sắp hết'],
    ['SKU-QU-002', 'Quần Short Chino Washed', '89', '321', 'Còn hàng'],
  ],
  customers: [
    ['CUS-001', 'Nguyễn Minh Anh', 'minhanh.nguyen@gmail.com', '18', '42.500.000 VNĐ'],
    ['CUS-002', 'Trần Bảo Ngọc', 'baongoc.tran@outlook.com', '6', '9.750.000 VNĐ'],
    ['CUS-003', 'Lê Hoàng Phúc', 'hoangphuc.le@yahoo.com', '2', '1.200.000 VNĐ'],
    ['CUS-004', 'Phạm Thu Hà', 'thuha.pham@gmail.com', '31', '86.300.000 VNĐ'],
    ['CUS-005', 'Đỗ Quang Huy', 'quanghuy.do@gmail.com', '0', '0 VNĐ'],
    ['CUS-006', 'Vũ Thanh Tùng', 'thanhtung.vu@gmail.com', '14', '28.900.000 VNĐ'],
    ['CUS-007', 'Hoàng Thị Lan', 'thilan.hoang@gmail.com', '9', '15.600.000 VNĐ'],
  ],
}

/* ---------- Status Badge Helper ---------- */
function getStatusClass(status: string): string {
  switch (status) {
    case 'Đã giao':
    case 'Còn hàng':
      return 'bg-outline-variant/20 text-on-surface-variant'
    case 'Đang giao':
    case 'Đang xử lý':
      return 'bg-secondary-container text-on-secondary-container'
    case 'Sắp hết':
      return 'bg-tertiary text-on-tertiary'
    case 'Đã huỷ':
    case 'Hết hàng':
      return 'bg-error text-on-error'
    default:
      return 'bg-surface-container-high text-on-surface-variant'
  }
}

function isStatusColumn(reportType: ReportType, colIndex: number): boolean {
  if (reportType === 'orders' && colIndex === 3) return true
  if (reportType === 'inventory' && colIndex === 4) return true
  return false
}

/* ---------- Toast Component ---------- */
function Toast({ message, visible }: { message: string; visible: boolean }) {
  return (
    <div
      className={`fixed bottom-8 left-1/2 -translate-x-1/2 z-[9999] transition-all duration-500 ${
        visible ? 'opacity-100 translate-y-0' : 'opacity-0 translate-y-4 pointer-events-none'
      }`}
    >
      <div className="bg-primary text-on-primary px-8 py-4 shadow-2xl flex items-center gap-3">
        <span className="material-symbols-outlined text-[20px] animate-spin">progress_activity</span>
        <span className="font-body text-label-md uppercase tracking-widest">{message}</span>
      </div>
    </div>
  )
}

/* ---------- Date Presets ---------- */
function getPresetRange(preset: '7d' | '30d' | 'quarter'): { from: string; to: string } {
  const today = new Date()
  const to = today.toISOString().slice(0, 10)

  if (preset === '7d') {
    const from = new Date(today)
    from.setDate(from.getDate() - 7)
    return { from: from.toISOString().slice(0, 10), to }
  }
  if (preset === '30d') {
    const from = new Date(today)
    from.setDate(from.getDate() - 30)
    return { from: from.toISOString().slice(0, 10), to }
  }
  // quarter
  const qMonth = Math.floor(today.getMonth() / 3) * 3
  const from = new Date(today.getFullYear(), qMonth, 1)
  return { from: from.toISOString().slice(0, 10), to }
}

/* ============================================================
   Main Component
   ============================================================ */
export default function ReportManagementPage() {
  const [reportType, setReportType] = useState<ReportType>('revenue')
  const [dateFrom, setDateFrom] = useState(() => getPresetRange('30d').from)
  const [dateTo, setDateTo] = useState(() => getPresetRange('30d').to)
  const [activePreset, setActivePreset] = useState<'7d' | '30d' | 'quarter' | null>('30d')
  const [toast, setToast] = useState({ message: '', visible: false })

  /* Auto-hide toast */
  useEffect(() => {
    if (!toast.visible) return
    const timer = setTimeout(() => setToast((prev) => ({ ...prev, visible: false })), 2500)
    return () => clearTimeout(timer)
  }, [toast.visible])

  function handlePreset(preset: '7d' | '30d' | 'quarter') {
    const range = getPresetRange(preset)
    setDateFrom(range.from)
    setDateTo(range.to)
    setActivePreset(preset)
  }

  function handleExport(format: 'PDF' | 'Excel' | 'CSV') {
    const reportLabel = REPORT_OPTIONS.find((r) => r.key === reportType)?.label ?? ''
    setToast({ message: `Đang xuất báo cáo ${reportLabel} dưới dạng ${format}...`, visible: true })
  }

  const kpis = KPI_DATA[reportType]
  const columns = TABLE_COLUMNS[reportType]
  const rows = TABLE_DATA[reportType]

  return (
    <div className="flex flex-col gap-0">
      {/* ===== Header ===== */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-black">Báo cáo & Thống kê</h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
            Trang chủ &nbsp;/&nbsp; <strong className="text-black">REPORTS</strong>
          </p>
        </div>
      </header>
      <section className="mb-12">
        <p className="font-body text-body-md text-on-surface-variant max-w-2xl">
          Hỗ trợ xuất dữ liệu phục vụ thống kê, kế toán và quản lý. Chọn loại báo cáo, khoảng thời gian
          và xem trước dữ liệu trước khi xuất.
        </p>
      </section>

      {/* ===== Report Type Selector ===== */}
      <section className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {REPORT_OPTIONS.map((opt) => {
          const isActive = reportType === opt.key
          return (
            <button
              key={opt.key}
              onClick={() => setReportType(opt.key)}
              className={`relative text-left p-8 border transition-all duration-300 group cursor-pointer overflow-hidden ${
                isActive
                  ? 'bg-primary/5 border-primary shadow-lg'
                  : 'bg-surface-container-lowest border-outline-variant hover:border-primary/50 hover:shadow-md'
              }`}
            >
              <div className={`p-3 inline-flex mb-5 transition-colors duration-300 ${
                isActive ? 'bg-primary text-on-primary' : 'bg-tertiary-container text-on-tertiary'
              }`}>
                <span className="material-symbols-outlined">{opt.icon}</span>
              </div>
              <h3 className={`text-headline-md font-bold mb-2 transition-colors ${
                isActive ? 'text-primary' : 'text-on-surface'
              }`}>
                {opt.label}
              </h3>
              <p className="font-body text-caption text-on-surface-variant leading-relaxed">
                {opt.description}
              </p>
              {/* Active indicator bar */}
              <div className={`absolute bottom-0 left-0 h-1 transition-all duration-500 ${
                isActive ? 'w-full bg-primary' : 'w-0 bg-secondary group-hover:w-full'
              }`} />
            </button>
          )
        })}
      </section>

      {/* ===== Date Range Filter ===== */}
      <section className="bg-surface-container-lowest border border-outline-variant p-8 mb-12">
        <div className="flex flex-col lg:flex-row lg:items-end gap-6">
          {/* Date inputs */}
          <div className="flex flex-col sm:flex-row gap-6 flex-1">
            <div className="flex-1">
              <label className="block font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-3">
                Từ ngày
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                  calendar_today
                </span>
                <input
                  type="date"
                  value={dateFrom}
                  onChange={(e) => { setDateFrom(e.target.value); setActivePreset(null) }}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant font-body text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
            <div className="flex-1">
              <label className="block font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-3">
                Đến ngày
              </label>
              <div className="relative">
                <span className="material-symbols-outlined absolute left-4 top-1/2 -translate-y-1/2 text-secondary text-[20px]">
                  event
                </span>
                <input
                  type="date"
                  value={dateTo}
                  onChange={(e) => { setDateTo(e.target.value); setActivePreset(null) }}
                  className="w-full pl-12 pr-4 py-3 bg-surface border border-outline-variant font-body text-body-md text-on-surface focus:outline-none focus:border-primary transition-colors"
                />
              </div>
            </div>
          </div>

          {/* Presets */}
          <div className="flex gap-2">
            {([
              { key: '7d' as const, label: '7 ngày' },
              { key: '30d' as const, label: '30 ngày' },
              { key: 'quarter' as const, label: 'Quý này' },
            ]).map((p) => (
              <button
                key={p.key}
                onClick={() => handlePreset(p.key)}
                className={`px-5 py-3 font-body text-caption uppercase tracking-wider font-bold transition-all duration-300 cursor-pointer ${
                  activePreset === p.key
                    ? 'bg-primary text-on-primary shadow-md'
                    : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
              >
                {p.label}
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== KPI Summary Cards ===== */}
      <section className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-12">
        {kpis.map((kpi) => (
          <div
            key={kpi.label}
            className="bg-surface-container-lowest border border-outline-variant p-8 relative overflow-hidden group"
          >
            <div className="flex justify-between items-start mb-6">
              <div className="p-3 bg-tertiary-container text-on-tertiary">
                <span className="material-symbols-outlined">{kpi.icon}</span>
              </div>
              <span className="text-secondary font-semibold text-caption">{kpi.badge}</span>
            </div>
            <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-2">
              {kpi.label}
            </p>
            <h3 className="text-headline-md font-bold text-primary">{kpi.value}</h3>
            {/* Hover gold bar */}
            <div className="absolute bottom-0 left-0 h-1 w-0 bg-secondary transition-all duration-500 group-hover:w-full" />
          </div>
        ))}
      </section>

      {/* ===== Data Preview Table ===== */}
      <section className="bg-surface-container-lowest border border-outline-variant mb-12">
        {/* Table Header */}
        <div className="p-8 border-b border-outline-variant flex flex-col sm:flex-row justify-between items-start sm:items-center gap-4">
          <div>
            <h3 className="text-headline-md font-bold text-primary">Xem trước dữ liệu</h3>
            <p className="font-body text-caption text-on-surface-variant mt-1">
              {dateFrom} — {dateTo} · {rows.length} bản ghi
            </p>
          </div>
          <div className="flex items-center gap-2 text-on-surface-variant">
            <span className="material-symbols-outlined text-[18px]">info</span>
            <span className="font-body text-caption uppercase tracking-wider">
              Dữ liệu mẫu — Sẽ được thay thế khi ghép API
            </span>
          </div>
        </div>

        {/* Table */}
        <div className="overflow-x-auto">
          <table className="w-full text-left border-collapse">
            <thead>
              <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant bg-surface-container-low">
                {columns.map((col) => (
                  <th key={col} className="p-6 font-semibold">
                    {col}
                  </th>
                ))}
              </tr>
            </thead>
            <tbody className="font-body text-body-md divide-y divide-outline-variant">
              {rows.map((row, rowIdx) => (
                <tr
                  key={rowIdx}
                  className="transition-all duration-300 hover:translate-x-2 hover:bg-surface-container-low cursor-pointer group"
                >
                  {row.map((cell, colIdx) => (
                    <td key={colIdx} className={`p-6 ${colIdx === 0 ? 'font-bold' : ''} ${colIdx === row.length - 1 ? 'text-right font-bold' : ''}`}>
                      {isStatusColumn(reportType, colIdx) ? (
                        <span className={`inline-block px-3 py-1 text-caption font-bold uppercase tracking-wider ${getStatusClass(cell)}`}>
                          {cell}
                        </span>
                      ) : (
                        cell
                      )}
                    </td>
                  ))}
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* ===== Export Actions ===== */}
      <section className="bg-tertiary-container text-on-tertiary p-10 mb-12">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-8">
          <div>
            <h3 className="text-headline-md font-bold text-on-tertiary mb-2">Xuất báo cáo</h3>
            <p className="font-body text-body-md text-on-tertiary/70">
              Chọn định dạng file để tải xuống báo cáo {REPORT_OPTIONS.find((r) => r.key === reportType)?.label?.toLowerCase()}.
            </p>
          </div>
          <div className="flex gap-4">
            {([
              { format: 'PDF' as const, icon: 'picture_as_pdf' },
              { format: 'Excel' as const, icon: 'table_view' },
              { format: 'CSV' as const, icon: 'csv' },
            ]).map((exp) => (
              <button
                key={exp.format}
                onClick={() => handleExport(exp.format)}
                className="flex items-center gap-3 px-6 py-4 border border-on-tertiary/20 hover:border-secondary hover:text-secondary transition-all duration-300 group cursor-pointer"
              >
                <span className="material-symbols-outlined">{exp.icon}</span>
                <span className="font-label text-label-md uppercase tracking-widest font-bold">
                  {exp.format}
                </span>
                <span className="material-symbols-outlined text-[18px] opacity-0 group-hover:opacity-100 transition-opacity">
                  download
                </span>
              </button>
            ))}
          </div>
        </div>
      </section>

      {/* ===== Toast ===== */}
      <Toast message={toast.message} visible={toast.visible} />
    </div>
  )
}
