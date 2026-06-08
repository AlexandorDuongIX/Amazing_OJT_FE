import { useState } from 'react'
import Button from '../../components/Button'

/* ============================================================
   HomePage — AMAZING Clothing Shop (Customer Page)
   ============================================================
   Sections:
   1. Hero (full-width, bg image, CTA)
   2. Categories Grid (Bento layout)
   3. About
   4. Blog / Editorial
   5. Newsletter
   ============================================================ */

/* ---------- Image URLs ---------- */
const IMAGES = {
  hero: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCue7rtdmW2RgLjgwCVCVC7GZgi63V7TiSssQO9PIt1OtH1aGyJ_pfToRJNXrxAEGvNDXXqqLxjC5oAjFx-efNCxG3RKVpuKvZKd6lTQpJxe97LqM8jnz9o31gm4j84NohC7BAHmEiwPn-fCZjbYFP3f8tBUN-KT65brEKgrFtLM296_TZU6lkpzBaJGDjCAaOG58-yznM6BJMxLuYplVU5OkvbH29_9xwYYY3DNMS9FK3Jp6cXh0dUQE84HP5vZWC3G5egyf4ME',
  women: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjCue7rtdmW2RgLjgwCVCVC7GZgi63V7TiSssQO9PIt1OtH1aGyJ_pfToRJNXrxAEGvNDXXqqLxjC5oAjFx-efNCxG3RKVpuKvZKd6lTQpJxe97LqM8jnz9o31gm4j84NohC7BAHmEiwPn-fCZjbYFP3f8tBUN-KT65brEKgrFtLM296_TZU6lkpzBaJGDjCAaOG58-yznM6BJMxLuYplVU5OkvbH29_9xwYYY3DNMS9FK3Jp6cXh0dUQE84HP5vZWC3G5egyf4ME',
  men: 'https://lh3.googleusercontent.com/aida-public/AB6AXuAjFMbxUQCBM8Dgdh6nvkpBeVcWqAdgZfk8OixaHYuMX9PRvhz0HbazjPtXsojVee6gHjkgXL_Cda0a0WOA4ea0IShxCVGC72CZ11th-DXvus7KzeRHuAFRcvHWo0Gf6gpRHDPjbPRrCsQ4f2oCHfxhhIUz2oU-KZEUguRSgfrJmMkLEcdpXX5TNgsJ9q6EsPuXZksiFyrjv5fgE7gBtSKt9mD5rh4n5E5cKh-z4akj6GCzoyXYtPjfJjbMr8z941NLllBltiy6wAo',
  accessories: 'https://lh3.googleusercontent.com/aida-public/AB6AXuCEEMRAYNsWYIamEt3oGaYGTnkzjvSEGgyPZYoqFO_8K7EcSQriWNR7_8MFU2MdWYnHoTc8W3H-fOAvOqRY16rtQE_38AHcvXgNIH914L3jesQGUGLntYJyH9scrJaAtWojM-X9gKvy1PTWmfmGI_cLsy8wTyTUtbKjN3bwMOtGpwmOeD4wH7XurirQDjXni_a9kDLOEC9rqSgrPsiIP0O8jy5ShdlBDRMYLqvjlizBISwwMB2bdyxdktGBfDmKGyTHmyqjpiVsH98',
  blog: 'https://lh3.googleusercontent.com/aida-public/AB6AXuDe7Q7KfaQ2fbCKVztHoR3zJJggyCbXni2ICIqgjncKdsVp3i5xdC7-iMMwe0zTFf4w7cuR6ymrsTARQAkGxC-egGIJjhj8qMdygBP1FtmZVNLsMfD3CmKfggKwa5u0Cc1bxThFsqlOCfPIdEcPhsSSv9YxgPmDi4cs6VnsxOMrMrElx7WCi4yM1Dwobh0PWUDq0iisOpI1qQKB4dcHuVQe5d5c1W6JTpC6zqtfW1Be2S3Gu6r8Sfa0U6MKDcBnhSEEXkEu8ED-3fk',
}

