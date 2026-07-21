import axios from 'axios'
import type {
  Category,
  CreateProductInput,
  InventoryRecord,
  InventoryWriteInput,
  PagedResult,
  ProductApiErrorCode,
  ProductDetail,
  ProductFilters,
  ProductListItem,
  ProductWriteResult,
  UpdateProductInput,
} from './types'

const TOKEN_KEY = 'token'

export class ProductApiError extends Error {
  code: ProductApiErrorCode
  status?: number

  constructor(code: ProductApiErrorCode, message: string, status?: number) {
    super(message)
    this.name = 'ProductApiError'
    this.code = code
    this.status = status
  }
}

export function normalizeApiBaseUrl(value?: string): string {
  const trimmed = value?.trim().replace(/\/+$/, '') ?? ''
  if (!trimmed) return '/api'
  return /\/api$/i.test(trimmed) ? trimmed : `${trimmed}/api`
}

function apiUrl(path: string): string {
  return `${normalizeApiBaseUrl(import.meta.env.VITE_API_BASE_URL)}${path}`
}

function readAdminToken(): string {
  const token = window.localStorage.getItem(TOKEN_KEY)?.trim()
  if (!token) {
    throw new ProductApiError(
      'missing-token',
      'An Admin or Staff login token is required before saving changes.',
    )
  }
  return token
}

function authorizationConfig() {
  return { headers: { Authorization: `Bearer ${readAdminToken()}` } }
}

function responseMessage(error: unknown): string | undefined {
  if (!error || typeof error !== 'object' || !('response' in error)) return undefined
  const response = (error as { response?: { data?: unknown } }).response
  const data = response?.data
  if (typeof data === 'string') return data
  if (data && typeof data === 'object' && 'message' in data && typeof data.message === 'string') {
    return data.message
  }
  return undefined
}

function toProductApiError(error: unknown): ProductApiError {
  if (error instanceof ProductApiError) return error
  const response =
    error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { status?: number } }).response
      : undefined
  const status = response?.status
  const detail = responseMessage(error)

  if (status === 400) return new ProductApiError('validation', detail ?? 'The submitted product data is invalid.', status)
  if (status === 401 || status === 403) {
    return new ProductApiError('unauthorized', 'The Admin or Staff token is missing, expired, or unauthorized.', status)
  }
  if (status === 404) return new ProductApiError('not-found', detail ?? 'The requested product data was not found.', status)
  if (status === 409) return new ProductApiError('conflict', detail ?? 'The change conflicts with existing product data.', status)
  if (typeof status === 'number' && status >= 500) {
    return new ProductApiError('server', 'The server could not complete the request. Please try again.', status)
  }
  if (response !== undefined) {
    return new ProductApiError('unknown', detail ?? 'The product request could not be completed.', status)
  }
  if (error && typeof error === 'object' && 'request' in error) {
    return new ProductApiError('network', 'The product service could not be reached. Check the backend connection.')
  }
  return new ProductApiError('unknown', detail ?? 'The product request could not be completed.')
}

async function execute<T>(request: Promise<{ data: T }>): Promise<T> {
  try {
    const response = await request
    return response.data
  } catch (error) {
    throw toProductApiError(error)
  }
}

function compactParams(filters: ProductFilters): Record<string, string | number> {
  const entries = Object.entries(filters).flatMap(([key, value]) => {
    if (typeof value === 'string') {
      const trimmed = value.trim()
      return trimmed ? [[key, trimmed]] : []
    }
    return value === undefined ? [] : [[key, value]]
  })
  return Object.fromEntries(entries) as Record<string, string | number>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function invalidResponse(resource: string): ProductApiError {
  return new ProductApiError('server', `The ${resource} service returned an invalid response.`)
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isPositiveInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value > 0
}

function isPositiveNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value > 0
}

function isNonNegativeNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0
}

function isNullableNonNegativeNumber(value: unknown): value is number | null | undefined {
  return value === undefined || value === null || isNonNegativeNumber(value)
}

function isNonNegativeInteger(value: unknown): value is number {
  return typeof value === 'number' && Number.isInteger(value) && value >= 0
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string'
}

