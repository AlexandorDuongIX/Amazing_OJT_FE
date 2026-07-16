import { useState, useEffect, useRef } from 'react'
import { useNavigate, useParams } from 'react-router-dom'
import { useCartStore } from '../cart/cartStore'
import { fetchProducts } from '../../../services/productApi'
import type { ProductListDto } from '../../../types/product'

/* ============================================================
   ProductListPage — AMAZING Clothing Shop (Customer Page)
   ============================================================
   Sections:
   1. Page Header with Filters & Sort
   2. Product Grid (2 cols mobile / 4 cols desktop)
   3. Load More Button
   ============================================================ */

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
  product: ProductListDto
  onAddToCart: () => void
}

function ProductCard({ product, onAddToCart }: ProductCardProps) {
  const navigate = useNavigate()
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)
  const hasDiscount = product.price < product.basePrice
  const isOutOfStock = product.availableQuantity <= 0

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
          src={imgError ? 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22533%22%20viewBox%3D%220%200%20400%20533%22%3E%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22266%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E' : (product.thumbnailUrl || product.imageUrl || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22533%22%20viewBox%3D%220%200%20400%20533%22%3E%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22266%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E')}
          alt={product.name}
          onError={() => setImgError(true)}
          className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
        />

        {/* Out of Stock Overlay */}
        {isOutOfStock && (
          <div className="absolute inset-0 bg-surface/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
            <span className="bg-surface text-on-surface px-4 py-2 font-label text-[14px] font-bold uppercase tracking-widest rounded-sm border border-outline">
              Hết Hàng
            </span>
          </div>
        )}

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
        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out z-20">
            <button
              onClick={(e) => { e.stopPropagation(); onAddToCart() }}
              className="w-full py-3 bg-primary text-on-primary font-label text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary transition-colors duration-200"
            >
              Thêm Vào Giỏ
            </button>
          </div>
        )}
      </div>

      {/* Info */}
      <div className="text-center px-1">
        {product.brand && product.brand !== 'No Brand' && (
          <div className="font-label text-[12px] uppercase text-on-surface-variant mb-1 tracking-widest">
            {product.brand}
          </div>
        )}
        <h3 className="font-headline text-[18px] md:text-[20px] font-medium text-on-surface mb-1 leading-snug">
          {product.name}
        </h3>
        {hasDiscount ? (
          <div className="flex items-center justify-center gap-2">
            <span className="font-body text-[14px] font-semibold text-error">
              {formatVND(product.price)}
            </span>
            <span className="font-body text-[13px] text-on-surface-variant line-through">
              {formatVND(product.basePrice)}
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
  'tre-em': 'Trẻ Em',
}

const CATEGORY_IDS: Record<string, number> = {
  nam: 1,
  nu: 2,
  'tre-em': 3,
}

/* ---------- Static Options ---------- */
const categoryOptions = [
  { value: '1', label: 'Thời Trang Nam' },
  { value: '2', label: 'Thời Trang Nữ' },
  { value: '3', label: 'Trẻ Em' },
]

const colorOptions = [
  { value: 'Đen', label: 'Đen' },
  { value: 'Trắng', label: 'Trắng' },
  { value: 'Xanh', label: 'Xanh' },
  { value: 'Đỏ', label: 'Đỏ' },
  { value: 'Vàng', label: 'Vàng' },
  { value: 'Nâu', label: 'Nâu' },
  { value: 'Hồng', label: 'Hồng' },
  { value: 'Xám', label: 'Xám' },
]

const sizeOptions = [
  { value: 'XS', label: 'XS' },
  { value: 'S', label: 'S' },
  { value: 'M', label: 'M' },
  { value: 'L', label: 'L' },
  { value: 'XL', label: 'XL' },
  { value: 'XXL', label: 'XXL' },
]

/* ---------- ProductListPage ---------- */
export default function ProductListPage() {
  const { category } = useParams<{ category?: string }>()
  const pageTitle = category ? (CATEGORY_TITLES[category] ?? 'Bộ Sưu Tập') : 'Tất Cả Sản Phẩm'
  const { addItem, showToast } = useCartStore()

  const [products, setProducts] = useState<ProductListDto[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  // API State
  const [page, setPage] = useState(1)
  const [totalItems, setTotalItems] = useState(0)
  const pageSize = 12

  // Filter State
  const [filterCategory, setFilterCategory] = useState('')
  const [filterColor, setFilterColor] = useState('')
  const [filterSize, setFilterSize] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('')

  // Sync category route with filterCategory internally
  useEffect(() => {
    if (category && CATEGORY_IDS[category]) {
      setFilterCategory(CATEGORY_IDS[category].toString())
    } else {
      setFilterCategory('')
    }
  }, [category])

  // Reset page to 1 when any filter changes
  // We use a ref to prevent double fetching on mount when category is set
  const initialMount = useRef(true)
  useEffect(() => {
    if (initialMount.current) {
      initialMount.current = false
      return
    }
    setPage(1)
  }, [filterCategory, filterColor, filterSize, priceRange, sortBy])

  /* ── Fetch from API ── */
  useEffect(() => {
    setLoading(true)
    setError(null)
    
    let minPrice: number | undefined;
    let maxPrice: number | undefined;
    if (priceRange === 'duoi-300k') maxPrice = 300000;
    else if (priceRange === '300k-600k') { minPrice = 300000; maxPrice = 600000; }
    else if (priceRange === 'tren-600k') minPrice = 600000;

    let sortField: string | undefined;
    let sortDirection: string | undefined;
    if (sortBy === 'gia-tang') { sortField = 'price'; sortDirection = 'asc'; }
    else if (sortBy === 'gia-giam') { sortField = 'price'; sortDirection = 'desc'; }
    else if (sortBy === 'danh-gia') { sortField = 'rating'; sortDirection = 'desc'; }

    fetchProducts({
      page,
      pageSize,
      categoryId: filterCategory ? Number(filterCategory) : undefined,
      minPrice,
      maxPrice,
      color: filterColor || undefined,
      size: filterSize || undefined,
      sortBy: sortField,
      sortDirection
    })
      .then((data) => {
        setTotalItems(data.totalItems)
        if (page === 1) {
          setProducts(data.items)
        } else {
          setProducts(prev => {
            // Filter duplicates just in case
            const existingIds = new Set(prev.map(p => p.id))
            const newItems = data.items.filter(p => !existingIds.has(p.id))
            return [...prev, ...newItems]
          })
        }
      })
      .catch((err) => {
        console.error(err)
        setError('Không thể tải sản phẩm. Vui lòng thử lại sau.')
      })
      .finally(() => {
        setLoading(false)
      })
  }, [page, filterCategory, filterColor, filterSize, priceRange, sortBy])

  const hasMore = products.length < totalItems

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
            {/* Show Category filter only if not already viewing a specific category route */}
            {!category && (
              <FilterSelect
                label="Danh mục"
                value={filterCategory}
                onChange={setFilterCategory}
                options={categoryOptions}
              />
            )}
            <FilterSelect
              label="Màu sắc"
              value={filterColor}
              onChange={setFilterColor}
              options={colorOptions}
            />
            <FilterSelect
              label="Kích cỡ"
              value={filterSize}
              onChange={setFilterSize}
              options={sizeOptions}
            />
            <FilterSelect
              label="Khoảng giá"
              value={priceRange}
              onChange={setPriceRange}
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
                { value: 'gia-tang', label: 'Giá tăng dần' },
                { value: 'gia-giam', label: 'Giá giảm dần' },
                { value: 'danh-gia', label: 'Đánh giá cao nhất' },
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
          {products.map((product) => (
            <ProductCard
              key={product.id}
              product={product}
              onAddToCart={() => {
                addItem({
                  id: product.id.toString(),
                  name: product.name,
                  price: product.price,
                  imageUrl: product.thumbnailUrl || product.imageUrl || '',
                  size: product.variantsSummary?.[0]?.size ?? '',
                  color: product.variantsSummary?.[0]?.color ?? '',
                  quantity: 1,
                })
                showToast(product.name, product.thumbnailUrl || product.imageUrl || '', product.price)
              }}
            />
          ))}
          {loading && Array.from({ length: pageSize }).map((_, i) => <SkeletonCard key={`skel-${i}`} />)}
        </div>
      )}

      {/* ── Empty state ── */}
      {!loading && !error && products.length === 0 && (
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
            onClick={() => setPage((p) => p + 1)}
            className="border border-primary px-10 py-4 font-label text-[14px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer"
          >
            Xem Thêm Sản Phẩm
          </button>
        </div>
      )}

      {!loading && !error && products.length > 0 && !hasMore && (
        <p className="mt-16 text-center font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
          Đã hiển thị tất cả {totalItems} sản phẩm
        </p>
      )}
    </main>
  )
}