/* ---------- Hero Section ---------- */
function HeroSection() {
  return (
    <section className="relative w-full h-[870px] min-h-[600px] flex items-center justify-center bg-surface-container overflow-hidden">
      {/* Background Image */}
      <div className="absolute inset-0 w-full h-full">
        <img
          src={IMAGES.hero}
          alt="Model mặc áo khoác charcoal phong cách tối giản cao cấp"
          className="w-full h-full object-cover object-center transform hover:scale-105 transition-transform duration-[20s] ease-out"
        />
        {/* Gradient overlay */}
        <div className="absolute inset-0 bg-gradient-to-t from-tertiary/60 via-tertiary/20 to-transparent" />
      </div>

      {/* Hero Content */}
      <div className="relative z-10 text-center text-on-tertiary max-w-5xl px-margin-mobile fade-in">
        <h1 className="font-display text-[40px] md:text-[64px] font-bold leading-[1.1] md:leading-[1.1] tracking-tight mb-6 md:tracking-[-0.02em] whitespace-nowrap">
          Bản sắc thời trang hiện đại
        </h1>
        <p className="font-body text-[18px] leading-[1.6] tracking-[0.01em] mb-10 text-surface-container opacity-90 max-w-xl mx-auto">
          Khám phá bộ sưu tập Thu Đông mới nhất tại AMAZING.
        </p>
        <Button variant="primary" size="lg" href="#categories">
          Xem ngay
        </Button>
      </div>
    </section>
  )
}

/* ---------- Category Card ---------- */
interface CategoryCardProps {
  href: string
  image: string
  title: string
  subtitle?: string
  className?: string
  imgPosition?: string
}

function CategoryCard({ href, image, title, subtitle = 'Khám phá', className = '', imgPosition = 'object-center' }: CategoryCardProps) {
  return (
    <a href={href} className={`group relative overflow-hidden block ${className}`}>
      <img
        src={image}
        alt={title}
        className={`w-full h-full object-cover ${imgPosition} group-hover:scale-105 transition-transform duration-700 ease-in-out`}
      />
      <div className="absolute inset-0 bg-tertiary/10 group-hover:bg-tertiary/30 transition-colors duration-500" />
      <div className="absolute bottom-0 left-0 p-6 md:p-8 w-full bg-gradient-to-t from-tertiary/80 to-transparent">
        <h3 className="font-headline text-[24px] md:text-[32px] font-medium text-on-tertiary mb-1 md:mb-2">
          {title}
        </h3>
        <p className="font-label text-[12px] md:text-[14px] font-semibold text-surface uppercase tracking-widest flex items-center opacity-0 group-hover:opacity-100 transition-opacity duration-300 transform translate-y-4 group-hover:translate-y-0">
          {subtitle}
          <span className="material-symbols-outlined ml-2 text-[18px]">arrow_forward</span>
        </p>
      </div>
    </a>
  )
}

/* ---------- Categories Section ---------- */
function CategoriesSection() {
  return (
    <section
      id="categories"
      className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto"
    >
      {/* Section Header */}
      <div className="text-center mb-16">
        <h2 className="font-headline text-[32px] md:text-[48px] font-semibold text-primary mb-4">
          Bộ Sưu Tập
        </h2>
        <div className="w-12 h-px bg-outline mx-auto" />
      </div>

      {/* Bento Grid */}
      <div className="grid grid-cols-1 md:grid-cols-12 gap-gutter auto-rows-[400px] md:auto-rows-[600px]">
        {/* Women (Large) */}
        <CategoryCard
          href="#"
          image={IMAGES.women}
          title="Thời trang Nữ"
          className="col-span-1 md:col-span-8"
          imgPosition="object-top"
        />

        {/* Right Column */}
        <div className="col-span-1 md:col-span-4 grid grid-rows-2 gap-gutter h-full">
          {/* Men */}
          <CategoryCard
            href="#"
            image={IMAGES.men}
            title="Thời trang Nam"
            subtitle="Xem thêm"
            className="h-full"
          />
          {/* Accessories */}
          <CategoryCard
            href="#"
            image={IMAGES.accessories}
            title="Phụ kiện cao cấp"
            subtitle="Xem thêm"
            className="h-full"
          />
        </div>
      </div>
    </section>
  )
}

/* ---------- About Section ---------- */
function AboutSection() {
  return (
    <section className="py-section-gap bg-surface-container-low px-margin-mobile md:px-margin-desktop">
      <div className="max-w-4xl mx-auto text-center">
        <span className="font-label text-[14px] font-semibold text-on-surface-variant uppercase tracking-[0.2em] mb-4 block">
          Về chúng tôi
        </span>
        <h2 className="font-display text-[40px] md:text-[64px] font-bold text-primary mb-8 leading-[1.1] md:leading-[1.1]">
          Câu chuyện AMAZING
        </h2>
        <p className="font-body text-[18px] leading-[1.6] tracking-[0.01em] text-on-surface-variant max-w-2xl mx-auto mb-10">
          Chúng tôi tin rằng thời trang là ngôn ngữ của sự tự tin. AMAZING mang đến những thiết kế
          tinh giản, chú trọng vào chất liệu và phom dáng, tạo nên vẻ đẹp vượt thời gian cho người
          mặc.
        </p>
        <div className="w-24 h-[1px] bg-primary mx-auto" />
      </div>
    </section>
  )
}

