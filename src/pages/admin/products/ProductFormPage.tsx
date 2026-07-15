import { useEffect, useMemo, useState } from 'react'
import { ArrowLeft } from 'lucide-react'
import { Link, useNavigate, useParams } from 'react-router-dom'
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
import type { Category, InventoryRecord, ProductDetail, ProductFormValues, ProductWriteResult } from './types'

type Feedback = { kind: 'success' | 'error' | 'partial'; message: string; productId?: number }

function messageFrom(error: unknown) {
  return error instanceof Error ? error.message : 'The request could not be completed.'
}

export default function ProductFormPage() {
  const { productId } = useParams<{ productId: string }>()
  const navigate = useNavigate()
  const mode = productId ? 'edit' : 'create'
  const numericProductId = Number(productId)
  const [categories, setCategories] = useState<Category[]>([])
  const [categoriesLoading, setCategoriesLoading] = useState(true)
  const [product, setProduct] = useState<ProductDetail>()
  const [inventory, setInventory] = useState<InventoryRecord | null>(null)
  const [detailsLoading, setDetailsLoading] = useState(mode === 'edit')
  const [pageError, setPageError] = useState<string>()
  const [feedback, setFeedback] = useState<Feedback>()
  const [submitting, setSubmitting] = useState(false)
  const canWrite = hasAdminToken()

  useEffect(() => {
    let active = true
    getCategories()
      .then((data) => {
        if (active) setCategories(data)
      })
      .catch((error: unknown) => {
        if (active) setPageError(`Categories could not be loaded: ${messageFrom(error)}`)
      })
      .finally(() => {
        if (active) setCategoriesLoading(false)
      })
    return () => {
      active = false
    }
  }, [])

  useEffect(() => {
    if (mode !== 'edit' || !Number.isInteger(numericProductId) || numericProductId <= 0) return
    let active = true
    const inventoryRequest = getInventoryByProduct(numericProductId).catch((error: unknown) => {
      if (error instanceof ProductApiError && error.code === 'not-found') return null
      throw error
    })
    Promise.all([getProduct(numericProductId), inventoryRequest])
      .then(([productData, inventoryData]) => {
        if (!active) return
        setProduct(productData)
        setInventory(inventoryData)
      })
      .catch((error: unknown) => {
        if (active) setPageError(`Product details could not be loaded: ${messageFrom(error)}`)
      })
      .finally(() => {
        if (active) setDetailsLoading(false)
      })
    return () => {
      active = false
    }
  }, [mode, numericProductId])

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
        navigate('/admin/inventory', { state: { productSuccess: `Product “${created.name}” was created with its initial stock.` } })
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

    try {
      await updateProduct(numericProductId, buildUpdateProductInput(values))
    } catch (error) {
      setFeedback({ kind: 'error', message: `Nothing was saved. ${messageFrom(error)}` })
      setSubmitting(false)
      return
    }

    try {
      if (inventory) {
        await updateInventory(inventory.id, { ...inventory, quantity: Number(values.initialStock) })
      } else {
        await createInventory({ productId: numericProductId, quantity: Number(values.initialStock), reservedQuantity: 0 })
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
    <div className="px-5 py-8 sm:px-8 lg:px-10 lg:py-12">
      <div className="mx-auto max-w-5xl space-y-7">
        <header>
          <Link to="/admin/inventory" className="inline-flex items-center gap-2 text-xs uppercase tracking-[0.14em] text-[#444748] hover:text-black"><ArrowLeft size={16} /> Back to inventory</Link>
          <h1 className="mt-5 text-4xl font-medium">{mode === 'create' ? 'Create Product' : 'Edit Product'}</h1>
          <p className="mt-2 text-sm text-[#444748]">{mode === 'create' ? 'Add catalogue details, creation-only options, images, variants, and initial stock.' : 'Update the fields supported by the current product API without changing creation-only data.'}</p>
        </header>

        {pageError ? <div role="alert" className="border-l-4 border-[#ba1a1a] bg-[#fff5f3] px-5 py-4 text-sm text-[#93000a]">{pageError}</div> : null}
        {feedback ? (
          <div role="status" className={`border-l-4 px-5 py-4 text-sm ${feedback.kind === 'error' ? 'border-[#ba1a1a] bg-[#fff5f3] text-[#93000a]' : 'border-[#735c00] bg-[#fff7d8]'}`}>
            {feedback.message}
            {feedback.productId ? <Link to={`/admin/inventory/${feedback.productId}/edit`} className="ml-2 font-semibold underline">Open the product editor</Link> : null}
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
    </div>
  )
}
