import { useState } from 'react'
import { Link } from 'react-router-dom'
import { staticBlogs } from './staticBlogs'
import Button from '../../../components/Button'

export default function BlogListPage() {
    const [blogs] = useState(staticBlogs)
    const [keyword, setKeyword] = useState('')

    const filteredBlogs = blogs.filter((blog) =>
        blog.title
            .toLowerCase()
            .includes(keyword.toLowerCase())
    )

    return (
        <div className="max-w-[1280px] mx-auto px-[80px] py-[96px]">

            <h1 className="font-headline text-[48px] font-semibold text-primary mb-8">
                Blog Thời Trang
            </h1>

            <div className="mb-8">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={keyword}
                    onChange={(e) => setKeyword(e.target.value)}
                    className="w-full md:w-96 border border-outline-variant px-4 py-2.5 font-label text-[14px] text-on-surface-variant outline-none transition-colors hover:border-primary focus:border-primary bg-surface"
                />
            </div>

            {filteredBlogs.length === 0 ? (
                <div className="text-center py-20 font-label text-[16px] text-muted">
                    Chưa có bài viết nào.
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-8">
                    {filteredBlogs.map((blog) => (
                        <div
                            key={blog.id}
                            className="bg-surface-container-lowest border border-outline-variant/30 shadow-sm overflow-hidden hover:shadow-md transition-shadow"
                        >
                            <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-60 object-cover"
                            />

                            <div className="p-6">
                                <h2 className="font-headline text-[20px] font-semibold text-primary mb-2">
                                    {blog.title}
                                </h2>

                                <p className="font-label text-[12px] text-muted mb-3 uppercase tracking-wider">
                                    {blog.createdAt}
                                </p>

                                <p className="font-body text-[14px] text-on-surface-variant mb-5 line-clamp-3">
                                    {blog.summary}
                                </p>

                                <Button variant="primary" size="sm">
                                    <Link to={`/blog/${blog.id}`}>Xem chi tiết</Link>
                                </Button>
                            </div>
                        </div>
                    ))}
                </div>
            )}

        </div>
    )
}