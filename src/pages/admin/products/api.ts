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

const TOKEN_KEY = 'amazing_admin_token'

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
  const token = window.sessionStorage.getItem(TOKEN_KEY)?.trim()
  if (!token) {
    throw new ProductApiError(
      'missing-token',
      'An Admin or Staff token is required. Add it to this browser session before saving changes.',
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
  const status =
    error && typeof error === 'object' && 'response' in error
      ? (error as { response?: { status?: number } }).response?.status
      : undefined
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
  return Object.fromEntries(
    Object.entries(filters).filter(([, value]) => value !== undefined && value !== ''),
  ) as Record<string, string | number>
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function invalidResponse(resource: string): ProductApiError {
  return new ProductApiError('server', `The ${resource} service returned an invalid response.`)
}

function isProductListItem(value: unknown): value is ProductListItem {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.name === 'string' &&
    typeof value.price === 'number' &&
    typeof value.availableQuantity === 'number'
  )
}

function isInventoryRecord(value: unknown): value is InventoryRecord {
  return (
    isRecord(value) &&
    typeof value.id === 'number' &&
    typeof value.productId === 'number' &&
    typeof value.quantity === 'number' &&
    typeof value.reservedQuantity === 'number'
  )
}

export function hasAdminToken(): boolean {
  return Boolean(window.sessionStorage.getItem(TOKEN_KEY)?.trim())
}

export async function getProducts(filters: ProductFilters): Promise<PagedResult<ProductListItem>> {
  const isSearch = Boolean(filters.searchTerm?.trim())
  const path = isSearch ? '/products/search' : '/products'
  const data = await execute<unknown>(axios.get(apiUrl(path), { params: compactParams(filters) }))
  if (
    !isRecord(data) ||
    typeof data.page !== 'number' ||
    typeof data.pageSize !== 'number' ||
    typeof data.totalItems !== 'number' ||
    !Array.isArray(data.items) ||
    !data.items.every(isProductListItem)
  ) {
    throw invalidResponse('product')
  }
  return data as unknown as PagedResult<ProductListItem>
}

export async function getProduct(productId: number): Promise<ProductDetail> {
  const data = await execute<unknown>(axios.get(apiUrl(`/products/${productId}`)))
  if (!isRecord(data) || typeof data.id !== 'number' || typeof data.name !== 'string' || !Array.isArray(data.images) || !Array.isArray(data.variants)) {
    throw invalidResponse('product detail')
  }
  return data as unknown as ProductDetail
}

export async function createProduct(input: CreateProductInput): Promise<ProductWriteResult> {
  const data = await execute<unknown>(axios.post(apiUrl('/products'), input, authorizationConfig()))
  if (!isRecord(data) || typeof data.id !== 'number' || typeof data.name !== 'string') throw invalidResponse('product')
  return data as unknown as ProductWriteResult
}

export async function updateProduct(productId: number, input: UpdateProductInput): Promise<ProductWriteResult> {
  const data = await execute<unknown>(axios.put(apiUrl(`/products/${productId}`), { id: productId, ...input }, authorizationConfig()))
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
  return execute(axios.post(apiUrl('/inventories'), input, authorizationConfig()))
}

export async function updateInventory(inventoryId: number, input: InventoryWriteInput): Promise<InventoryRecord> {
  return execute(
    axios.put(apiUrl(`/inventories/${inventoryId}`), { ...input, id: inventoryId }, authorizationConfig()),
  )
}
