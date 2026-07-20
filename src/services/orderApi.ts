import axiosClient from './axiosClient';

export interface OrderResponse {
  id: number;
  userId: number;
  orderNumber: string;
  status: number;
  subTotal: number;
  shippingCost: number;
  taxAmount: number;
  discountAmount: number;
  totalPrice: number;
  shippingAddress?: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber?: string;
  notes?: string;
  shippedDate?: string;
  deliveredDate?: string;
  trackingNumber?: string;
  createdAt: string;
  items: OrderItemResponse[];
  shipment?: any;
}

export interface OrderItemResponse {
  id: number;
  orderId: number;
  productId: number;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
  size?: string;
  color?: string;
  product?: {
    id: number;
    name: string;
    imageUrl?: string;
  };
}

export interface CreateOrderRequest {
  shippingAddress: string;
  city?: string;
  state?: string;
  postalCode?: string;
  country?: string;
  phoneNumber: string;
  notes?: string;
}

export const orderApi = {
  /** Place a new order (Checkout) */
  placeOrder: async (data: CreateOrderRequest): Promise<OrderResponse> => {
    return axiosClient.post<any, OrderResponse>('/orders', data);
  },

  /** Get order by ID */
  getOrderById: async (id: number): Promise<OrderResponse> => {
    return axiosClient.get<any, OrderResponse>(`/orders/${id}`);
  },

  /** Get all orders for current user */
  getMyOrders: async (): Promise<OrderResponse[]> => {
    return axiosClient.get<any, OrderResponse[]>('/orders/my');
  },

  /** Cancel an order */
  cancelOrder: async (id: number): Promise<{ message: string }> => {
    return axiosClient.post<any, { message: string }>(`/orders/${id}/cancel`);
  },
};

