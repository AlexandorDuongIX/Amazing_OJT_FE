import { useState } from 'react'

/* ============================================================
   CustomerManagement — AMAZING Admin
   Matches AdminLayout design system:
   - Gold primary (#C6A96B), dark sidebar (#111111)
   - White cards, uppercase labels, generous tracking
   - Meant to be rendered as children of <AdminLayout />
   ============================================================ */

type CustomerStatus = 'ACTIVE' | 'BLOCKED'
type OrderStatus = 'PROCESSING' | 'SHIPPED' | 'DELIVERED'

interface Order {
  id: string
  date: string
  status: OrderStatus
  total: string
}

interface Customer {
  id: string
  name: string
  email: string
  phone: string
  address: string
  totalOrders: number
  totalSpending: string
  status: CustomerStatus
  orders: Order[]
}

const dummyCustomers: Customer[] = [
  {
    id: 'CUS-001',
    name: 'Nguyễn Minh Anh',
    email: 'minhanh.nguyen@gmail.com',
    phone: '0901 234 567',
    address: '12 Lê Lợi, Quận 1, TP.HCM',
    totalOrders: 18,
    totalSpending: '42.500.000 VNĐ',
    status: 'ACTIVE',
    orders: [
      { id: 'ORD-2201', date: '02/12/2024', status: 'DELIVERED', total: '3.200.000 VNĐ' },
      { id: 'ORD-2214', date: '10/12/2024', status: 'SHIPPED', total: '1.850.000 VNĐ' },
      { id: 'ORD-2229', date: '18/12/2024', status: 'PROCESSING', total: '5.100.000 VNĐ' },
    ],
  },
  {
    id: 'CUS-002',
    name: 'Trần Bảo Ngọc',
    email: 'baongoc.tran@outlook.com',
    phone: '0912 345 678',
    address: '45 Nguyễn Huệ, Quận 1, TP.HCM',
    totalOrders: 6,
    totalSpending: '9.750.000 VNĐ',
    status: 'ACTIVE',
    orders: [
      { id: 'ORD-1987', date: '28/11/2024', status: 'DELIVERED', total: '2.400.000 VNĐ' },
      { id: 'ORD-2050', date: '05/12/2024', status: 'DELIVERED', total: '1.100.000 VNĐ' },
    ],
  },
  {
    id: 'CUS-003',
    name: 'Lê Hoàng Phúc',
    email: 'hoangphuc.le@yahoo.com',
    phone: '0987 654 321',
    address: '78 Điện Biên Phủ, Bình Thạnh, TP.HCM',
    totalOrders: 2,
    totalSpending: '1.200.000 VNĐ',
    status: 'BLOCKED',
    orders: [{ id: 'ORD-1755', date: '14/10/2024', status: 'DELIVERED', total: '1.200.000 VNĐ' }],
  },
  {
    id: 'CUS-004',
    name: 'Phạm Thu Hà',
    email: 'thuha.pham@gmail.com',
    phone: '0933 221 109',
    address: '23 Pasteur, Quận 3, TP.HCM',
    totalOrders: 31,
    totalSpending: '86.300.000 VNĐ',
    status: 'ACTIVE',
    orders: [
      { id: 'ORD-2101', date: '20/11/2024', status: 'DELIVERED', total: '4.400.000 VNĐ' },
      { id: 'ORD-2188', date: '08/12/2024', status: 'SHIPPED', total: '2.900.000 VNĐ' },
      { id: 'ORD-2233', date: '19/12/2024', status: 'PROCESSING', total: '6.700.000 VNĐ' },
    ],
  },
  {
    id: 'CUS-005',
    name: 'Đỗ Quang Huy',
    email: 'quanghuy.do@gmail.com',
    phone: '0977 888 234',
    address: '9 Hai Bà Trưng, Quận 1, TP.HCM',
    totalOrders: 0,
    totalSpending: '0 VNĐ',
    status: 'BLOCKED',
    orders: [],
  },
]

