import { useState } from 'react'
import BlogForm from './BlogForm'
import type { Blog } from '../data/blogStorage'
import {
    getBlogs,
    saveBlogs
} from '../data/blogStorage'

export default function BlogManagement () {
    const [blogs, setBlogs] =
        useState<Blog[]>(getBlogs())

    const [editingBlog, setEditingBlog] =
        useState<Blog | null>(null)

    const updateBlogs = (newBlogs: Blog[]) => {
        setBlogs(newBlogs)
        saveBlogs(newBlogs)
    }

    const saveBlog = (blog: Blog) => {
        const existed = blogs.find(
            (x) => x.id === blog.id
        )

        if (existed) {
            updateBlogs(
                blogs.map((x) =>
                    x.id === blog.id ? blog : x
                )
            )
        } else {
            updateBlogs([...blogs, blog])
        }

        setEditingBlog(null)
    }

    const deleteBlog = (id: number) => {
        if (
            window.confirm(
                'Bạn có chắc muốn xóa?'
            )
        ) {
            updateBlogs(
                blogs.filter(
                    (x) => x.id !== id
                )
            )
        }
    }

    const duplicateBlog = (
        blog: Blog
    ) => {
        const copy: Blog = {
            ...blog,
            id: Date.now(),
            title:
                blog.title + ' (Copy)'
        }

        updateBlogs([...blogs, copy])
    }

    return (
        <div className="p-6">
            <h1 className="text-3xl font-bold mb-6">
                Quản Lý Blog
            </h1>

            <BlogForm
                editingBlog={editingBlog}
                onSave={saveBlog}
                onCancel={() =>
                    setEditingBlog(null)
                }
            />

            <table className="w-full border">
                <thead>
                    <tr className="bg-gray-100">
                        <th>ID</th>
                        <th>Ảnh</th>
                        <th>Tiêu đề</th>
                        <th>Ngày đăng</th>
                        <th>Thao tác</th>
                    </tr>
                </thead>

                <tbody>
                    {blogs.map((blog) => (
                        <tr key={blog.id}>
                            <td>{blog.id}</td>

                            <td>
                                <img
                                    src={
                                        blog.thumbnail
                                    }
                                    alt=""
                                    className="w-20 h-20 object-cover"
                                />
                            </td>

                            <td>
                                {blog.title}
                            </td>

                            <td>
                                {blog.createdAt}
                            </td>

                            <td>
                                <div className="flex gap-2">

                                    <button
                                        onClick={() =>
                                            setEditingBlog(
                                                blog
                                            )
                                        }
                                        className="bg-yellow-500 text-white px-3 py-1 rounded"
                                    >
                                        Sửa
                                    </button>

                                    <button
                                        onClick={() =>
                                            deleteBlog(
                                                blog.id
                                            )
                                        }
                                        className="bg-red-500 text-white px-3 py-1 rounded"
                                    >
                                        Xóa
                                    </button>

                                    <button
                                        onClick={() =>
                                            duplicateBlog(
                                                blog
                                            )
                                        }
                                        className="bg-purple-600 text-white px-3 py-1 rounded"
                                    >
                                        Nhân bản
                                    </button>

                                </div>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>
        </div>
    )
}
