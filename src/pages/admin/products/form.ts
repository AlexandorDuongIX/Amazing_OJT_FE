import type {
  CreateProductImageInput,
  CreateProductInput,
  CreateProductVariantInput,
  InventoryRecord,
  ProductDetail,
  ProductFormValues,
  UpdateProductInput,
} from './types'

export function emptyProductForm(): ProductFormValues {
  return {
    name: '',
    description: '',
    regularPrice: '',
    discountPrice: '',
    categoryId: '',
    initialStock: '',
    sku: '',
    brand: '',
    material: '',
    color: '',
    size: '',
    variants: [],
    images: [],
  }
}

export function productFormFromDetail(product: ProductDetail, inventory: InventoryRecord | null): ProductFormValues {
  return {
    ...emptyProductForm(),
    name: product.name,
    description: product.description ?? '',
    regularPrice: product.basePrice.toString(),
    discountPrice: product.discountPrice?.toString() ?? '',
    categoryId: product.category?.id.toString() ?? '',
    initialStock: (inventory?.quantity ?? product.availableQuantity).toString(),
  }
}

function validImageUrl(value: string) {
  return value.startsWith('/') || /^https?:\/\/[^\s]+$/i.test(value)
}

export function validateProductForm(
  values: ProductFormValues,
  mode: 'create' | 'edit',
  reservedQuantity: number,
): string[] {
  const errors: string[] = []
  const regularPrice = Number(values.regularPrice)
  const discountPrice = values.discountPrice ? Number(values.discountPrice) : undefined
  const stock = Number(values.initialStock)

  if (!values.name.trim()) errors.push('Product name is required.')
  if (!Number.isFinite(regularPrice) || regularPrice <= 0) errors.push('Regular price must be greater than zero.')
  if (discountPrice !== undefined && (!Number.isFinite(discountPrice) || discountPrice < 0 || discountPrice >= regularPrice)) {
    errors.push('Discount price must be non-negative and lower than the regular price.')
  }
  if (!Number.isInteger(Number(values.categoryId)) || Number(values.categoryId) <= 0) errors.push('Category is required.')
  if (!values.initialStock.trim() || !Number.isInteger(stock) || stock < 0) errors.push('Total stock cannot be negative and must be a whole number.')
  if (mode === 'edit' && Number.isInteger(stock) && stock < reservedQuantity) {
    errors.push(`Total stock cannot be lower than the ${reservedQuantity} reserved units.`)
  }

  if (mode === 'create') {
    const normalizedSkus = values.variants.map((variant) => variant.sku.trim().toLowerCase()).filter(Boolean)
    if (values.variants.some((variant) => !variant.sku.trim())) errors.push('Variant SKU is required for every variant row.')
    if (new Set(normalizedSkus).size !== normalizedSkus.length) errors.push('Variant SKUs must be unique.')
    if (values.variants.some((variant) => {
      const value = variant.priceOverride.trim()
      if (!value) return false
      const priceOverride = Number(value)
      return !Number.isFinite(priceOverride) || priceOverride <= 0
    })) {
      errors.push('Variant price overrides must be finite numbers greater than zero.')
    }
    if (values.images.some((image) => !validImageUrl(image.imageUrl.trim()))) {
      errors.push('Each image must use a valid HTTP(S) or root-relative URL.')
    }
  }
  return errors
}

function optional(value: string): string | undefined {
  return value.trim() || undefined
}

export function buildCreateProductInput(values: ProductFormValues): CreateProductInput {
  const selectedThumbnail = values.images.findIndex((image) => image.isThumbnail)
  const thumbnailIndex = selectedThumbnail >= 0 ? selectedThumbnail : 0
  const variants: CreateProductVariantInput[] = values.variants.map((variant) => {
    const priceOverride = variant.priceOverride.trim()
    return {
      sku: variant.sku.trim(),
      color: optional(variant.color),
      size: optional(variant.size),
      priceOverride: priceOverride ? Number(priceOverride) : undefined,
    }
  })
  const images: CreateProductImageInput[] = values.images.map((image, index) => ({
    imageUrl: image.imageUrl.trim(),
    isThumbnail: index === thumbnailIndex,
  }))

  return {
    name: values.name.trim(),
    description: optional(values.description),
    basePrice: Number(values.regularPrice),
    discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
    categoryId: Number(values.categoryId),
    sku: optional(values.sku),
    brand: optional(values.brand),
    material: optional(values.material),
    color: optional(values.color),
    size: optional(values.size),
    imageUrl: images[thumbnailIndex]?.imageUrl,
    isActive: true,
    variants,
    images,
  }
}

export function buildUpdateProductInput(values: ProductFormValues): UpdateProductInput {
  return {
    name: values.name.trim(),
    description: optional(values.description),
    price: Number(values.regularPrice),
    discountPrice: values.discountPrice ? Number(values.discountPrice) : undefined,
    categoryId: Number(values.categoryId),
  }
}
