import { useEffect, useMemo, useState, type ChangeEvent } from 'react'

import Button from '../../components/Button'
import Modal from '../../components/Modal'

import {
  getBannerItems,
  getBlogPosts,
  removeBannerItem,
  removeBlogPost,
  saveBannerItem,
  saveBlogPost,
  type BannerItem,
  type BlogPost,
  type ContentStatus,
} from '../../services/contentApi'

type ContentTab = 'blog' | 'banner'

interface BlogDraft {
  title: string
  slug: string
  category: string
  excerpt: string
  content: string
  status: ContentStatus
  publishFrom: string
  publishTo: string
  image: string
}

interface BannerDraft {
  title: string
  placement: string
  ctaLabel: string
  link: string
  status: ContentStatus
  publishFrom: string
  publishTo: string
  image: string
}

const today = new Date().toISOString().slice(0, 10)
const defaultBlogImage = '/images/auth/login-editorial.png'
const defaultBannerImage = '/images/auth/register-editorial.png'

function statusClasses(status: ContentStatus) {
  switch (status) {
    case 'Published':
      return 'bg-secondary-container text-on-secondary-container'
    case 'Scheduled':
      return 'bg-tertiary text-on-tertiary'
    case 'Draft':
      return 'bg-outline-variant text-on-surface-variant'
  }
}

function formatRange(from: string, to: string) {
  if (!from && !to) return 'Chưa thiết lập'
  if (!to) return from
  return `${from} - ${to}`
}

function emptyBlogDraft(): BlogDraft {
  return {
    title: '',
    slug: '',
    category: 'Styling',
    excerpt: '',
    content: '',
    status: 'Draft',
    publishFrom: today,
    publishTo: '',
    image: defaultBlogImage,
  }
}

function emptyBannerDraft(): BannerDraft {
  return {
    title: '',
    placement: 'Homepage Hero',
    ctaLabel: '',
    link: '',
    status: 'Draft',
    publishFrom: today,
    publishTo: '',
    image: defaultBannerImage,
  }
}

function StatCard({ label, value, hint, icon }: { label: string; value: string; hint: string; icon: string }) {
  return (
    <div className="border border-outline-variant bg-surface-container-lowest p-6">
      <div className="flex items-start justify-between gap-4 mb-4">
        <div className="p-3 bg-tertiary-container text-on-tertiary">
          <span className="material-symbols-outlined">{icon}</span>
        </div>
        <span className="font-label text-caption uppercase tracking-widest text-on-surface-variant">
          {hint}
        </span>
      </div>
      <p className="font-body text-label-md uppercase tracking-widest text-on-surface-variant mb-1">
        {label}
      </p>
      <h3 className="text-headline-md font-bold text-primary">{value}</h3>
    </div>
  )
}

