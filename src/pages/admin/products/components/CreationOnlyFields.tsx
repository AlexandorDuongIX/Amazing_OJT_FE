import { ImagePlus, Plus, Trash2 } from 'lucide-react'
import type { ProductFormValues } from '../types'

interface CreationOnlyFieldsProps {
  values: ProductFormValues
  onChange: (values: ProductFormValues) => void
}

const inputClass = 'h-11 w-full border border-[#c4c7c7] bg-white px-3 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black'

export default function CreationOnlyFields({ values, onChange }: CreationOnlyFieldsProps) {
  const setField = (field: keyof Pick<ProductFormValues, 'sku' | 'brand' | 'material' | 'color' | 'size'>, value: string) =>
    onChange({ ...values, [field]: value })

  return (
    <section className="space-y-6 border-t border-[#c4c7c7]/40 pt-8">
      <div>
        <h2 className="text-2xl">Creation-only details</h2>
        <p className="mt-1 text-sm text-[#444748]">These values can be supplied only when the product is first created.</p>
      </div>
      <div className="grid gap-5 md:grid-cols-2 xl:grid-cols-5">
        {([
          ['sku', 'Base SKU'],
          ['brand', 'Brand'],
          ['material', 'Material'],
          ['color', 'Base color'],
          ['size', 'Base size'],
        ] as const).map(([field, label]) => (
          <label key={field} className="space-y-2 text-xs uppercase tracking-[0.12em] text-[#444748]">
            {label}
            <input aria-label={label} className={inputClass} value={values[field]} onChange={(event) => setField(field, event.target.value)} />
          </label>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl">Variants</h3>
          <button type="button" onClick={() => onChange({ ...values, variants: [...values.variants, { sku: '', color: '', size: '', priceOverride: '' }] })} className="inline-flex min-h-10 items-center gap-2 border border-black px-4 text-xs uppercase tracking-[0.12em]"><Plus size={15} /> Add variant</button>
        </div>
        {values.variants.length === 0 ? <p className="text-sm text-[#747878]">No variants added.</p> : null}
        {values.variants.map((variant, index) => (
          <div key={index} className="grid gap-3 bg-[#f5f3f3] p-4 md:grid-cols-[1.2fr_1fr_1fr_1fr_auto]">
            {(['sku', 'color', 'size', 'priceOverride'] as const).map((field) => (
              <label key={field} className="space-y-1 text-[11px] uppercase tracking-[0.1em] text-[#444748]">
                {field === 'priceOverride' ? 'Price override' : field}
                <input
                  aria-label={`Variant ${index + 1} ${field}`}
                  className={inputClass}
                  value={variant[field]}
                  onChange={(event) => onChange({ ...values, variants: values.variants.map((item, itemIndex) => itemIndex === index ? { ...item, [field]: event.target.value } : item) })}
                />
              </label>
            ))}
            <button type="button" aria-label={`Remove variant ${index + 1}`} onClick={() => onChange({ ...values, variants: values.variants.filter((_, itemIndex) => itemIndex !== index) })} className="grid size-11 place-items-center self-end text-[#93000a]"><Trash2 size={17} /></button>
          </div>
        ))}
      </div>

      <div className="space-y-4">
        <div className="flex items-center justify-between gap-4">
          <h3 className="text-xl">Product images</h3>
          <button type="button" onClick={() => onChange({ ...values, images: [...values.images, { imageUrl: '', isThumbnail: false }] })} className="inline-flex min-h-10 items-center gap-2 border border-black px-4 text-xs uppercase tracking-[0.12em]"><ImagePlus size={15} /> Add image</button>
        </div>
        {values.images.length === 0 ? <p className="text-sm text-[#747878]">Add image URLs to show the product in the catalogue.</p> : null}
        {values.images.map((image, index) => (
          <div key={index} className="grid items-end gap-3 bg-[#f5f3f3] p-4 md:grid-cols-[1fr_auto_auto]">
            <label className="space-y-1 text-[11px] uppercase tracking-[0.1em] text-[#444748]">
              Image URL
              <input aria-label={`Image ${index + 1} URL`} className={inputClass} value={image.imageUrl} onChange={(event) => onChange({ ...values, images: values.images.map((item, itemIndex) => itemIndex === index ? { ...item, imageUrl: event.target.value } : item) })} />
            </label>
            <label className="flex h-11 items-center gap-2 px-3 text-xs uppercase tracking-[0.1em]">
              <input type="radio" name="thumbnail" checked={image.isThumbnail} onChange={() => onChange({ ...values, images: values.images.map((item, itemIndex) => ({ ...item, isThumbnail: itemIndex === index })) })} /> Thumbnail
            </label>
            <button type="button" aria-label={`Remove image ${index + 1}`} onClick={() => onChange({ ...values, images: values.images.filter((_, itemIndex) => itemIndex !== index) })} className="grid size-11 place-items-center text-[#93000a]"><Trash2 size={17} /></button>
          </div>
        ))}
      </div>
    </section>
  )
}
