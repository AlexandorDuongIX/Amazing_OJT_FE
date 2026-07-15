import { useEffect, useMemo, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import {
  createInventory,
  deleteProduct,
  getCategories,
  getInventories,
  getProducts,
  hasAdminToken,
  updateInventory,
} from './api'
import type { ProductFilterDraft } from './components/ProductFilters'
import { aggregateInventoryByProduct, createStockTransition } from './stock'
import type {
  Category,
  InventoryRecord,
  InventorySummary,
  PagedResult,
  ProductFilters,
  ProductListItem,
} from './types'

export const PRODUCT_PAGE_SIZE = 10
const emptyPage: PagedResult<ProductListItem> = {
  page: 1,
  pageSize: PRODUCT_PAGE_SIZE,
  totalItems: 0,
  items: [],
}

function positiveNumber(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isFinite(parsed) && parsed >= 0 ? parsed : undefined
}

function readFilters(params: URLSearchParams): ProductFilters {
  return {
    searchTerm: params.get('searchTerm') || undefined,
    page: Math.max(1, Number(params.get('page')) || 1),
    pageSize: PRODUCT_PAGE_SIZE,
    categoryId: positiveNumber(params.get('categoryId')),
    size: params.get('size') || undefined,
    color: params.get('color') || undefined,
    minPrice: positiveNumber(params.get('minPrice')),
    maxPrice: positiveNumber(params.get('maxPrice')),
  }
}

export function draftFromFilters(filters: ProductFilters): ProductFilterDraft {
  return {
    searchTerm: filters.searchTerm ?? '',
    categoryId: filters.categoryId?.toString() ?? '',
    size: filters.size ?? '',
    color: filters.color ?? '',
    minPrice: filters.minPrice?.toString() ?? '',
    maxPrice: filters.maxPrice?.toString() ?? '',
  }
}

function errorMessage(error: unknown) {
  return error instanceof Error ? error.message : 'The request could not be completed.'
}

export function useProductManagement() {
  const [searchParams, setSearchParams] = useSearchParams()
  const location = useLocation()
  const queryKey = searchParams.toString()
  const filters = useMemo(() => readFilters(new URLSearchParams(queryKey)), [queryKey])
  const [products, setProducts] = useState<PagedResult<ProductListItem>>(emptyPage)
  const [categories, setCategories] = useState<Category[]>([])
  const [inventories, setInventories] = useState<InventoryRecord[]>([])
  const [productsLoading, setProductsLoading] = useState(true)
  const [productsError, setProductsError] = useState<string>()
  const [categoriesError, setCategoriesError] = useState<string>()
  const [inventoryError, setInventoryError] = useState<string>()
  const [inventoryLoading, setInventoryLoading] = useState(true)
  const [reloadVersion, setReloadVersion] = useState(0)
  const [deleteTarget, setDeleteTarget] = useState<ProductListItem>()
  const [stockTarget, setStockTarget] = useState<{ product: ProductListItem; summary?: InventorySummary }>()
  const [busyProductId, setBusyProductId] = useState<number>()
  const [actionError, setActionError] = useState<string>()
  const canWrite = hasAdminToken()
  const successMessage = (location.state as { productSuccess?: string } | null)?.productSuccess

  useEffect(() => {
    let active = true
    getProducts(filters)
      .then((data) => {
        if (active) setProducts(data)
      })
      .catch((error: unknown) => {
        if (active) setProductsError(errorMessage(error))
      })
      .finally(() => {
        if (active) setProductsLoading(false)
      })
    return () => {
      active = false
    }
  }, [filters, reloadVersion])

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((error: unknown) => {
        if (active) setCategoriesError(errorMessage(error))
      })
    return () => {
      active = false
    }
  }, [reloadVersion])

  useEffect(() => {
    let active = true
    getInventories()
      .then((data) => {
        if (active) {
          setInventories(data)
          setInventoryError(undefined)
        }
      })
      .catch((error: unknown) => {
        if (active) setInventoryError(errorMessage(error))
      })
      .finally(() => {
        if (active) setInventoryLoading(false)
      })
    return () => {
      active = false
    }
  }, [reloadVersion])

  const inventoryByProduct = useMemo(() => aggregateInventoryByProduct(inventories), [inventories])
  const stockCounts = useMemo(() => {
    const summaries = [...inventoryByProduct.values()]
    return {
      lowStock: summaries.filter((item) => item.status === 'low-stock').length,
      inStock: summaries.filter((item) => item.status === 'in-stock').length,
      outOfStock: summaries.filter((item) => item.status === 'out-of-stock').length,
    }
  }, [inventoryByProduct])

  const refreshInventory = () => {
    setInventoryLoading(true)
    setReloadVersion((value) => value + 1)
  }

  const applyFilters = (draft: ProductFilterDraft) => {
    setProductsLoading(true)
    setProductsError(undefined)
    const next = new URLSearchParams()
    Object.entries(draft).forEach(([key, value]) => {
      if (value.trim()) next.set(key, value.trim())
    })
    next.set('page', '1')
    setSearchParams(next)
  }

  const setPage = (page: number) => {
    setProductsLoading(true)
    setProductsError(undefined)
    const next = new URLSearchParams(searchParams)
    if (page === 1) next.delete('page')
    else next.set('page', page.toString())
    setSearchParams(next)
  }

  const confirmDelete = async () => {
    if (!deleteTarget || busyProductId !== undefined) return
    setBusyProductId(deleteTarget.id)
    setActionError(undefined)
    try {
      await deleteProduct(deleteTarget.id)
      setProducts((current) => ({
        ...current,
        totalItems: Math.max(0, current.totalItems - 1),
        items: current.items.filter((product) => product.id !== deleteTarget.id),
      }))
      setDeleteTarget(undefined)
      refreshInventory()
    } catch (error) {
      setActionError(errorMessage(error))
    } finally {
      setBusyProductId(undefined)
    }
  }

  const markOutOfStock = async (product: ProductListItem, summary?: InventorySummary) => {
    if (busyProductId !== undefined) return
    setBusyProductId(product.id)
    setActionError(undefined)
    try {
      if (!summary || summary.records.length === 0) {
        await createInventory({ productId: product.id, quantity: 0, reservedQuantity: 0 })
      } else {
        await Promise.all(
          summary.records.map((record) => updateInventory(record.id, createStockTransition(record, 'out-of-stock'))),
        )
      }
      refreshInventory()
    } catch (error) {
      setActionError(errorMessage(error))
    } finally {
      setBusyProductId(undefined)
    }
  }

  const setInStock = async (newTotalQuantity: number) => {
    if (!stockTarget || busyProductId !== undefined) return
    const { product, summary } = stockTarget
    setBusyProductId(product.id)
    setActionError(undefined)
    try {
      if (!summary || summary.records.length === 0) {
        await createInventory({ productId: product.id, quantity: newTotalQuantity, reservedQuantity: 0 })
      } else {
        const [primary, ...otherRecords] = summary.records
        const otherQuantity = otherRecords.reduce((total, record) => total + record.quantity, 0)
        await updateInventory(primary.id, createStockTransition(primary, 'in-stock', newTotalQuantity - otherQuantity))
      }
      setStockTarget(undefined)
      refreshInventory()
    } catch (error) {
      setActionError(errorMessage(error))
    } finally {
      setBusyProductId(undefined)
    }
  }

  return {
    actionError,
    applyFilters,
    busyProductId,
    canManageStock: canWrite && !inventoryLoading && !inventoryError,
    canWrite,
    categories,
    categoriesError,
    confirmDelete,
    deleteTarget,
    filters,
    inventoryByProduct,
    inventoryError,
    markOutOfStock,
    products,
    productsError,
    productsLoading,
    queryKey,
    resetFilters: () => setSearchParams({}),
    retryInventory: () => {
      setInventoryError(undefined)
      refreshInventory()
    },
    retryProducts: () => {
      setProductsLoading(true)
      setProductsError(undefined)
      setReloadVersion((value) => value + 1)
    },
    setDeleteTarget,
    setInStock,
    setPage,
    setStockTarget,
    stockCounts,
    stockTarget,
    successMessage,
  }
}
