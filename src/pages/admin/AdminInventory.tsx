import { useState } from "react";

/* ============================================================
   InventoryPage — Quản lý Sản phẩm
   ============================================================
   Matches the Figma design:
   - Stats cards: Tổng sản phẩm, Sắp hết hàng, Đang bán, Hết hàng
   - Search / filter bar
   - Product table with image, name/SKU, category, price, stock bar, status, actions
   - Pagination
   ============================================================ */

// ─── Types ──────────────────────────────────────────────────

type ProductStatus = "ACTIVE" | "LOW STOCK" | "OUT OF STOCK" | "DRAFT";

interface Product {
  id: string;
  image: string;
  name: string;
  sku: string;
  category: string;
  price: number;
  stock: number;
  maxStock: number;
  status: ProductStatus;
}

// ─── Mock Data ───────────────────────────────────────────────

const MOCK_PRODUCTS: Product[] = [
  {
    id: "1",
    image:
      "https://images.unsplash.com/photo-1566174053879-31528523f8ae?w=80&h=80&fit=crop",
    name: "Silk Evening Dress 'L'Amour'",
    sku: "AMZ-DRS-001",
    category: "THỜI TRANG NỮ",
    price: 12500000,
    stock: 45,
    maxStock: 100,
    status: "ACTIVE",
  },
  {
    id: "2",
    image:
      "https://images.unsplash.com/photo-1548883354-94bcfe321cbb?w=80&h=80&fit=crop",
    name: "Limited Cashmere Overcoat",
    sku: "AMZ-COT-092",
    category: "THỜI TRANG NAM",
    price: 28000000,
    stock: 3,
    maxStock: 50,
    status: "LOW STOCK",
  },
  {
    id: "3",
    image:
      "https://images.unsplash.com/photo-1584917865442-de89df76afd3?w=80&h=80&fit=crop",
    name: "Signature Leather Tote",
    sku: "AMZ-ACC-512",
    category: "PHỤ KIỆN",
    price: 18200000,
    stock: 0,
    maxStock: 30,
    status: "OUT OF STOCK",
  },
  {
    id: "4",
    image:
      "https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?w=80&h=80&fit=crop",
    name: "Velvet Blazer Noir",
    sku: "AMZ-BLZ-034",
    category: "THỜI TRANG NỮ",
    price: 9800000,
    stock: 22,
    maxStock: 60,
    status: "ACTIVE",
  },
  {
    id: "5",
    image:
      "https://images.unsplash.com/photo-1542291026-7eec264c27ff?w=80&h=80&fit=crop",
    name: "Classic Oxford Sneakers",
    sku: "AMZ-SHO-201",
    category: "GIÀY DÉP",
    price: 4500000,
    stock: 67,
    maxStock: 120,
    status: "ACTIVE",
  },
  {
    id: "6",
    image:
      "https://images.unsplash.com/photo-1601924994987-69e26d50dc26?w=80&h=80&fit=crop",
    name: "Linen Summer Dress",
    sku: "AMZ-DRS-078",
    category: "THỜI TRANG NỮ",
    price: 6200000,
    stock: 5,
    maxStock: 80,
    status: "LOW STOCK",
  },
  {
    id: "7",
    image:
      "https://images.unsplash.com/photo-1553062407-98eeb64c6a62?w=80&h=80&fit=crop",
    name: "Heritage Canvas Backpack",
    sku: "AMZ-BAG-310",
    category: "PHỤ KIỆN",
    price: 3800000,
    stock: 88,
    maxStock: 150,
    status: "ACTIVE",
  },
  {
    id: "8",
    image:
      "https://images.unsplash.com/photo-1559056199-641a0ac8b55e?w=80&h=80&fit=crop",
    name: "Tailored Wool Trousers",
    sku: "AMZ-TRS-056",
    category: "THỜI TRANG NAM",
    price: 7600000,
    stock: 0,
    maxStock: 40,
    status: "DRAFT",
  },
  {
    id: "9",
    image:
      "https://images.unsplash.com/photo-1523275335684-37898b6baf30?w=80&h=80&fit=crop",
    name: "Gold Mesh Watch",
    sku: "AMZ-WCH-009",
    category: "PHỤ KIỆN",
    price: 42000000,
    stock: 8,
    maxStock: 20,
    status: "LOW STOCK",
  },
  {
    id: "10",
    image:
      "https://images.unsplash.com/photo-1609709295948-17d77cb2a69b?w=80&h=80&fit=crop",
    name: "Structured Mini Bag",
    sku: "AMZ-BAG-445",
    category: "PHỤ KIỆN",
    price: 15900000,
    stock: 0,
    maxStock: 25,
    status: "OUT OF STOCK",
  },
];

