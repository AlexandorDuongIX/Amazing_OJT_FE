import { useState } from 'react'
import { Link } from 'react-router-dom'
import type { Blog } from '../data/blogStorage'
import { getBlogs } from '../data/blogStorage'

export default function BlogListPage() {
    const [blogs] = useState<Blog[]>(() => getBlogs())
    const [keyword, setKeyword] = useState('')

    const filteredBlogs = blogs.filter((blog) =>
        blog.title
            .toLowerCase()
            .includes(keyword.toLowerCase())
    )

    return (
        <div className="container mx-auto px-4 py-8">

            <h1 className="text-4xl font-bold mb-6">
                Blog Thời Trang
            </h1>

            <div className="mb-6">
                <input
                    type="text"
                    placeholder="Tìm kiếm bài viết..."
                    value={keyword}
                    onChange={(e) =>
                        setKeyword(e.target.value)
                    }
                    className="w-full md:w-96 border p-3 rounded"
                />
            </div>

            {filteredBlogs.length === 0 ? (
                <div className="text-center py-10">
                    Chưa có bài viết nào.
                </div>
            ) : (
                <div className="grid md:grid-cols-3 gap-6">

                    {filteredBlogs.map((blog) => (

                        <div
                            key={blog.id}
                            className="bg-white rounded-xl shadow-lg overflow-hidden hover:shadow-xl transition"
                        >
                            <img
                                src={blog.thumbnail}
                                alt={blog.title}
                                className="w-full h-60 object-cover"
                            />

                            <div className="p-5">

                                <h2 className="text-xl font-bold mb-2">
                                    {blog.title}
                                </h2>

                                <p className="text-gray-500 text-sm mb-3">
                                    {blog.createdAt}
                                </p>

                                <p className="text-gray-700 mb-4 line-clamp-3">
                                    {blog.summary}
                                </p>

                                <Link
                                    to={`/blog/${blog.id}`}
                                    className="inline-block bg-black text-white px-4 py-2 rounded"
                                >
                                    Xem chi tiết
                                </Link>

                            </div>
                        </div>

                    ))}

                </div>
            )}

        </div>
    )
}