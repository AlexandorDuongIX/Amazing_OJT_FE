export interface VariantSummaryDto {
  id: number;
  sku: string;
  color?: string;
  size?: string;
  priceOverride?: number;
}

export interface VariantDetailDto {
  id: number;
  sku: string;
  color?: string;
  size?: string;
  price: number;
  priceOverride?: number;
}

export interface CategoryDto {
  id: number;
  name: string;
}

export interface ImageDto {
  id: number;
  url: string;
  isThumbnail: boolean;
}

export interface ProductListDto {
  id: number;
  name: string;
  sku?: string;
  brand?: string;
  color?: string;
  size?: string;
  basePrice: number;
  price: number;
  isActive: boolean;
  imageUrl?: string;
  category?: CategoryDto;
  thumbnailUrl?: string;
  availableQuantity: number;
  variantsSummary: VariantSummaryDto[];
}

export interface ProductDetailDto {
  id: number;
  name: string;
  description?: string;
  basePrice: number;
  discountPrice?: number;
  category?: CategoryDto;
  images: ImageDto[];
  variants: VariantDetailDto[];
  availableQuantity: number;
  brand?: string; // Adding since it might be needed, BE Product model has Brand
}

export interface PagedResult<T> {
  page: number;
  pageSize: number;
  totalItems: number;
  items: T[];
}

export interface CartItem {
  cartItemId?: number; // Optional if we only store locally, but BE might have cart item id
  productId: number;
  variantId?: number; // If applicable
  name: string;
  price: number; // The actual price applied
  imageUrl?: string;
  quantity: number;
  color?: string;
  size?: string;
}
