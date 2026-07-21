import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import type { ProductDetailDto, ProductListDto } from '../../../types/product'
import { CatalogApiError, fetchProductById, fetchProducts } from '../../../services/productApi'
import { useCartStore } from '../cart/cartStore'

/* ---------- Helpers ---------- */
const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

const FALLBACK_IMAGE = 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22800%22%20height%3D%221000%22%20viewBox%3D%220%200%20800%201000%22%3E%3Crect%20width%3D%22800%22%20height%3D%221000%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22400%22%20y%3D%22500%22%20font-family%3D%22sans-serif%22%20font-size%3D%2240%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'

const getSafeImageUrl = (url?: string | null) => {
  if (!url) return FALLBACK_IMAGE
  if (url.includes('placeholder.com') || url.includes('placehold.co')) return FALLBACK_IMAGE
  return url
}

const parseProductId = (value?: string) => {
  if (!value || !/^\d+$/.test(value)) return null
  const id = Number(value)
  return Number.isSafeInteger(id) && id > 0 ? id : null
}

const COLOR_MAP: Record<string, string> = {
  'đen': '#111111',
  'trắng': '#ffffff',
  'đỏ': '#ef4444',
  'xanh dương': '#3b82f6',
  'xanh lá': '#22c55e',
  'vàng': '#eab308',
  'xám': '#6b7280',
  'hồng': '#ec4899',
  'nâu': '#78350f',
  'tím': '#a855f7',
  'cam': '#f97316',
};

const getCssColor = (colorName: string) => {
  const normalized = colorName.toLowerCase().trim();
  if (COLOR_MAP[normalized]) return COLOR_MAP[normalized];
  
  // Nếu Admin có nhập trực tiếp mã Hex hoặc RGB thì dùng luôn
  if (normalized.startsWith('#') || normalized.startsWith('rgb')) return normalized;
  
  // Fallback: Gradient 7 sắc cầu vồng cho các màu lạ/không xác định
  return 'linear-gradient(135deg, #ef4444 0%, #eab308 25%, #22c55e 50%, #3b82f6 75%, #a855f7 100%)';
};

/* ---------- Accordion ---------- */
function AccordionRow({
  title,
  open,
  children,
  onToggle,
}: {
  title: string
  open: boolean
  children?: React.ReactNode
  onToggle: () => void
}) {
  return (
    <div className="border-t border-[#ece9e8] py-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-label text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
          {title}
        </span>
        <span className="font-label text-[18px] leading-none text-primary">{open ? '×' : '+'}</span>
      </button>
      {open && children ? (
        <div className="mt-4 max-w-[420px] font-body text-[14px] leading-7 text-on-surface-variant">
          {children}
        </div>
      ) : null}
    </div>
  )
}

/* ---------- Skeleton ---------- */
function ProductDetailSkeleton() {
  return (
    <div
      role="status"
      aria-label="Đang tải sản phẩm"
      className="max-w-[1220px] mx-auto px-4 md:px-8 py-6 md:py-10 animate-pulse"
    >
      <div className="grid gap-6 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 items-start">
        <div className="space-y-4">
          <div className="aspect-[4/5] bg-surface-container rounded" />
          <div className="hidden md:block aspect-[4/5] bg-surface-container rounded" />
        </div>
        <div className="space-y-6">
          <div className="h-8 bg-surface-container rounded w-3/4" />
          <div className="h-5 bg-surface-container rounded w-1/4" />
          <div className="h-20 bg-surface-container rounded" />
        </div>
      </div>
    </div>
  )
}

type DetailResult =
  | { requestKey: string; status: 'ready'; product: ProductDetailDto }
  | { requestKey: string; status: 'not-found' | 'error' }