function isCategory(value: unknown): value is Category | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (isRecord(value) &&
      isFiniteNumber(value.id) &&
      typeof value.name === 'string')
  )
}

function isProductDetailCategory(value: unknown): value is Category | null | undefined {
  return (
    value === undefined ||
    value === null ||
    (isRecord(value) &&
      isPositiveInteger(value.id) &&
      typeof value.name === 'string' &&
      isOptionalString(value.description) &&
      isOptionalString(value.imageUrl) &&
      (value.parentCategoryId === undefined || value.parentCategoryId === null || isPositiveInteger(value.parentCategoryId)) &&
      (value.isActive === undefined || typeof value.isActive === 'boolean'))
  )
}

function isProductImage(value: unknown): boolean {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.url === 'string' &&
    typeof value.isThumbnail === 'boolean'
  )
}

function isProductVariantDetail(value: unknown): boolean {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.sku === 'string' &&
    Boolean(value.sku.trim()) &&
    isOptionalString(value.color) &&
    isOptionalString(value.size) &&
    isNullableNonNegativeNumber(value.priceOverride) &&
    isPositiveNumber(value.price)
  )
}

function isProductDetail(value: unknown): value is ProductDetail {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.name === 'string' &&
    Boolean(value.name.trim()) &&
    isOptionalString(value.description) &&
    isPositiveNumber(value.basePrice) &&
    isNullableNonNegativeNumber(value.discountPrice) &&
    isProductDetailCategory(value.category) &&
    Array.isArray(value.images) &&
    value.images.every(isProductImage) &&
    Array.isArray(value.variants) &&
    value.variants.every(isProductVariantDetail) &&
    isNonNegativeNumber(value.availableQuantity)
  )
}

function isVariantSummary(value: unknown): boolean {
  return (
    isRecord(value) &&
    isFiniteNumber(value.id) &&
    typeof value.sku === 'string' &&
    isOptionalString(value.color) &&
    isOptionalString(value.size) &&
    (value.priceOverride === undefined || value.priceOverride === null || isFiniteNumber(value.priceOverride))
  )
}

function normalizeProductListItem(value: unknown): ProductListItem | undefined {
  if (
    !isRecord(value) ||
    !isFiniteNumber(value.id) ||
    value.id <= 0 ||
    typeof value.name !== 'string' ||
    !value.name.trim() ||
    !isFiniteNumber(value.basePrice) ||
    value.basePrice <= 0 ||
    !isFiniteNumber(value.price) ||
    !isFiniteNumber(value.availableQuantity) ||
    !isOptionalString(value.description) ||
    !isOptionalString(value.thumbnailUrl) ||
    !isCategory(value.category) ||
    (value.discountPrice !== undefined && value.discountPrice !== null && !isFiniteNumber(value.discountPrice)) ||
    (value.variantsSummary !== undefined &&
      (!Array.isArray(value.variantsSummary) || !value.variantsSummary.every(isVariantSummary)))
  ) {
    return undefined
  }

  const price = value.price > 0
    ? value.price
    : isFiniteNumber(value.discountPrice) && value.discountPrice > 0 && value.discountPrice < value.basePrice
      ? value.discountPrice
      : value.basePrice

  return {
    id: value.id,
    name: value.name,
    ...(value.description !== undefined ? { description: value.description } : {}),
    basePrice: value.basePrice,
    price,
    ...(value.discountPrice !== undefined ? { discountPrice: value.discountPrice } : {}),
    ...(value.category !== undefined ? { category: value.category } : {}),
    ...(value.thumbnailUrl !== undefined ? { thumbnailUrl: value.thumbnailUrl } : {}),
    availableQuantity: value.availableQuantity,
    variantsSummary: Array.isArray(value.variantsSummary) ? value.variantsSummary : [],
  }
}

function isInventoryRecord(value: unknown): value is InventoryRecord {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    isPositiveInteger(value.productId) &&
    isNonNegativeInteger(value.quantity) &&
    isNonNegativeInteger(value.reservedQuantity) &&
    (value.warehouseId === undefined || value.warehouseId === null || isPositiveInteger(value.warehouseId)) &&
    isOptionalString(value.location) &&
    isOptionalString(value.lastRestockDate) &&
    isOptionalString(value.notes)
  )
}

