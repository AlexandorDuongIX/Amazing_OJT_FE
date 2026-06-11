import { useState, useEffect, useMemo } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import axios from 'axios'
import { useCartStore } from '../../store/cartStore'

/* ============================================================
   ProductListPage — AMAZING Clothing Shop (Customer Page)
   ============================================================
   Sections:
   1. Page Header with Filters & Sort
   2. Product Grid (2 cols mobile / 4 cols desktop)
   3. Load More Button
   ============================================================ */

/* ---------- Product Data (from API) ---------- */
interface Product {
  id: number
  name: string
  description: string
  price: number
  discountPrice: number
  category: string
  sku: string
  brand: string
  color: string
  size: string
  material: string
  imageUrl: string
  rating: number
  reviewCount: number
  isActive: boolean
}

/* ---------- Helpers ---------- */
const formatVND = (amount: number) =>
  amount.toLocaleString('vi-VN') + ' ₫'

/* ---------- Filter Select ---------- */
interface FilterSelectProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-outline pb-1 pr-6 font-label text-[14px] font-semibold text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer w-full md:w-auto transition-colors duration-200 appearance-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'292.4'%20height%3D'292.4'%3E%3Cpath%20fill%3D'%231b1c1c'%20d%3D'M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z'%2F%3E%3C%2Fsvg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right .5em top 50%',
          backgroundSize: '.55em auto',
        }}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ---------- Product Card ---------- */
