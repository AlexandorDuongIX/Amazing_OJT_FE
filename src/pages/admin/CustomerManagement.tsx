import { useState, useEffect, useMemo } from "react";

type CustomerStatus = "ACTIVE" | "BLOCKED";
type OrderStatus = "PROCESSING" | "SHIPPED" | "DELIVERED" | "CANCELLED";

const ORDER_STATUS_MAP: Record<number, OrderStatus> = {
  0: "PROCESSING",
  1: "PROCESSING",
  2: "SHIPPED",
  3: "DELIVERED",
  4: "CANCELLED",
};

interface Order {
  id: string;
  date: string;
  status: OrderStatus;
  total: string;
}

interface Customer {
  id: string;
  name: string;
  email: string;
  phone: string;
  address: string;
  totalOrders: number;
  totalSpending: string;
  status: CustomerStatus;
  orders: Order[];
}

const BASE_URL = "https://localhost:57867";

/* ---------------- Helpers ---------------- */

function formatCurrency(value: number): string {
  return value.toLocaleString("vi-VN", {
    style: "currency",
    currency: "VND",
    maximumFractionDigits: 0,
  });
}

function normalizeOrderStatus(raw: any): OrderStatus {
  if (typeof raw === "number") {
    return ORDER_STATUS_MAP[raw] ?? "PROCESSING";
  }

  const s = String(raw ?? "").toUpperCase();
  if (s.includes("CANCEL")) return "CANCELLED";
  if (s.includes("SHIP")) return "SHIPPED";
  if (s.includes("DELIVER")) return "DELIVERED";
  return "PROCESSING";
}

function formatAddress(addr: any): string {
  if (!addr) return "";
  return [addr.addressLine, addr.ward, addr.district, addr.province]
    .filter(Boolean)
    .join(", ");
}

// Picks the default address for a user, falling back to the first one.
function pickDefaultAddress(addresses: any[] | undefined): string {
  if (!addresses || addresses.length === 0) return "";
  const def = addresses.find((a) => a?.isDefault) ?? addresses[0];
  return formatAddress(def);
}

const TOKEN_KEYS = ["token", "accessToken", "access_token", "authToken", "jwt"];

function getAuthToken(): string | null {
  for (const key of TOKEN_KEYS) {
    const value = localStorage.getItem(key) ?? sessionStorage.getItem(key);
    if (value) return value;
  }
  return null;
}

function authHeaders() {
  const token = getAuthToken();
  const headers: Record<string, string> = {
    "Content-Type": "application/json",
  };
  if (token) headers.Authorization = `Bearer ${token}`;
  return headers;
}

/* ---------------- Status Badges ---------------- */

function CustomerStatusBadge({ status }: { status: CustomerStatus }) {
  const styles =
    status === "ACTIVE" ? "bg-[#C6A96B] text-black" : "bg-[#1A1A1A] text-white";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  );
}

function OrderStatusBadge({ status }: { status: OrderStatus }) {
  const styles =
    status === "PROCESSING"
      ? "bg-[#C6A96B] text-black"
      : status === "SHIPPED"
        ? "bg-[#1A1A1A] text-white"
        : status === "CANCELLED"
          ? "bg-[#F5C6C6] text-[#7A1E1E]"
          : "bg-[#E5E5E5] text-[#1A1A1A]";
  return (
    <span
      className={`inline-flex items-center px-3 py-1 text-[11px] font-semibold uppercase tracking-widest ${styles}`}
    >
      {status}
    </span>
  );
}

/* ---------------- Stat Card (reused dashboard style) ---------------- */

function StatCard({
  icon,
  label,
  value,
  hint,
}: {
  icon: string;
  label: string;
  value: string;
  hint?: string;
}) {
  return (
    <div className="bg-white border border-[#EAEAEA] rounded-lg p-5">
      <div className="flex items-center justify-between mb-6">
        <div className="w-11 h-11 bg-[#1A1A1A] flex items-center justify-center text-white">
          <span className="material-symbols-outlined text-[20px]">{icon}</span>
        </div>
        {hint && (
          <span className="text-[12px] font-semibold text-[#C6A96B]">
            {hint}
          </span>
        )}
      </div>
      <p className="text-[11px] uppercase tracking-widest text-[#888888] mb-1">
        {label}
      </p>
      <p className="text-[20px] font-bold text-[#1A1A1A]">{value}</p>
    </div>
  );
}

