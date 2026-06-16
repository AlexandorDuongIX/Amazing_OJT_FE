export interface ProductColor {
  name: string
  value: string
  swatchClass: string
}

export interface Product {
  id: string
  name: string
  price: number
  discountPrice: number
  description: string
  breadcrumb: string[]
  images: string[]
  colors: ProductColor[]
  sizes: string[]
  fabric: string
  delivery: string
  category: string
  brand: string
  rating: number
  reviewCount: number
}
