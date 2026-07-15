import axios from 'axios'

export type ContentStatus = 'Draft' | 'Published' | 'Scheduled'

export interface BlogPost {
  id: string
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

export interface BannerItem {
  id: string
  title: string
  placement: string
  ctaLabel: string
  link: string
  status: ContentStatus
  publishFrom: string
  publishTo: string
  image: string
}

const BLOG_STORAGE_KEY = 'amazing_content_blogs'
const BANNER_STORAGE_KEY = 'amazing_content_banners'

const DEFAULT_BLOG_IMAGE = '/images/auth/login-editorial.png'
const DEFAULT_BANNER_IMAGE = '/images/auth/register-editorial.png'

const today = new Date().toISOString().slice(0, 10)

const seedBlogs: BlogPost[] = [
  {
    id: 'blog-1',
    title: 'Nghệ thuật layering cho mùa chuyển mùa',
    slug: 'nghe-thuat-layering-mua-chuyen-mua',
    category: 'Styling',
    excerpt: 'Gợi ý phối lớp tinh gọn cho những ngày đầu mùa để giữ sự linh hoạt và thanh lịch.',
    content:
      'Bài viết hướng dẫn cách phối áo khoác mỏng, sơ mi và knitwear theo từng bối cảnh sử dụng.',
    status: 'Published',
    publishFrom: '2026-06-18',
    publishTo: '2026-07-31',
    image: DEFAULT_BLOG_IMAGE,
  },
  {
    id: 'blog-2',
    title: 'Cấu trúc tủ đồ capsule cho nam giới hiện đại',
    slug: 'capsule-wardrobe-nam-gioi',
    category: 'Editorial',
    excerpt: 'Xây dựng bộ sưu tập tối giản nhưng đủ dùng cho công việc, hẹn hò và du lịch.',
    content: 'Đề xuất 12 món đồ chủ lực và cách tối ưu phối đồ theo tuần.',
    status: 'Draft',
    publishFrom: today,
    publishTo: '',
    image: DEFAULT_BLOG_IMAGE,
  },
  {
    id: 'blog-3',
    title: '5 cách làm mới trang phục công sở với phụ kiện nhỏ',
    slug: 'lam-moi-trang-phuc-cong-so',
    category: 'Fashion Tips',
    excerpt: 'Tạo điểm nhấn tinh tế bằng thắt lưng, khăn lụa và túi xách theo gam màu trung tính.',
    content: 'Bài viết phù hợp cho lịch đăng bài định kỳ vào giữa tuần.',
    status: 'Scheduled',
    publishFrom: '2026-07-10',
    publishTo: '2026-07-28',
    image: DEFAULT_BLOG_IMAGE,
  },
]

const seedBanners: BannerItem[] = [
  {
    id: 'banner-1',
    title: 'Summer Luxury Drop',
    placement: 'Homepage Hero',
    ctaLabel: 'Khám phá ngay',
    link: '/collections/new-arrivals',
    status: 'Published',
    publishFrom: '2026-07-01',
    publishTo: '2026-07-31',
    image: DEFAULT_BANNER_IMAGE,
  },
  {
    id: 'banner-2',
    title: 'Editorial Spotlight',
    placement: 'Mid-page Banner',
    ctaLabel: 'Đọc blog',
    link: '/blog',
    status: 'Scheduled',
    publishFrom: '2026-07-12',
    publishTo: '2026-08-05',
    image: DEFAULT_BANNER_IMAGE,
  },
  {
    id: 'banner-3',
    title: 'Members Only Offer',
    placement: 'Footer Banner',
    ctaLabel: 'Nhận ưu đãi',
    link: '/register',
    status: 'Draft',
    publishFrom: today,
    publishTo: '',
    image: DEFAULT_BANNER_IMAGE,
  },
]

const apiBase = import.meta.env.VITE_API_BASE_URL?.replace(/\/$/, '') ?? ''

function canUseBrowserStorage() {
  return typeof window !== 'undefined'
}

function readCollection<T>(storageKey: string, seed: T[]): T[] {
  if (!canUseBrowserStorage()) return seed

  try {
    const raw = window.localStorage.getItem(storageKey)
    return raw ? (JSON.parse(raw) as T[]) : seed
  } catch {
    return seed
  }
}

function writeCollection<T>(storageKey: string, items: T[]) {
  if (!canUseBrowserStorage()) return

  window.localStorage.setItem(storageKey, JSON.stringify(items))
}

function buildUrl(path: string) {
  return `${apiBase}/${path.replace(/^\//, '')}`
}

async function loadRemote<T>(path: string) {
  if (!apiBase) throw new Error('API base URL is not configured')
  const response = await axios.get<T>(buildUrl(path))
  return response.data
}

async function upsertRemote<T>(path: string, id: string | null, payload: T) {
  if (!apiBase) throw new Error('API base URL is not configured')

  const response = id
    ? await axios.put<T>(buildUrl(`${path}/${id}`), payload)
    : await axios.post<T>(buildUrl(path), payload)

  return response.data
}

async function deleteRemote(path: string, id: string) {
  if (!apiBase) throw new Error('API base URL is not configured')
  await axios.delete(buildUrl(`${path}/${id}`))
}

export async function getBlogPosts() {
  try {
    return await loadRemote<BlogPost[]>('content/blogs')
  } catch {
    return readCollection<BlogPost>(BLOG_STORAGE_KEY, seedBlogs)
  }
}

export async function saveBlogPost(blog: BlogPost) {
  try {
    const saved = await upsertRemote<BlogPost>('content/blogs', blog.id, blog)
    return saved
  } catch {
    const current = readCollection<BlogPost>(BLOG_STORAGE_KEY, seedBlogs)
    const next = current.some((item) => item.id === blog.id)
      ? current.map((item) => (item.id === blog.id ? blog : item))
      : [blog, ...current]
    writeCollection(BLOG_STORAGE_KEY, next)
    return blog
  }
}

export async function removeBlogPost(id: string) {
  try {
    await deleteRemote('content/blogs', id)
  } catch {
    const current = readCollection<BlogPost>(BLOG_STORAGE_KEY, seedBlogs)
    writeCollection(
      BLOG_STORAGE_KEY,
      current.filter((item) => item.id !== id),
    )
  }
}

export async function getBannerItems() {
  try {
    return await loadRemote<BannerItem[]>('content/banners')
  } catch {
    return readCollection<BannerItem>(BANNER_STORAGE_KEY, seedBanners)
  }
}

export async function saveBannerItem(banner: BannerItem) {
  try {
    const saved = await upsertRemote<BannerItem>('content/banners', banner.id, banner)
    return saved
  } catch {
    const current = readCollection<BannerItem>(BANNER_STORAGE_KEY, seedBanners)
    const next = current.some((item) => item.id === banner.id)
      ? current.map((item) => (item.id === banner.id ? banner : item))
      : [banner, ...current]
    writeCollection(BANNER_STORAGE_KEY, next)
    return banner
  }
}

export async function removeBannerItem(id: string) {
  try {
    await deleteRemote('content/banners', id)
  } catch {
    const current = readCollection<BannerItem>(BANNER_STORAGE_KEY, seedBanners)
    writeCollection(
      BANNER_STORAGE_KEY,
      current.filter((item) => item.id !== id),
    )
  }
}
