import { useState, type FormEvent } from 'react'
import type { Category, ProductDetail, ProductFormValues } from './types'
import { validateProductForm } from './form'
import CreationOnlyFields from './components/CreationOnlyFields'

interface ProductFormProps {
  mode: 'create' | 'edit'
  initialValues: ProductFormValues
  categories: Category[]
  product?: ProductDetail
  reservedQuantity: number
  canWrite: boolean
  submitting: boolean
  onSubmit: (values: ProductFormValues) => Promise<void>
}

const inputClass = 'h-12 w-full border border-[#c4c7c7] bg-white px-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'
const labelClass = 'space-y-2 text-xs uppercase tracking-[0.12em] text-[#444748]'

export default function ProductForm({
  mode,
  initialValues,
  categories,
  product,
  reservedQuantity,
  canWrite,
  submitting,
  onSubmit,
}: ProductFormProps) {
  const [values, setValues] = useState(initialValues)
  const [errors, setErrors] = useState<string[]>([])
  const setField = (field: keyof Pick<ProductFormValues, 'name' | 'description' | 'regularPrice' | 'discountPrice' | 'categoryId' | 'initialStock'>, value: string) =>
    setValues((current) => ({ ...current, [field]: value }))

  const submit = async (event: FormEvent) => {
    event.preventDefault()
    const nextErrors = validateProductForm(values, mode, reservedQuantity)
    setErrors(nextErrors)
    if (nextErrors.length > 0) return
    await onSubmit(values)
  }

  return (
    <form onSubmit={submit} className="space-y-8 border border-[#c4c7c7]/30 bg-white p-5 sm:p-8">
      {errors.length > 0 ? (
        <div role="alert" className="border-l-4 border-[#ba1a1a] bg-[#fff5f3] px-5 py-4 text-sm text-[#93000a]">
          <p className="font-semibold">Please correct the following:</p>
          <ul className="mt-2 list-disc space-y-1 pl-5">{errors.map((error) => <li key={error}>{error}</li>)}</ul>
        </div>
      ) : null}

      <section className="space-y-6">
        <div>
          <h2 className="text-2xl">Product details</h2>
          <p className="mt-1 text-sm text-[#444748]">Fields marked as required must be completed before saving.</p>
        </div>
        <div className="grid gap-5 md:grid-cols-2">
          <label className={labelClass}>
            Product name *
            <input aria-label="Product name" className={inputClass} value={values.name} onChange={(event) => setField('name', event.target.value)} />
          </label>
          <label className={labelClass}>
            Category *
            <select aria-label="Category" className={inputClass} value={values.categoryId} onChange={(event) => setField('categoryId', event.target.value)}>
              <option value="">Select a category</option>
              {categories.map((category) => <option key={category.id} value={category.id}>{category.name}</option>)}
            </select>
          </label>
          <label className={`${labelClass} md:col-span-2`}>
            Description
            <textarea aria-label="Description" rows={5} className="w-full border border-[#c4c7c7] bg-white px-4 py-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black" value={values.description} onChange={(event) => setField('description', event.target.value)} />
          </label>
          <label className={labelClass}>
            Regular price *
            <input aria-label="Regular price" inputMode="decimal" className={inputClass} value={values.regularPrice} onChange={(event) => setField('regularPrice', event.target.value)} />
          </label>
          <label className={labelClass}>
            Discount price
            <input aria-label="Discount price" inputMode="decimal" className={inputClass} value={values.discountPrice} onChange={(event) => setField('discountPrice', event.target.value)} />
          </label>
          <label className={labelClass}>
            Total stock *
            <input aria-label="Total stock" inputMode="numeric" className={inputClass} value={values.initialStock} onChange={(event) => setField('initialStock', event.target.value)} />
            {mode === 'edit' && reservedQuantity > 0 ? <span className="block normal-case tracking-normal text-[#735c00]">{reservedQuantity} units are reserved and must be preserved.</span> : null}
          </label>
        </div>
      </section>

      {mode === 'create' ? <CreationOnlyFields values={values} onChange={setValues} /> : null}

      {mode === 'edit' && product ? (
        <section className="space-y-5 border-t border-[#c4c7c7]/40 pt-8">
          <div>
            <h2 className="text-2xl">Creation-only details</h2>
            <p className="mt-1 text-sm text-[#444748]">Variants and images are read-only because the current backend cannot update them. Brand, material, and product-level SKU are not shown because the detail response does not provide them.</p>
          </div>
          <div>
            <h3 className="text-lg">Variants</h3>
            {product.variants.length === 0 ? <p className="mt-2 text-sm text-[#747878]">No variants.</p> : (
              <ul className="mt-2 divide-y divide-[#c4c7c7]/30 border border-[#c4c7c7]/30">
                {product.variants.map((variant) => <li key={variant.id} className="flex flex-wrap gap-x-6 gap-y-1 px-4 py-3 text-sm"><strong>{variant.sku}</strong><span>{variant.color ?? 'No color'}</span><span>{variant.size ?? 'No size'}</span></li>)}
              </ul>
            )}
          </div>
          <div>
            <h3 className="text-lg">Images</h3>
            {product.images.length === 0 ? <p className="mt-2 text-sm text-[#747878]">No images.</p> : (
              <ul className="mt-2 space-y-2">{product.images.map((image) => <li key={image.id} className="break-all bg-[#f5f3f3] px-4 py-3 text-sm">{image.url}{image.isThumbnail ? ' — Thumbnail' : ''}</li>)}</ul>
            )}
          </div>
        </section>
      ) : null}

      {!canWrite ? <div role="note" className="border-l-4 border-[#735c00] bg-[#fff7d8] px-5 py-4 text-sm">An Admin or Staff token is required before this form can be saved. Entered data will remain in the form.</div> : null}

      <div className="flex justify-end border-t border-[#c4c7c7]/30 pt-6">
        <button
          type="submit"
          aria-label={mode === 'create' ? 'Create product' : 'Save product'}
          disabled={!canWrite || submitting}
          className="min-h-14 bg-black px-8 text-xs font-semibold uppercase tracking-[0.16em] text-white disabled:cursor-not-allowed disabled:opacity-45 focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black"
        >
          {submitting ? 'Saving…' : mode === 'create' ? 'Create product' : 'Save product'}
        </button>
      </div>
    </form>
  )
}
