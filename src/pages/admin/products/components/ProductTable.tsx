import { ImageOff, PackagePlus, PackageX, Pencil, Trash2 } from 'lucide-react'
import { Link } from 'react-router-dom'
import { getStockStatus } from '../stock'
import type { InventorySummary, ProductListItem, ProductRouteBase } from '../types'
import StockBadge from './StockBadge'

interface ProductTableProps {
  products: ProductListItem[]
  inventory: Map<number, InventorySummary>
  productBasePath: ProductRouteBase
  canWrite: boolean
  canManageStock: boolean
  loading: boolean
  busyProductId?: number
  onDelete: (product: ProductListItem) => void
  onMarkOutOfStock: (product: ProductListItem, summary?: InventorySummary) => void
  onSetInStock: (product: ProductListItem, summary?: InventorySummary) => void
}

const formatVnd = (amount: number) => `${amount.toLocaleString('vi-VN')} VND`

export default function ProductTable({
  products,
  inventory,
  productBasePath,
  canWrite,
  canManageStock,
  loading,
  busyProductId,
  onDelete,
  onMarkOutOfStock,
  onSetInStock,
}: ProductTableProps) {
  if (loading) {
    return (
      <div aria-live="polite" className="border border-[#c4c7c7]/30 bg-white px-8 py-16 text-center text-sm uppercase tracking-[0.14em] text-[#444748]">
        Loading products…
      </div>
    )
  }

  if (products.length === 0) {
    return (
      <div className="border border-[#c4c7c7]/30 bg-white px-8 py-16 text-center">
        <h2 className="text-2xl">No products match your filters</h2>
        <p className="mt-2 text-sm text-[#444748]">Reset the filters or try a broader search.</p>
      </div>
    )
  }

  return (
    <div className="overflow-x-auto border border-[#c4c7c7]/30 bg-white">
      <table className="w-full min-w-[880px] border-collapse text-left">
        <thead>
          <tr className="border-b border-[#c4c7c7]/40 text-xs uppercase tracking-[0.14em] text-[#444748]">
            <th className="px-5 py-5 font-semibold">Ảnh</th>
            <th className="px-5 py-5 font-semibold">Sản phẩm / SKU</th>
            <th className="px-5 py-5 font-semibold">Danh mục</th>
            <th className="px-5 py-5 font-semibold">Giá bán</th>
            <th className="px-5 py-5 font-semibold">Tồn kho</th>
            <th className="px-5 py-5 font-semibold">Trạng thái</th>
            <th className="px-5 py-5 text-right font-semibold">Hành động</th>
          </tr>
        </thead>
        <tbody>
          {products.map((product) => {
            const summary = inventory.get(product.id)
            const available = summary?.availableQuantity ?? Math.max(0, product.availableQuantity)
            const status = summary?.status ?? getStockStatus(available)
            const sku = product.variantsSummary?.[0]?.sku ?? '—'
            const busy = busyProductId === product.id
            return (
              <tr key={product.id} className="border-b border-[#c4c7c7]/25 last:border-b-0">
                <td className="px-5 py-5">
                  {product.thumbnailUrl ? (
                    <img src={product.thumbnailUrl} alt="" className="h-16 w-12 bg-[#f5f3f3] object-cover" />
                  ) : (
                    <div aria-label={`Image unavailable for ${product.name}`} className="grid h-16 w-12 place-items-center bg-[#f5f3f3] text-[#747878]">
                      <ImageOff size={18} strokeWidth={1.4} />
                    </div>
                  )}
                </td>
                <td className="px-5 py-5">
                  <p className="max-w-52 font-serif text-base leading-snug">{product.name}</p>
                  <p className="mt-1 text-[11px] uppercase tracking-[0.1em] text-[#747878]">SKU: {sku}</p>
                </td>
                <td className="px-5 py-5 text-xs uppercase tracking-[0.08em] text-[#444748]">{product.category?.name ?? 'Unassigned'}</td>
                <td className="px-5 py-5 text-sm font-semibold">{formatVnd(product.price)}</td>
                <td className="px-5 py-5">
                  <span className={status === 'low-stock' ? 'font-semibold text-[#ba1a1a]' : ''}>{available}</span>
                </td>
                <td className="px-5 py-5"><StockBadge status={status} /></td>
                <td className="px-5 py-5 text-right">
                  <div className="inline-flex items-center gap-1">
                    {canWrite ? (
                      <Link
                      to={`${productBasePath}/${product.id}/edit`}
                      aria-label={`Edit ${product.name}`}
                      className={`inline-grid size-10 place-items-center border border-transparent text-[#444748] hover:border-[#c4c7c7] hover:text-black focus-visible:outline-2 focus-visible:outline-black ${busy ? 'pointer-events-none opacity-40' : ''}`}
                      >
                        <Pencil size={17} strokeWidth={1.5} />
                      </Link>
                    ) : <button type="button" disabled aria-label={`Edit ${product.name}`} className="grid size-10 place-items-center text-[#c4c7c7]"><Pencil size={17} strokeWidth={1.5} /></button>}
                    <button
                      type="button"
                      disabled={!canManageStock || busy}
                      aria-label={status === 'out-of-stock' ? `Set ${product.name} in stock` : `Mark ${product.name} out of stock`}
                      onClick={() => status === 'out-of-stock' ? onSetInStock(product, summary) : onMarkOutOfStock(product, summary)}
                      className="grid size-10 place-items-center text-[#444748] hover:bg-[#f5f3f3] hover:text-black disabled:cursor-not-allowed disabled:text-[#c4c7c7] focus-visible:outline-2 focus-visible:outline-black"
                    >
                      {status === 'out-of-stock' ? <PackagePlus size={17} strokeWidth={1.5} /> : <PackageX size={17} strokeWidth={1.5} />}
                    </button>
                    <button
                      type="button"
                      disabled={!canWrite || busy}
                      aria-label={`Delete ${product.name}`}
                      onClick={() => onDelete(product)}
                      className="grid size-10 place-items-center text-[#444748] hover:bg-[#fff5f3] hover:text-[#93000a] disabled:cursor-not-allowed disabled:text-[#c4c7c7] focus-visible:outline-2 focus-visible:outline-[#93000a]"
                    >
                      <Trash2 size={17} strokeWidth={1.5} />
                    </button>
                  </div>
                </td>
              </tr>
            )
          })}
        </tbody>
      </table>
    </div>
  )
}
