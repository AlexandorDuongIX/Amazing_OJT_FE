import axios from 'axios'
import axiosClient from './axiosClient'
import type {
  CategoryDto,
  CategorySummaryDto,
  ImageDto,
  PagedResult,
  ProductDetailDto,
  ProductListDto,
  ProductListQueryParams,
  ProductSearchQueryParams,
  ProductSearchResultDto,
  VariantDetailDto,
  VariantSummaryDto,
} from '../types/product'

export type CatalogApiErrorCode =
  | 'network'
  | 'not-found'
  | 'invalid-response'
  | 'request-failed'

export class CatalogApiError extends Error {
  code: CatalogApiErrorCode
  status?: number

  constructor(code: CatalogApiErrorCode, message: string, status?: number) {
    super(message)
    this.name = 'CatalogApiError'
    this.code = code
    this.status = status
  }
}

function isRecord(value: unknown): value is Record<string, unknown> {
  return Boolean(value) && typeof value === 'object'
}

function isFiniteNumber(value: unknown): value is number {
  return typeof value === 'number' && Number.isFinite(value)
}

function isPositiveNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value > 0
}

function isNonNegativeNumber(value: unknown): value is number {
  return isFiniteNumber(value) && value >= 0
}

function isPositiveInteger(value: unknown): value is number {
  return Number.isInteger(value) && isPositiveNumber(value)
}

function isOptionalString(value: unknown): value is string | null | undefined {
  return value === undefined || value === null || typeof value === 'string'
}

function isNullableString(value: unknown): value is string | null {
  return value === null || typeof value === 'string'
}

function isNullableNumber(value: unknown): value is number | null {
  return value === null || isFiniteNumber(value)
}

function isCategorySummary(value: unknown): value is CategorySummaryDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0
  )
}

function isOptionalCategorySummary(
  value: unknown,
): value is CategorySummaryDto | null | undefined {
  return value === undefined || value === null || isCategorySummary(value)
}

function isVariantSummary(value: unknown): value is VariantSummaryDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.sku === 'string' &&
    isNullableString(value.color) &&
    isNullableString(value.size) &&
    isNullableNumber(value.priceOverride)
  )
}

function isVariantDetail(value: unknown): value is VariantDetailDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.sku === 'string' &&
    isNullableString(value.color) &&
    isNullableString(value.size) &&
    isNullableNumber(value.priceOverride) &&
    isPositiveNumber(value.price)
  )
}

function isImage(value: unknown): value is ImageDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.url === 'string' &&
    value.url.length > 0 &&
    typeof value.isThumbnail === 'boolean'
  )
}

function invalidResponse(resource: string): CatalogApiError {
  return new CatalogApiError(
    'invalid-response',
    `The ${resource} service returned an invalid response.`,
  )
}

function toCatalogApiError(error: unknown): CatalogApiError {
  if (error instanceof CatalogApiError) return error

  if (axios.isAxiosError(error)) {
    const status = error.response?.status
    if (status === 404) {
      return new CatalogApiError('not-found', 'The requested catalog item was not found.', status)
    }
    if (!error.response) {
      return new CatalogApiError('network', 'The catalog service could not be reached.')
    }
    return new CatalogApiError('request-failed', 'The catalog request could not be completed.', status)
  }

  return new CatalogApiError('request-failed', 'The catalog request could not be completed.')
}

async function getBody<T>(path: string, config?: { params: Record<string, unknown> }): Promise<T> {
  try {
    return config
      ? await axiosClient.get<unknown, T>(path, config)
      : await axiosClient.get<unknown, T>(path)
  } catch (error) {
    throw toCatalogApiError(error)
  }
}

function compactBrowsingParams(params: ProductListQueryParams): Record<string, unknown> {
  const supported = {
    page: params.page,
    pageSize: params.pageSize,
    categoryId: params.categoryId,
    minPrice: params.minPrice,
    maxPrice: params.maxPrice,
    size: params.size,
    color: params.color,
    sort: params.sort,
    sortBy: params.sortBy,
    sortDirection: params.sortDirection,
  }

  return Object.fromEntries(
    Object.entries(supported).filter(([, value]) => value !== undefined && value !== ''),
  )
}

function requestDetails(params: ProductSearchQueryParams = {}) {
  const searchTerm = params.searchTerm?.trim()
  const browsingParams = compactBrowsingParams(params)

  if (!searchTerm) {
    return { path: '/products', params: browsingParams, isSearch: false }
  }

  return {
    path: '/products/search',
    params: {
      ...browsingParams,
      searchTerm,
      ...(params.brand?.trim() ? { brand: params.brand.trim() } : {}),
    },
    isSearch: true,
  }
}

function isPageEnvelope(value: unknown): value is Record<string, unknown> & {
  page: number
  pageSize: number
  totalItems: number
  items: unknown[]
} {
  return (
    isRecord(value) &&
    isPositiveInteger(value.page) &&
    Number.isInteger(value.pageSize) &&
    isNonNegativeNumber(value.pageSize) &&
    Number.isInteger(value.totalItems) &&
    isNonNegativeNumber(value.totalItems) &&
    Array.isArray(value.items)
  )
}