/* ---------------- Status Badges ---------------- */

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const styles =
    status === 'ACTIVE'
      ? 'bg-[#C6A96B] text-black'
      : 'bg-[#1A1A1A] text-white'
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  )
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles =
    status === 'PROCESSING'
      ? 'bg-[#C6A96B] text-black'
      : status === 'SHIPPED'
      ? 'bg-[#1A1A1A] text-white'
      : 'bg-[#E5E5E5] text-[#1A1A1A]'
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  )
}

/* ---------------- Stat Card (reused dashboard style) ---------------- */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string
  label: string
  value: string
  hint?: string
}) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 bg-[#1A1A1A] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {hint && (
          <span className="text-[12px] font-semibold text-[#C6A96B]">{hint}</span>
        )}
      </div>
      <p className="text-[11px] uppercase tracking-widest text-[#888888] mb-1">
        {label}
      </p>
      <p className="text-[20px] font-bold text-[#1A1A1A]">{value}</p>
    </div>
  )
}

/* ---------------- Customer Detail Panel ---------------- */

function CustomerDetailPanel({
  customer,
  onClose,
  onToggleStatus,
}: {
  customer: Customer
  onClose: () => void
  onToggleStatus: (id: string) => void
}) {
  const [confirming, setConfirming] = useState(false)

  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div
        className="absolute inset-0 bg-black/50"
        onClick={onClose}
      />

      {/* Side Panel */}
      <div className="relative w-full max-w-[520px] h-full bg-[#F5F5F5] overflow-y-auto border-l border-[#EAEAEA]">
        <div className="sticky top-0 bg-white border-b border-[#EAEAEA] px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#888888] mb-1">
              {customer.id}
            </p>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">{customer.name}</h2>
          </div>
          <button
            onClick={onClose}
            className="w-9 h-9 flex items-center justify-center border border-[#EAEAEA] hover:border-[#1A1A1A] transition-colors"
          >
            <span className="material-symbols-outlined text-[18px]">close</span>
          </button>
        </div>

        <div className="p-8 space-y-8">
          {/* Contact Info Card */}
          <div className="bg-white border border-[#EAEAEA] rounded-lg p-5 space-y-4">
            <div className="flex justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[#888888]">
                Email
              </span>
              <span className="text-[14px] text-[#1A1A1A]">{customer.email}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[#888888]">
                Phone
              </span>
              <span className="text-[14px] text-[#1A1A1A]">{customer.phone}</span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[#888888]">
                Address
              </span>
              <span className="text-[14px] text-[#1A1A1A] text-right max-w-[280px]">
                {customer.address}
              </span>
            </div>
            <div className="flex justify-between items-center">
              <span className="text-[11px] uppercase tracking-widest text-[#888888]">
                Status
              </span>
              <CustomerStatusBadge status={customer.status} />
            </div>
          </div>

          {/* Stats */}
          <div className="grid grid-cols-2 gap-4">
            <StatCard icon="shopping_bag" label="Total Orders" value={String(customer.totalOrders)} />
            <StatCard icon="payments" label="Total Spending" value={customer.totalSpending} />
          </div>

          {/* Purchase History */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">
              Purchase History
            </h3>
            <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
              {customer.orders.length === 0 ? (
                <p className="p-6 text-center text-[13px] text-[#888888]">
                  No orders yet
                </p>
              ) : (
                <table className="w-full">
                  <thead>
                    <tr className="border-b border-[#EAEAEA]">
                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                        Order ID
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                        Date
                      </th>
                      <th className="text-left px-5 py-3 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                        Status
                      </th>
                      <th className="text-right px-5 py-3 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                        Total
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {customer.orders.map((order) => (
                      <tr
                        key={order.id}
                        className="border-b border-[#EAEAEA] last:border-0 hover:bg-[#F9F9F9] transition-colors"
                      >
                        <td className="px-5 py-3 text-[13px] font-medium text-[#1A1A1A]">
                          {order.id}
                        </td>
                        <td className="px-5 py-3 text-[13px] text-[#888888]">{order.date}</td>
                        <td className="px-5 py-3">
                          <OrderStatusBadge status={order.status} />
                        </td>
                        <td className="px-5 py-3 text-[13px] text-right font-semibold text-[#1A1A1A]">
                          {order.total}
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              )}
            </div>
          </div>

          {/* Account Control */}
          <div>
            <h3 className="text-[13px] font-bold uppercase tracking-widest text-[#1A1A1A] mb-4">
              Account Control
            </h3>
            <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
              {!confirming ? (
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#888888]">
                    {customer.status === 'ACTIVE'
                      ? 'This customer currently has full access to the store.'
                      : 'This customer is currently blocked from placing orders.'}
                  </p>
                  <button
                    onClick={() => setConfirming(true)}
                    className={`px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ml-4 ${
                      customer.status === 'ACTIVE'
                        ? 'border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white'
                        : 'bg-[#C6A96B] text-black hover:opacity-90'
                    }`}
                  >
                    {customer.status === 'ACTIVE' ? 'Block Customer' : 'Unblock Customer'}
                  </button>
                </div>
              ) : (
                <div className="flex items-center justify-between">
                  <p className="text-[13px] text-[#1A1A1A] font-medium">
                    Are you sure you want to{' '}
                    {customer.status === 'ACTIVE' ? 'block' : 'unblock'} this customer?
                  </p>
                  <div className="flex gap-2 ml-4">
                    <button
                      onClick={() => setConfirming(false)}
                      className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest border border-[#EAEAEA] text-[#888888] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors"
                    >
                      Cancel
                    </button>
                    <button
                      onClick={() => {
                        onToggleStatus(customer.id)
                        setConfirming(false)
                      }}
                      className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest bg-[#1A1A1A] text-white hover:opacity-90 transition-colors"
                    >
                      Confirm
                    </button>
                  </div>
                </div>
              )}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}

/* ---------------- Main Page ---------------- */

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>(dummyCustomers)
  const [search, setSearch] = useState('')
  const [filter, setFilter] = useState<'ALL' | CustomerStatus>('ALL')
  const [selectedId, setSelectedId] = useState<string | null>(null)

  const filtered = customers.filter((c) => {
    const matchesSearch =
      c.name.toLowerCase().includes(search.toLowerCase()) ||
      c.email.toLowerCase().includes(search.toLowerCase())
    const matchesFilter = filter === 'ALL' || c.status === filter
    return matchesSearch && matchesFilter
  })

  const selectedCustomer = customers.find((c) => c.id === selectedId) ?? null

  const toggleStatus = (id: string) => {
    setCustomers((prev) =>
      prev.map((c) =>
        c.id === id
          ? { ...c, status: c.status === 'ACTIVE' ? 'BLOCKED' : 'ACTIVE' }
          : c
      )
    )
  }

  const totalActive = customers.filter((c) => c.status === 'ACTIVE').length
  const totalBlocked = customers.filter((c) => c.status === 'BLOCKED').length
  const totalSpendAll = customers.length

  return (
    <div>
        {/* Page Header */}
        <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
          <div>
            <h1 className="font-serif text-4xl font-medium leading-tight text-black">Quản lý Khách hàng</h1>
            <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
              Trang chủ &nbsp;/&nbsp; <strong className="text-black">CUSTOMERS</strong>
            </p>
          </div>
          <button className="flex items-center gap-2 px-5 py-3 bg-[#C6A96B] text-black text-[12px] font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">person_add</span>
          Add Customer
        </button>
      </header>

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard icon="group" label="Total Customers" value={String(customers.length)} />
        <StatCard icon="verified_user" label="Active Customers" value={String(totalActive)} />
        <StatCard icon="block" label="Blocked Customers" value={String(totalBlocked)} />
        <StatCard icon="person_add" label="New This Month" value={String(totalSpendAll)} hint="+5% vs last month" />
      </div>

      {/* Toolbar */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-5 mb-6 flex items-center justify-between gap-4">
        <div className="flex items-center gap-3 flex-1">
          <div className="relative flex-1 max-w-[360px]">
            <span className="material-symbols-outlined absolute left-3 top-1/2 -translate-y-1/2 text-[18px] text-[#888888]">
              search
            </span>
            <input
              value={search}
              onChange={(e) => setSearch(e.target.value)}
              placeholder="Search by name or email..."
              className="w-full pl-10 pr-4 py-2.5 border border-[#EAEAEA] text-[13px] text-[#1A1A1A] placeholder:text-[#888888] focus:outline-none focus:border-[#C6A96B] transition-colors"
            />
          </div>

          <select
            value={filter}
            onChange={(e) => setFilter(e.target.value as 'ALL' | CustomerStatus)}
            className="px-4 py-2.5 border border-[#EAEAEA] text-[12px] uppercase tracking-widest text-[#1A1A1A] focus:outline-none focus:border-[#C6A96B] transition-colors"
          >
            <option value="ALL">All</option>
            <option value="ACTIVE">Active</option>
            <option value="BLOCKED">Blocked</option>
          </select>
        </div>

        <p className="text-[12px] uppercase tracking-widest text-[#888888] whitespace-nowrap">
          {filtered.length} results
        </p>
      </div>

      {/* Customer Table */}
      <div className="bg-white border border-[#EAEAEA] rounded-lg overflow-hidden">
        <table className="w-full">
          <thead>
            <tr className="border-b border-[#EAEAEA] bg-[#FAFAFA]">
              <th className="text-left px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Customer Name
              </th>
              <th className="text-left px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Email
              </th>
              <th className="text-left px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Phone
              </th>
              <th className="text-center px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Total Orders
              </th>
              <th className="text-right px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Total Spending
              </th>
              <th className="text-center px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Status
              </th>
              <th className="text-right px-5 py-4 text-[11px] uppercase tracking-widest text-[#888888] font-semibold">
                Actions
              </th>
            </tr>
          </thead>
          <tbody>
            {filtered.map((customer) => (
              <tr
                key={customer.id}
                className="border-b border-[#EAEAEA] last:border-0 hover:bg-[#FAFAFA] transition-colors"
              >
                <td className="px-5 py-4">
                  <p className="text-[13px] font-semibold text-[#1A1A1A]">{customer.name}</p>
                  <p className="text-[11px] text-[#888888]">{customer.id}</p>
                </td>
                <td className="px-5 py-4 text-[13px] text-[#1A1A1A]">{customer.email}</td>
                <td className="px-5 py-4 text-[13px] text-[#1A1A1A]">{customer.phone}</td>
                <td className="px-5 py-4 text-[13px] text-center text-[#1A1A1A]">
                  {customer.totalOrders}
                </td>
                <td className="px-5 py-4 text-[13px] text-right font-semibold text-[#1A1A1A]">
                  {customer.totalSpending}
                </td>
                <td className="px-5 py-4 text-center">
                  <CustomerStatusBadge status={customer.status} />
                </td>
                <td className="px-5 py-4">
                  <div className="flex items-center justify-end gap-2">
                    <button
                      onClick={() => setSelectedId(customer.id)}
                      className="px-3 py-2 text-[11px] font-semibold uppercase tracking-widest border border-[#EAEAEA] text-[#1A1A1A] hover:border-[#1A1A1A] transition-colors"
                    >
                      View
                    </button>
                    <button
                      onClick={() => toggleStatus(customer.id)}
                      className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors ${
                        customer.status === 'ACTIVE'
                          ? 'bg-[#1A1A1A] text-white hover:opacity-90'
                          : 'bg-[#C6A96B] text-black hover:opacity-90'
                      }`}
                    >
                      {customer.status === 'ACTIVE' ? 'Block' : 'Unblock'}
                    </button>
                  </div>
                </td>
              </tr>
            ))}

            {filtered.length === 0 && (
              <tr>
                <td colSpan={7} className="px-5 py-10 text-center text-[13px] text-[#888888]">
                  No customers found
                </td>
              </tr>
            )}
          </tbody>
        </table>
      </div>

      {/* Detail Panel */}
      {selectedCustomer && (
        <CustomerDetailPanel
          customer={selectedCustomer}
          onClose={() => setSelectedId(null)}
          onToggleStatus={toggleStatus}
        />
      )}
    </div>
  )
}