const CATEGORIES = [
  "Tất cả danh mục",
  "THỜI TRANG NỮ",
  "THỜI TRANG NAM",
  "PHỤ KIỆN",
  "GIÀY DÉP",
];
const STATUSES = [
  "Mọi trạng thái",
  "ACTIVE",
  "LOW STOCK",
  "OUT OF STOCK",
  "DRAFT",
];
const PAGE_SIZE = 10;

// ─── Helpers ────────────────────────────────────────────────

function formatVND(amount: number) {
  return amount.toLocaleString("vi-VN") + " VNĐ";
}

function statusStyle(status: ProductStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-emerald-100 text-emerald-800 border border-emerald-200";
    case "LOW STOCK":
      return "bg-amber-100 text-amber-800 border border-amber-200";
    case "OUT OF STOCK":
      return "bg-red-100 text-red-700 border border-red-200";
    case "DRAFT":
      return "bg-gray-100 text-gray-500 border border-gray-200";
  }
}

function stockBarColor(status: ProductStatus) {
  switch (status) {
    case "ACTIVE":
      return "bg-on-surface";
    case "LOW STOCK":
      return "bg-amber-500";
    case "OUT OF STOCK":
    case "DRAFT":
      return "bg-red-400";
  }
}

// ─── Sub-components ──────────────────────────────────────────

function StatCard({
  label,
  value,
  badge,
  badgeColor,
  icon,
  accent,
}: {
  label: string;
  value: string | number;
  badge?: string;
  badgeColor?: string;
  icon?: string;
  accent?: boolean;
}) {
  return (
    <div
      className={`flex-1 min-w-0 px-8 py-6 border border-outline-variant/30 bg-surface-container-low ${
        accent ? "border-l-2 border-l-secondary" : ""
      }`}
    >
      <p className="font-label uppercase tracking-widest text-caption text-on-surface-variant/70 mb-3">
        {label}
      </p>
      <div className="flex items-end gap-3">
        <span
          className={`font-headline font-bold text-[28px] leading-none ${
            accent ? "text-secondary" : "text-on-surface"
          }`}
        >
          {value}
        </span>
        {badge && (
          <span
            className={`font-label text-caption font-semibold mb-0.5 ${badgeColor}`}
          >
            {badge}
          </span>
        )}
        {icon && (
          <span
            className={`material-symbols-outlined text-[20px] mb-0.5 ${badgeColor}`}
          >
            {icon}
          </span>
        )}
      </div>
    </div>
  );
}

function StockBar({
  stock,
  maxStock,
  status,
}: {
  stock: number;
  maxStock: number;
  status: ProductStatus;
}) {
  const pct = maxStock > 0 ? Math.round((stock / maxStock) * 100) : 0;
  return (
    <div className="flex items-center gap-3">
      <span
        className={`font-headline font-semibold text-body-md min-w-[24px] ${
          status === "LOW STOCK"
            ? "text-amber-600"
            : status === "OUT OF STOCK"
              ? "text-red-500"
              : "text-on-surface"
        }`}
      >
        {stock}
      </span>
      <div className="w-16 h-[3px] bg-outline-variant/30 rounded-full overflow-hidden">
        <div
          className={`h-full rounded-full ${stockBarColor(status)}`}
          style={{ width: `${pct}%` }}
        />
      </div>
    </div>
  );
}

// ─── Main Page ───────────────────────────────────────────────

