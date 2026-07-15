interface SummaryCardsProps {
  total: number
  lowStock: number
  inStock: number
  outOfStock: number
}

const cards = [
  { key: 'total', label: 'Tổng sản phẩm', accent: 'border-black', valueClass: 'text-[#1b1c1c]' },
  { key: 'lowStock', label: 'Sắp hết hàng', accent: 'border-[#9a7b00]', valueClass: 'text-[#735c00]' },
  { key: 'inStock', label: 'Đang bán', accent: 'border-[#1b1c1c]', valueClass: 'text-[#1b1c1c]' },
  { key: 'outOfStock', label: 'Hết hàng', accent: 'border-[#c4c7c7]', valueClass: 'text-[#747878]' },
] as const

export default function SummaryCards(props: SummaryCardsProps) {
  return (
    <section aria-label="Product summary" className="grid gap-4 sm:grid-cols-2 xl:grid-cols-4">
      {cards.map((card) => (
        <article key={card.key} className={`min-h-36 border-l-4 bg-[#f5f3f3] px-7 py-6 ${card.accent}`}>
          <p className="max-w-32 text-sm uppercase tracking-[0.14em] text-[#444748]">{card.label}</p>
          <p data-stat={card.key} className={`mt-4 font-serif text-4xl leading-none ${card.valueClass}`}>
            {props[card.key].toLocaleString('vi-VN')}
          </p>
        </article>
      ))}
    </section>
  )
}
