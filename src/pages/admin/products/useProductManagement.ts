import { useEffect, useLayoutEffect, useMemo, useRef, useState } from 'react'
import { useLocation, useSearchParams } from 'react-router-dom'
import { useAuthStore } from '../../customer/auth/authStore'
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
  ManagementRole,
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

function positiveSafeInteger(value: string | null): number | undefined {
  if (!value) return undefined
  const parsed = Number(value)
  return Number.isSafeInteger(parsed) && parsed > 0 ? parsed : undefined
}

function readFilters(params: URLSearchParams): ProductFilters {
  return {
    searchTerm: params.get('searchTerm') || undefined,
    page: positiveSafeInteger(params.get('page')) ?? 1,
    pageSize: PRODUCT_PAGE_SIZE,
    categoryId: positiveSafeInteger(params.get('categoryId')),
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

export function useProductManagement(role: ManagementRole) {
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
  const user = useAuthStore((state) => state.user)
  const canWrite = hasAdminToken() && user?.role.trim().toLowerCase() === role
  const successMessage = (location.state as { productSuccess?: string } | null)?.productSuccess
  const latestViewRef = useRef({ filters, products, queryKey })

  useLayoutEffect(() => {
    latestViewRef.current = { filters, products, queryKey }
  }, [filters, products, queryKey])

  useEffect(() => {
    let active = true
    queueMicrotask(() => {
      if (!active) return
      setProductsLoading(true)
      setProductsError(undefined)
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
    queueMicrotask(() => {
      if (!active) return
      setInventoryLoading(true)
      setInventoryError(undefined)
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
    const target = deleteTarget
    const deletionQueryKey = queryKey
    setBusyProductId(target.id)
    setActionError(undefined)
    try {
      await deleteProduct(target.id)
      const latestView = latestViewRef.current
      if (latestView.queryKey === deletionQueryKey) {
        const targetIsVisible = latestView.products.items.some((product) => product.id === target.id)
        if (targetIsVisible) {
          setProducts((current) => ({
            ...current,
            totalItems: Math.max(0, current.totalItems - 1),
            items: current.items.filter((product) => product.id !== target.id),
          }))
        }
        if (
          latestView.filters.page > 1 &&
          latestView.products.items.length === 1 &&
          latestView.products.items[0]?.id === target.id
        ) {
          const next = new URLSearchParams(latestView.queryKey)
          const previousPage = latestView.filters.page - 1
          if (previousPage === 1) next.delete('page')
          else next.set('page', previousPage.toString())
          setProductsLoading(true)
          setProductsError(undefined)
          setSearchParams(next)
        }
      }
      setDeleteTarget((current) => current?.id === target.id ? undefined : current)
      refreshInventory()
    } catch (error) {
      setActionError(errorMessage(error))
    } finally {
      setBusyProductId(undefined)
    }
  }

  const markOutOfStock = async (product: ProductListItem, loadedSummary?: InventorySummary) => {
    void loadedSummary
    if (busyProductId !== undefined) return
    setBusyProductId(product.id)
    setActionError(undefined)
    try {
      const currentSummary = aggregateInventoryByProduct(await getInventories()).get(product.id)
      if (!currentSummary || currentSummary.records.length === 0) {
        await createInventory({ productId: product.id, quantity: 0, reservedQuantity: 0 })
      } else {
        const results = await Promise.allSettled(
          currentSummary.records.map((record) => updateInventory(record.id, createStockTransition(record, 'out-of-stock'))),
        )
        const succeeded = results.filter((result) => result.status === 'fulfilled').length
        const failed = results.length - succeeded
        if (failed > 0) {
          setActionError(
            succeeded > 0
              ? `Stock updated ${succeeded} of ${results.length} inventory records; ${failed} update${failed === 1 ? '' : 's'} failed. Current inventory is being refreshed.`
              : `Stock update failed for all ${results.length} inventory records. Current inventory is being refreshed.`,
          )
        }
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
    const { product } = stockTarget
    setBusyProductId(product.id)
    setActionError(undefined)
    try {
      const currentSummary = aggregateInventoryByProduct(await getInventories()).get(product.id)
      if (!currentSummary || currentSummary.records.length === 0) {
        await createInventory({ productId: product.id, quantity: newTotalQuantity, reservedQuantity: 0 })
      } else {
        if (newTotalQuantity <= currentSummary.reservedQuantity) {
          throw new Error(
            `The requested total must be greater than the latest reserved quantity of ${currentSummary.reservedQuantity}.`,
          )
        }
        const [primary, ...otherRecords] = currentSummary.records
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
