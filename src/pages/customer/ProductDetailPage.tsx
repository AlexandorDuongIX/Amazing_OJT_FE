import { useMemo, useState } from 'react'
import { Link, useParams } from 'react-router-dom'

type ProductVariant = {
  id: string
  name: string
  price: number
  breadcrumb: string[]
  images: string[]
  colors: { name: string; value: string; swatchClass: string }[]
  sizes: string[]
  description: string
  fabric: string
  delivery: string
}

type RelatedItem = {
  id: string
  title: string
  price: number
  image: string
}

const formatVND = (amount: number) => `${amount.toLocaleString('vi-VN')} VND`

const PRODUCT_VARIANTS: Record<string, ProductVariant> = {
  default: {
    id: 'default',
    name: 'Đầm Lụa Satin Cao Cấp',
    price: 4500000,
    breadcrumb: ['Home', 'Nữ', 'Váy'],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCue7rtdmW2RgLjgwCVCVC7GZgi63V7TiSssQO9PIt1OtH1aGyJ_pfToRJNXrxAEGvNDXXqqLxjC5oAjFx-efNCxG3RKVpuKvZKd6lTQpJxe97LqM8jnz9o31gm4j84NohC7BAHmEiwPn-fCZjbYFP3f8tBUN-KT65brEKgrFtLM296_TZU6lkpzBaJGDjCAaOG58-yznM6BJMxLuYplVU5OkvbH29_9xwYYY3DNMS9FK3Jp6cXh0dUQE84HP5vZWC3G5egyf4ME',
      'https://images.unsplash.com/photo-1612722432474-b971cdcea546?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Black', value: 'black', swatchClass: 'bg-black' },
      { name: 'Gold', value: 'gold', swatchClass: 'bg-[#d8b24c]' },
    ],
    sizes: ['S', 'M', 'L', 'XL'],
    description:
      'Chiếc đầm lụa satin cao cấp từ bộ sưu tập Editorial. Thiết kế tối giản với đường cắt tinh tế, tôn dáng và đem lại cảm giác mềm mại khi di chuyển. Phom dáng dài thanh lịch giúp tạo hiệu ứng thị giác sang trọng mà vẫn giữ được độ nhẹ nhàng cần thiết.',
    fabric:
      'Chất liệu lụa satin có bề mặt mịn, độ rủ tự nhiên và phản chiếu ánh sáng rất nhẹ. Phù hợp cho buổi tối, sự kiện, hoặc những khoảnh khắc cần một diện mạo tối giản nhưng nổi bật.',
    delivery:
      'Đổi trả trong 7 ngày. Giao hàng nội thành 1-2 ngày, toàn quốc 3-5 ngày. Hỗ trợ đóng gói cao cấp cho quà tặng.',
  },
  '1': {
    id: '1',
    name: 'Áo Sơ Mi Lụa',
    price: 2200000,
    breadcrumb: ['Home', 'Nữ', 'Áo'],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDe7Q7KfaQ2fbCKVztHoR3zJJggyCbXni2ICIqgjncKdsVp3i5xdC7-iMMwe0zTFf4w7cuR6ymrsTARQAkGxC-egGIJjhj8qMdygBP1FtmZVNLsMfD3CmKfggKwa5u0Cc1bxThFsqlOCfPIdEcPhsSSv9YxgPmDi4cs6VnsxOMrMrElx7WCi4yM1Dwobh0PWUDq0iisOpI1qQKB4dcHuVQe5d5c1W6JTpC6zqtfW1Be2S3Gu6r8Sfa0U6MKDcBnhSEEXkEu8ED-3fk',
      'https://images.unsplash.com/photo-1595777712802-d2332f01f35f?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'White', value: 'white', swatchClass: 'bg-white border-[#d7d2cf]' },
      { name: 'Black', value: 'black', swatchClass: 'bg-black' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Áo sơ mi lụa với thiết kế cổ điển, vải mịn và thoáng mát. Phù hợp để mix match với nhiều loại trang phục, từ công sở đến dạo phố. Chi tiết khuy cài bằng vỏ sò cao cấp.',
    fabric:
      'Lụa tơ tằm thiên nhiên 100%, độ mềm và độ bóng lụa là đặc trưng chính của chất liệu này. Thoáng mát, thấm hút mồ hôi tốt.',
    delivery:
      'Đổi trả trong 7 ngày. Giao hàng nội thành 1-2 ngày, toàn quốc 3-5 ngày.',
  },
  '2': {
    id: '2',
    name: 'Chân Váy Bút Chì',
    price: 1800000,
    breadcrumb: ['Home', 'Nữ', 'Váy'],
    images: [
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1612872087720-bb876e2e67d1?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Black', value: 'black', swatchClass: 'bg-black' },
      { name: 'Navy', value: 'navy', swatchClass: 'bg-[#1a1a2e]' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Chân váy bút chì với dáng ôm nhẹ, tôn vóc dáng một cách tinh tế. Tạo điểm nhấn chuyên nghiệp cho trang phục công sở hoặc dạo phố.',
    fabric:
      'Vải cotton blend với elastane, co giãn tốt và thoải mái suốt ngày. Kiểu dáng bút chì giúp di chuyển dễ dàng.',
    delivery:
      'Đổi trả trong 7 ngày. Giao hàng nội thành 1-2 ngày, toàn quốc 3-5 ngày.',
  },
  '3': {
    id: '3',
    name: 'Áo Vest Cấu Trúc',
    price: 3900000,
    breadcrumb: ['Home', 'Nữ', 'Áo Ngoài'],
    images: [
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjFMbxUQCBM8Dgdh6nvkpBeVcWqAdgZfk8OixaHYuMX9PRvhz0HbazjPtXsojVee6gHjkgXL_Cda0a0WOA4ea0IShxCVGC72CZ11th-DXvus7KzeRHuAFRcvHWo0Gf6gpRHDPjbPRrCsQ4f2oCHfxhhIUz2oU-KZEUguRSgfrJmMkLEcdpXX5TNgsJ9q6EsPuXZksiFyrjv5fgE7gBtSKt9mD5rh4n5E5cKh-z4akj6GCzoyXYtPjfJjbMr8z941NLllBltiy6wAo',
      'https://images.unsplash.com/photo-1580136579312-94651dfd596d?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Black', value: 'black', swatchClass: 'bg-black' },
      { name: 'Camel', value: 'camel', swatchClass: 'bg-[#c4a67d]' },
    ],
    sizes: ['XS', 'S', 'M', 'L', 'XL'],
    description:
      'Áo vest cấu trúc với vai tròn, vừa vặn ở phần thân và tay. Thiết kế hiện đại nhưng vẫn giữ tinh thần minimalist. Khóa vàng bóng tinh tế.',
    fabric:
      'Vải wool blend với lót cotton ở phần trong. Cứng cáp vừa đủ, tạo form đẹp và thoải mái cả ngày.',
    delivery:
      'Đổi trả trong 7 ngày. Giao hàng nội thành 1-2 ngày, toàn quốc 3-5 ngày.',
  },
  '4': {
    id: '4',
    name: 'Đầm Slip Dress Lụa',
    price: 3500000,
    breadcrumb: ['Home', 'Nữ', 'Váy'],
    images: [
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=1200&q=80',
      'https://images.unsplash.com/photo-1595777712802-d2332f01f35f?auto=format&fit=crop&w=1200&q=80',
    ],
    colors: [
      { name: 'Champagne', value: 'champagne', swatchClass: 'bg-[#f5d5b8]' },
      { name: 'Black', value: 'black', swatchClass: 'bg-black' },
    ],
    sizes: ['XS', 'S', 'M', 'L'],
    description:
      'Đầm slip dress dáng thẳng, chất lụa mịn, phù hợp cho những dịp tối hay party. Có thể mặc một mình hoặc khoác áo vest bên ngoài.',
    fabric:
      'Lụa tơ tằm tự nhiên với lót cotton mỏng. Ôm nhẹ vóc dáng, thoáng mát và thoải mái.',
    delivery:
      'Đổi trả trong 7 ngày. Giao hàng nội thành 1-2 ngày, toàn quốc 3-5 ngày.',
  },
}

const RELATED_ITEMS: RelatedItem[] = [
  {
    id: '1',
    title: 'Áo Sơ Mi Lụa',
    price: 2200000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDe7Q7KfaQ2fbCKVztHoR3zJJggyCbXni2ICIqgjncKdsVp3i5xdC7-iMMwe0zTFf4w7cuR6ymrsTARQAkGxC-egGIJjhj8qMdygBP1FtmZVNLsMfD3CmKfggKwa5u0Cc1bxThFsqlOCfPIdEcPhsSSv9YxgPmDi4cs6VnsxOMrMrElx7WCi4yM1Dwobh0PWUDq0iisOpI1qQKB4dcHuVQe5d5c1W6JTpC6zqtfW1Be2S3Gu6r8Sfa0U6MKDcBnhSEEXkEu8ED-3fk',
  },
  {
    id: '2',
    title: 'Chân Váy Bút Chì',
    price: 1800000,
    image:
      'https://images.unsplash.com/photo-1529139574466-a303027c1d8b?auto=format&fit=crop&w=900&q=80',
  },
  {
    id: '3',
    title: 'Áo Vest Cấu Trúc',
    price: 3900000,
    image:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjFMbxUQCBM8Dgdh6nvkpBeVcWqAdgZfk8OixaHYuMX9PRvhz0HbazjPtXsojVee6gHjkgXL_Cda0a0WOA4ea0IShxCVGC72CZ11th-DXvus7KzeRHuAFRcvHWo0Gf6gpRHDPjbPRrCsQ4f2oCHfxhhIUz2oU-KZEUguRSgfrJmMkLEcdpXX5TNgsJ9q6EsPuXZksiFyrjv5fgE7gBtSKt9mD5rh4n5E5cKh-z4akj6GCzoyXYtPjfJjbMr8z941NLllBltiy6wAo',
  },
  {
    id: '4',
    title: 'Đầm Slip Dress Lụa',
    price: 3500000,
    image:
      'https://images.unsplash.com/photo-1515886657613-9f3515b0c78f?auto=format&fit=crop&w=900&q=80',
  },
]

function AccordionRow({
  title,
  open,
  children,
  onToggle,
}: {
  title: string
  open: boolean
  children?: React.ReactNode
  onToggle: () => void
}) {
  return (
    <div className="border-t border-[#ece9e8] py-4 first:border-t-0 first:pt-0">
      <button
        type="button"
        onClick={onToggle}
        className="flex w-full items-center justify-between gap-4 text-left"
      >
        <span className="font-label text-[12px] font-semibold uppercase tracking-[0.22em] text-primary">
          {title}
        </span>
        <span className="font-label text-[18px] leading-none text-primary">{open ? '×' : '+'}</span>
      </button>
      {open && children ? (
        <div className="mt-4 max-w-[420px] font-body text-[14px] leading-7 text-on-surface-variant">
          {children}
        </div>
      ) : null}
    </div>
  )
}

export default function ProductDetailPage() {
  const { productId } = useParams<{ productId?: string }>()
  const product = useMemo(
    () => PRODUCT_VARIANTS[productId ?? 'default'] ?? PRODUCT_VARIANTS.default,
    [productId],
  )
  const [selectedColor, setSelectedColor] = useState(product.colors[0].value)
  const [selectedSize, setSelectedSize] = useState('M')
  const [openPanel, setOpenPanel] = useState<'description' | 'fabric' | 'delivery'>('description')

  return (
    <section className="w-full bg-background">
      <div className="max-w-[1220px] mx-auto px-4 md:px-8 py-6 md:py-10">
        <div className="mb-4 hidden md:block text-[11px] font-label font-semibold uppercase tracking-[0.25em] text-on-surface-variant/70">
          <Link to="/" className="hover:text-primary transition-colors">
            {product.breadcrumb[0]}
          </Link>
          <span className="mx-2">/</span>
          <Link to="/collections/nu" className="hover:text-primary transition-colors">
            {product.breadcrumb[1]}
          </Link>
          <span className="mx-2">/</span>
          <span>{product.breadcrumb[2]}</span>
        </div>

        <div className="grid gap-6 md:gap-10 lg:grid-cols-[minmax(0,1fr)_380px] lg:gap-12 items-start">
          <div className="space-y-4 md:space-y-8">
            <div className="overflow-hidden bg-surface-container-low">
              <img
                src={product.images[0]}
                alt={product.name}
                className="w-full aspect-[4/5] object-cover object-center"
              />
            </div>

            <div className="hidden md:block overflow-hidden bg-surface-container-low">
              <img
                src={product.images[1]}
                alt="Chất liệu lụa satin đen"
                className="w-full aspect-[4/5] object-cover object-center"
              />
            </div>
          </div>

          <aside className="lg:sticky lg:top-[104px] space-y-4 md:space-y-8">
            <div>
              <h1 className="font-headline text-[24px] md:text-[34px] font-medium leading-tight text-primary">
                {product.name}
              </h1>
              <p className="mt-1.5 md:mt-2 font-body text-[14px] md:text-[17px] text-on-surface-variant">
                {formatVND(product.price)}
              </p>
            </div>

            <div>
              <div className="mb-3 font-label text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                Color: Black
              </div>
              <div className="flex items-center gap-2.5 md:gap-3">
                {product.colors.map((color) => {
                  const isActive = selectedColor === color.value
                  return (
                    <button
                      key={color.value}
                      type="button"
                      onClick={() => setSelectedColor(color.value)}
                      className={`h-5 w-5 md:h-6 md:w-6 rounded-full border transition-all ${color.swatchClass} ${isActive ? 'border-primary ring-2 ring-primary/20 ring-offset-2 ring-offset-background' : 'border-[#d7d2cf]'}`}
                      aria-label={color.name}
                    />
                  )
                })}
              </div>
            </div>

            <div>
              <div className="mb-3 flex items-end justify-between gap-4">
                <span className="font-label text-[10px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant">
                  Size
                </span>
                <button
                  type="button"
                  className="font-label text-[9px] md:text-[10px] font-semibold uppercase tracking-[0.24em] text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
                >
                  Size Guide
                </button>
              </div>
              <div className="grid grid-cols-4 gap-2 md:gap-3">
                {product.sizes.map((size) => {
                  const isActive = selectedSize === size
                  return (
                    <button
                      key={size}
                      type="button"
                      onClick={() => setSelectedSize(size)}
                      className={`h-10 md:h-11 border font-label text-[12px] md:text-[13px] font-semibold uppercase tracking-[0.18em] transition-colors ${isActive ? 'border-primary bg-primary text-on-primary' : 'border-[#cfc9c6] bg-background text-primary hover:border-primary'}`}
                    >
                      {size}
                    </button>
                  )
                })}
              </div>
            </div>

            <div className="space-y-2.5 md:space-y-3 pt-2">
              <button
                type="button"
                className="h-11 md:h-12 w-full border border-primary bg-background font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-primary transition-colors hover:bg-primary hover:text-on-primary"
              >
                Thêm Vào Giỏ Hàng
              </button>
              <button
                type="button"
                className="h-11 md:h-12 w-full bg-primary font-label text-[11px] md:text-[12px] font-semibold uppercase tracking-[0.22em] text-on-primary transition-colors hover:bg-[#111111]"
              >
                Mua Ngay
              </button>
            </div>

            <div className="border-t border-[#ece9e8] pt-4 md:pt-5">
              <AccordionRow
                title="Mô tả sản phẩm"
                open={openPanel === 'description'}
                onToggle={() => setOpenPanel(openPanel === 'description' ? 'fabric' : 'description')}
              >
                {product.description}
              </AccordionRow>

              <AccordionRow
                title="Chất liệu &amp; áo quần"
                open={openPanel === 'fabric'}
                onToggle={() => setOpenPanel(openPanel === 'fabric' ? 'delivery' : 'fabric')}
              >
                {product.fabric}
              </AccordionRow>

              <AccordionRow
                title="Giao hàng &amp; đổi trả"
                open={openPanel === 'delivery'}
                onToggle={() => setOpenPanel(openPanel === 'delivery' ? 'description' : 'delivery')}
              >
                {product.delivery}
              </AccordionRow>
            </div>
          </aside>
        </div>

        <section className="mt-12 md:mt-24">
          <div className="mb-4 md:mb-8 flex items-end justify-between gap-4">
            <h2 className="font-headline text-[18px] md:text-[28px] font-medium text-primary">
              Sản phẩm liên quan
            </h2>
            <Link
              to="/collections"
              className="font-label text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.22em] text-on-surface-variant underline underline-offset-4 transition-colors hover:text-primary"
            >
              Xem tất cả
            </Link>
          </div>

          <div className="grid grid-cols-2 gap-3 md:grid-cols-4 md:gap-5">
            {RELATED_ITEMS.map((item) => (
              <Link key={item.id} to={`/product/${item.id}`} className="group block">
                <div className="overflow-hidden bg-surface-container-low">
                  <img
                    src={item.image}
                    alt={item.title}
                    className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
                  />
                </div>
                <div className="pt-2 md:pt-3">
                  <h3 className="font-label text-[9px] md:text-[11px] font-semibold uppercase tracking-[0.18em] text-primary">
                    {item.title}
                  </h3>
                  <p className="mt-0.5 md:mt-1 font-body text-[10px] md:text-[12px] text-on-surface-variant">
                    {formatVND(item.price)}
                  </p>
                </div>
              </Link>
            ))}
          </div>
        </section>
      </div>
    </section>
  )
}