/* ---------------- Shared Confirm Dialog (used by table + panel) ---------------- */

function ConfirmStatusDialog({
  customer,
  busy,
  onCancel,
  onConfirm,
}: {
  customer: Customer;
  busy: boolean;
  onCancel: () => void;
  onConfirm: () => void;
}) {
  const willBlock = customer.status === "ACTIVE";

  return (
    <div className="fixed inset-0 z-[200] flex items-center justify-center px-4">
      <div className="absolute inset-0 bg-black/50" onClick={onCancel} />
      <div className="relative w-full max-w-[420px] bg-white rounded-lg border border-[#EAEAEA] p-6">
        <div className="flex items-start gap-4 mb-5">
          <div
            className={`w-11 h-11 flex items-center justify-center shrink-0 ${
              willBlock ? "bg-[#1A1A1A] text-white" : "bg-[#C6A96B] text-black"
            }`}
          >
            <span className="material-symbols-outlined text-[20px]">
              {willBlock ? "block" : "lock_open"}
            </span>
          </div>
          <div>
            <h3 className="text-[15px] font-bold text-[#1A1A1A] mb-1">
              {willBlock ? "Chặn khách hàng?" : "Bỏ chặn khách hàng?"}
            </h3>
            <p className="text-[13px] text-[#666666]">
              {willBlock
                ? `Bạn có chắc muốn chặn "${customer.name}"? Khách hàng này sẽ không thể đăng nhập hoặc đặt hàng.`
                : `Bạn có chắc muốn bỏ chặn "${customer.name}"? Khách hàng này sẽ có thể đăng nhập lại bình thường.`}
            </p>
          </div>
        </div>

        <div className="flex justify-end gap-2">
          <button
            onClick={onCancel}
            disabled={busy}
            className="px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest border border-[#EAEAEA] text-[#888888] hover:border-[#1A1A1A] hover:text-[#1A1A1A] transition-colors disabled:opacity-50"
          >
            Hủy
          </button>
          <button
            onClick={onConfirm}
            disabled={busy}
            className={`px-4 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-colors disabled:opacity-50 ${
              willBlock
                ? "bg-[#1A1A1A] text-white hover:opacity-90"
                : "bg-[#C6A96B] text-black hover:opacity-90"
            }`}
          >
            {busy ? "Đang xử lý..." : "Xác nhận"}
          </button>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Customer Detail Panel ---------------- */

function CustomerDetailPanel({
  customer,
  onClose,
  onRequestToggleStatus,
}: {
  customer: Customer;
  onClose: () => void;
  onRequestToggleStatus: (customer: Customer) => void;
}) {
  return (
    <div className="fixed inset-0 z-[100] flex justify-end">
      {/* Overlay */}
      <div className="absolute inset-0 bg-black/50" onClick={onClose} />

      {/* Side Panel */}
      <div className="relative w-full max-w-[520px] h-full bg-[#F5F5F5] overflow-y-auto border-l border-[#EAEAEA]">
        <div className="sticky top-0 bg-white border-b border-[#EAEAEA] px-8 py-6 flex items-center justify-between z-10">
          <div>
            <p className="text-[11px] uppercase tracking-widest text-[#888888] mb-1">
              {customer.id}
            </p>
            <h2 className="text-[20px] font-bold text-[#1A1A1A]">
              {customer.name}
            </h2>
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
              <span className="text-[14px] text-[#1A1A1A]">
                {customer.email}
              </span>
            </div>
            <div className="flex justify-between">
              <span className="text-[11px] uppercase tracking-widest text-[#888888]">
                Phone
              </span>
              <span className="text-[14px] text-[#1A1A1A]">
                {customer.phone || "Chưa cập nhật"}
              </span>
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
            <StatCard
              icon="shopping_bag"
              label="Total Orders"
              value={String(customer.totalOrders)}
            />
            <StatCard
              icon="payments"
              label="Total Spending"
              value={customer.totalSpending}
            />
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
                        <td className="px-5 py-3 text-[13px] text-[#888888]">
                          {order.date}
                        </td>
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
              <div className="flex items-center justify-between">
                <p className="text-[13px] text-[#888888]">
                  {customer.status === "ACTIVE"
                    ? "This customer currently has full access to the store."
                    : "This customer is currently blocked from placing orders."}
                </p>

                <button
                  onClick={() => onRequestToggleStatus(customer)}
                  className={`px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest transition-colors whitespace-nowrap ml-4 ${
                    customer.status === "ACTIVE"
                      ? "border border-[#1A1A1A] text-[#1A1A1A] hover:bg-[#1A1A1A] hover:text-white"
                      : "bg-[#C6A96B] text-black hover:opacity-90"
                  }`}
                >
                  {customer.status === "ACTIVE"
                    ? "Block Customer"
                    : "Unblock Customer"}
                </button>
              </div>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* ---------------- Main Page ---------------- */

export default function CustomerManagement() {
  const [customers, setCustomers] = useState<Customer[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [search, setSearch] = useState("");
  const [filter, setFilter] = useState<"ALL" | CustomerStatus>("ALL");
  const [selectedId, setSelectedId] = useState<string | null>(null);

  // Customer currently pending block/unblock confirmation (null = no dialog open)
  const [confirmTarget, setConfirmTarget] = useState<Customer | null>(null);
  const [togglingId, setTogglingId] = useState<string | null>(null);
  const [actionError, setActionError] = useState<string | null>(null);

  const fetchCustomers = async () => {
    try {
      setLoading(true);
      setError(null);
      const headers = authHeaders();

      if (!getAuthToken()) {
        throw new Error(
          "Bạn chưa đăng nhập hoặc phiên đăng nhập đã hết hạn. Vui lòng đăng nhập lại bằng tài khoản Admin.",
        );
      }

      // 1) Load users
      const usersRes = await fetch(`${BASE_URL}/api/Users`, { headers });
      if (usersRes.status === 401) {
        throw new Error(
          "Phiên đăng nhập đã hết hạn hoặc tài khoản không có quyền Admin. Vui lòng đăng nhập lại.",
        );
      }
      if (!usersRes.ok) throw new Error("Failed to fetch users");
      const usersData = await usersRes.json();
      const users: any[] = Array.isArray(usersData)
        ? usersData
        : (usersData.items ?? usersData.data ?? []);

      let ordersByUser: Record<string, any[]> = {};
      try {
        const ordersRes = await fetch(`${BASE_URL}/api/Orders`, { headers });
        if (ordersRes.ok) {
          const ordersData = await ordersRes.json();
          const orders: any[] = Array.isArray(ordersData)
            ? ordersData
            : (ordersData.items ?? ordersData.data ?? []);

          for (const o of orders) {
            if (o.isDeleted) continue;
            const uid = String(o.userId ?? o.user?.id ?? "");
            if (!uid) continue;
            if (!ordersByUser[uid]) ordersByUser[uid] = [];
            ordersByUser[uid].push(o);
          }
        }
      } catch {
        // Orders are supplementary — if they fail to load we still show customers.
      }

      const mapped: Customer[] = users.map((u: any) => {
        const uid = String(u.id);
        const rawOrders = ordersByUser[uid] ?? [];

        const orders: Order[] = rawOrders
          .map((o: any) => ({
            id: String(o.orderNumber ?? o.id ?? ""),
            date: o.createdAt ?? o.shippedDate ?? "",
            status: normalizeOrderStatus(o.status),
            total: formatCurrency(Number(o.totalPrice ?? 0)),
            _sortDate: o.createdAt ?? o.shippedDate ?? "",
          }))
          .sort(
            (a: any, b: any) =>
              new Date(b._sortDate).getTime() - new Date(a._sortDate).getTime(),
          )
          .map(({ _sortDate, ...order }: any) => order);

        const totalSpendingValue = rawOrders.reduce(
          (sum: number, o: any) => sum + Number(o.totalPrice ?? 0),
          0,
        );

        const userFromOrder = rawOrders[0]?.user;
        const addressFromOrders = pickDefaultAddress(userFromOrder?.addresses);
        const addressFromOrderShipping = rawOrders[0]
          ? [
              rawOrders[0].shippingAddress,
              rawOrders[0].city ?? rawOrders[0].district,
              rawOrders[0].state ?? rawOrders[0].province,
            ]
              .filter(Boolean)
              .join(", ")
          : "";

        return {
          id: uid,
          name:
            `${u.firstName ?? ""} ${u.lastName ?? ""}`.trim() ||
            u.userName ||
            u.email,
          email: u.email ?? "",
          phone: u.phoneNumber ?? u.phone ?? "",
          address:
            addressFromOrders ||
            addressFromOrderShipping ||
            pickDefaultAddress(u.addresses) ||
            "Chưa cập nhật",
          totalOrders: rawOrders.length,
          totalSpending: formatCurrency(totalSpendingValue),
          status: u.isActive === false ? "BLOCKED" : "ACTIVE",
          orders,
        };
      });

      setCustomers(mapped);
    } catch (err: any) {
      setError(err.message ?? "Failed to load customers");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCustomers();
  }, []);

  const filtered = useMemo(
    () =>
      customers.filter((c) => {
        const matchesSearch =
          c.name.toLowerCase().includes(search.toLowerCase()) ||
          c.email.toLowerCase().includes(search.toLowerCase());
        const matchesFilter = filter === "ALL" || c.status === filter;
        return matchesSearch && matchesFilter;
      }),
    [customers, search, filter],
  );

  const selectedCustomer = customers.find((c) => c.id === selectedId) ?? null;

  // Opens the confirmation dialog instead of toggling immediately.
  const requestToggleStatus = (customer: Customer) => {
    setActionError(null);
    setConfirmTarget(customer);
  };

  // Actually calls the lock/unlock endpoint after the user confirms.
  const confirmToggleStatus = async () => {
    if (!confirmTarget) return;
    const { id, status } = confirmTarget;

    try {
      setTogglingId(id);
      setActionError(null);
      const headers = authHeaders();

      // status is the CURRENT status: ACTIVE -> lock (block), BLOCKED -> unlock
      const url =
        status === "ACTIVE"
          ? `${BASE_URL}/api/Users/${id}/lock`
          : `${BASE_URL}/api/Users/${id}/unlock`;

      const res = await fetch(url, { method: "POST", headers });

      if (res.status === 401) {
        throw new Error(
          "Phiên đăng nhập đã hết hạn hoặc tài khoản không có quyền Admin/Manager. Vui lòng đăng nhập lại.",
        );
      }

      if (!res.ok) {
        const text = await res.text().catch(() => "");
        throw new Error(text || "Không thể cập nhật trạng thái khách hàng");
      }

      // Optimistically flip status locally, then re-sync with the server.
      setCustomers((prev) =>
        prev.map((c) =>
          c.id === id
            ? { ...c, status: status === "ACTIVE" ? "BLOCKED" : "ACTIVE" }
            : c,
        ),
      );
      setConfirmTarget(null);
      await fetchCustomers();
    } catch (err: any) {
      setActionError(err.message ?? "Không thể cập nhật trạng thái khách hàng");
    } finally {
      setTogglingId(null);
    }
  };

  const totalActive = customers.filter((c) => c.status === "ACTIVE").length;
  const totalBlocked = customers.filter((c) => c.status === "BLOCKED").length;

  if (error) {
    return (
      <div className="bg-white border border-[#EAEAEA] rounded-lg p-8 text-center">
        <p className="text-[14px] text-[#7A1E1E] mb-4">Lỗi: {error}</p>
        <button
          onClick={fetchCustomers}
          className="px-5 py-2.5 text-[12px] font-semibold uppercase tracking-widest bg-[#1A1A1A] text-white hover:opacity-90 transition-colors"
        >
          Thử lại
        </button>
      </div>
    );
  }

  return (
    <div>
      {/* Page Header */}
      <header className="flex flex-col gap-6 sm:flex-row sm:items-end sm:justify-between mb-8">
        <div>
          <h1 className="font-serif text-4xl font-medium leading-tight text-black">
            Quản lý Khách hàng
          </h1>
          <p className="mt-2 text-[11px] uppercase tracking-[0.15em] text-[#444748]">
            Trang chủ &nbsp;/&nbsp;{" "}
            <strong className="text-black">CUSTOMERS</strong>
          </p>
        </div>
        <button className="flex items-center gap-2 px-5 py-3 bg-[#C6A96B] text-black text-[12px] font-semibold uppercase tracking-widest hover:opacity-90 transition-opacity">
          <span className="material-symbols-outlined text-[18px]">
            person_add
          </span>
          Add Customer
        </button>
      </header>

      {actionError && (
        <div className="mb-6 px-5 py-3 bg-[#FDEDED] border border-[#F5C6C6] text-[#7A1E1E] text-[13px] rounded-lg">
          {actionError}
        </div>
      )}

      {/* Stat Cards */}
      <div className="grid grid-cols-4 gap-4 mb-6">
        <StatCard
          icon="group"
          label="Total Customers"
          value={String(customers.length)}
        />
        <StatCard
          icon="verified_user"
          label="Active Customers"
          value={String(totalActive)}
        />
        <StatCard
          icon="block"
          label="Blocked Customers"
          value={String(totalBlocked)}
        />
        <StatCard
          icon="shopping_bag"
          label="Total Orders"
          value={String(customers.reduce((sum, c) => sum + c.totalOrders, 0))}
        />
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
            onChange={(e) =>
              setFilter(e.target.value as "ALL" | CustomerStatus)
            }
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
            {loading && customers.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[13px] text-[#888888]"
                >
                  Đang tải...
                </td>
              </tr>
            )}

            {!loading &&
              filtered.map((customer) => (
                <tr
                  key={customer.id}
                  className="border-b border-[#EAEAEA] last:border-0 hover:bg-[#FAFAFA] transition-colors"
                >
                  <td className="px-5 py-4">
                    <p className="text-[13px] font-semibold text-[#1A1A1A]">
                      {customer.name}
                    </p>
                    <p className="text-[11px] text-[#888888]">{customer.id}</p>
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#1A1A1A]">
                    {customer.email}
                  </td>
                  <td className="px-5 py-4 text-[13px] text-[#1A1A1A]">
                    {customer.phone || "—"}
                  </td>
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
                        onClick={() => requestToggleStatus(customer)}
                        disabled={togglingId === customer.id}
                        className={`px-3 py-2 text-[11px] font-semibold uppercase tracking-widest transition-colors disabled:opacity-50 ${
                          customer.status === "ACTIVE"
                            ? "bg-[#1A1A1A] text-white hover:opacity-90"
                            : "bg-[#C6A96B] text-black hover:opacity-90"
                        }`}
                      >
                        {customer.status === "ACTIVE" ? "Block" : "Unblock"}
                      </button>
                    </div>
                  </td>
                </tr>
              ))}

            {!loading && filtered.length === 0 && (
              <tr>
                <td
                  colSpan={7}
                  className="px-5 py-10 text-center text-[13px] text-[#888888]"
                >
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
          onRequestToggleStatus={requestToggleStatus}
        />
      )}

      {/* Shared confirm dialog for block/unblock, used by both table and panel */}
      {confirmTarget && (
        <ConfirmStatusDialog
          customer={confirmTarget}
          busy={togglingId === confirmTarget.id}
          onCancel={() => setConfirmTarget(null)}
          onConfirm={confirmToggleStatus}
        />
      )}
    </div>
  );
}
