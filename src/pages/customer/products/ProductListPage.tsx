import { useEffect, useMemo, useRef, useState, type FormEvent } from 'react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useCartStore } from '../cart/cartStore'
import { fetchCategories, fetchProducts } from '../../../services/productApi'
import type {
  CategoryDto,
  ProductListDto,
  ProductSearchQueryParams,
} from '../../../types/product'
import { resolveCategoryFromSlug } from '../../../utils/categorySlug'

const PAGE_SIZE = 12
const FALLBACK_IMAGE =
  'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22533%22%20viewBox%3D%220%200%20400%20533%22%3E%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22266%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E'

interface BrowsingCriteria {
  searchTerm?: string
  categoryId?: number
  color?: string
  size?: string
  minPrice?: number
  maxPrice?: number
  sortBy?: 'price' | 'newest'
  sortDirection?: 'asc' | 'desc'
}

interface FilterSelectProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (value: string) => void
  disabled?: boolean
}

const formatVND = (amount: number) => `${amount.toLocaleString('vi-VN')} ₫`

function optionalText(params: URLSearchParams, key: string): string | undefined {
  const value = params.get(key)?.trim()
  return value || undefined
}

function optionalNonNegativeNumber(
  params: URLSearchParams,
  key: string,
): number | undefined {
  const raw = params.get(key)
  if (raw === null || raw.trim() === '') return undefined
  const value = Number(raw)
  return Number.isFinite(value) && value >= 0 ? value : undefined
}

function optionalCategoryId(params: URLSearchParams): number | undefined {
  const value = optionalNonNegativeNumber(params, 'categoryId')
  return value !== undefined && Number.isInteger(value) && value > 0 ? value : undefined
}

function readCriteria(search: string): BrowsingCriteria {
  const params = new URLSearchParams(search)
  const requestedSort = optionalText(params, 'sortBy')
  const requestedDirection = optionalText(params, 'sortDirection')
  const sortBy = requestedSort === 'price' || requestedSort === 'newest'
    ? requestedSort
    : undefined
  const sortDirection = sortBy === 'newest'
    ? 'desc'
    : requestedDirection === 'desc'
      ? 'desc'
      : sortBy === 'price'
        ? 'asc'
        : undefined

  return {
    searchTerm: optionalText(params, 'searchTerm'),
    categoryId: optionalCategoryId(params),
    color: optionalText(params, 'color'),
    size: optionalText(params, 'size'),
    minPrice: optionalNonNegativeNumber(params, 'minPrice'),
    maxPrice: optionalNonNegativeNumber(params, 'maxPrice'),
    sortBy,
    sortDirection,
  }
}

function priceFilterValue(criteria: BrowsingCriteria): string {
  if (
    (criteria.minPrice === undefined || criteria.minPrice === 0) &&
    criteria.maxPrice === 300_000
  ) {
    return '0-300000'
  }
  if (criteria.minPrice === 300_000 && criteria.maxPrice === 600_000) {
    return '300000-600000'
  }
  if (criteria.minPrice === 600_000 && criteria.maxPrice === undefined) {
    return '600000-'
  }
  return ''
}

function sortFilterValue(criteria: BrowsingCriteria): string {
  if (criteria.sortBy === 'newest') return 'newest'
  if (criteria.sortBy === 'price' && criteria.sortDirection === 'desc') return 'price-desc'
  if (criteria.sortBy === 'price') return 'price-asc'
  return ''
}

function buildProductQuery(
  criteria: BrowsingCriteria,
  page: number,
  routeCategoryId?: number,
): ProductSearchQueryParams {
  const query: ProductSearchQueryParams = { page, pageSize: PAGE_SIZE }
  const categoryId = routeCategoryId ?? criteria.categoryId

  if (criteria.searchTerm) query.searchTerm = criteria.searchTerm
  if (categoryId) query.categoryId = categoryId
  if (criteria.minPrice !== undefined) query.minPrice = criteria.minPrice
  if (criteria.maxPrice !== undefined) query.maxPrice = criteria.maxPrice
  if (criteria.color) query.color = criteria.color
  if (criteria.size) query.size = criteria.size
  if (criteria.sortBy) {
    query.sortBy = criteria.sortBy
    query.sortDirection = criteria.sortDirection
  }

  return query
}

function appendUniqueProducts(
  current: ProductListDto[],
  additions: ProductListDto[],
): ProductListDto[] {
  const existingIds = new Set(current.map((product) => product.id))
  return [
    ...current,
    ...additions.filter((product) => {
      if (existingIds.has(product.id)) return false
      existingIds.add(product.id)
      return true
    }),
  ]
}

