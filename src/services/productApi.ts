import axiosClient from './axiosClient';
import type { ProductListDto, ProductDetailDto, PagedResult } from '../types/product';

// Fetch products
export const fetchProducts = async (params?: Record<string, any>): Promise<PagedResult<ProductListDto>> => {
  const response = await axiosClient.get<PagedResult<ProductListDto>>('/products', { params });
  const data = response.data || response; // Dependent on axios interceptor
  
  if (data && 'items' in data) {
    return data as unknown as PagedResult<ProductListDto>;
  }
  
  // Fallback if backend returns plain array or something weird
  if (Array.isArray(data)) {
    const dataArray = data as ProductListDto[];
    return {
      items: dataArray,
      page: 1,
      pageSize: dataArray.length,
      totalItems: dataArray.length,
    }
  }

  // Fallback to empty
  return { items: [], page: 1, pageSize: 20, totalItems: 0 };
};

// Fetch product by ID
export const fetchProductById = async (id: number | string): Promise<ProductDetailDto> => {
  const dto = await axiosClient.get<ProductDetailDto>(`/products/${id}`);
  return dto.data || dto as any; // Dependent on axios interceptor returning response.data
}
