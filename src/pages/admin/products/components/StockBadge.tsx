import type { StockStatus } from '../types'

const styles: Record<StockStatus, string> = {
  'in-stock': 'bg-[#fed65b] text-[#241a00]',
  'low-stock': 'bg-[#ffdad6] text-[#93000a]',
  'out-of-stock': 'bg-[#e3e2e2] text-[#444748]',
}

const labels: Record<StockStatus, string> = {
  'in-stock': 'In Stock',
  'low-stock': 'Low Stock',
  'out-of-stock': 'Out of Stock',
}

export default function StockBadge({ status }: { status: StockStatus }) {
  return (
    <span className={`inline-flex px-2.5 py-1 text-[10px] font-bold uppercase tracking-[0.08em] ${styles[status]}`}>
      {labels[status]}
    </span>
  )
}