function FilterSelect({
  label,
  options,
  value,
  onChange,
  disabled = false,
}: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        aria-label={label}
        value={value}
        onChange={(event) => onChange(event.target.value)}
        disabled={disabled}
        className="bg-transparent border-b border-outline pb-1 pr-6 font-label text-[14px] font-semibold text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer w-full md:w-auto transition-colors duration-200 appearance-none disabled:cursor-not-allowed disabled:opacity-60"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'292.4'%20height%3D'292.4'%3E%3Cpath%20fill%3D'%231b1c1c'%20d%3D'M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z'%2F%3E%3C%2Fsvg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right .5em top 50%',
          backgroundSize: '.55em auto',
        }}
      >
        <option value="">{label}</option>
        {options.map((option) => (
          <option key={option.value} value={option.value}>
            {option.label}
          </option>
        ))}
      </select>
    </div>
  )
}

interface ProductSearchFormProps {
  appliedSearchTerm: string
  onClear: () => void
  onSubmit: (searchTerm: string) => void
}

function ProductSearchForm({
  appliedSearchTerm,
  onClear,
  onSubmit,
}: ProductSearchFormProps) {
  const [draft, setDraft] = useState(appliedSearchTerm)

  const submit = (event: FormEvent<HTMLFormElement>) => {
    event.preventDefault()
    onSubmit(draft.trim())
  }

  return (
    <form onSubmit={submit} role="search" className="max-w-2xl mx-auto mb-8">
      <label htmlFor="product-search" className="block font-label text-[13px] font-semibold uppercase tracking-wider text-on-surface-variant mb-2">
        Tìm kiếm sản phẩm
      </label>
      <div className="flex border-b border-outline focus-within:border-primary transition-colors duration-200">
        <input
          id="product-search"
          type="search"
          value={draft}
          onChange={(event) => setDraft(event.target.value)}
          placeholder="Nhập tên sản phẩm"
          className="min-w-0 flex-1 bg-transparent py-3 font-body text-[15px] text-on-surface placeholder:text-on-surface-variant focus:outline-none"
        />
        {(draft || appliedSearchTerm) && (
          <button
            type="button"
            onClick={() => {
              setDraft('')
              onClear()
            }}
            className="px-3 font-label text-[12px] font-semibold uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors duration-200"
          >
            Xóa tìm kiếm
          </button>
        )}
        <button
          type="submit"
          className="px-5 font-label text-[13px] font-semibold uppercase tracking-wider text-primary hover:text-secondary transition-colors duration-200"
        >
          Tìm kiếm
        </button>
      </div>
    </form>
  )
}

interface ProductCardProps {
  product: ProductListDto
  onAction: () => void
}

