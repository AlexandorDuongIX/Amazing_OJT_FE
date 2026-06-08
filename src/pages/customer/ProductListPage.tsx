import { useState, useEffect } from 'react'
import { useParams } from 'react-router-dom'

/* ============================================================
   ProductListPage — AMAZING Clothing Shop (Customer Page)
   ============================================================
   Sections:
   1. Page Header with Filters & Sort
   2. Product Grid (2 cols mobile / 4 cols desktop)
   3. Load More Button
   ============================================================ */

/* ---------- Product Data ---------- */
interface Product {
  id: number
  name: string
  price: string
  badge?: string
  primaryImage: string
  secondaryImage: string
}

const PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Áo Khoác Wool Oversized',
    price: '12.500.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBeZ7rP06QQFBe5La9OVex1xCQmm8EDZ6hzAwEWwnb7M-EZACkLdTQDYSeaH6N5Mq4mno-w0qmcVGHd1pXYo42M3LZzAbWgsyotaDWhcvOFAQFLa01xwHMdphkTWtE9NURZxfomFXbwGm7k5hEevlbvJAzJisP7zPsctVqbUbdDgvSBDO1TkbsPvHch_yqCiwW-DThKtomIbiiAqn3TOysnbU2dW70-gpIITjGU2P9z3YwjPU-i2ETWbhHhcR2q6LsieCwgjkTfAo',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgxZRAJh8TLZg-czqw7oyalCXLQgQrIPWo_YKGInaGt6WazrjnYSOUIHKVvCVm_ABdrIne0rzMNmxbV-TIWKqy7PTgDhorTXSSM71ubEZshappoUf0D1PZDbVGJMpOXp9qwFdF9ekjeRl5tIg2Fl2qxW28NHaWx4NHVGHdCp40pl_swzJv2tULHjassCHWBOcxirhXHCKu94BP49nZNE1UPiw9nPHpoavN4Bv5AQP1TI_rM0nqIO040AjlckPsgryNlpkTS3YJJU',
  },
  {
    id: 2,
    name: 'Suit Nam Essential',
    price: '18.000.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGRWul4XhzRhwR4_6Try_wyRK-sMjVmSXSUkCWF6L8DH0lAuR3XzcaaB8SH61fXNyKeIcUXLdYx16JsbDeRj4kpcbrP7S8XqKmgmsDyC9_iqH5gJPO2VlKx7tQdUe627EodLylpR-2EkoLZUBXprQ_t42pWTIYfOR_MFhd3i3_oqIcm7kWMDpJtDjI-Snrj5W-PM8qdarqKQyvlcDsDe4iEW30cFgmg9LgDucwkmDQuCWdo-2eKCiXkamU0ZiL6DRrUjW63MCiv1w',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtCYceFovBQHmq6ZDgh-HXTVp8KRPCZg__8aTlquZxiXQ1s83c989kzdDRmRQy1aZy-Z8Sunc9ck4dFtCn0UrxCg3910qVDBcy76Yn-kenwRKD6KAN5tqKUt-JEZuuuji0KP40o6WCenQVY0dz-JQDgC2qlRCxGoswjodNxJ0vNycVN9WuvIvSUMTt_T9akmJjmSGXB8aqTZx2iRgeG2wyaj1zxJ8rgz1N0zK_eK1Ujci1WlpxOwUs80y5e6Msf__03-KWv_n3KiA',
  },
  {
    id: 3,
    name: 'Giày Loafers Da Cao Cấp',
    price: '8.500.000 VNĐ',
    badge: 'Limited Edition',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDpCtKHg5h7qvAXEKjUb7hbEufj5yQhgt_8VsplHbYTb3-EwLKqN0F6YhQZgYTWM3-rfPEc535lUmrrBe7vf2UohzsYfL1OcAIIMjKDFDAEZNp92PWNhgkXPSxXbLM9BEBPLtVDem64xKxNw4pFbeg2YkKtCLlqW1lbFIBXiwz_KDFx2CP-_evdkmdka5bQSjr_boaRRdAXwqQqOLGCVMyg_GfHMqVOnevBAJk8tBYVhO--i-7-gU2EjAVAeC96dX6xhmR2tq8FxcI',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuA5k_XQrIp1dh6a8N_C2igi6HMdNJ3B-B56lA5cBL4wTgDMBGuquydgK3di95Jo35V2hT4en1Dxavd_Ygplzh5DHFF2lz_uMvk95xMXTKaofFBmWOoQcotpRHv237xsA0uqq7YaWSuLDuYhz9s7qBIfIBsSg0MmXcp7TLcQJI1_wP42dutUjAkcBGu8rKhPbZO7kLGvtlhwW_7ch4UDPvoFo6QjCgq8uG75JsVzA87aSt-sYJp0sZSEvi__D_NWi6ruInoUgs8O4MA',
  },
  {
    id: 4,
    name: 'Đồng Hồ Gold Minimalist',
    price: '15.200.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida/ADBb0uipFJY_Zhm-1F7u9QTNTueSZ6MGoH2A8OkKYMoEBSW0bMIQTP91VfQGy3AuV1GFTSVICBG9hl753DUB3GyWzTrJVxj7I792-dV_7UYLHTsXPUxR0o2xB-zoARpQjYl8tipAw7SwX3V6hR4L_cVCKuy7ik56gQ_sXaZbAl8om-WSMH4zoAmb9AW-UaT7bRQBKNA_2WD6lFemN-bg58-c2kqPsqU22gmAE57oaxzytUdyTpCpUPx1rrXr8A',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida/ADBb0uipFJY_Zhm-1F7u9QTNTueSZ6MGoH2A8OkKYMoEBSW0bMIQTP91VfQGy3AuV1GFTSVICBG9hl753DUB3GyWzTrJVxj7I792-dV_7UYLHTsXPUxR0o2xB-zoARpQjYl8tipAw7SwX3V6hR4L_cVCKuy7ik56gQ_sXaZbAl8om-WSMH4zoAmb9AW-UaT7bRQBKNA_2WD6lFemN-bg58-c2kqPsqU22gmAE57oaxzytUdyTpCpUPx1rrXr8A',
  },
  {
    id: 5,
    name: 'Áo Sơ Mi Linen Trắng',
    price: '3.200.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCue7rtdmW2RgLjgwCVCVC7GZgi63V7TiSssQO9PIt1OtH1aGyJ_pfToRJNXrxAEGvNDXXqqLxjC5oAjFx-efNCxG3RKVpuKvZKd6lTQpJxe97LqM8jnz9o31gm4j84NohC7BAHmEiwPn-fCZjbYFP3f8tBUN-KT65brEKgrFtLM296_TZU6lkpzBaJGDjCAaOG58-yznM6BJMxLuYplVU5OkvbH29_9xwYYY3DNMS9FK3Jp6cXh0dUQE84HP5vZWC3G5egyf4ME',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuAjFMbxUQCBM8Dgdh6nvkpBeVcWqAdgZfk8OixaHYuMX9PRvhz0HbazjPtXsojVee6gHjkgXL_Cda0a0WOA4ea0IShxCVGC72CZ11th-DXvus7KzeRHuAFRcvHWo0Gf6gpRHDPjbPRrCsQ4f2oCHfxhhIUz2oU-KZEUguRSgfrJmMkLEcdpXX5TNgsJ9q6EsPuXZksiFyrjv5fgE7gBtSKt9mD5rh4n5E5cKh-z4akj6GCzoyXYtPjfJjbMr8z941NLllBltiy6wAo',
  },
  {
    id: 6,
    name: 'Quần Tây Slim Fit',
    price: '5.800.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEMRAYNsWYIamEt3oGaYGTnkzjvSEGgyPZYoqFO_8K7EcSQriWNR7_8MFU2MdWYnHoTc8W3H-fOAvOqRY16rtQE_38AHcvXgNIH914L3jesQGUGLntYJyH9scrJaAtWojM-X9gKvy1PTWmfmGI_cLsy8wTyTUtbKjN3bwMOtGpwmOeD4wH7XurirQDjXni_a9kDLOEC9rqSgrPsiIP0O8jy5ShdlBDRMYLqvjlizBISwwMB2bdyxdktGBfDmKGyTHmyqjpiVsH98',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDe7Q7KfaQ2fbCKVztHoR3zJJggyCbXni2ICIqgjncKdsVp3i5xdC7-iMMwe0zTFf4w7cuR6ymrsTARQAkGxC-egGIJjhj8qMdygBP1FtmZVNLsMfD3CmKfggKwa5u0Cc1bxThFsqlOCfPIdEcPhsSSv9YxgPmDi4cs6VnsxOMrMrElx7WCi4yM1Dwobh0PWUDq0iisOpI1qQKB4dcHuVQe5d5c1W6JTpC6zqtfW1Be2S3Gu6r8Sfa0U6MKDcBnhSEEXkEu8ED-3fk',
  },
  {
    id: 7,
    name: 'Túi Tote Da Bò',
    price: '7.900.000 VNĐ',
    badge: 'New Arrival',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCBeZ7rP06QQFBe5La9OVex1xCQmm8EDZ6hzAwEWwnb7M-EZACkLdTQDYSeaH6N5Mq4mno-w0qmcVGHd1pXYo42M3LZzAbWgsyotaDWhcvOFAQFLa01xwHMdphkTWtE9NURZxfomFXbwGm7k5hEevlbvJAzJisP7zPsctVqbUbdDgvSBDO1TkbsPvHch_yqCiwW-DThKtomIbiiAqn3TOysnbU2dW70-gpIITjGU2P9z3YwjPU-i2ETWbhHhcR2q6LsieCwgjkTfAo',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuDLgxZRAJh8TLZg-czqw7oyalCXLQgQrIPWo_YKGInaGt6WazrjnYSOUIHKVvCVm_ABdrIne0rzMNmxbV-TIWKqy7PTgDhorTXSSM71ubEZshappoUf0D1PZDbVGJMpOXp9qwFdF9ekjeRl5tIg2Fl2qxW28NHaWx4NHVGHdCp40pl_swzJv2tULHjassCHWBOcxirhXHCKu94BP49nZNE1UPiw9nPHpoavN4Bv5AQP1TI_rM0nqIO040AjlckPsgryNlpkTS3YJJU',
  },
  {
    id: 8,
    name: 'Kính Mắt Vuông Classic',
    price: '2.400.000 VNĐ',
    primaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuCGRWul4XhzRhwR4_6Try_wyRK-sMjVmSXSUkCWF6L8DH0lAuR3XzcaaB8SH61fXNyKeIcUXLdYx16JsbDeRj4kpcbrP7S8XqKmgmsDyC9_iqH5gJPO2VlKx7tQdUe627EodLylpR-2EkoLZUBXprQ_t42pWTIYfOR_MFhd3i3_oqIcm7kWMDpJtDjI-Snrj5W-PM8qdarqKQyvlcDsDe4iEW30cFgmg9LgDucwkmDQuCWdo-2eKCiXkamU0ZiL6DRrUjW63MCiv1w',
    secondaryImage:
      'https://lh3.googleusercontent.com/aida-public/AB6AXuBtCYceFovBQHmq6ZDgh-HXTVp8KRPCZg__8aTlquZxiXQ1s83c989kzdDRmRQy1aZy-Z8Sunc9ck4dFtCn0UrxCg3910qVDBcy76Yn-kenwRKD6KAN5tqKUt-JEZuuuji0KP40o6WCenQVY0dz-JQDgC2qlRCxGoswjodNxJ0vNycVN9WuvIvSUMTt_T9akmJjmSGXB8aqTZx2iRgeG2wyaj1zxJ8rgz1N0zK_eK1Ujci1WlpxOwUs80y5e6Msf__03-KWv_n3KiA',
  },
]

