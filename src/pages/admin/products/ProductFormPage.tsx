import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useLocation, useNavigate, useParams } from 'react-router-dom'
import { useAuthStore } from '../../customer/auth/authStore'
import {
  ProductApiError,
  createInventory,
  createProduct,
  getCategories,
  getInventoryByProduct,
  getProduct,
  hasAdminToken,
  updateInventory,
  updateProduct,
} from './api'
import {
  buildCreateProductInput,
  buildUpdateProductInput,
  emptyProductForm,
  productFormFromDetail,
} from './form'
import ProductForm from './ProductForm'
import type {
  Category,
  InventoryRecord,
  ManagementRole,
  ProductDetail,
  ProductFormValues,
  ProductRouteBase,
  ProductWriteResult,
} from './types'

type Feedback = { kind: 'success' | 'error' | 'partial'; message: string; productId?: number }

type DetailLoadResult = {
  productId: number
  product?: ProductDetail
  inventory?: InventoryRecord | null
  error?: string
}

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : 'The request could not be completed.'
}

async function getInventoryOrNull(productId: number): Promise<InventoryRecord | null> {
  try {
    return await getInventoryByProduct(productId)
  } catch (error) {
    if (error instanceof ProductApiError && error.code === 'not-found') return null
    throw error
  }
}

interface ProductFormPageProps {
  role: ManagementRole
}