function ProductCard({ product, onAction }: ProductCardProps) {
  const [wished, setWished] = useState(false)
  const [imgError, setImgError] = useState(false)
  const hasDiscount = product.price < product.basePrice
  const isOutOfStock = product.availableQuantity <= 0
  const productPath = `/product/${product.id}`

  return (
    <div className="group product-card">
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-surface-container-low">
        <Link
          to={productPath}
          className="block h-full focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-[-2px] focus-visible:outline-primary"
        >
          <img
            src={imgError ? FALLBACK_IMAGE : (product.thumbnailUrl || product.imageUrl || FALLBACK_IMAGE)}
            alt={product.name}
            onError={() => setImgError(true)}
            className="object-cover w-full h-full absolute inset-0 transition-transform duration-500 ease-in-out group-hover:scale-105"
          />

          {isOutOfStock && (
            <div className="absolute inset-0 bg-surface/60 flex items-center justify-center z-10 backdrop-blur-[2px]">
              <span className="bg-surface text-on-surface px-4 py-2 font-label text-[14px] font-bold uppercase tracking-widest rounded-sm border border-outline">
                Hết Hàng
              </span>
            </div>
          )}
        </Link>

        <button
          type="button"
          className="absolute top-4 right-4 z-20 p-2 bg-surface/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 group-focus-within:opacity-100 focus-visible:opacity-100 focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-all duration-300 hover:bg-surface/80"
          onClick={() => setWished((current) => !current)}
          aria-label="Thêm vào yêu thích"
          aria-pressed={wished}
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${wished ? 'text-error' : 'text-on-surface hover:text-secondary'}`}
            style={wished ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            favorite
          </span>
        </button>

        {!isOutOfStock && (
          <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 group-focus-within:translate-y-0 transition-transform duration-300 ease-out z-20">
            <button
              type="button"
              onClick={onAction}
              className="w-full py-3 bg-primary text-on-primary font-label text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
            >
              {product.requiresVariantSelection ? 'Chọn tùy chọn' : 'Thêm Vào Giỏ'}
            </button>
          </div>
        )}
      </div>

      <div className="text-center px-1">
        {product.brand && product.brand !== 'No Brand' && (
          <div className="font-label text-[12px] uppercase text-on-surface-variant mb-1 tracking-widest">
            {product.brand}
          </div>
        )}
        <h3 className="font-headline text-[18px] md:text-[20px] font-medium text-on-surface mb-1 leading-snug">
          <Link
            to={productPath}
            className="hover:text-secondary focus-visible:outline focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-primary transition-colors duration-200"
          >
            {product.name}
          </Link>
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
          <p className="font-body text-[14px] text-on-surface-variant">
            {formatVND(product.price)}
          </p>
        )}
      </div>
    </div>
  )
}

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

const colorOptions = ['Đen', 'Trắng', 'Xanh', 'Đỏ', 'Vàng', 'Nâu', 'Hồng', 'Xám']
  .map((value) => ({ value, label: value }))

const sizeOptions = ['XS', 'S', 'M', 'L', 'XL', 'XXL']
  .map((value) => ({ value, label: value }))

const priceOptions = [
  { value: '0-300000', label: 'Dưới 300.000 ₫' },
  { value: '300000-600000', label: '300.000 – 600.000 ₫' },
  { value: '600000-', label: 'Trên 600.000 ₫' },
]

const sortOptions = [
  { value: 'price-asc', label: 'Giá tăng dần' },
  { value: 'price-desc', label: 'Giá giảm dần' },
  { value: 'newest', label: 'Mới nhất' },
]

export default function ProductListPage() {
  const { category: categorySlug } = useParams<{ category?: string }>()
  const location = useLocation()
  const navigate = useNavigate()
  const { addItem, showToast } = useCartStore()
  const criteria = useMemo(() => readCriteria(location.search), [location.search])
  const urlSearchTerm = criteria.searchTerm ?? ''

  const [categories, setCategories] = useState<CategoryDto[]>([])
  const [categoryStatus, setCategoryStatus] = useState<'loading' | 'ready' | 'error'>('loading')
  const [products, setProducts] = useState<ProductListDto[]>([])
  const [totalItems, setTotalItems] = useState(0)
  const [nextPage, setNextPage] = useState(2)
  const [initialLoading, setInitialLoading] = useState(true)
  const [loadMoreLoading, setLoadMoreLoading] = useState(false)
  const [initialError, setInitialError] = useState(false)
  const [loadMoreError, setLoadMoreError] = useState(false)
  const [retryToken, setRetryToken] = useState(0)
  const requestGeneration = useRef(0)

  useEffect(() => {
    let active = true

    fetchCategories()
      .then((result) => {
        if (!active) return
        setCategories(result.filter((item) => item.isActive && !item.isDeleted))
        setCategoryStatus('ready')
      })
      .catch(() => {
        if (!active) return
        setCategories([])
        setCategoryStatus('error')
      })

    return () => {
      active = false
    }
  }, [])

  const routeCategory = categorySlug && categoryStatus === 'ready'
    ? resolveCategoryFromSlug(categories, categorySlug)
    : undefined

  const selectedCategory = !categorySlug && criteria.categoryId && categoryStatus === 'ready'
    ? categories.find((item) => item.id === criteria.categoryId)
    : undefined

  const routeResolution = !categorySlug
    ? 'plain'
    : categoryStatus === 'loading'
      ? 'loading'
      : categoryStatus === 'error'
        ? 'unavailable'
        : routeCategory
          ? 'resolved'
          : 'not-found'

  const productResolution = categorySlug
    ? routeResolution
    : criteria.categoryId
      ? categoryStatus === 'loading'
        ? 'loading'
        : categoryStatus === 'error' || !selectedCategory
          ? 'selected-category-unavailable'
          : 'resolved'
      : 'plain'

  useEffect(() => {
    const generation = requestGeneration.current + 1
    requestGeneration.current = generation

    const startRequest = async () => {
      await Promise.resolve()
      if (requestGeneration.current !== generation) return

      setProducts([])
      setTotalItems(0)
      setNextPage(2)
      setInitialError(false)
      setLoadMoreError(false)
      setLoadMoreLoading(false)

      if (productResolution === 'loading') {
        setInitialLoading(true)
        return
      }
      if (
        productResolution === 'not-found' ||
        productResolution === 'unavailable' ||
        productResolution === 'selected-category-unavailable'
      ) {
        setInitialLoading(false)
        return
      }

      setInitialLoading(true)
      try {
        const result = await fetchProducts(buildProductQuery(criteria, 1, routeCategory?.id))
        if (requestGeneration.current !== generation) return
        setProducts(appendUniqueProducts([], result.items))
        setTotalItems(result.totalItems)
      } catch {
        if (requestGeneration.current !== generation) return
        setProducts([])
        setTotalItems(0)
        setInitialError(true)
      } finally {
        if (requestGeneration.current === generation) setInitialLoading(false)
      }
    }

    void startRequest()

    return () => {
      if (requestGeneration.current === generation) {
        requestGeneration.current += 1
      }
    }
  }, [criteria, productResolution, retryToken, routeCategory?.id])

  const updateSearchParams = (update: (params: URLSearchParams) => void) => {
    const params = new URLSearchParams(location.search)
    update(params)
    const search = params.toString()
    navigate({ pathname: location.pathname, search: search ? `?${search}` : '' })
  }

  const submitSearch = (searchTerm: string) => {
    updateSearchParams((params) => {
      if (searchTerm) params.set('searchTerm', searchTerm)
      else params.delete('searchTerm')
    })
  }

  const changeCategory = (value: string) => {
    updateSearchParams((params) => {
      if (value) params.set('categoryId', value)
      else params.delete('categoryId')
    })
  }

  const changePrice = (value: string) => {
    updateSearchParams((params) => {
      params.delete('minPrice')
      params.delete('maxPrice')
      if (value === '0-300000') params.set('maxPrice', '300000')
      if (value === '300000-600000') {
        params.set('minPrice', '300000')
        params.set('maxPrice', '600000')
      }
      if (value === '600000-') params.set('minPrice', '600000')
    })
  }

  const changeSort = (value: string) => {
    updateSearchParams((params) => {
      params.delete('sortBy')
      params.delete('sortDirection')
      if (value === 'price-asc' || value === 'price-desc') {
        params.set('sortBy', 'price')
        params.set('sortDirection', value === 'price-desc' ? 'desc' : 'asc')
      }
      if (value === 'newest') {
        params.set('sortBy', 'newest')
        params.set('sortDirection', 'desc')
      }
    })
  }

  const changeTextFilter = (key: 'color' | 'size', value: string) => {
    updateSearchParams((params) => {
      if (value) params.set(key, value)
      else params.delete(key)
    })
  }

  const loadMore = () => {
    const generation = requestGeneration.current
    setLoadMoreLoading(true)
    setLoadMoreError(false)

    fetchProducts(buildProductQuery(criteria, nextPage, routeCategory?.id))
      .then((result) => {
        if (requestGeneration.current !== generation) return
        setProducts((current) => appendUniqueProducts(current, result.items))
        setTotalItems(result.totalItems)
        setNextPage((current) => current + 1)
      })
      .catch(() => {
        if (requestGeneration.current === generation) setLoadMoreError(true)
      })
      .finally(() => {
        if (requestGeneration.current === generation) setLoadMoreLoading(false)
      })
  }

  const categoryOptions = categories.map((item) => ({
    value: item.id.toString(),
    label: item.name,
  }))

  const pageTitle = routeCategory?.name ?? (categorySlug ? 'Bộ Sưu Tập' : 'Tất Cả Sản Phẩm')
  const hasMore = products.length < totalItems

  return (
    <main className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-16 md:py-24">
      <div className="mb-12 md:mb-16">
        <h1 className="font-headline text-[32px] md:text-[48px] font-semibold text-center mb-8 md:mb-12 fade-in">
          {pageTitle}
        </h1>

        <ProductSearchForm
          key={location.key}
          appliedSearchTerm={urlSearchTerm}
          onSubmit={submitSearch}
          onClear={() => updateSearchParams((params) => params.delete('searchTerm'))}
        />

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant pb-6">
          <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto">
            {!categorySlug && (
              <FilterSelect
                label="Danh mục"
                value={criteria.categoryId?.toString() ?? ''}
                onChange={changeCategory}
                options={categoryOptions}
                disabled={categoryStatus === 'error' && !criteria.categoryId}
              />
            )}
            <FilterSelect
              label="Màu sắc"
              value={criteria.color ?? ''}
              onChange={(value) => changeTextFilter('color', value)}
              options={colorOptions}
            />
            <FilterSelect
              label="Kích cỡ"
              value={criteria.size ?? ''}
              onChange={(value) => changeTextFilter('size', value)}
              options={sizeOptions}
            />
            <FilterSelect
              label="Khoảng giá"
              value={priceFilterValue(criteria)}
              onChange={changePrice}
              options={priceOptions}
            />
          </div>

          <div className="w-full md:w-auto">
            <FilterSelect
              label="Sắp xếp theo"
              value={sortFilterValue(criteria)}
              onChange={changeSort}
              options={sortOptions}
            />
          </div>
        </div>

        {!categorySlug && categoryStatus === 'error' && (
          <p role="status" className="mt-3 font-body text-[13px] text-on-surface-variant">
            Bộ lọc danh mục hiện không khả dụng.
          </p>
        )}
      </div>

      {routeResolution === 'not-found' && (
        <div role="status" className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 block">
            search_off
          </span>
          <p className="font-body text-on-surface-variant text-[16px]">
            Không tìm thấy danh mục này.
          </p>
        </div>
      )}

      {routeResolution === 'unavailable' && (
        <div role="alert" className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <p className="font-body text-error text-[16px]">
            Không thể tải danh mục để mở bộ sưu tập này.
          </p>
        </div>
      )}

      {productResolution === 'selected-category-unavailable' && (
        <div role="status" className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 block">
            search_off
          </span>
          <p className="font-body text-on-surface-variant text-[16px]">
            Danh mục đã chọn không tồn tại hoặc không khả dụng.
          </p>
        </div>
      )}

      {initialError && (
        <div role="alert" className="text-center py-20">
          <span className="material-symbols-outlined text-[48px] text-error mb-4 block">error</span>
          <p className="font-body text-error text-[16px]">
            Không thể tải danh sách sản phẩm.
          </p>
          <button
            onClick={() => setRetryToken((current) => current + 1)}
            className="mt-6 border border-primary px-8 py-3 font-label text-[13px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Thử tải lại danh sách
          </button>
        </div>
      )}

      {!initialError &&
        routeResolution !== 'not-found' &&
        routeResolution !== 'unavailable' &&
        productResolution !== 'selected-category-unavailable' && (
        <>
          <div
            className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-[24px] gap-y-12 md:gap-y-16"
            aria-busy={initialLoading || loadMoreLoading}
          >
            {products.map((product) => (
              <ProductCard
                key={product.id}
                product={product}
                onAction={() => {
                  if (product.requiresVariantSelection) {
                    navigate(`/product/${product.id}`)
                    return
                  }

                  addItem({
                    id: product.id.toString(),
                    name: product.name,
                    price: product.price,
                    imageUrl: product.thumbnailUrl || product.imageUrl || '',
                    size: '',
                    color: '',
                    quantity: 1,
                  })
                  showToast(
                    product.name,
                    product.thumbnailUrl || product.imageUrl || '',
                    product.price,
                  )
                }}
              />
            ))}
            {initialLoading && products.length === 0 && Array.from({ length: PAGE_SIZE }).map((_, index) => (
              <SkeletonCard key={`skeleton-${index}`} />
            ))}
          </div>

          {!initialLoading && products.length === 0 && (
            <div role="status" className="text-center py-20">
              <span className="material-symbols-outlined text-[48px] text-on-surface-variant mb-4 block">
                search_off
              </span>
              <p className="font-body text-on-surface-variant text-[16px]">
                Không có sản phẩm phù hợp.
              </p>
            </div>
          )}

          {loadMoreError && (
            <div role="alert" className="mt-12 text-center">
              <p className="font-body text-error text-[15px]">Không thể tải thêm sản phẩm.</p>
              <button
                onClick={loadMore}
                className="mt-4 border border-primary px-8 py-3 font-label text-[13px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
              >
                Thử tải thêm lần nữa
              </button>
            </div>
          )}

          {!initialLoading && !loadMoreError && hasMore && (
            <div className="mt-16 flex justify-center">
              <button
                onClick={loadMore}
                disabled={loadMoreLoading}
                className="border border-primary px-10 py-4 font-label text-[14px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300 cursor-pointer disabled:cursor-wait disabled:opacity-60"
              >
                {loadMoreLoading ? 'Đang tải...' : 'Xem Thêm Sản Phẩm'}
              </button>
            </div>
          )}

          {!initialLoading && products.length > 0 && !hasMore && (
            <p className="mt-16 text-center font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
              Đã hiển thị tất cả {totalItems} sản phẩm
            </p>
          )}
        </>
      )}
    </main>
  )
}