/* ---------- Filter Select ---------- */
interface FilterSelectProps {
  label: string
  options: { value: string; label: string }[]
  value: string
  onChange: (v: string) => void
}

function FilterSelect({ label, options, value, onChange }: FilterSelectProps) {
  return (
    <div className="relative">
      <select
        value={value}
        onChange={(e) => onChange(e.target.value)}
        className="bg-transparent border-b border-outline pb-1 pr-6 font-label text-[14px] font-semibold text-on-surface-variant focus:outline-none focus:border-primary cursor-pointer w-full md:w-auto transition-colors duration-200 appearance-none"
        style={{
          backgroundImage:
            "url(\"data:image/svg+xml;charset=US-ASCII,%3Csvg%20xmlns%3D'http%3A%2F%2Fwww.w3.org%2F2000%2Fsvg'%20width%3D'292.4'%20height%3D'292.4'%3E%3Cpath%20fill%3D'%231b1c1c'%20d%3D'M287%2069.4a17.6%2017.6%200%200%200-13-5.4H18.4c-5%200-9.3%201.8-12.9%205.4A17.6%2017.6%200%200%200%200%2082.2c0%205%201.8%209.3%205.4%2012.9l128%20127.9c3.6%203.6%207.8%205.4%2012.8%205.4s9.2-1.8%2012.8-5.4L287%2095c3.5-3.5%205.4-7.8%205.4-12.8%200-5-1.9-9.2-5.5-12.8z'%2F%3E%3C%2Fsvg%3E\")",
          backgroundRepeat: 'no-repeat',
          backgroundPosition: 'right .5em top 50%',
          backgroundSize: '.55em auto',
        }}
      >
        <option value="">{label}</option>
        {options.map((opt) => (
          <option key={opt.value} value={opt.value}>
            {opt.label}
          </option>
        ))}
      </select>
    </div>
  )
}