/* ---------- Blog Section ---------- */
function BlogSection() {
  return (
    <section className="py-section-gap px-margin-mobile md:px-margin-desktop max-w-[1440px] mx-auto">
      {/* Section Header */}
      <div className="flex flex-col md:flex-row justify-between items-end mb-12 gap-6">
        <div>
          <h2 className="font-headline text-[32px] md:text-[48px] font-semibold text-primary mb-2">
            Xu hướng &amp; Phong cách
          </h2>
          <p className="font-body text-[16px] text-on-surface-variant">
            Những câu chuyện thời trang và cảm hứng sống.
          </p>
        </div>
        <a
          href="#"
          className="font-label text-[14px] font-semibold text-primary uppercase tracking-widest border-b border-primary pb-1 hover:text-secondary-fixed-dim hover:border-secondary-fixed-dim transition-colors"
        >
          Xem tất cả bài viết
        </a>
      </div>

      {/* Blog Content */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-12 items-center">
        {/* Featured Image */}
        <div className="relative overflow-hidden aspect-[4/3] md:aspect-square">
          <img
            src={IMAGES.blog}
            alt="Bàn cà phê thời trang với tạp chí và vải linen cao cấp"
            className="w-full h-full object-cover hover:scale-105 transition-transform duration-1000"
          />
        </div>

        {/* Featured Content */}
        <div className="flex flex-col justify-center">
          <span className="font-label text-[14px] font-semibold text-on-surface-variant uppercase tracking-[0.1em] mb-4">
            Editorial
          </span>
          <h3 className="font-headline text-[32px] md:text-[48px] font-semibold text-primary mb-6 leading-tight">
            Nghệ thuật tối giản trong tủ đồ hiện đại
          </h3>
          <p className="font-body text-[16px] text-on-surface-variant mb-8 leading-relaxed">
            Khám phá cách xây dựng một tủ đồ &apos;capsule&apos; hoàn hảo với những item cơ bản nhưng đầy
            uy quyền. Sự tinh tế bắt nguồn từ việc lược bỏ những thứ không cần thiết.
          </p>
          <a
            href="#"
            className="inline-flex items-center text-primary font-label text-[14px] font-semibold uppercase tracking-widest hover:text-secondary-fixed-dim transition-colors group w-fit"
          >
            Đọc tiếp
            <span className="material-symbols-outlined ml-2 transform group-hover:translate-x-1 transition-transform">
              arrow_right_alt
            </span>
          </a>
        </div>
      </div>
    </section>
  )
}

/* ---------- Newsletter Section ---------- */
function NewsletterSection() {
  const [email, setEmail] = useState('')

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    if (email) {
      alert(`Cảm ơn bạn đã đăng ký! Email: ${email}`)
      setEmail('')
    }
  }

  return (
    <section className="py-24 bg-tertiary text-on-tertiary px-margin-mobile md:px-margin-desktop text-center">
      <div className="max-w-2xl mx-auto">
        <span className="material-symbols-outlined text-[32px] mb-6 text-secondary-container">
          mail
        </span>
        <h2 className="font-headline text-[32px] font-medium mb-4">
          Tham gia cùng AMAZING
        </h2>
        <p className="font-body text-[16px] text-surface-variant mb-10">
          Đăng ký nhận bản tin để nhận voucher 10% cho đơn hàng đầu tiên và cập nhật những bộ sưu
          tập mới nhất.
        </p>
        <form
          onSubmit={handleSubmit}
          className="flex flex-col sm:flex-row gap-4 justify-center max-w-md mx-auto"
        >
          <input
            type="email"
            value={email}
            onChange={(e) => setEmail(e.target.value)}
            placeholder="Địa chỉ email của bạn"
            className="bg-transparent border-b border-surface-variant text-on-tertiary px-0 py-3 font-body text-[16px] focus:outline-none focus:border-secondary-container w-full placeholder:text-surface-variant/50 transition-colors"
            required
          />
          <Button
            variant="primary"
            size="md"
            className="mt-4 sm:mt-0"
            onClick={() => {}}
          >
            Đăng ký
          </Button>
        </form>
      </div>
    </section>
  )
}

/* ---------- HomePage ---------- */
export default function HomePage() {
  return (
    <>
      <HeroSection />
      <CategoriesSection />
      <AboutSection />
      <BlogSection />
      <NewsletterSection />
    </>
  )
}
