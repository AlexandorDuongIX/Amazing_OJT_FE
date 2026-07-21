import type { OrderStatus } from '@/types/order'
import { STATUS_LABELS } from '@/components/OrderStatusBadge'

const TABS: { value: OrderStatus | 'Tất cả'; label: string }[] = [
  { value: 'Tất cả', label: 'Tất cả' },
  { value: 'Pending', label: STATUS_LABELS.Pending },
  { value: 'Processing', label: STATUS_LABELS.Processing },
  { value: 'Shipped', label: STATUS_LABELS.Shipped },
  { value: 'Delivered', label: STATUS_LABELS.Delivered },
  { value: 'Cancelled', label: STATUS_LABELS.Cancelled },
  { value: 'Returned', label: STATUS_LABELS.Returned },
]

interface OrderFilterTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function OrderFilterTabs({ activeTab, onTabChange }: OrderFilterTabsProps) {
  return (
    <div className="bg-surface-container-lowest border-b border-divider">
      <div className="flex gap-8 pt-4 px-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab.value}
            onClick={() => onTabChange(tab.value)}
            className={`pb-4 font-label text-[14px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab.value
                ? 'border-gold font-bold text-on-background'
                : 'border-transparent font-normal text-muted hover:text-on-background'
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>
    </div>
  )
}