/* ---------- Product Card ---------- */
interface ProductCardProps {
  product: Product
}

function ProductCard({ product }: ProductCardProps) {
  const [wished, setWished] = useState(false)

  return (
    <div className="group product-card cursor-pointer">
      <div className="relative aspect-[3/4] overflow-hidden mb-4 bg-surface-container-low">
        {/* Primary Image */}
        <img
          src={product.primaryImage}
          alt={product.name}
          className="object-cover w-full h-full absolute inset-0 transition-opacity duration-500 ease-in-out group-hover:opacity-0"
        />
        {/* Secondary (hover) Image */}
        <img
          src={product.secondaryImage}
          alt={`${product.name} chi tiết`}
          className="object-cover w-full h-full absolute inset-0 opacity-0 transition-opacity duration-500 ease-in-out group-hover:opacity-100"
        />

        {/* Badge */}
        {product.badge && (
          <div className="absolute top-4 left-4 border border-secondary text-secondary font-label text-[10px] uppercase tracking-widest px-2 py-1 bg-surface/80 z-10">
            {product.badge}
          </div>
        )}

        {/* Wishlist Button */}
        <button
          className="absolute top-4 right-4 z-10 p-2 bg-surface/50 backdrop-blur-sm rounded-full opacity-0 group-hover:opacity-100 transition-all duration-300 hover:bg-surface/80"
          onClick={() => setWished((w) => !w)}
          aria-label="Thêm vào yêu thích"
        >
          <span
            className={`material-symbols-outlined text-[20px] transition-colors duration-200 ${
              wished ? 'text-error fill' : 'text-on-surface hover:text-secondary'
            }`}
            style={wished ? { fontVariationSettings: "'FILL' 1" } : {}}
          >
            favorite
          </span>
        </button>

        {/* Add to Cart — Slides up on hover */}
        <div className="absolute bottom-0 left-0 w-full p-4 transform translate-y-full group-hover:translate-y-0 transition-transform duration-300 ease-out">
          <button className="w-full py-3 bg-primary text-on-primary font-label text-[14px] font-semibold uppercase tracking-wider hover:bg-secondary transition-colors duration-200">
            Thêm Vào Giỏ
          </button>
        </div>
      </div>

      {/* Info */}
      <div className="text-center px-1">
        <h3 className="font-headline text-[18px] md:text-[20px] font-medium text-on-surface mb-1 leading-snug">
          {product.name}
        </h3>
        <p className="font-body text-[14px] text-on-surface-variant">{product.price}</p>
      </div>
    </div>
  )
}

