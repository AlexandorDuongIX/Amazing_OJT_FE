import { useMemo, useState } from 'react'
import { useCartStore } from '../../store/cartStore'

type SortOption = 'default' | 'price-asc' | 'price-desc'

interface WishlistProduct {
  id: string
  name: string
  price: number
  imageUrl: string
  size: string
  color: string
}

const wishlistProducts: WishlistProduct[] = [
  {
    id: 'wishlist-wool-coat',
    name: 'Áo Khoác Wool Oversized',
    price: 12500000,
    imageUrl: '/images/wishlist/wool-coat.png',
    size: 'M',
    color: 'Charcoal',
  },
  {
    id: 'wishlist-essential-suit',
    name: 'Suit Nam Essential',
    price: 18000000,
    imageUrl: '/images/wishlist/essential-suit.png',
    size: 'L',
    color: 'Light Gray',
  },
  {
    id: 'wishlist-leather-loafers',
    name: 'Giày Loafers Da Cao Cấp',
    price: 8500000,
    imageUrl: '/images/wishlist/leather-loafers.png',
    size: '42',
    color: 'Cognac',
  },
  {
    id: 'wishlist-gold-watch',
    name: 'Đồng Hồ Gold Minimalist',
    price: 15200000,
    imageUrl: '/images/wishlist/gold-watch.png',
    size: 'One Size',
    color: 'Gold',
  },
]

const formatVND = (amount: number) => `${amount.toLocaleString('vi-VN')} VNĐ`

function WishlistProductCard({
  product,
  onAddToCart,
}: {
  product: WishlistProduct
  onAddToCart: (product: WishlistProduct) => void
}) {
  return (
    <article className="group text-center">
      <div className="overflow-hidden bg-surface-container-low">
        <img
          src={product.imageUrl}
          alt={product.name}
          className="aspect-[3/4] w-full object-cover transition-transform duration-500 group-hover:scale-[1.03]"
        />
      </div>

      <div className="mx-auto mt-[18px] flex min-h-[152px] max-w-[250px] flex-col items-center">
        <h2 className="font-headline text-[30px] font-medium leading-[1.15] text-primary">
          {product.name}
        </h2>
        <p className="mt-[10px] font-body text-[14px] font-medium text-on-surface-variant">
          {formatVND(product.price)}
        </p>
        <button
          type="button"
          onClick={() => onAddToCart(product)}
          className="mt-[16px] h-[50px] min-w-[176px] bg-primary px-[22px] font-label text-[12px] font-bold uppercase tracking-[0.12em] text-on-primary transition-colors hover:bg-[#D4AF37] hover:text-primary"
        >
          Thêm vào giỏ hàng
        </button>
      </div>
    </article>
  )
}

export default function WishlistPage() {
  const [sortBy, setSortBy] = useState<SortOption>('default')
  const { addItem, showToast, openCart } = useCartStore()

  const sortedProducts = useMemo(() => {
    const products = [...wishlistProducts]

    if (sortBy === 'price-asc') {
      return products.sort((a, b) => a.price - b.price)
    }

    if (sortBy === 'price-desc') {
      return products.sort((a, b) => b.price - a.price)
    }

    return products
  }, [sortBy])

  const addWishlistProduct = (product: WishlistProduct) => {
    addItem({
      id: product.id,
      name: product.name,
      price: product.price,
      imageUrl: product.imageUrl,
      size: product.size,
      color: product.color,
      quantity: 1,
    })
    showToast(product.name, product.imageUrl, product.price)
  }

  const addAllToCart = () => {
    wishlistProducts.forEach(addWishlistProduct)
    openCart()
  }

  return (
    <section className="bg-[#FBF9F9]">
      <div className="mx-auto max-w-[1280px] px-[80px] pb-[76px] pt-[96px]">
        <header className="text-center">
          <h1 className="font-headline text-[48px] font-semibold leading-tight text-primary">
            DANH SÁCH YÊU THÍCH
          </h1>
          <p className="mt-[26px] font-label text-[11px] font-bold uppercase tracking-[0.28em] text-on-surface-variant/60">
            {wishlistProducts.length} sản phẩm đã lưu
          </p>
        </header>

        <div className="mt-[58px]">
          <label className="sr-only" htmlFor="wishlist-sort">
            Sắp xếp sản phẩm yêu thích
          </label>
          <select
            id="wishlist-sort"
            value={sortBy}
            onChange={(event) => setSortBy(event.target.value as SortOption)}
            className="h-[32px] min-w-[150px] border border-outline-variant bg-transparent px-[12px] font-label text-[13px] font-semibold text-on-surface-variant outline-none transition-colors hover:border-primary focus:border-primary"
          >
            <option value="default">Sắp xếp theo</option>
            <option value="price-asc">Giá tăng dần</option>
            <option value="price-desc">Giá giảm dần</option>
          </select>
        </div>

        <div className="mt-[24px] border-t border-outline-variant pt-[40px]">
          <div className="grid grid-cols-4 gap-x-[24px]">
            {sortedProducts.map((product) => (
              <WishlistProductCard
                key={product.id}
                product={product}
                onAddToCart={addWishlistProduct}
              />
            ))}
          </div>
        </div>

        <div className="mt-[58px] flex h-[48px] items-center justify-between border border-outline-variant px-[32px]">
          <p className="font-body text-[13px] font-medium text-primary">
            Tổng cộng {wishlistProducts.length} sản phẩm
          </p>
          <button
            type="button"
            onClick={addAllToCart}
            className="h-[32px] bg-primary px-[20px] font-label text-[11px] font-bold uppercase tracking-[0.12em] text-on-primary transition-colors hover:bg-[#D4AF37] hover:text-primary"
          >
            Thêm tất cả vào giỏ hàng
          </button>
        </div>
      </div>
    </section>
  )
}
