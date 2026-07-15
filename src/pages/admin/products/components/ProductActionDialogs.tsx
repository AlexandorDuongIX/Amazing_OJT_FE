import { useState, type FormEvent } from 'react'
import type { InventorySummary, ProductListItem } from '../types'

interface DeleteProductDialogProps {
  product: ProductListItem
  busy: boolean
  onClose: () => void
  onConfirm: () => void
}

export function DeleteProductDialog({ product, busy, onClose, onConfirm }: DeleteProductDialogProps) {
  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5">
      <div role="dialog" aria-modal="true" aria-label="Delete product" className="w-full max-w-md bg-white p-7 shadow-2xl">
        <h2 className="text-2xl">Delete product?</h2>
        <p className="mt-3 text-sm text-[#444748]">“{product.name}” will remain visible until the server confirms deletion. This action cannot be undone.</p>
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" disabled={busy} onClick={onClose} className="min-h-11 border border-[#747878] px-5 text-xs uppercase tracking-[0.12em] disabled:opacity-40">Cancel</button>
          <button type="button" aria-label="Confirm deletion" disabled={busy} onClick={onConfirm} className="min-h-11 bg-[#93000a] px-5 text-xs uppercase tracking-[0.12em] text-white disabled:opacity-45">{busy ? 'Deleting…' : 'Delete product'}</button>
        </div>
      </div>
    </div>
  )
}

interface StockDialogProps {
  product: ProductListItem
  summary?: InventorySummary
  busy: boolean
  onClose: () => void
  onConfirm: (quantity: number) => void
}

export function StockDialog({ product, summary, busy, onClose, onConfirm }: StockDialogProps) {
  const reserved = summary?.reservedQuantity ?? 0
  const [quantity, setQuantity] = useState(Math.max(reserved + 1, 6).toString())
  const [error, setError] = useState<string>()

  const submit = (event: FormEvent) => {
    event.preventDefault()
    const parsed = Number(quantity)
    if (!Number.isInteger(parsed) || parsed <= reserved) {
      setError(`New total stock must be a whole number greater than the ${reserved} reserved units.`)
      return
    }
    onConfirm(parsed)
  }

  return (
    <div className="fixed inset-0 z-50 grid place-items-center bg-black/60 p-5">
      <form onSubmit={submit} role="dialog" aria-modal="true" aria-label="Set product in stock" className="w-full max-w-md bg-white p-7 shadow-2xl">
        <h2 className="text-2xl">Set “{product.name}” in stock</h2>
        <p className="mt-3 text-sm text-[#444748]">Enter a new total above all reserved stock. Reserved units will not be changed.</p>
        <label className="mt-6 block space-y-2 text-xs uppercase tracking-[0.12em] text-[#444748]">
          New total stock
          <input autoFocus aria-label="New total stock" inputMode="numeric" value={quantity} onChange={(event) => setQuantity(event.target.value)} className="h-12 w-full border border-[#c4c7c7] px-4 text-sm outline-none focus:border-black focus:ring-1 focus:ring-black" />
        </label>
        {error ? <p role="alert" className="mt-3 text-sm text-[#93000a]">{error}</p> : null}
        <div className="mt-7 flex justify-end gap-3">
          <button type="button" disabled={busy} onClick={onClose} className="min-h-11 border border-[#747878] px-5 text-xs uppercase tracking-[0.12em] disabled:opacity-40">Cancel</button>
          <button type="submit" aria-label="Confirm stock change" disabled={busy} className="min-h-11 bg-black px-5 text-xs uppercase tracking-[0.12em] text-white disabled:opacity-45">{busy ? 'Saving…' : 'Save stock'}</button>
        </div>
      </form>
    </div>
  )
}