interface ProductCardProps {
  product: Product
  onAddToCart: () => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate()
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)
  const hasDiscount = product.discountPrice < product.price

  return (
    <div
      className="group product-card cursor-pointer"
      onClick={() => navigate(`/product/${product.id}`)}
      role="button"
      tabIndex={0}
      onKeyDown={(event) => {
        if (event.key === 'Enter' || event.key === ' ') {
          event.preventDefault()
          navigate(`/product/${product.id}`)
        }
      }}
    >
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-surface-container-low">
        {/* Product Image */}
        <img
          src={imgError ? 'https://via.placeholder.com/400x533?text=No+Image' : product.imageUrl}
          alt={product.name}
          onError={() => setImgError(true)}
          className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Wishlist Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-surface/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-surface/80"
          onClick={(event) => {
            event.stopPropagation()
            setWished((w) => !w)
          }}
          aria-label="Thêm vào yêu thích"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${wished ? 'text-error' : 'text-on-surface hover:text-secondary'
              }`}
            style={wished ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            favorite
          </span>
        </button>

        {/* Add to Cart — Slides up on hover */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button
            onClick={(e) => { e.stopPropagation(); onAddToCart() }}
            className="w-full py-3 bg-primary text-on-primary font-label text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary transition-colors duration-200"
          >
            Thêm Vào Giỏ
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-1">
        <h3 className="font-headline text-[18px] md:text-[20px] font-medium text-on-surface mb-1 leading-snug">
          {product.name}
        </h3>
        {hasDiscount ? (
          <div className="flex items-center justify-center gap-2">
            <span className="font-body text-[14px] font-semibold text-error">
              {formatVND(product.discountPrice)}
            </span>
            <span className="font-body text-[13px] text-on-surface-variant line-through">
              {formatVND(product.price)}
            </span>
          </div>
        ) : (
          <p className="font-body text-[14px] text-on-surface-variant">{formatVND(product.price)}</p>
        )}
      </div>
    </div>
  )
}

/* ---------- Skeleton Card ---------- */
function SkeletonCard() {
  return (
    <div className="animate-pulse">
      <div className="aspect-[3/4] bg-surface-container rounded mb-4" />
      <div className="space-y-2 px-1">
        <div className="h-3 bg-surface-container rounded w-1/2 mx-auto" />
        <div className="h-4 bg-surface-container rounded w-3/4 mx-auto" />
        <div className="h-3 bg-surface-container rounded w-1/3 mx-auto" />
      </div>
    </div>
  )
}

/* ---------- Category label map ---------- */
const CATEGORY_TITLES: Record<string, string> = {
  nam: 'Thời Trang Nam',
  nu: 'Thời Trang Nữ',
  'phu-kien': 'Phụ Kiện',
}

/* ---------- ProductListPage ---------- */
export default function ProductListPage() {
  const { category } = useParams<{ category?: string }>()
  const pageTitle = category ? (CATEGORY_TITLES[category] ?? 'Bộ Sưu Tập') : 'Tất Cả Sản Phẩm'
  const { addItem, showToast } = useCartStore()

  const [products, setProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [filterCategory, setFilterCategory] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)

  /* ── Fetch from API ── */
  useEffect(() => {
    const apiBase = import.meta.env.VITE_API_BASE_URL
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setLoading(true)
    setError(null)
    axios
      .get<Product[]>(`${apiBase}/product`)
      .then((res) => {
        setProducts(res.data)
      })
      .catch(() => {
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [])

  // Reset paging whenever the route category changes
  useEffect(() => {
    // eslint-disable-next-line react-hooks/set-state-in-effect
    setVisibleCount(8)
  }, [category])

  /* ── Derive unique filter options from data ── */
  const categoryOptions = useMemo(() => {
    const cats = [...new Set(products.map((p) => p.category))]
    return cats.map((c) => ({ value: c, label: c }))
  }, [products])

  const colorOptions = useMemo(() => {
    const colors = [...new Set(products.map((p) => p.color))]
    return colors.map((c) => ({ value: c, label: c }))
  }, [products])

  const sizeOptions = useMemo(() => {
    const sizes = [...new Set(products.map((p) => p.size))]
    return sizes.map((s) => ({ value: s, label: s }))
  }, [products])

  /* ── Filter + Sort logic ── */
  const filteredProducts = useMemo(() => {
    let list = products.filter((p) => p.isActive)

    if (filterCategory) list = list.filter((p) => p.category === filterCategory)
    if (filterColor) list = list.filter((p) => p.color === filterColor)
    if (filterSize) list = list.filter((p) => p.size === filterSize)

    if (priceRange === 'duoi-300k') list = list.filter((p) => (p.discountPrice || p.price) < 300000)
    else if (priceRange === '300k-600k')
      list = list.filter((p) => (p.discountPrice || p.price) >= 300000 && (p.discountPrice || p.price) <= 600000)
    else if (priceRange === 'tren-600k') list = list.filter((p) => (p.discountPrice || p.price) > 600000)

    if (sortBy === 'gia-tang') list = [...list].sort((a, b) => (a.discountPrice || a.price) - (b.discountPrice || b.price))
    else if (sortBy === 'gia-giam') list = [...list].sort((a, b) => (b.discountPrice || b.price) - (a.discountPrice || a.price))
    else if (sortBy === 'danh-gia') list = [...list].sort((a, b) => b.rating - a.rating)

    return list
  }, [products, filterCategory, filterColor, filterSize, priceRange, sortBy])

  const visibleProducts = filteredProducts.slice(0, visibleCount)
  const hasMore = visibleCount < filteredProducts.length

  return (
    <main className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-16 md:py-24">
      {/* ── Page Header ── */}
      <div className="mb-12 md:mb-16">
        <h1 className="font-headline text-[32px] md:text-[48px] font-semibold text-center mb-8 md:mb-12 fade-in">
          {pageTitle}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant pb-6">
          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto">
            <FilterSelect
              label="Danh mục"
              value={filterCategory}
              onChange={(v) => { setFilterCategory(v); setVisibleCount(8) }}
              options={categoryOptions}
            />
            <FilterSelect
              label="Màu sắc"
              value={filterColor}
              onChange={(v) => { setFilterColor(v); setVisibleCount(8) }}
              options={colorOptions}
            />
            <FilterSelect
              label="Kích cỡ"
              value={filterSize}
              onChange={(v) => { setFilterSize(v); setVisibleCount(8) }}
              options={sizeOptions}
            />
            <FilterSelect
              label="Khoảng giá"
              value={priceRange}
              onChange={(v) => { setPriceRange(v); setVisibleCount(8) }}
              options={[
                { value: 'duoi-300k', label: 'Dưới 300.000 ₫' },
                { value: '300k-600k', label: '300.000 – 600.000 ₫' },
                { value: 'tren-600k', label: 'Trên 600.000 ₫' },
              ]}
            />
          </div>

          {/* ── Sort ── */}
          <div className="w-full md:w-auto">
            <FilterSelect
              label="Sắp xếp theo"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'danh-gia', label: 'Đánh giá cao nhất' },
                { value: 'gia-tang', label: 'Giá tăng dần' },
                { value: 'gia-giam', label: 'Giá giảm dần' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── States ── */}
      {error && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <p className="font-body text-error text-[16px]">{error}</p>
          <button
            onClick={() => window.location.reload()}
            className="mt-6 border border-primary px-8 py-3 font-label text-[13px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Thử lại
          </button>
        </div>
      )}

      {/* ── Product Grid ── */}
      {!error && (
        <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-[24px] gap-y-12 md:gap-y-16">
          {loading
            ? Array.from({ length: 8 }).map((_, i) => <SkeletonCard key={i} />)
            : visibleProducts.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAddToCart={() => {
                  addItem({
                    id: product.id,
                    name: product.name,
                    price: product.discountPrice || product.price,
                    imageUrl: product.imageUrl,
                    size: product.size,
                    color: product.color,
                    quantity: 1,
                  })
                  showToast(product.name, product.imageUrl, product.discountPrice || product.price)
                }}
              />
            ))}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && filteredProducts.length === 0 && (
        <div className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 block">
            search_off
          </span>
          <p className="font-body text-on-surface-variant text-[16px]">
            Không tìm thấy sản phẩm phù hợp với bộ lọc đã chọn.
          </p>
        </div>
      )}

      {/* ── Load More ── */}
      {!loading && !error && hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + 4)}
            className="border border-primary px-10 py-4 font-label text-[14px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Xem Thêm Sản Phẩm
          </button>
        </div>
      )}

      {!loading && !error && filteredProducts.length > 0 && !hasMore && (
        <p className="mt-16 text-center font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
          Đã hiển thị tất cả {filteredProducts.length} sản phẩm
        </p>
      )}
    </main>
  )
}
