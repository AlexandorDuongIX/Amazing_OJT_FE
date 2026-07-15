import { useParams, Link } from 'react-router-dom'
import { staticBlogs } from './staticBlogs'
import Button from '../../../components/Button'

export default function BlogDetailPage() {
    const { id } = useParams()

    const blogs = staticBlogs

    const blog = blogs.find(
        (x) => x.id === Number(id)
    )

    if (!blog) {
        return (
            <div className="max-w-[1280px] mx-auto px-[80px] py-[96px]">
                <h1 className="font-headline text-[36px] font-semibold text-primary mb-6">
                    Không tìm thấy bài viết
                </h1>
                <Button variant="outline" size="sm" href="/blogs">
                    Quay lại Blog
                </Button>
            </div>
        )
    }

    const relatedBlogs = blogs
        .filter((x) => x.id !== blog.id)
        .slice(0, 3)

    return (
        <div className="max-w-[1280px] mx-auto px-[80px] py-[96px]">

            <Link
                to="/blogs"
                className="inline-flex items-center gap-2 font-label text-[13px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors mb-8"
            >
                ← Quay lại danh sách Blog
            </Link>

            <h1 className="font-headline text-[48px] font-semibold text-primary mt-4 mb-3">
                {blog.title}
            </h1>

            <p className="font-label text-[12px] uppercase tracking-wider text-muted mb-8">
                Ngày đăng: {blog.createdAt}
            </p>

            <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-[500px] object-cover mb-8"
            />

            <div className="bg-surface-container-lowest border border-outline-variant/30 p-8">

                <h2 className="font-headline text-[24px] font-semibold text-primary mb-4">
                    Tóm tắt
                </h2>

                <p className="font-body text-[16px] text-on-surface-variant mb-8 leading-relaxed">
                    {blog.summary}
                </p>

                <h2 className="font-headline text-[24px] font-semibold text-primary mb-4">
                    Nội dung
                </h2>

                <div className="font-body text-[16px] leading-8 text-on-surface-variant whitespace-pre-wrap">
                    {blog.content}
                </div>

            </div>

            {relatedBlogs.length > 0 && (

                <div className="mt-16">

                    <h2 className="font-headline text-[32px] font-semibold text-primary mb-8">
                        Bài viết liên quan
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {relatedBlogs.map((item) => (

                            <div
                                key={item.id}
                                className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-5">

                                    <h3 className="font-headline text-[18px] font-semibold text-primary mb-3">
                                        {item.title}
                                    </h3>

                                    <Link
                                        to={`/blog/${item.id}`}
                                        className="font-label text-[12px] uppercase tracking-wider text-on-surface-variant hover:text-primary transition-colors"
                                    >
                                        Đọc tiếp →
                                    </Link>

                                </div>
                            </div>

                        ))}

                    </div>

                </div>

            )}

        </div>
    )
}