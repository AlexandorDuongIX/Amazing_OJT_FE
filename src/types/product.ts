export interface VariantSummaryDto {
  id: number;
  sku: string;
  color: string | null;
  size: string | null;
  priceOverride: number | null;
}

export interface VariantDetailDto {
  id: number;
  sku: string;
  color: string | null;
  size: string | null;
  price: number;
  priceOverride: number | null;
}

export interface CategorySummaryDto {
  id: number;
  name: string;
}

export interface CategoryDto extends CategorySummaryDto {
  description: string | null;
  imageUrl: string | null;
  parentCategoryId: number | null;
  isActive: boolean;
  createdAt: string;
  updatedAt: string | null;
  isDeleted: boolean;
}

export interface ImageDto {
  id: number;
  url: string;
  isThumbnail: boolean;
}

export interface ProductListDto {
  id: number;
  name: string;
  description?: string | null;
  sku?: string | null;
  brand?: string | null;
  color?: string | null;
  size?: string | null;
  basePrice: number;
  price: number;
  discountPrice?: number | null;
  isActive?: boolean;
  imageUrl?: string | null;
  category?: CategorySummaryDto | null;
  thumbnailUrl?: string | null;
  availableQuantity: number;
  variantsSummary: VariantSummaryDto[];
  requiresVariantSelection: boolean;
}

export interface ProductSearchResultDto {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  price: number;
  discountPrice: number | null;
  brand: string | null;
  color: string | null;
  size: string | null;
  category: CategorySummaryDto | null;
  thumbnailUrl: string | null;
  availableQuantity: number;
}

export interface ProductDetailDto {
  id: number;
  name: string;
  description: string | null;
  basePrice: number;
  discountPrice: number | null;
  category: CategorySummaryDto | null;
  images: ImageDto[];
  variants: VariantDetailDto[];
  availableQuantity: number;
}

export interface ProductListQueryParams {
  page?: number;
  pageSize?: number;
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  size?: string;
  color?: string;
  sort?: string;
  sortBy?: string;
  sortDirection?: string;
}

export interface ProductSearchQueryParams extends ProductListQueryParams {
  searchTerm?: string;
  brand?: string;
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
