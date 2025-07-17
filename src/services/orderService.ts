import apiService from './api';
import type { Order, OrderFilters, PaginatedResponse } from '../types';

// Order creation data
interface CreateOrderData {
  customerId: number;
  items: Array<{
    productId: number;
    quantity: number;
    price: number;
    selectedVariants?: any[];
  }>;
  shippingMethodId: number;
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
}

class OrderService {
  // Create new order
  async createOrder(orderData: CreateOrderData): Promise<Order> {
    try {
      const response = await apiService.post('/orders', orderData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create order');
    }
  }

  // Get all orders (admin only)
  async getAllOrders(filters?: OrderFilters): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiService.get('/orders', filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch orders');
    }
  }

  // Get single order by ID
  async getOrder(orderId: number): Promise<Order> {
    try {
      const response = await apiService.get(`/orders/${orderId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order');
    }
  }

  // Get user's orders
  async getUserOrders(userId: number, filters?: Omit<OrderFilters, 'customerId'>): Promise<PaginatedResponse<Order>> {
    try {
      const response = await apiService.get(`/orders/user/${userId}`, filters);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user orders');
    }
  }

  // Update order status (admin only)
  async updateOrderStatus(orderId: number, status: Order['status']): Promise<Order> {
    try {
      const response = await apiService.patch(`/orders/${orderId}`, { status });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update order status');
    }
  }

  // Cancel order
  async cancelOrder(orderId: number): Promise<Order> {
    try {
      const response = await apiService.patch(`/orders/${orderId}`, { 
        status: 'cancelled' 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to cancel order');
    }
  }

  // Get order tracking info
  async getOrderTracking(orderId: number): Promise<{
    status: Order['status'];
    estimatedDelivery?: string;
    trackingNumber?: string;
    statusHistory: Array<{
      status: string;
      timestamp: string;
      note?: string;
    }>;
  }> {
    try {
      const response = await apiService.get(`/orders/${orderId}/tracking`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch order tracking');
    }
  }

  // Create order from cart
  async createOrderFromCart(
    userId: number, 
    shippingMethodId: number,
    shippingAddress: string,
    billingAddress: string,
    paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer'
  ): Promise<Order> {
    try {
      const response = await apiService.post('/orders/from-cart', {
        customerId: userId,
        shippingMethodId,
        shippingAddress,
        billingAddress,
        paymentMethod
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create order from cart');
    }
  }

  // Get order summary for checkout
  async getOrderSummary(userId: number, shippingMethodId: number): Promise<{
    subtotal: number;
    shipping: number;
    tax: number;
    total: number;
    items: Array<{
      productId: number;
      name: string;
      quantity: number;
      price: number;
      total: number;
    }>;
  }> {
    try {
      const response = await apiService.get(`/orders/summary`, {
        customerId: userId,
        shippingMethodId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to get order summary');
    }
  }
}

export const orderService = new OrderService();
export default orderService;