/* ---------- Main Component ---------- */
export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addItem, showToast } = useCartStore()

  const [relatedProducts, setRelatedProducts] = useState<ProductListDto[]>([])
  const [requestVersion, setRequestVersion] = useState(0)
  const routeProductId = parseProductId(productId)
  const requestKey = routeProductId === null ? null : `${routeProductId}:${requestVersion}`
  const [detailResult, setDetailResult] = useState<DetailResult | null>(null)

  const [selectedVariantId, setSelectedVariantId] = useState<number | null>(null)
  const [openPanel, setOpenPanel] = useState<'description' | 'fabric' | 'delivery'>('description')
  const [mainImgError, setMainImgError] = useState(false)

  /* ── Fetch product by id ── */
  useEffect(() => {
    if (routeProductId === null || requestKey === null) return
    let active = true

    fetchProductById(routeProductId)
      .then((p) => {
        if (!active) return
        setDetailResult({ requestKey, status: 'ready', product: p })
        setRelatedProducts([])
        setSelectedVariantId(p.variants[0]?.id ?? null)
        setMainImgError(false)
      })
      .catch((error: unknown) => {
        if (!active) return
        setDetailResult({
          requestKey,
          status: error instanceof CatalogApiError && error.code === 'not-found'
            ? 'not-found'
            : 'error',
        })
      })

    return () => {
      active = false
    }
  }, [requestKey, routeProductId])

  const currentDetail = detailResult?.requestKey === requestKey ? detailResult : null
  const loadState = routeProductId === null ? 'invalid' : (currentDetail?.status ?? 'loading')
  const product = currentDetail?.status === 'ready' ? currentDetail.product : null

  /* ── Fetch related products (same category) ── */
  useEffect(() => {
    if (!product) return
    let active = true

    fetchProducts({ pageSize: 4, categoryId: product.category?.id })
      .then((related) => {
        if (!active) return
        setRelatedProducts(related.items.filter(p => p.id !== product.id))
      })
      .catch(() => {/* silently ignore related fetch errors */})

    return () => {
      active = false
    }
  }, [product])

  /* ── Loading ── */
  if (loadState === 'loading') {
    return (
      <section className="w-full bg-background">
        <ProductDetailSkeleton />
      </section>
    )
  }

  /* ── Invalid and not found ── */
  if (loadState === 'invalid' || loadState === 'not-found') {
    return (
      <section className="w-full bg-background">
        <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-20 text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <h1 className="font-headline text-[28px] font-medium text-primary">Không tìm thấy sản phẩm</h1>
          <p className="mt-3 font-body text-error text-[16px] mb-6">
            {loadState === 'invalid' ? 'Mã sản phẩm không hợp lệ.' : 'Sản phẩm không tồn tại.'}
          </p>
          <button
            onClick={() => navigate(-1)}
            className="border border-primary px-8 py-3 font-label text-[13px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Quay lại
          </button>
        </div>
      </section>
    )
  }

  /* ── Temporary error ── */
  if (loadState === 'error') {
    return (
      <section className="w-full bg-background">
        <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-20 text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <h1 className="font-headline text-[28px] font-medium text-primary">Không thể tải sản phẩm</h1>
          <p className="mt-3 font-body text-error text-[16px] mb-6">
            Đã có lỗi tạm thời. Vui lòng thử lại.
          </p>
          <button
            type="button"
            onClick={() => setRequestVersion((version) => version + 1)}
            className="border border-primary px-8 py-3 font-label text-[13px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Thử tải lại
          </button>
        </div>
      </section>
    )
  }

  if (!product) return null

  const selectedVariant = product.variants.find((variant) => variant.id === selectedVariantId)
  const productPrice = product.discountPrice !== null
    && product.discountPrice > 0
    && product.discountPrice < product.basePrice
    ? product.discountPrice
    : product.basePrice
  const displayPrice = selectedVariant?.priceOverride !== null
    && selectedVariant?.priceOverride !== undefined
    && selectedVariant.priceOverride > 0
    ? selectedVariant.priceOverride
    : productPrice
  const showBasePrice = displayPrice < product.basePrice
  const thumbnailImage = product.images.find((image) => image.isThumbnail) ?? product.images[0]
  const secondaryImage = product.images.find((image) => image.id !== thumbnailImage?.id)
  const mainImage = mainImgError
    ? FALLBACK_IMAGE
    : getSafeImageUrl(thumbnailImage?.url)
  const selectedColor = selectedVariant?.color ?? ''
  const selectedSize = selectedVariant?.size ?? ''
  const uniqueColors = [...new Set(product.variants.map((variant) => variant.color).filter((color): color is string => Boolean(color)))]
  const availableSizes = [...new Set(
    product.variants
      .filter((variant) => variant.color === (selectedVariant?.color ?? null))
      .map((variant) => variant.size)
      .filter((size): size is string => Boolean(size)),
  )]
  const canPurchase = product.availableQuantity > 0
    && (product.variants.length === 0 || selectedVariant !== undefined)

  const handleAddToCart = () => {
    if (!canPurchase) return
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: displayPrice,
      imageUrl: mainImage,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })
    showToast(product.name, mainImage, displayPrice)
  }

  const handleBuyNow = () => {
    if (!canPurchase) return
    addItem({
      id: product.id.toString(),
      name: product.name,
      price: displayPrice,
      imageUrl: mainImage,
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })
    navigate('/payment')
  }

  return (
    <section className="w-full bg-background">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Breadcrumb */}
        <div className="mb-4 hidden md:block text-[11px] font-label font-semibold uppercase tracking-[0.25em] text-on-surface-variant/70">
          <Link to="/" className="hover:text-primary transition-colors">
            Trang chủ
          </Link>
          <span className="mx-2">/</span>
          <Link to="/collections" className="hover:text-primary transition-colors">
            Sản phẩm
          </Link>
          <span className="mx-2">/</span>
          <span>{product.name}</span>
        </div>

        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 items-start">

          {/* Images */}
          <div className="space-y-4 md:space-y-8">
            <div className="overflow-hidden bg-surface-container-low">
              <img
                src={mainImage}
                alt={`Ảnh chính của ${product.name}`}
                onError={() => setMainImgError(true)}
                className="w-full aspect-[4/5] object-cover object-center"
              />
            </div>
            {secondaryImage && getSafeImageUrl(secondaryImage.url) !== FALLBACK_IMAGE && (
              <div className="hidden md:block overflow-hidden bg-surface-container-low">
                <img
                  src={getSafeImageUrl(secondaryImage.url)}
                  alt={`Ảnh bổ sung của ${product.name}`}
                  onError={(event) => {
                    event.currentTarget.src = FALLBACK_IMAGE
                  }}
                  className="w-full aspect-[4/5] object-cover object-center"
                />
              </div>
            )}
          </div>

          {/* Info Sidebar */}
          <aside className="lg:sticky lg:top-[104px] space-y-4 md:space-y-8">
            <div>
              <h1 className="font-headline text-[24px] md:text-[34px] font-medium leading-tight text-primary">
                {product.name}
              </h1>
              {showBasePrice ? (
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-body text-[16px] md:text-[18px] font-semibold text-error">
                    {formatVND(displayPrice)}
                  </span>
                  <span className="font-body text-[14px] text-on-surface-variant line-through">
                    {formatVND(product.basePrice)}
                  </span>
                </div>
              ) : (
                <p className="mt-1.5 md:mt-2 font-body text-[14px] md:text-[17px] text-on-surface-variant">
                  {formatVND(displayPrice)}
                </p>
              )}
              <p
                className={`mt-2 font-label text-[11px] font-semibold uppercase tracking-[0.16em] ${product.availableQuantity > 0 ? 'text-on-surface-variant' : 'text-error'}`}
              >
                {product.availableQuantity > 0
                  ? `Còn ${product.availableQuantity} sản phẩm`
                  : 'Hết hàng'}
              </p>
            </div>

            {/* Colors */}
            {uniqueColors.length > 0 && (
              <div>
                <div className="mb-3 font-label text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  Màu sắc:{' '}
                  <span className="text-primary">
                    {selectedColor}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3">
                  {uniqueColors.map((color) => {
                    const isActive = selectedColor === color
                    return (
                      <button
                        key={color}
                        type="button"
                        onClick={() => {
                          const variant = product.variants.find((item) => item.color === color)
                          setSelectedVariantId(variant?.id ?? null)
                        }}
                        className={`h-5 w-5 md:h-6 md:w-6 rounded-full border transition-all ${isActive ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-[#d7d2cf]'}`}
                        style={{ background: getCssColor(color) }}
                        aria-label={`Chọn màu ${color}`}
                        aria-pressed={isActive}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {availableSizes.length > 0 && (
              <div>
                <div className="mb-3 flex items-end justify-between gap-4">
                  <span className="font-label text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                    Size
                  </span>
                  <button
                    type="button"
                    className="font-label text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
                  >
                    Size Guide
                  </button>
                </div>
                <div className="grid grid-cols-4 gap-2 md:gap-3">
                  {availableSizes.map((size) => {
                    const isActive = selectedSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => {
                          const variant = product.variants.find((item) => (
                            item.color === (selectedVariant?.color ?? null) && item.size === size
                          ))
                          setSelectedVariantId(variant?.id ?? null)
                        }}
                        className={`h-10 md:h-11 border font-label text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${isActive ? 'border-primary bg-primary text-on-primary' : 'border-[#cfc9c6] bg-background text-primary hover:border-primary'}`}
                        aria-label={`Chọn kích cỡ ${size}`}
                        aria-pressed={isActive}
                      >
                        {size}
                      </button>
                    )
                  })}
                </div>
              </div>
            )}

            {/* CTA Buttons */}
            <div className="space-y-2.5 md:space-y-3 pt-2">
              <button
                type="button"
                onClick={handleAddToCart}
                disabled={!canPurchase}
                className="h-11 md:h-12 w-full border border-primary bg-background font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-on-primary disabled:cursor-not-allowed disabled:border-on-surface-variant/30 disabled:text-on-surface-variant/50 disabled:hover:bg-background"
              >
                Thêm Vào Giỏ Hàng
              </button>
              <button
                type="button"
                onClick={handleBuyNow}
                disabled={!canPurchase}
                className="h-11 md:h-12 w-full bg-primary font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-on-primary transition-colors hover:bg-[#111111] disabled:cursor-not-allowed disabled:bg-on-surface-variant/30"
              >
                Mua Ngay
              </button>
            </div>

            {/* Accordion Info */}
            <div className="border-t border-[#ece9e8] pt-4 md:pt-5">
              <AccordionRow
                title="Mô tả sản phẩm"
                open={openPanel === 'description'}
                onToggle={() => setOpenPanel(openPanel === 'description' ? 'fabric' : 'description')}
              >
                {product.description || 'Chưa có mô tả cho sản phẩm này.'}
              </AccordionRow>

              <AccordionRow
                title="Chất liệu"
                open={openPanel === 'fabric'}
                onToggle={() => setOpenPanel(openPanel === 'fabric' ? 'delivery' : 'fabric')}
              >
                Thông tin chung của cửa hàng: Cotton
              </AccordionRow>

              <AccordionRow
                title="Giao hàng & đổi trả"
                open={openPanel === 'delivery'}
                onToggle={() => setOpenPanel(openPanel === 'delivery' ? 'description' : 'delivery')}
              >
                Thông tin chung của cửa hàng: Giao hàng 3-5 ngày
              </AccordionRow>
            </div>
          </aside>
        </div>

        {/* Related Products */}
        {relatedProducts.length > 0 && (
          <section className="mt-12 md:mt-24">
            <div className="mb-4 md:mb-8 flex items-end justify-between gap-4">
              <h2 className="font-headline text-[18px] md:text-[28px] font-medium text-primary">
                Sản phẩm liên quan
              </h2>
              <Link
                to="/collections"
                className="font-label text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
              >
                Xem tất cả
              </Link>
            </div>

            <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
              {relatedProducts.map((item) => (
                <Link key={item.id} to={`/product/${item.id}`} className="group block">
                  <div className="overflow-hidden bg-surface-container-low">
                    <img
                      src={getSafeImageUrl(item.thumbnailUrl || item.imageUrl)}
                      alt={item.name}
                      onError={(event) => {
                        event.currentTarget.src = FALLBACK_IMAGE
                      }}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-2 md:pt-3">
                    <h3 className="font-label text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 md:mt-1 font-body text-[10px] md:text-[12px] text-on-surface-variant">
                      {formatVND(item.price)}
                    </p>
                  </div>
                </Link>
              ))}
            </div>
          </section>
        )}
      </div>
    </section>
  )
}
