import apiClient from '../config/api';
import { Order, CartItem } from '../types';

interface CreateOrderRequest {
  items: CartItem[];
  deliveryAddress: string;
  phone: string;
  notes?: string;
}

interface OrdersResponse {
  orders: Order[];
  total: number;
}

export const orderService = {
  // Create new order
  createOrder: async (orderData: CreateOrderRequest): Promise<Order> => {
    try {
      const response = await apiClient.post('/api/orders', orderData);
      return response.data;
    } catch (error) {
      console.error('Create order error:', error);
      throw error;
    }
  },

  // Get user orders
  getOrders: async (params?: {
    page?: number;
    limit?: number;
    status?: string;
  }): Promise<OrdersResponse> => {
    try {
      const response = await apiClient.get('/api/orders', { params });
      return response.data;
    } catch (error) {
      console.error('Get orders error:', error);
      throw error;
    }
  },

  // Get order by ID
  getOrderById: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get(`/api/orders/${id}`);
      return response.data;
    } catch (error) {
      console.error('Get order error:', error);
      throw error;
    }
  },

  // Cancel order
  cancelOrder: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.put(`/api/orders/${id}/cancel`);
      return response.data;
    } catch (error) {
      console.error('Cancel order error:', error);
      throw error;
    }
  },

  // Track order
  trackOrder: async (id: string): Promise<Order> => {
    try {
      const response = await apiClient.get(`/api/orders/${id}/track`);
      return response.data;
    } catch (error) {
      console.error('Track order error:', error);
      throw error;
    }
  },
};

export default orderService;
