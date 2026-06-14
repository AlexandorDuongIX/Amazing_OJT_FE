
export interface Blog {
    id: number
    title: string
    thumbnail: string
    summary: string
    content: string
    createdAt: string
}

const BLOG_KEY = 'fashion_shop_blogs'

export const getBlogs = (): Blog[] => {
    const data = localStorage.getItem(BLOG_KEY)

    if (!data) return []

    return JSON.parse(data)
}

export const saveBlogs = (blogs: Blog[]) => {
    localStorage.setItem(
        BLOG_KEY,
        JSON.stringify(blogs)
    )
}
