import { cartApi, type CartItemResponse } from './cartApi';
import { useCartStore } from '../pages/customer/cart/cartStore';
import { useAuthStore } from '../pages/customer/auth/authStore';

/**
 * CartService - Bridges the local Zustand cart store with the backend API.
 * Provides sync methods that update both local state and server.
 */
class CartService {
  private getUserId(): number | null {
    const user = useAuthStore.getState().user;
    return user?.id ?? null;
  }

  /** Convert a backend CartItemResponse to local CartItem format */
  private toLocalItem(item: CartItemResponse) {
    return {
      id: String(item.productId),
      name: item.product?.name ?? `Product #${item.productId}`,
      price: item.unitPrice,
      imageUrl: item.product?.imageUrl ?? '',
      size: item.product?.size ?? '',
      color: item.product?.color ?? '',
      quantity: item.quantity,
    };
  }

  /** Fetch cart from backend and update local store */
  async fetchCart(): Promise<void> {
    const userId = this.getUserId();
    if (!userId) return;

    try {
      const cart = await cartApi.getCartByUserId(userId);
      const items = (cart.items ?? []).map((item) => this.toLocalItem(item));
      useCartStore.getState().setItems(items);
    } catch (error) {
      console.warn('Failed to fetch cart from server, using local state:', error);
    }
  }

  /** Add item to cart (server + local) */
  async addItem(
    productId: number,
    quantity: number,
    name: string,
    price: number,
    imageUrl: string,
    size: string,
    color: string
  ): Promise<void> {
    const userId = this.getUserId();
    if (!userId) {
      // Offline mode: add to local store only
      useCartStore.getState().addItem({
        id: String(productId),
        name,
        price,
        imageUrl,
        size,
        color,
        quantity,
      });
      return;
    }

    try {
      await cartApi.addToCart(userId, { productId, quantity });
      await this.fetchCart();
    } catch (error) {
      console.error('Failed to add item to server cart:', error);
      // Fallback: add locally
      useCartStore.getState().addItem({
        id: String(productId),
        name,
        price,
        imageUrl,
        size,
        color,
        quantity,
      });
    }
  }

  /** Update item quantity (server + local) */
  async updateQuantity(
    cartItemId: number | undefined,
    productId: number,
    quantity: number,
    size: string,
    color: string,
    id: string
  ): Promise<void> {
    const userId = this.getUserId();
    if (!userId || !cartItemId) {
      useCartStore.getState().updateQuantity(id, size, color, quantity);
      return;
    }

    try {
      const cart = useCartStore.getState().items[0];
      const cartId = await this.getCartId();
      if (cartId) {
        await cartApi.updateCartItem(cartId, productId, { quantity });
      }
      useCartStore.getState().updateQuantity(id, size, color, quantity);
    } catch (error) {
      console.error('Failed to update quantity on server:', error);
      useCartStore.getState().updateQuantity(id, size, color, quantity);
    }
  }

  /** Remove item from cart (server + local) */
  async removeItem(
    productId: number,
    size: string,
    color: string,
    id: string
  ): Promise<void> {
    const userId = this.getUserId();
    if (!userId) {
      useCartStore.getState().removeItem(id, size, color);
      return;
    }

    try {
      const cartId = await this.getCartId();
      if (cartId) {
        await cartApi.removeFromCart(cartId, productId);
      }
      useCartStore.getState().removeItem(id, size, color);
    } catch (error) {
      console.error('Failed to remove item on server:', error);
      useCartStore.getState().removeItem(id, size, color);
    }
  }

  /** Clear cart (server + local) */
  async clearCart(): Promise<void> {
    const userId = this.getUserId();
    if (!userId) {
      useCartStore.getState().clearCart();
      return;
    }

    try {
      const cartId = await this.getCartId();
      if (cartId) {
        await cartApi.clearCart(cartId);
      }
      useCartStore.getState().clearCart();
    } catch (error) {
      console.error('Failed to clear cart on server:', error);
      useCartStore.getState().clearCart();
    }
  }

  /** Helper: get cartId from the first item or fetch from server */
  private async getCartId(): Promise<number | null> {
    const userId = this.getUserId();
    if (!userId) return null;

    try {
      const cart = await cartApi.getCartByUserId(userId);
      return cart.id;
    } catch {
      return null;
    }
  }
}

export const cartService = new CartService();

