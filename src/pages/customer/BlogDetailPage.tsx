
import { useParams, Link } from 'react-router-dom'
import { staticBlogs } from '../../utils/staticBlogs'

export default function BlogDetailPage() {
    const { id } = useParams()

    const blogs = staticBlogs

    const blog = blogs.find(
        (x) => x.id === Number(id)
    )

    if (!blog) {
        return (
            <div className="container mx-auto p-8">

                <h1 className="text-3xl font-bold mb-4">
                    Không tìm thấy bài viết
                </h1>

                <Link
                    to="/blogs"
                    className="bg-black text-white px-4 py-2 rounded"
                >
                    Quay lại Blog
                </Link>

            </div>
        )
    }

    const relatedBlogs = blogs
        .filter((x) => x.id !== blog.id)
        .slice(0, 3)

    return (
        <div className="container mx-auto px-4 py-8">

            <Link
                to="/blogs"
                className="text-blue-600"
            >
                ← Quay lại danh sách Blog
            </Link>

            <h1 className="text-4xl font-bold mt-4 mb-3">
                {blog.title}
            </h1>

            <p className="text-gray-500 mb-6">
                Ngày đăng: {blog.createdAt}
            </p>

            <img
                src={blog.thumbnail}
                alt={blog.title}
                className="w-full h-[500px] object-cover rounded-xl mb-6"
            />

            <div className="bg-white rounded-xl shadow p-6">

                <h2 className="text-2xl font-semibold mb-3">
                    Tóm tắt
                </h2>

                <p className="mb-6 text-gray-700">
                    {blog.summary}
                </p>

                <h2 className="text-2xl font-semibold mb-3">
                    Nội dung
                </h2>

                <div className="leading-8 text-gray-800 whitespace-pre-wrap">
                    {blog.content}
                </div>

            </div>

            {relatedBlogs.length > 0 && (

                <div className="mt-10">

                    <h2 className="text-3xl font-bold mb-5">
                        Bài viết liên quan
                    </h2>

                    <div className="grid md:grid-cols-3 gap-6">

                        {relatedBlogs.map((item) => (

                            <div
                                key={item.id}
                                className="bg-white rounded-xl shadow overflow-hidden"
                            >
                                <img
                                    src={item.thumbnail}
                                    alt={item.title}
                                    className="w-full h-48 object-cover"
                                />

                                <div className="p-4">

                                    <h3 className="font-bold mb-2">
                                        {item.title}
                                    </h3>

                                    <Link
                                        to={`/blog/${item.id}`}
                                        className="text-blue-600"
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