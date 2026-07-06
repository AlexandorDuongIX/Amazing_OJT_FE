const TABS = ['Tất cả', 'Đang xử lý', 'Đã giao', 'Đã hủy', 'Trả hàng/Hoàn tiền'] as const

interface OrderFilterTabsProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

export default function OrderFilterTabs({ activeTab, onTabChange }: OrderFilterTabsProps) {
  return (
    <div className="bg-white border-b border-divider">
      <div className="flex gap-8 pt-4 px-6 overflow-x-auto">
        {TABS.map(tab => (
          <button
            key={tab}
            onClick={() => onTabChange(tab)}
            className={`pb-4 font-label text-[14px] whitespace-nowrap border-b-2 transition-colors cursor-pointer ${
              activeTab === tab
                ? 'border-gold font-bold text-on-background'
                : 'border-transparent font-normal text-muted hover:text-on-background'
            }`}
          >
            {tab}
          </button>
        ))}
      </div>
    </div>
  )
}