export default function ContentManagementPage() {
  const [tab, setTab] = useState<ContentTab>('blog')
  const [blogs, setBlogs] = useState<BlogPost[]>([])
  const [banners, setBanners] = useState<BannerItem[]>([])
  const [isEditorOpen, setIsEditorOpen] = useState(false)
  const [editingBlogId, setEditingBlogId] = useState<string | null>(null)
  const [editingBannerId, setEditingBannerId] = useState<string | null>(null)
  const [blogDraft, setBlogDraft] = useState<BlogDraft>(emptyBlogDraft)
  const [bannerDraft, setBannerDraft] = useState<BannerDraft>(emptyBannerDraft)
  const [isLoading, setIsLoading] = useState(true)
  const [isSaving, setIsSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)

  useEffect(() => {
    let isMounted = true

    setIsLoading(true)
    setError(null)

    Promise.all([getBlogPosts(), getBannerItems()])
      .then(([blogItems, bannerItems]) => {
        if (!isMounted) return
        setBlogs(blogItems)
        setBanners(bannerItems)
      })
      .catch(() => {
        if (!isMounted) return
        setError('Không thể tải nội dung. Hệ thống đang dùng dữ liệu dự phòng cục bộ.')
      })
      .finally(() => {
        if (!isMounted) return
        setIsLoading(false)
      })

    return () => {
      isMounted = false
    }
  }, [])

  const stats = useMemo(() => {
    const scheduledContent = [...blogs, ...banners].filter((item) => item.status === 'Scheduled').length
    return {
      totalBlogs: blogs.length,
      activeBanners: banners.filter((item) => item.status === 'Published').length,
      scheduledContent,
      draftQueue: [...blogs, ...banners].filter((item) => item.status === 'Draft').length,
    }
  }, [blogs, banners])

  const openBlogEditor = (blog?: BlogPost) => {
    if (blog) {
      setEditingBlogId(blog.id)
      setEditingBannerId(null)
      setBlogDraft({
        title: blog.title,
        slug: blog.slug,
        category: blog.category,
        excerpt: blog.excerpt,
        content: blog.content,
        status: blog.status,
        publishFrom: blog.publishFrom,
        publishTo: blog.publishTo,
        image: blog.image,
      })
    } else {
      setEditingBlogId(null)
      setEditingBannerId(null)
      setBlogDraft(emptyBlogDraft())
    }
    setTab('blog')
    setIsEditorOpen(true)
  }

  const openBannerEditor = (banner?: BannerItem) => {
    if (banner) {
      setEditingBannerId(banner.id)
      setEditingBlogId(null)
      setBannerDraft({
        title: banner.title,
        placement: banner.placement,
        ctaLabel: banner.ctaLabel,
        link: banner.link,
        status: banner.status,
        publishFrom: banner.publishFrom,
        publishTo: banner.publishTo,
        image: banner.image,
      })
    } else {
      setEditingBannerId(null)
      setEditingBlogId(null)
      setBannerDraft(emptyBannerDraft())
    }
    setTab('banner')
    setIsEditorOpen(true)
  }

  const closeEditor = () => {
    setIsEditorOpen(false)
    setEditingBlogId(null)
    setEditingBannerId(null)
  }

  const handleBlogImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBlogDraft((current) => ({ ...current, image: URL.createObjectURL(file) }))
  }

  const handleBannerImageChange = (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return
    setBannerDraft((current) => ({ ...current, image: URL.createObjectURL(file) }))
  }

  const saveBlog = async () => {
    const nextBlog: BlogPost = {
      id: editingBlogId ?? `blog-${Date.now()}`,
      title: blogDraft.title,
      slug: blogDraft.slug,
      category: blogDraft.category,
      excerpt: blogDraft.excerpt,
      content: blogDraft.content,
      status: blogDraft.status,
      publishFrom: blogDraft.publishFrom,
      publishTo: blogDraft.publishTo,
      image: blogDraft.image,
    }

    setIsSaving(true)
    try {
      const savedBlog = await saveBlogPost(nextBlog)
      setBlogs((current) =>
        editingBlogId
          ? current.map((item) => (item.id === editingBlogId ? savedBlog : item))
          : [savedBlog, ...current],
      )
      closeEditor()
    } finally {
      setIsSaving(false)
    }
  }

  const saveBanner = async () => {
    const nextBanner: BannerItem = {
      id: editingBannerId ?? `banner-${Date.now()}`,
      title: bannerDraft.title,
      placement: bannerDraft.placement,
      ctaLabel: bannerDraft.ctaLabel,
      link: bannerDraft.link,
      status: bannerDraft.status,
      publishFrom: bannerDraft.publishFrom,
      publishTo: bannerDraft.publishTo,
      image: bannerDraft.image,
    }

    setIsSaving(true)
    try {
      const savedBanner = await saveBannerItem(nextBanner)
      setBanners((current) =>
        editingBannerId
          ? current.map((item) => (item.id === editingBannerId ? savedBanner : item))
          : [savedBanner, ...current],
      )
      closeEditor()
    } finally {
      setIsSaving(false)
    }
  }

  const deleteBlog = async (id: string) => {
    const target = blogs.find((item) => item.id === id)
    if (!target) return
    if (!window.confirm(`Xóa bài viết "${target.title}"?`)) return
    await removeBlogPost(id)
    setBlogs((current) => current.filter((item) => item.id !== id))
  }

  const deleteBanner = async (id: string) => {
    const target = banners.find((item) => item.id === id)
    if (!target) return
    if (!window.confirm(`Xóa banner "${target.title}"?`)) return
    await removeBannerItem(id)
    setBanners((current) => current.filter((item) => item.id !== id))
  }

  if (isLoading) {
    return (
      <div className="min-h-[50vh] flex items-center justify-center border border-outline-variant bg-surface-container-lowest">
        <div className="flex items-center gap-3 font-label uppercase tracking-widest text-on-surface-variant">
          <span className="material-symbols-outlined animate-spin">progress_activity</span>
          Đang tải nội dung...
        </div>
      </div>
    )
  }

  return (
    <div className="flex flex-col gap-10">
      <section className="flex flex-col lg:flex-row lg:items-end justify-between gap-8">
        <div>
          <p className="font-label text-caption uppercase tracking-[0.3em] text-on-surface-variant mb-4">
            Admin / Content Management
          </p>
          <h2 className="text-display-lg-mobile md:text-headline-lg font-bold text-primary mb-4">
            Quản lý nội dung hiển thị trên website
          </h2>
          <p className="max-w-3xl font-body text-body-md text-on-surface-variant leading-relaxed">
            Quản lý bài viết blog, banner trang chủ, hình ảnh và lịch hiển thị để đồng bộ thông điệp
            thương hiệu trên toàn site.
          </p>
          {error && (
            <p className="mt-4 inline-flex border border-outline-variant bg-surface-container-low px-4 py-2 font-body text-caption text-on-surface-variant">
              {error}
            </p>
          )}
        </div>
        <div className="flex flex-wrap gap-3">
          <Button variant="outline" onClick={() => openBannerEditor()} disabled={isSaving}>
            Thêm banner
          </Button>
          <Button onClick={() => openBlogEditor()} disabled={isSaving}>
            Thêm bài viết
          </Button>
        </div>
      </section>

      <section className="grid grid-cols-1 md:grid-cols-2 xl:grid-cols-4 gap-6">
        <StatCard label="Bài blog" value={`${stats.totalBlogs}`} hint="Nội dung" icon="article" />
        <StatCard label="Banner đang chạy" value={`${stats.activeBanners}`} hint="Homepage" icon="crop_free" />
        <StatCard label="Lịch đăng" value={`${stats.scheduledContent}`} hint="Scheduled" icon="event_upcoming" />
        <StatCard label="Bản nháp" value={`${stats.draftQueue}`} hint="Draft" icon="edit_note" />
      </section>

      <section className="border border-outline-variant bg-surface-container-lowest">
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 p-4 md:p-6 border-b border-outline-variant">
          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={() => setTab('blog')}
              className={`px-4 py-2 font-label text-[12px] uppercase tracking-[0.2em] transition-colors ${tab === 'blog'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
            >
              Blog
            </button>
            <button
              type="button"
              onClick={() => setTab('banner')}
              className={`px-4 py-2 font-label text-[12px] uppercase tracking-[0.2em] transition-colors ${tab === 'banner'
                  ? 'bg-primary text-on-primary'
                  : 'border border-outline-variant text-on-surface-variant hover:border-primary hover:text-primary'
                }`}
            >
              Banner trang chủ
            </button>
          </div>
          <p className="font-body text-caption uppercase tracking-[0.25em] text-on-surface-variant">
            Upload ảnh, đặt trạng thái và thời gian hiển thị ngay trên một màn hình.
          </p>
        </div>

        {tab === 'blog' ? (
          <div className="grid grid-cols-1 xl:grid-cols-[1.3fr_0.7fr] gap-0">
            <div className="overflow-x-auto border-b xl:border-b-0 xl:border-r border-outline-variant">
              <table className="w-full text-left border-collapse">
                <thead className="bg-surface-container-low">
                  <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant">
                    <th className="p-4 md:p-6 font-semibold">Bài viết</th>
                    <th className="p-4 md:p-6 font-semibold">Trạng thái</th>
                    <th className="p-4 md:p-6 font-semibold">Thời gian</th>
                    <th className="p-4 md:p-6 font-semibold text-right">Thao tác</th>
                  </tr>
                </thead>
                <tbody className="divide-y divide-outline-variant">
                  {blogs.map((blog) => (
                    <tr key={blog.id} className="align-top hover:bg-surface-container-low/70 transition-colors">
                      <td className="p-4 md:p-6">
                        <div className="flex gap-4 items-start">
                          <img
                            src={blog.image}
                            alt={blog.title}
                            className="w-20 h-20 object-cover border border-outline-variant"
                          />
                          <div className="min-w-0">
                            <p className="font-headline text-body-md font-semibold text-primary">{blog.title}</p>
                            <p className="font-body text-caption text-on-surface-variant uppercase tracking-widest mt-1">
                              {blog.category} • /blog/{blog.slug}
                            </p>
                            <p className="font-body text-body-sm text-on-surface-variant mt-2 line-clamp-2">
                              {blog.excerpt}
                            </p>
                          </div>
                        </div>
                      </td>
                      <td className="p-4 md:p-6">
                        <span
                          className={`inline-flex px-3 py-1 text-caption font-bold uppercase tracking-wider ${statusClasses(blog.status)}`}
                        >
                          {blog.status}
                        </span>
                      </td>
                      <td className="p-4 md:p-6 text-body-sm text-on-surface-variant">
                        <p>{formatRange(blog.publishFrom, blog.publishTo)}</p>
                      </td>
                      <td className="p-4 md:p-6">
                        <div className="flex justify-end gap-2">
                          <button
                            type="button"
                            onClick={() => openBlogEditor(blog)}
                            className="px-3 py-2 border border-outline-variant text-caption uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                          >
                            Sửa
                          </button>
                          <button
                            type="button"
                            onClick={() => deleteBlog(blog.id)}
                            className="px-3 py-2 border border-outline-variant text-caption uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors"
                          >
                            Xóa
                          </button>
                        </div>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-6 md:p-8 bg-surface-container-low">
              <h3 className="text-headline-md font-bold text-primary mb-4">Quy tắc xuất bản blog</h3>
              <div className="space-y-4 text-body-md text-on-surface-variant leading-relaxed">
                <p>
                  Bản nháp cho phép kiểm duyệt nội dung trước khi lên lịch, còn Scheduled sẽ tự động
                  chuyển sang hiển thị theo khung thời gian đã thiết lập.
                </p>
                <p>
                  Hình ảnh nên đồng bộ theo tỷ lệ 4:3 hoặc 1:1 để giữ chất lượng hiển thị trên homepage,
                  blog list và các block editorial.
                </p>
                <div className="border border-outline-variant bg-background p-4">
                  <p className="font-label text-caption uppercase tracking-[0.25em] text-on-surface-variant mb-2">
                    Trạng thái đề xuất
                  </p>
                  <ul className="space-y-2 text-body-sm">
                    <li>• Draft: nội dung đang chỉnh sửa</li>
                    <li>• Scheduled: đã duyệt và chờ đăng</li>
                    <li>• Published: đang hiển thị trên website</li>
                  </ul>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="overflow-x-auto">
            <table className="w-full text-left border-collapse">
              <thead className="bg-surface-container-low">
                <tr className="font-body text-label-md uppercase tracking-wider text-on-surface-variant">
                  <th className="p-4 md:p-6 font-semibold">Banner</th>
                  <th className="p-4 md:p-6 font-semibold">Trạng thái</th>
                  <th className="p-4 md:p-6 font-semibold">Thời gian</th>
                  <th className="p-4 md:p-6 font-semibold text-right">Thao tác</th>
                </tr>
              </thead>
              <tbody className="divide-y divide-outline-variant">
                {banners.map((banner) => (
                  <tr key={banner.id} className="align-top hover:bg-surface-container-low/70 transition-colors">
                    <td className="p-4 md:p-6">
                      <div className="flex gap-4 items-start">
                        <img
                          src={banner.image}
                          alt={banner.title}
                          className="w-24 h-16 object-cover border border-outline-variant"
                        />
                        <div className="min-w-0">
                          <p className="font-headline text-body-md font-semibold text-primary">{banner.title}</p>
                          <p className="font-body text-caption text-on-surface-variant uppercase tracking-widest mt-1">
                            {banner.placement}
                          </p>
                          <p className="font-body text-body-sm text-on-surface-variant mt-2 break-all">
                            {banner.ctaLabel} • {banner.link}
                          </p>
                        </div>
                      </div>
                    </td>
                    <td className="p-4 md:p-6">
                      <span
                        className={`inline-flex px-3 py-1 text-caption font-bold uppercase tracking-wider ${statusClasses(banner.status)}`}
                      >
                        {banner.status}
                      </span>
                    </td>
                    <td className="p-4 md:p-6 text-body-sm text-on-surface-variant">
                      <p>{formatRange(banner.publishFrom, banner.publishTo)}</p>
                    </td>
                    <td className="p-4 md:p-6">
                      <div className="flex justify-end gap-2">
                        <button
                          type="button"
                          onClick={() => openBannerEditor(banner)}
                          className="px-3 py-2 border border-outline-variant text-caption uppercase tracking-widest hover:border-primary hover:text-primary transition-colors"
                        >
                          Sửa
                        </button>
                        <button
                          type="button"
                          onClick={() => deleteBanner(banner.id)}
                          className="px-3 py-2 border border-outline-variant text-caption uppercase tracking-widest hover:border-secondary hover:text-secondary transition-colors"
                        >
                          Xóa
                        </button>
                      </div>
                    </td>
                  </tr>
                ))}
              </tbody>
            </table>
          </div>
        )}
      </section>

      <Modal
        isOpen={isEditorOpen}
        onClose={closeEditor}
        title={editingBannerId || tab === 'banner' ? 'Quản lý banner' : 'Quản lý bài viết blog'}
        maxWidth="max-w-5xl"
      >
        {editingBannerId || tab === 'banner' ? (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Tiêu đề banner
                </label>
                <input
                  value={bannerDraft.title}
                  onChange={(event) => setBannerDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Summer Luxury Drop"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Vị trí hiển thị
                  </label>
                  <select
                    value={bannerDraft.placement}
                    onChange={(event) => setBannerDraft((current) => ({ ...current, placement: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  >
                    <option>Homepage Hero</option>
                    <option>Mid-page Banner</option>
                    <option>Footer Banner</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={bannerDraft.status}
                    onChange={(event) =>
                      setBannerDraft((current) => ({ ...current, status: event.target.value as ContentStatus }))
                    }
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Bắt đầu hiển thị
                  </label>
                  <input
                    type="date"
                    value={bannerDraft.publishFrom}
                    onChange={(event) => setBannerDraft((current) => ({ ...current, publishFrom: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Kết thúc hiển thị
                  </label>
                  <input
                    type="date"
                    value={bannerDraft.publishTo}
                    onChange={(event) => setBannerDraft((current) => ({ ...current, publishTo: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  CTA label
                </label>
                <input
                  value={bannerDraft.ctaLabel}
                  onChange={(event) => setBannerDraft((current) => ({ ...current, ctaLabel: event.target.value }))}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Khám phá ngay"
                />
              </div>

              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Link điều hướng
                </label>
                <input
                  value={bannerDraft.link}
                  onChange={(event) => setBannerDraft((current) => ({ ...current, link: event.target.value }))}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="/collections/new-arrivals"
                />
              </div>

              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Upload hình ảnh
                </label>
                <input
                  type="file"
                  accept="image/*"
                  onChange={handleBannerImageChange}
                  className="w-full text-body-sm text-on-surface-variant"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={closeEditor} disabled={isSaving}>
                  Hủy
                </Button>
                <Button onClick={saveBanner} disabled={isSaving}>
                  {isSaving ? 'Đang lưu...' : editingBannerId ? 'Cập nhật banner' : 'Tạo banner'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label text-caption uppercase tracking-[0.25em] text-on-surface-variant">
                Xem trước banner
              </p>
              <div className="border border-outline-variant bg-surface-container-low overflow-hidden">
                <img
                  src={bannerDraft.image}
                  alt={bannerDraft.title || 'Banner preview'}
                  className="w-full aspect-[16/9] object-cover"
                />
                <div className="p-6 space-y-3">
                  <p className="font-body text-caption uppercase tracking-widest text-on-surface-variant">
                    {bannerDraft.placement}
                  </p>
                  <h3 className="text-headline-md font-bold text-primary">
                    {bannerDraft.title || 'Tiêu đề banner'}
                  </h3>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {bannerDraft.ctaLabel || 'CTA sẽ hiển thị ở đây'}
                  </p>
                  <p className="font-body text-caption text-on-surface-variant break-all">{bannerDraft.link || 'Link điều hướng'}</p>
                  <span className={`inline-flex px-3 py-1 text-caption font-bold uppercase tracking-wider ${statusClasses(bannerDraft.status)}`}>
                    {bannerDraft.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        ) : (
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-8">
            <div className="space-y-5">
              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Tiêu đề bài viết
                </label>
                <input
                  value={blogDraft.title}
                  onChange={(event) => setBlogDraft((current) => ({ ...current, title: event.target.value }))}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  placeholder="Nghệ thuật layering cho mùa chuyển mùa"
                />
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Slug
                  </label>
                  <input
                    value={blogDraft.slug}
                    onChange={(event) => setBlogDraft((current) => ({ ...current, slug: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                    placeholder="nghe-thuat-layering"
                  />
                </div>
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Danh mục
                  </label>
                  <input
                    value={blogDraft.category}
                    onChange={(event) => setBlogDraft((current) => ({ ...current, category: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                    placeholder="Styling"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Trạng thái
                  </label>
                  <select
                    value={blogDraft.status}
                    onChange={(event) =>
                      setBlogDraft((current) => ({ ...current, status: event.target.value as ContentStatus }))
                    }
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  >
                    <option value="Draft">Draft</option>
                    <option value="Scheduled">Scheduled</option>
                    <option value="Published">Published</option>
                  </select>
                </div>
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Upload hình ảnh
                  </label>
                  <input
                    type="file"
                    accept="image/*"
                    onChange={handleBlogImageChange}
                    className="w-full text-body-sm text-on-surface-variant"
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Bắt đầu hiển thị
                  </label>
                  <input
                    type="date"
                    value={blogDraft.publishFrom}
                    onChange={(event) => setBlogDraft((current) => ({ ...current, publishFrom: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
                <div>
                  <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                    Kết thúc hiển thị
                  </label>
                  <input
                    type="date"
                    value={blogDraft.publishTo}
                    onChange={(event) => setBlogDraft((current) => ({ ...current, publishTo: event.target.value }))}
                    className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary"
                  />
                </div>
              </div>

              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Mô tả ngắn
                </label>
                <textarea
                  value={blogDraft.excerpt}
                  onChange={(event) => setBlogDraft((current) => ({ ...current, excerpt: event.target.value }))}
                  rows={3}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary resize-none"
                  placeholder="Tóm tắt ngắn gọn cho card blog"
                />
              </div>

              <div>
                <label className="block font-label text-caption uppercase tracking-widest text-on-surface-variant mb-2">
                  Nội dung bài viết
                </label>
                <textarea
                  value={blogDraft.content}
                  onChange={(event) => setBlogDraft((current) => ({ ...current, content: event.target.value }))}
                  rows={6}
                  className="w-full border border-outline-variant bg-transparent px-4 py-3 focus:outline-none focus:border-primary resize-none"
                  placeholder="Nội dung bài viết đầy đủ"
                />
              </div>

              <div className="flex gap-3 pt-2">
                <Button variant="outline" onClick={closeEditor} disabled={isSaving}>
                  Hủy
                </Button>
                <Button onClick={saveBlog} disabled={isSaving}>
                  {isSaving ? 'Đang lưu...' : editingBlogId ? 'Cập nhật bài viết' : 'Tạo bài viết'}
                </Button>
              </div>
            </div>

            <div className="space-y-4">
              <p className="font-label text-caption uppercase tracking-[0.25em] text-on-surface-variant">
                Xem trước bài viết
              </p>
              <div className="border border-outline-variant bg-surface-container-low overflow-hidden">
                <img
                  src={blogDraft.image}
                  alt={blogDraft.title || 'Blog preview'}
                  className="w-full aspect-[4/3] object-cover"
                />
                <div className="p-6 space-y-3">
                  <p className="font-body text-caption uppercase tracking-widest text-on-surface-variant">
                    {blogDraft.category}
                  </p>
                  <h3 className="text-headline-md font-bold text-primary">
                    {blogDraft.title || 'Tiêu đề bài viết'}
                  </h3>
                  <p className="font-body text-body-md text-on-surface-variant">
                    {blogDraft.excerpt || 'Mô tả ngắn sẽ hiển thị ở đây'}
                  </p>
                  <p className="font-body text-caption text-on-surface-variant break-all">
                    /blog/{blogDraft.slug || 'slug-bai-viet'}
                  </p>
                  <span className={`inline-flex px-3 py-1 text-caption font-bold uppercase tracking-wider ${statusClasses(blogDraft.status)}`}>
                    {blogDraft.status}
                  </span>
                </div>
              </div>
            </div>
          </div>
        )}
      </Modal>
    </div>
  )
}