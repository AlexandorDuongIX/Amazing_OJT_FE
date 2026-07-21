export type StockStatus = 'in-stock' | 'low-stock' | 'out-of-stock'

export type ManagementRole = 'admin' | 'staff'

export type ProductRouteBase = '/admin/products' | '/staff/products'

export interface Category {
  id: number
  name: string
  description?: string | null
  imageUrl?: string | null
  parentCategoryId?: number | null
  isActive?: boolean
}

export interface ProductVariantSummary {
  id: number
  sku: string
  color?: string | null
  size?: string | null
  priceOverride?: number | null
}

export interface ProductVariantDetail extends ProductVariantSummary {
  price: number
}

export interface ProductImage {
  id: number
  url: string
  isThumbnail: boolean
}

export interface ProductListItem {
  id: number
  name: string
  description?: string | null
  basePrice: number
  price: number
  discountPrice?: number | null
  category?: Category | null
  thumbnailUrl?: string | null
  availableQuantity: number
  variantsSummary?: ProductVariantSummary[]
}

export interface ProductDetail {
  id: number
  name: string
  description?: string | null
  basePrice: number
  discountPrice?: number | null
  category?: Category | null
  images: ProductImage[]
  variants: ProductVariantDetail[]
  availableQuantity: number
}

export interface ProductWriteResult {
  id: number
  name: string
}

export interface PagedResult<T> {
  page: number
  pageSize: number
  totalItems: number
  items: T[]
}

export interface ProductFilters {
  searchTerm?: string
  page: number
  pageSize: number
  categoryId?: number
  minPrice?: number
  maxPrice?: number
  size?: string
  color?: string
}

export interface CreateProductVariantInput {
  sku: string
  color?: string
  size?: string
  priceOverride?: number
}

export interface CreateProductImageInput {
  imageUrl: string
  isThumbnail: boolean
}

export interface CreateProductInput {
  name: string
  description?: string
  basePrice: number
  discountPrice?: number
  categoryId: number
  sku?: string
  brand?: string
  color?: string
  size?: string
  material?: string
  imageUrl?: string
  isActive?: boolean
  variants?: CreateProductVariantInput[]
  images?: CreateProductImageInput[]
}

export interface UpdateProductInput {
  name: string
  description?: string
  price: number
  discountPrice?: number
  categoryId: number
}

export interface InventoryRecord {
  id: number
  productId: number
  quantity: number
  reservedQuantity: number
  warehouseId?: number | null
  location?: string | null
  lastRestockDate?: string | null
  notes?: string | null
}

export type InventoryWriteInput = Pick<
  InventoryRecord,
  'productId' | 'quantity' | 'reservedQuantity'
> &
  Partial<Pick<InventoryRecord, 'id' | 'warehouseId' | 'location' | 'lastRestockDate' | 'notes'>>

export interface InventorySummary {
  productId: number
  quantity: number
  reservedQuantity: number
  availableQuantity: number
  status: StockStatus
  records: InventoryRecord[]
}

export type ProductApiErrorCode =
  | 'missing-token'
  | 'validation'
  | 'unauthorized'
  | 'not-found'
  | 'conflict'
  | 'server'
  | 'network'
  | 'unknown'

export interface ProductFormValues {
  name: string
  description: string
  regularPrice: string
  discountPrice: string
  categoryId: string
  initialStock: string
  sku: string
  brand: string
  material: string
  color: string
  size: string
  variants: Array<{ sku: string; color: string; size: string; priceOverride: string }>
  images: Array<{ imageUrl: string; isThumbnail: boolean }>
}
