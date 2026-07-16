import { useMemo, useState, useEffect } from 'react'
import axios from 'axios'
import { useCartStore } from '../cart/cartStore'
import Loading from '../../../components/Loading'

type SortOption = 'default' | 'price-asc' | 'price-desc'

interface WishlistProduct {
    id: string
    name: string
    price: number
    imageUrl: string
    size: string
    color: string
}

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
                <h2 className="font-headline text-[20px] md:text-[24px] font-medium leading-[1.15] text-primary line-clamp-2">
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
    const [wishlistProducts, setWishlistProducts] = useState<WishlistProduct[]>([])
    const [loading, setLoading] = useState(true)
    const [sortBy, setSortBy] = useState<SortOption>('default')
    const { addItem, showToast, openCart } = useCartStore()

    useEffect(() => {
        const apiBase = import.meta.env.VITE_API_BASE_URL
        axios.get<any[]>(`${apiBase}/data`)
            .then(res => {
                // Map the first 4 items from the mock API as our default wishlist items
                const mapped = res.data.slice(0, 4).map(p => ({
                    id: p.id,
                    name: p.name,
                    price: p.discountPrice || p.price,
                    imageUrl: p.images?.[0] || 'data:image/svg+xml;charset=UTF-8,%3Csvg%20xmlns%3D%22http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg%22%20width%3D%22400%22%20height%3D%22533%22%20viewBox%3D%220%200%20400%20533%22%3E%3Crect%20width%3D%22400%22%20height%3D%22533%22%20fill%3D%22%23e2e8f0%22%2F%3E%3Ctext%20x%3D%22200%22%20y%3D%22266%22%20font-family%3D%22sans-serif%22%20font-size%3D%2224%22%20fill%3D%22%2394a3b8%22%20text-anchor%3D%22middle%22%20dominant-baseline%3D%22middle%22%3ENo%20Image%3C%2Ftext%3E%3C%2Fsvg%3E',
                    size: p.sizes?.[0] || 'M',
                    color: p.colors?.[0]?.name || 'Default',
                }))
                setWishlistProducts(mapped)
            })
            .catch(err => {
                console.error('Lỗi khi tải wishlist:', err)
            })
            .finally(() => {
                setLoading(false)
            })
    }, [])

    const sortedProducts = useMemo(() => {
        const products = [...wishlistProducts]

        if (sortBy === 'price-asc') {
            return products.sort((a, b) => a.price - b.price)
        }

        if (sortBy === 'price-desc') {
            return products.sort((a, b) => b.price - a.price)
        }

        return products
    }, [sortBy, wishlistProducts])

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

    if (loading) {
        return <Loading variant="fullscreen" text="Đang tải sản phẩm..." />
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