function normalizeListItem(value: unknown): ProductListDto | undefined {
  if (
    !isRecord(value) ||
    !isPositiveInteger(value.id) ||
    typeof value.name !== 'string' ||
    value.name.trim().length === 0 ||
    !isPositiveNumber(value.basePrice) ||
    !isFiniteNumber(value.price) ||
    typeof value.isActive !== 'boolean' ||
    !isOptionalString(value.sku) ||
    !isOptionalString(value.brand) ||
    !isOptionalString(value.color) ||
    !isOptionalString(value.size) ||
    !isOptionalString(value.imageUrl) ||
    !isOptionalCategorySummary(value.category) ||
    !isOptionalString(value.thumbnailUrl) ||
    !isNonNegativeNumber(value.availableQuantity) ||
    !Array.isArray(value.variantsSummary) ||
    !value.variantsSummary.every(isVariantSummary)
  ) {
    return undefined
  }

  return {
    id: value.id,
    name: value.name,
    sku: value.sku,
    brand: value.brand,
    color: value.color,
    size: value.size,
    basePrice: value.basePrice,
    price: value.price > 0 ? value.price : value.basePrice,
    isActive: value.isActive,
    imageUrl: value.imageUrl,
    category: value.category,
    thumbnailUrl: value.thumbnailUrl,
    availableQuantity: value.availableQuantity,
    variantsSummary: value.variantsSummary,
    requiresVariantSelection: value.variantsSummary.length > 0,
  }
}

function isSearchItem(value: unknown): value is ProductSearchResultDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    isNullableString(value.description) &&
    isPositiveNumber(value.basePrice) &&
    isFiniteNumber(value.price) &&
    isNullableNumber(value.discountPrice) &&
    isNullableString(value.brand) &&
    isNullableString(value.color) &&
    isNullableString(value.size) &&
    (value.category === null || isCategorySummary(value.category)) &&
    isNullableString(value.thumbnailUrl) &&
    isNonNegativeNumber(value.availableQuantity)
  )
}

function normalizeSearchItem(value: unknown): ProductListDto | undefined {
  if (!isSearchItem(value)) return undefined

  const fallbackPrice =
    isPositiveNumber(value.discountPrice) && value.discountPrice < value.basePrice
      ? value.discountPrice
      : value.basePrice

  return {
    id: value.id,
    name: value.name,
    description: value.description,
    brand: value.brand,
    color: value.color,
    size: value.size,
    basePrice: value.basePrice,
    price: value.price > 0 ? value.price : fallbackPrice,
    discountPrice: value.discountPrice,
    category: value.category,
    thumbnailUrl: value.thumbnailUrl,
    availableQuantity: value.availableQuantity,
    variantsSummary: [],
    requiresVariantSelection: true,
  }
}

function normalizePage(
  value: unknown,
  normalizeItem: (item: unknown) => ProductListDto | undefined,
): PagedResult<ProductListDto> {
  if (!isPageEnvelope(value)) throw invalidResponse('product')

  const items = value.items.map(normalizeItem)
  if (items.some((item) => item === undefined)) throw invalidResponse('product')

  return {
    page: value.page,
    pageSize: value.pageSize,
    totalItems: value.totalItems,
    items: items as ProductListDto[],
  }
}

export async function fetchProducts(
  params: ProductSearchQueryParams = {},
): Promise<PagedResult<ProductListDto>> {
  const request = requestDetails(params)
  const data = await getBody<unknown>(request.path, { params: request.params })
  return normalizePage(data, request.isSearch ? normalizeSearchItem : normalizeListItem)
}

function isProductDetail(value: unknown): value is ProductDetailDto {
  return (
    isRecord(value) &&
    isPositiveInteger(value.id) &&
    typeof value.name === 'string' &&
    value.name.trim().length > 0 &&
    isNullableString(value.description) &&
    isPositiveNumber(value.basePrice) &&
    isNullableNumber(value.discountPrice) &&
    (value.category === null || isCategorySummary(value.category)) &&
    Array.isArray(value.images) &&
    value.images.every(isImage) &&
    Array.isArray(value.variants) &&
    value.variants.every(isVariantDetail) &&
    isNonNegativeNumber(value.availableQuantity)
  )
}

export async function fetchProductById(id: number | string): Promise<ProductDetailDto> {
  const data = await getBody<unknown>(`/products/${id}`)
  if (!isProductDetail(data)) throw invalidResponse('product detail')
  return data
}

function isCategory(value: unknown): value is CategoryDto {
  if (!isCategorySummary(value)) return false
  const fields = value as unknown as Record<string, unknown>

  return (
    isNullableString(fields.description) &&
    isNullableString(fields.imageUrl) &&
    (fields.parentCategoryId === null || isPositiveInteger(fields.parentCategoryId)) &&
    typeof fields.isActive === 'boolean' &&
    typeof fields.createdAt === 'string' &&
    isNullableString(fields.updatedAt) &&
    typeof fields.isDeleted === 'boolean'
  )
}

export async function fetchCategories(): Promise<CategoryDto[]> {
  const data = await getBody<unknown>('/categories')
  if (!Array.isArray(data) || !data.every(isCategory)) throw invalidResponse('category')
  return data
}
