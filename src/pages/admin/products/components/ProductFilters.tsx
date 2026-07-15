import { useState, type FormEvent } from 'react'
import type { Category } from '../types'

export interface ProductFilterDraft {
  searchTerm: string
  categoryId: string
  size: string
  color: string
  minPrice: string
  maxPrice: string
}

interface ProductFiltersProps {
  initialValues: ProductFilterDraft
  categories: Category[]
  categoriesError?: string
  onApply: (values: ProductFilterDraft) => void
  onReset: () => void
}

const inputClass =
  'h-11 w-full border border-[#c4c7c7] bg-white px-3 text-sm text-[#1b1c1c] outline-none transition focus:border-black focus:ring-1 focus:ring-black'

export default function ProductFilters({
  initialValues,
  categories,
  categoriesError,
  onApply,
  onReset,
}: ProductFiltersProps) {
  const [values, setValues] = useState(initialValues)
  const setValue = (field: keyof ProductFilterDraft, value: string) =>
    setValues((current) => ({ ...current, [field]: value }))

  const submit = (event: FormEvent) => {
    event.preventDefault()
    onApply(values)
  }

  return (
    <form onSubmit={submit} className="border border-[#c4c7c7]/30 bg-white p-5 sm:p-8">
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-3">
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Tìm kiếm
          <input
            aria-label="Search products"
            className={inputClass}
            value={values.searchTerm}
            onChange={(event) => setValue('searchTerm', event.target.value)}
            placeholder="Tên hoặc mô tả sản phẩm"
          />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Danh mục
          <select
            aria-label="Category"
            className={inputClass}
            value={values.categoryId}
            onChange={(event) => setValue('categoryId', event.target.value)}
          >
            <option value="">Tất cả danh mục</option>
            {categories.map((category) => (
              <option key={category.id} value={category.id}>
                {category.name}
              </option>
            ))}
          </select>
          {categoriesError ? <span className="normal-case tracking-normal text-[#93000a]">{categoriesError}</span> : null}
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Kích thước
          <input aria-label="Size" className={inputClass} value={values.size} onChange={(event) => setValue('size', event.target.value)} />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Màu sắc
          <input aria-label="Color" className={inputClass} value={values.color} onChange={(event) => setValue('color', event.target.value)} />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Giá tối thiểu
          <input aria-label="Minimum price" className={inputClass} inputMode="decimal" value={values.minPrice} onChange={(event) => setValue('minPrice', event.target.value)} />
        </label>
        <label className="space-y-2 text-xs uppercase tracking-[0.14em] text-[#444748]">
          Giá tối đa
          <input aria-label="Maximum price" className={inputClass} inputMode="decimal" value={values.maxPrice} onChange={(event) => setValue('maxPrice', event.target.value)} />
        </label>
      </div>
      <div className="mt-6 flex flex-wrap gap-3">
        <button type="submit" className="min-h-11 bg-black px-6 text-xs font-semibold uppercase tracking-[0.16em] text-white focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          Apply Filters
        </button>
        <button type="button" onClick={onReset} className="min-h-11 border border-[#747878] px-6 text-xs font-semibold uppercase tracking-[0.16em] focus-visible:outline-2 focus-visible:outline-offset-2 focus-visible:outline-black">
          Reset
        </button>
      </div>
    </form>
  )
}
