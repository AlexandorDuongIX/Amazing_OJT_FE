
import { useEffect, useState } from 'react'
import type { Blog } from '../data/blogStorage'

interface Props {
    editingBlog: Blog | null
    onSave: (blog: Blog) => void
    onCancel: () => void
}

export default function BlogForm({
    editingBlog,
    onSave,
    onCancel
}: Props) {
    const [form, setForm] = useState({
        title: '',
        thumbnail: '',
        summary: '',
        content: ''
    })

    useEffect(() => {
        if (!editingBlog) return

        // avoid synchronous setState inside effect to prevent cascading renders
        const t = setTimeout(() => {
            setForm({
                title: editingBlog.title,
                thumbnail: editingBlog.thumbnail,
                summary: editingBlog.summary,
                content: editingBlog.content
            })
        }, 0)

        return () => clearTimeout(t)
    }, [editingBlog])

    const submit = () => {
        if (!form.title.trim()) {
            alert('Nhập tiêu đề')
            return
        }

        const blog: Blog = {
            id: editingBlog?.id || Date.now(),
            createdAt:
                editingBlog?.createdAt ||
                new Date().toLocaleDateString(),
            ...form
        }

        onSave(blog)

        setForm({
            title: '',
            thumbnail: '',
            summary: '',
            content: ''
        })
    }

    return (
        <div className="bg-white p-6 rounded-lg shadow mb-6">
            <h2 className="text-2xl font-bold mb-4">
                {editingBlog
                    ? 'Cập nhật bài viết'
                    : 'Thêm bài viết'}
            </h2>

            <div className="space-y-3">
                <input
                    className="w-full border p-2 rounded"
                    placeholder="Tiêu đề"
                    value={form.title}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            title: e.target.value
                        })
                    }
                />

                <input
                    className="w-full border p-2 rounded"
                    placeholder="Ảnh đại diện"
                    value={form.thumbnail}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            thumbnail: e.target.value
                        })
                    }
                />

                <textarea
                    rows={3}
                    className="w-full border p-2 rounded"
                    placeholder="Tóm tắt"
                    value={form.summary}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            summary: e.target.value
                        })
                    }
                />

                <textarea
                    rows={6}
                    className="w-full border p-2 rounded"
                    placeholder="Nội dung"
                    value={form.content}
                    onChange={(e) =>
                        setForm({
                            ...form,
                            content: e.target.value
                        })
                    }
                />

                <div className="flex gap-2">
                    <button
                        onClick={submit}
                        className="bg-green-600 text-white px-4 py-2 rounded"
                    >
                        Lưu
                    </button>

                    <button
                        onClick={onCancel}
                        className="bg-gray-500 text-white px-4 py-2 rounded"
                    >
                        Hủy
                    </button>
                </div>
            </div>
        </div>
    )
}