/* ---------- Category label map ---------- */
const CATEGORY_TITLES: Record<string, string> = {
  nam: 'Thời Trang Nam',
  nu: 'Thời Trang Nữ',
  'phu-kien': 'Phụ Kiện',
}

/* ---------- ProductListPage ---------- */
export default function ProductListPage() {
  const { category } = useParams<{ category?: string }>()
  const pageTitle = category ? (CATEGORY_TITLES[category] ?? 'Bộ Sưu Tập') : 'Tất Cả Sản Phẩm'

  const [filterCategory, setFilterCategory] = useState('')
  const [color, setColor] = useState('')
  const [size, setSize] = useState('')
  const [priceRange, setPriceRange] = useState('')
  const [sortBy, setSortBy] = useState('')
  const [visibleCount, setVisibleCount] = useState(8)

  // Reset paging whenever the route category changes
  useEffect(() => {
    setVisibleCount(8)
  }, [category])

  const visibleProducts = PRODUCTS.slice(0, visibleCount)
  const hasMore = visibleCount < PRODUCTS.length

  return (
    <main className="w-full max-w-[1440px] mx-auto px-[20px] md:px-[80px] py-16 md:py-24">
      {/* ── Page Header ── */}
      <div className="mb-12 md:mb-16">
        <h1 className="font-headline text-[32px] md:text-[48px] font-semibold text-center mb-8 md:mb-12 fade-in">
          {pageTitle}
        </h1>

        <div className="flex flex-col md:flex-row justify-between items-start md:items-center gap-6 border-b border-outline-variant pb-6">
          {/* ── Filters ── */}
          <div className="flex flex-wrap gap-4 md:gap-8 w-full md:w-auto">
            <FilterSelect
              label="Danh mục"
              value={filterCategory}
              onChange={setFilterCategory}
              options={[
                { value: 'ao-khoac', label: 'Áo Khoác' },
                { value: 'giay', label: 'Giày' },
                { value: 'phu-kien', label: 'Phụ Kiện' },
              ]}
            />
            <FilterSelect
              label="Màu sắc"
              value={color}
              onChange={setColor}
              options={[
                { value: 'den', label: 'Đen' },
                { value: 'nau', label: 'Nâu' },
                { value: 'beige', label: 'Beige' },
              ]}
            />
            <FilterSelect
              label="Kích cỡ"
              value={size}
              onChange={setSize}
              options={[
                { value: 's', label: 'S' },
                { value: 'm', label: 'M' },
                { value: 'l', label: 'L' },
              ]}
            />
            <FilterSelect
              label="Khoảng giá"
              value={priceRange}
              onChange={setPriceRange}
              options={[
                { value: 'duoi-5tr', label: 'Dưới 5 triệu' },
                { value: '5-10tr', label: '5 – 10 triệu' },
                { value: 'tren-10tr', label: 'Trên 10 triệu' },
              ]}
            />
          </div>

          {/* ── Sort ── */}
          <div className="w-full md:w-auto">
            <FilterSelect
              label="Sắp xếp theo"
              value={sortBy}
              onChange={setSortBy}
              options={[
                { value: 'moi-nhat', label: 'Mới nhất' },
                { value: 'gia-tang', label: 'Giá tăng dần' },
                { value: 'gia-giam', label: 'Giá giảm dần' },
              ]}
            />
          </div>
        </div>
      </div>

      {/* ── Product Grid ── */}
      <div className="grid grid-cols-2 md:grid-cols-4 gap-x-4 md:gap-x-[24px] gap-y-12 md:gap-y-16">
        {visibleProducts.map((product) => (
          <ProductCard key={product.id} product={product} />
        ))}
      </div>

      {/* ── Load More ── */}
      {hasMore && (
        <div className="mt-16 flex justify-center">
          <button
            onClick={() => setVisibleCount((c) => c + 4)}
            className="border border-primary px-10 py-4 font-label text-[14px] font-semibold uppercase tracking-widest text-primary hover:bg-primary hover:text-on-primary transition-colors duration-300"
          >
            Xem Thêm Sản Phẩm
          </button>
        </div>
      )}

      {!hasMore && (
        <p className="mt-16 text-center font-label text-[13px] uppercase tracking-widest text-on-surface-variant">
          Đã hiển thị tất cả sản phẩm
        </p>
      )}
    </main>
  )
}