export default function InventoryPage() {
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("Tất cả danh mục");
  const [statusFilter, setStatusFilter] = useState("Mọi trạng thái");
  const [currentPage, setCurrentPage] = useState(1);

  // ── Derived stats
  const totalProducts = 1240;
  const lowStock = MOCK_PRODUCTS.filter((p) => p.status === "LOW STOCK").length;
  const active = MOCK_PRODUCTS.filter((p) => p.status === "ACTIVE").length;
  const outOfStock = MOCK_PRODUCTS.filter(
    (p) => p.status === "OUT OF STOCK",
  ).length;

  // ── Filtering
  const filtered = MOCK_PRODUCTS.filter((p) => {
    const matchSearch =
      search === "" ||
      p.name.toLowerCase().includes(search.toLowerCase()) ||
      p.sku.toLowerCase().includes(search.toLowerCase());
    const matchCat = category === "Tất cả danh mục" || p.category === category;
    const matchStatus =
      statusFilter === "Mọi trạng thái" || p.status === statusFilter;
    return matchSearch && matchCat && matchStatus;
  });

  const totalPages = Math.max(1, Math.ceil(filtered.length / PAGE_SIZE));
  const paginated = filtered.slice(
    (currentPage - 1) * PAGE_SIZE,
    currentPage * PAGE_SIZE,
  );

  function handleFilter() {
    setCurrentPage(1);
  }

  function handleReset() {
    setSearch("");
    setCategory("Tất cả danh mục");
    setStatusFilter("Mọi trạng thái");
    setCurrentPage(1);
  }

  // ── Pagination pages array
  const pages: (number | "...")[] = [];
  if (totalPages <= 7) {
    for (let i = 1; i <= totalPages; i++) pages.push(i);
  } else {
    pages.push(1, 2, 3);
    if (currentPage > 4) pages.push("...");
    if (currentPage > 3 && currentPage < totalPages - 2)
      pages.push(currentPage);
    if (currentPage < totalPages - 3) pages.push("...");
    pages.push(totalPages);
  }

  return (
    <div className="space-y-8">
      {/* ── Page Header ── */}
      <div className="flex items-start justify-between">
        <div>
          <h2 className="font-headline font-bold text-[32px] tracking-tight text-on-surface">
            Quản lý Sản phẩm
          </h2>
          <p className="font-label uppercase tracking-widest text-caption text-on-surface-variant/60 mt-1">
            Trang chủ &nbsp;/&nbsp;{" "}
            <span className="text-on-surface-variant">Inventory</span>
          </p>
        </div>
        <button className="flex items-center gap-2 bg-on-surface text-surface px-6 py-3 font-label uppercase tracking-widest text-label-sm hover:bg-on-surface/80 transition-colors">
          <span className="material-symbols-outlined text-[18px]">add</span>
          Thêm sản phẩm mới
        </button>
      </div>

      {/* ── Stats Cards ── */}
      <div className="flex gap-0 border border-outline-variant/30 divide-x divide-outline-variant/30">
        <StatCard
          label="Tổng sản phẩm"
          value="1,240"
          badge="+2.4%"
          badgeColor="text-emerald-500"
        />
        <StatCard
          label="Sắp hết hàng"
          value={lowStock}
          icon="trending_down"
          badgeColor="text-amber-500"
          accent
        />
        <StatCard
          label="Đang bán"
          value="1,150"
          badge="Live"
          badgeColor="text-on-surface-variant/50"
        />
        <StatCard
          label="Hết hàng"
          value={outOfStock}
          icon="pause_circle"
          badgeColor="text-on-surface-variant/40"
        />
      </div>

      {/* ── Filter Bar ── */}
      <div className="flex items-end gap-4">
        {/* Search */}
        <div className="flex flex-col gap-1.5 flex-1 min-w-0 max-w-xs">
          <label className="font-label uppercase tracking-widest text-caption text-on-surface-variant/70">
            Tìm kiếm
          </label>
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Tên sản phẩm"
            className="border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface placeholder-on-surface-variant/40 focus:outline-none focus:border-on-surface transition-colors"
          />
        </div>

        {/* Danh mục */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label uppercase tracking-widest text-caption text-on-surface-variant/70">
            Danh mục
          </label>
          <select
            value={category}
            onChange={(e) => setCategory(e.target.value)}
            className="border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-on-surface appearance-none pr-10 min-w-[180px] cursor-pointer"
          >
            {CATEGORIES.map((c) => (
              <option key={c}>{c}</option>
            ))}
          </select>
        </div>

        {/* Trạng thái */}
        <div className="flex flex-col gap-1.5">
          <label className="font-label uppercase tracking-widest text-caption text-on-surface-variant/70">
            Trạng thái
          </label>
          <select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value)}
            className="border border-outline-variant bg-surface-container-low px-4 py-2.5 text-body-md text-on-surface focus:outline-none focus:border-on-surface appearance-none pr-10 min-w-[180px] cursor-pointer"
          >
            {STATUSES.map((s) => (
              <option key={s}>{s}</option>
            ))}
          </select>
        </div>

        {/* Actions */}
        <div className="flex gap-2 pb-0">
          <button
            onClick={handleFilter}
            className="border border-on-surface bg-on-surface text-surface px-6 py-2.5 font-label uppercase tracking-widest text-label-sm hover:bg-on-surface/80 transition-colors"
          >
            Lọc kết quả
          </button>
          <button
            onClick={handleReset}
            className="border border-outline-variant bg-surface px-3 py-2.5 text-on-surface-variant hover:text-on-surface hover:border-on-surface transition-colors"
            title="Reset bộ lọc"
          >
            <span className="material-symbols-outlined text-[20px]">
              refresh
            </span>
          </button>
        </div>
      </div>

      {/* ── Product Table ── */}
      <div className="border border-outline-variant/30">
        {/* Table Header */}
        <div className="grid grid-cols-[80px_1fr_140px_160px_140px_120px_80px] gap-4 px-6 py-4 border-b border-outline-variant/30 bg-surface-container-low">
          {[
            "ẢNH",
            "SẢN PHẨM",
            "DANH MỤC",
            "GIÁ BÁN",
            "TỒN KHO",
            "TRẠNG THÁI",
            "HÀNH ĐỘNG",
          ].map((col) => (
            <span
              key={col}
              className="font-label uppercase tracking-widest text-caption text-on-surface-variant/60 text-[11px]"
            >
              {col}
            </span>
          ))}
        </div>

        {/* Table Rows */}
        {paginated.length === 0 ? (
          <div className="py-20 text-center text-on-surface-variant/50 font-body">
            Không tìm thấy sản phẩm nào.
          </div>
        ) : (
          <div className="divide-y divide-outline-variant/20">
            {paginated.map((product) => (
              <div
                key={product.id}
                className="grid grid-cols-[80px_1fr_140px_160px_140px_120px_80px] gap-4 px-6 py-5 items-center hover:bg-surface-container-low/60 transition-colors group"
              >
                {/* Image */}
                <div className="w-14 h-14 bg-surface-container-highest overflow-hidden flex-shrink-0">
                  <img
                    src={product.image}
                    alt={product.name}
                    className="w-full h-full object-cover"
                    onError={(e) => {
                      const t = e.target as HTMLImageElement;
                      t.src = `https://placehold.co/56x56/1a1a1a/888?text=${product.sku.slice(-3)}`;
                    }}
                  />
                </div>

                {/* Name / SKU */}
                <div className="min-w-0">
                  <p className="font-headline font-semibold text-body-md text-on-surface leading-snug truncate">
                    {product.name}
                  </p>
                  <p className="font-label text-caption text-on-surface-variant/50 mt-0.5 uppercase tracking-wider">
                    SKU: {product.sku}
                  </p>
                </div>

                {/* Category */}
                <span className="font-label text-caption uppercase tracking-wider text-on-surface-variant/70 leading-snug">
                  {product.category}
                </span>

                {/* Price */}
                <span className="font-headline font-semibold text-body-md text-on-surface">
                  {formatVND(product.price)}
                </span>

                {/* Stock bar */}
                <StockBar
                  stock={product.stock}
                  maxStock={product.maxStock}
                  status={product.status}
                />

                {/* Status badge */}
                <span
                  className={`inline-flex items-center justify-center px-3 py-1 font-label uppercase tracking-widest text-[10px] font-bold w-fit ${statusStyle(
                    product.status,
                  )}`}
                >
                  {product.status}
                </span>

                {/* Actions */}
                <div className="flex items-center gap-2 opacity-60 group-hover:opacity-100 transition-opacity">
                  <button
                    title="Chỉnh sửa"
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      edit_note
                    </span>
                  </button>
                  <button
                    title="Xem chi tiết"
                    className="p-1 hover:text-primary transition-colors"
                  >
                    <span className="material-symbols-outlined text-[18px]">
                      open_in_new
                    </span>
                  </button>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* ── Pagination ── */}
      <div className="flex items-center justify-between">
        <p className="font-body text-caption text-on-surface-variant/60 uppercase tracking-wider">
          Hiển thị{" "}
          {Math.min((currentPage - 1) * PAGE_SIZE + 1, filtered.length)}–
          {Math.min(currentPage * PAGE_SIZE, filtered.length)} của{" "}
          {filtered.length} sản phẩm
        </p>

        <div className="flex items-center gap-1">
          {/* Prev */}
          <button
            onClick={() => setCurrentPage((p) => Math.max(1, p - 1))}
            disabled={currentPage === 1}
            className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant disabled:opacity-30 hover:border-on-surface hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              chevron_left
            </span>
          </button>

          {/* Page numbers */}
          {pages.map((p, i) =>
            p === "..." ? (
              <span
                key={`ellipsis-${i}`}
                className="w-9 h-9 flex items-center justify-center text-on-surface-variant/40 text-sm"
              >
                …
              </span>
            ) : (
              <button
                key={p}
                onClick={() => setCurrentPage(p as number)}
                className={`w-9 h-9 flex items-center justify-center border font-label text-label-sm transition-colors ${
                  currentPage === p
                    ? "border-on-surface bg-on-surface text-surface"
                    : "border-outline-variant/30 text-on-surface-variant hover:border-on-surface hover:text-on-surface"
                }`}
              >
                {p}
              </button>
            ),
          )}

          {/* Next */}
          <button
            onClick={() => setCurrentPage((p) => Math.min(totalPages, p + 1))}
            disabled={currentPage === totalPages}
            className="w-9 h-9 flex items-center justify-center border border-outline-variant/30 text-on-surface-variant disabled:opacity-30 hover:border-on-surface hover:text-on-surface transition-colors"
          >
            <span className="material-symbols-outlined text-[16px]">
              chevron_right
            </span>
          </button>
        </div>
      </div>
    </div>
  );
}