function ProductFormPageContent({ role }: ProductFormPageProps) {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const mode = productId ? 'edit' : 'create'
  const numericProductId = Number(productId)
  const validEditId = mode === 'create' || (Number.isInteger(numericProductId) && numericProductId > 0)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [categoriesError, setCategoriesError] = useState<string>()
  const [detailResult, setDetailResult] = useState<DetailLoadResult>()
  const [feedback, setFeedback] = useState<Feedback>()
  const [submitting, setSubmitting] = useState(false)
  const user = useAuthStore((state) => state.user)
  const canWrite = hasAdminToken() && user?.role.trim().toLowerCase() === role
  const productBasePath: ProductRouteBase = role === 'admin' ? '/admin/products' : '/staff/products'

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((error: unknown) => {
        if (active) setCategoriesError(`Categories could not be loaded: ${messageFrom(error)}`)
      })
      .finally(() => {
        if (active) setCategoriesLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !validEditId) return
    let active = true
    const inventoryRequest = getInventoryOrNull(numericProductId)
    Promise.all([getProduct(numericProductId), inventoryRequest])
      .then(([productData, inventoryData]) => {
        if (!active) return
        setDetailResult({ productId: numericProductId, product: productData, inventory: inventoryData })
      })
      .catch((error: unknown) => {
        if (active) {
          setDetailResult({
            productId: numericProductId,
            error: `Product details could not be loaded: ${messageFrom(error)}`,
          })
        }
      })
    return () => {
      active = false
    }
  }, [mode, numericProductId, validEditId])

  const currentDetail = mode === 'edit' && detailResult?.productId === numericProductId
    ? detailResult
    : undefined
  const product = currentDetail?.product
  const inventory = currentDetail?.inventory ?? null
  const detailsLoading = mode === 'edit' && validEditId && currentDetail === undefined
  const pageError = mode === 'edit' && !validEditId
    ? 'Product ID must be a positive whole number.'
    : categoriesError ?? currentDetail?.error

  const initialValues = useMemo(() => {
    if (mode === 'edit' && product) return productFormFromDetail(product, inventory)
    return emptyProductForm()
  }, [inventory, mode, product])

  const submit = async (values: ProductFormValues) => {
    setSubmitting(true)
    setFeedback(undefined)
    if (mode === 'create') {
      let created: ProductWriteResult
      try {
        created = await createProduct(buildCreateProductInput(values))
      } catch (error) {
        setFeedback({ kind: 'error', message: `Nothing was saved. ${messageFrom(error)}` })
        setSubmitting(false)
        return
      }
      try {
        await createInventory({ productId: created.id, quantity: Number(values.initialStock), reservedQuantity: 0 })
        navigate(productBasePath, { state: { productSuccess: `Product “${created.name}” was created with its initial stock.` } })
      } catch (error) {
        setFeedback({
          kind: 'partial',
          message: `The product was created, but its stock was not saved. ${messageFrom(error)}`,
          productId: created.id,
        })
      } finally {
        setSubmitting(false)
      }
      return
    }

    let currentInventory: InventoryRecord | null
    try {
      currentInventory = await getInventoryOrNull(numericProductId)
    } catch (error) {
      setFeedback({
        kind: 'error',
        message: `Nothing was saved. Current stock could not be checked: ${messageFrom(error)}`,
      })
      setSubmitting(false)
      return
    }

    const requestedQuantity = Number(values.initialStock)
    const currentReservedQuantity = currentInventory?.reservedQuantity ?? 0
    if (requestedQuantity < currentReservedQuantity) {
      setFeedback({
        kind: 'error',
        message: `Nothing was saved. ${currentReservedQuantity} units are currently reserved, so total stock cannot be lower than that amount.`,
      })
      setSubmitting(false)
      return
    }

    try {
      await updateProduct(numericProductId, buildUpdateProductInput(values))
    } catch (error) {
      setFeedback({ kind: 'error', message: `Nothing was saved. ${messageFrom(error)}` })
      setSubmitting(false)
      return
    }

    try {
      if (currentInventory) {
        await updateInventory(currentInventory.id, { ...currentInventory, quantity: requestedQuantity })
      } else {
        await createInventory({ productId: numericProductId, quantity: requestedQuantity, reservedQuantity: 0 })
      }
      setFeedback({ kind: 'success', message: 'Product details and stock were saved.' })
    } catch (error) {
      setFeedback({ kind: 'partial', message: `Product details were saved, but stock was not saved. ${messageFrom(error)}` })
    } finally {
      setSubmitting(false)
    }
  }

  const loading = categoriesLoading || detailsLoading
  return (
    <div className="space-y-7 max-w-5xl">
      <header>
          <Link to={productBasePath} className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#444748] hover:text-black"><ArrowLeft size={16} /> Back to inventory</Link>
          <h1 className="mt-5 text-4xl font-medium">{mode === 'create' ? 'Create Product' : 'Edit Product'}</h1>
          <p className="mt-2 text-sm text-[#444748]">{mode === 'create' ? 'Add catalogue details, creation-only options, images, variants, and initial stock.' : 'Update the fields supported by the current product API without changing creation-only data.'}</p>
        </header>

        {pageError ? <div role="alert" className="border-l-4 border-[#ba1a1a] bg-[#fff5f3] px-5 py-4 text-sm text-[#93000a]">{pageError}</div> : null}
        {feedback ? (
          <div role="status" className={`border-l-4 px-5 py-4 text-sm ${feedback.kind === 'error' ? 'border-[#ba1a1a] bg-[#fff5f3] text-[#93000a]' : 'border-[#735c00] bg-[#fff7d8]'}`}>
            {feedback.message}
            {feedback.productId ? <Link to={`${productBasePath}/${feedback.productId}/edit`} className="ml-2 font-semibold underline">Open the product editor</Link> : null}
          </div>
        ) : null}

        {loading ? <div className="border border-[#c4c7c7]/30 bg-white px-6 py-16 text-center text-sm uppercase tracking-[0.14em] text-[#444748]">Loading product form…</div> : null}
        {!loading && !pageError && (mode === 'create' || product) ? (
          <ProductForm
            key={mode === 'edit' ? `edit-${product?.id}-${inventory?.id ?? 'new'}` : 'create'}
            mode={mode}
            initialValues={initialValues}
            categories={categories}
            product={product}
            reservedQuantity={inventory?.reservedQuantity ?? 0}
            canWrite={canWrite}
            submitting={submitting}
            onSubmit={submit}
          />
        ) : null}
    </div>
  )
}

export default function ProductFormPage(props: ProductFormPageProps) {
  const location = useLocation()
  return <ProductFormPageContent key={location.key} {...props} />
}