export function hasAdminToken(): boolean {
  return Boolean(window.localStorage.getItem(TOKEN_KEY)?.trim())
}

export async function getProducts(filters: ProductFilters): Promise<PagedResult<ProductListItem>> {
  const isSearch = Boolean(filters.searchTerm?.trim())
  const path = isSearch ? '/products/search' : '/products'
  const data = await execute<unknown>(axios.get(apiUrl(path), { params: compactParams(filters) }))
  if (
    !isRecord(data) ||
    !isPositiveInteger(data.page) ||
    !isPositiveInteger(data.pageSize) ||
    !isNonNegativeInteger(data.totalItems) ||
    !Array.isArray(data.items)
  ) {
    throw invalidResponse('product')
  }
  const items = data.items.map(normalizeProductListItem)
  if (items.some((item) => item === undefined)) throw invalidResponse('product')
  return {
    page: data.page,
    pageSize: data.pageSize,
    totalItems: data.totalItems,
    items: items as ProductListItem[],
  }
}

export async function getProduct(productId: number): Promise<ProductDetail> {
  const data = await execute<unknown>(axios.get(apiUrl(`/products/${productId}`)))
  if (!isProductDetail(data)) throw invalidResponse('product detail')
  return data
}

export async function createProduct(input: CreateProductInput): Promise<ProductWriteResult> {
  const data = await execute<unknown>(axios.post(apiUrl('/products'), input, authorizationConfig()))
  if (!isRecord(data) || typeof data.id !== 'number' || typeof data.name !== 'string') throw invalidResponse('product')
  return data as unknown as ProductWriteResult
}

export async function updateProduct(productId: number, input: UpdateProductInput): Promise<ProductWriteResult> {
  const body = {
    id: productId,
    name: input.name,
    description: input.description,
    price: input.price,
    discountPrice: input.discountPrice,
    categoryId: input.categoryId,
  }
  const data = await execute<unknown>(axios.put(apiUrl(`/products/${productId}`), body, authorizationConfig()))
  if (!isRecord(data) || typeof data.id !== 'number' || typeof data.name !== 'string') throw invalidResponse('product')
  return data as unknown as ProductWriteResult
}

export async function deleteProduct(productId: number): Promise<void> {
  return execute(axios.delete(apiUrl(`/products/${productId}`), authorizationConfig()))
}

export async function getCategories(): Promise<Category[]> {
  const data = await execute<unknown>(axios.get(apiUrl('/categories')))
  if (!Array.isArray(data) || !data.every((item) => isRecord(item) && typeof item.id === 'number' && typeof item.name === 'string')) {
    throw invalidResponse('category')
  }
  return data as Category[]
}

export async function getInventories(): Promise<InventoryRecord[]> {
  const data = await execute<unknown>(axios.get(apiUrl('/inventories')))
  if (!Array.isArray(data) || !data.every(isInventoryRecord)) throw invalidResponse('inventory')
  return data
}

export async function getInventoryByProduct(productId: number): Promise<InventoryRecord> {
  const data = await execute<unknown>(axios.get(apiUrl(`/inventories/product/${productId}`)))
  if (!isInventoryRecord(data)) throw invalidResponse('inventory')
  return data
}

export async function createInventory(input: InventoryWriteInput): Promise<InventoryRecord> {
  const data = await execute<unknown>(axios.post(apiUrl('/inventories'), input, authorizationConfig()))
  if (!isInventoryRecord(data)) throw invalidResponse('inventory')
  return data
}

export async function updateInventory(inventoryId: number, input: InventoryWriteInput): Promise<InventoryRecord> {
  const data = await execute<unknown>(
    axios.put(apiUrl(`/inventories/${inventoryId}`), { ...input, id: inventoryId }, authorizationConfig()),
  )
  if (!isInventoryRecord(data)) throw invalidResponse('inventory')
  return data
}
