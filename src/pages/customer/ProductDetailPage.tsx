import { useState, useEffect } from 'react'
import { Link, useParams, useNavigate } from 'react-router-dom'
import axios from 'axios'
import type { Product } from '../../types/product'
import { useCartStore } from '../../store/cartStore'

/* ---------- Helpers ---------- */
const formatVND = (amount: number) => amount.toLocaleString('vi-VN') + ' ₫'

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
    <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-6 md:py-10 animate-pulse">
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

/* ---------- Main Component ---------- */
export default function ProductDetailPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const { addItem, showToast } = useCartStore()

  const [product, setProduct] = useState<Product | null>(null)
  const [relatedProducts, setRelatedProducts] = useState<Product[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [selectedColor, setSelectedColor] = useState('')
  const [selectedSize, setSelectedSize] = useState('')
  const [openPanel, setOpenPanel] = useState<'description' | 'fabric' | 'delivery'>('description')
  const [mainImgError, setMainImgError] = useState(false)

  const apiBase = import.meta.env.VITE_API_BASE_URL

  /* ── Fetch product by id ── */
  useEffect(() => {
    if (!productId) return
    setLoading(true)
    setError(null)
    setMainImgError(false)

    axios
      .get<Product>(`${apiBase}/data/${productId}`)
      .then((res) => {
        const p = res.data
        setProduct(p)
        setSelectedColor(p.colors?.[0]?.value ?? '')
        setSelectedSize(p.sizes?.[0] ?? '')
      })
      .catch(() => setError('Không thể tải sản phẩm. Vui lòng thử lại.'))
      .finally(() => setLoading(false))
  }, [productId, apiBase])

  /* ── Fetch related products (same category) ── */
  useEffect(() => {
    if (!product) return
    axios
      .get<Product[]>(`${apiBase}/data`)
      .then((res) => {
        const related = res.data
          .filter((p) => p.id !== product.id && p.category === product.category)
          .slice(0, 4)
        setRelatedProducts(related)
      })
      .catch(() => {/* silently ignore related fetch errors */})
  }, [product, apiBase])

  /* ── Loading ── */
  if (loading) {
    return (
      <section className="w-full bg-background">
        <ProductDetailSkeleton />
      </section>
    )
  }

  /* ── Error ── */
  if (error || !product) {
    return (
      <section className="w-full bg-background">
        <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-20 text-center">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <p className="font-body text-error text-[16px] mb-6">{error ?? 'Sản phẩm không tồn tại.'}</p>
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

  const hasDiscount = product.discountPrice < product.price
  const displayPrice = hasDiscount ? product.discountPrice : product.price
  const mainImage = mainImgError
    ? 'https://via.placeholder.com/800x1000?text=No+Image'
    : (product.images?.[0] ?? '')

  const handleAddToCart = () => {
    addItem({
      id: product.id,
      name: product.name,
      price: displayPrice,
      imageUrl: product.images?.[0] ?? '',
      size: selectedSize,
      color: selectedColor,
      quantity: 1,
    })
    showToast(product.name, product.images?.[0] ?? '', displayPrice)
  }

  return (
    <section className="w-full bg-background">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-6 md:py-10">

        {/* Breadcrumb */}
        {product.breadcrumb?.length > 0 && (
          <div className="mb-4 hidden md:block text-[11px] font-label font-semibold uppercase tracking-[0.25em] text-on-surface-variant/70">
            <Link to="/" className="hover:text-primary transition-colors">
              {product.breadcrumb[0]}
            </Link>
            {product.breadcrumb[1] && (
              <>
                <span className="mx-2">/</span>
                <Link to="/collections" className="hover:text-primary transition-colors">
                  {product.breadcrumb[1]}
                </Link>
              </>
            )}
            {product.breadcrumb[2] && (
              <>
                <span className="mx-2">/</span>
                <span>{product.breadcrumb[2]}</span>
              </>
            )}
          </div>
        )}

        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 items-start">

          {/* Images */}
          <div className="space-y-4 md:space-y-8">
            <div className="overflow-hidden bg-surface-container-low">
              <img
                src={mainImage}
                alt={product.name}
                onError={() => setMainImgError(true)}
                className="w-full aspect-[4/5] object-cover object-center"
              />
            </div>
            {product.images?.[1] && (
              <div className="hidden md:block overflow-hidden bg-surface-container-low">
                <img
                  src={product.images[1]}
                  alt={product.name}
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
              {hasDiscount ? (
                <div className="flex items-center gap-3 mt-2">
                  <span className="font-body text-[16px] md:text-[18px] font-semibold text-error">
                    {formatVND(product.discountPrice)}
                  </span>
                  <span className="font-body text-[14px] text-on-surface-variant line-through">
                    {formatVND(product.price)}
                  </span>
                </div>
              ) : (
                <p className="mt-1.5 md:mt-2 font-body text-[14px] md:text-[17px] text-on-surface-variant">
                  {formatVND(product.price)}
                </p>
              )}
            </div>

            {/* Colors */}
            {product.colors?.length > 0 && (
              <div>
                <div className="mb-3 font-label text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  Màu sắc:{' '}
                  <span className="text-primary">
                    {product.colors.find((c) => c.value === selectedColor)?.name}
                  </span>
                </div>
                <div className="flex items-center gap-2.5 md:gap-3">
                  {product.colors.map((color) => {
                    const isActive = selectedColor === color.value
                    return (
                      <button
                        key={color.value}
                        type="button"
                        onClick={() => setSelectedColor(color.value)}
                        className={`h-5 w-5 md:h-6 md:w-6 rounded-full border transition-all ${isActive ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-[#d7d2cf]'}`}
                        style={{ backgroundColor: color.value }}
                        aria-label={color.name}
                      />
                    )
                  })}
                </div>
              </div>
            )}

            {/* Sizes */}
            {product.sizes?.length > 0 && (
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
                  {product.sizes.map((size) => {
                    const isActive = selectedSize === size
                    return (
                      <button
                        key={size}
                        type="button"
                        onClick={() => setSelectedSize(size)}
                        className={`h-10 md:h-11 border font-label text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${isActive ? 'border-primary bg-primary text-on-primary' : 'border-[#cfc9c6] bg-background text-primary hover:border-primary'}`}
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
                className="h-11 md:h-12 w-full border border-primary bg-background font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Thêm Vào Giỏ Hàng
              </button>
              <button
                type="button"
                className="h-11 md:h-12 w-full bg-primary font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-on-primary transition-colors hover:bg-[#111111]"
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
                {product.description}
              </AccordionRow>

              <AccordionRow
                title="Chất liệu"
                open={openPanel === 'fabric'}
                onToggle={() => setOpenPanel(openPanel === 'fabric' ? 'delivery' : 'fabric')}
              >
                {product.fabric}
              </AccordionRow>

              <AccordionRow
                title="Giao hàng & đổi trả"
                open={openPanel === 'delivery'}
                onToggle={() => setOpenPanel(openPanel === 'delivery' ? 'description' : 'delivery')}
              >
                {product.delivery}
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
                      src={item.images?.[0]}
                      alt={item.name}
                      className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                    />
                  </div>
                  <div className="pt-2 md:pt-3">
                    <h3 className="font-label text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                      {item.name}
                    </h3>
                    <p className="mt-0.5 md:mt-1 font-body text-[10px] md:text-[12px] text-on-surface-variant">
                      {formatVND(item.discountPrice || item.price)}
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
