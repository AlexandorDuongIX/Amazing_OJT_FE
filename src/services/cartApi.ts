import axiosClient from './axiosClient';

export interface CartResponse {
  id: number;
  userId: number;
  totalPrice: number;
  itemCount: number;
  items: CartItemResponse[];
}

export interface CartItemResponse {
  id: number;
  cartId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  product?: {
    id: number;
    name: string;
    price: number;
    discountPrice?: number;
    imageUrl?: string;
    size?: string;
    color?: string;
    sku?: string;
  };
}

export interface AddToCartRequest {
  productId: number;
  quantity: number;
}

export interface UpdateCartItemRequest {
  quantity: number;
}

export const cartApi = {
  /** Get cart by user ID */
  getCartByUserId: async (userId: number): Promise<CartResponse> => {
    return axiosClient.get<any, CartResponse>(`/cart/user/${userId}`);
  },

  /** Add item to cart */
  addToCart: async (userId: number, data: AddToCartRequest): Promise<CartResponse> => {
    return axiosClient.post<any, CartResponse>(`/cart/user/${userId}/items`, data);
  },

  /** Update item quantity */
  updateCartItem: async (cartId: number, productId: number, data: UpdateCartItemRequest): Promise<CartResponse> => {
    return axiosClient.put<any, CartResponse>(`/cart/${cartId}/items/${productId}`, data);
  },

  /** Remove item from cart */
  removeFromCart: async (cartId: number, productId: number): Promise<CartResponse> => {
    return axiosClient.delete<any, CartResponse>(`/cart/${cartId}/items/${productId}`);
  },

  /** Clear entire cart */
  clearCart: async (cartId: number): Promise<void> => {
    return axiosClient.delete(`/cart/${cartId}`);
  },

  /** Get cart total */
  getCartTotal: async (cartId: number): Promise<{ cartId: number; total: number }> => {
    return axiosClient.get<any, { cartId: number; total: number }>(`/cart/${cartId}/total`);
  },
};

