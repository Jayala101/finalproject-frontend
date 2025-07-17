import apiService from './api';
import type { Cart, Product, ProductVariant } from '../types';

// Local cart item for session storage
interface LocalCartItem {
  productId: number;
  quantity: number;
  selectedVariants?: ProductVariant[];
  price: number;
}

class CartService {
  private readonly CART_STORAGE_KEY = 'shopping_cart';
  
  // ========== Session Cart (MongoDB-backed) ==========
  
  // Get session cart (for guest users)
  getSessionCart(): LocalCartItem[] {
    try {
      const stored = localStorage.getItem(this.CART_STORAGE_KEY);
      return stored ? JSON.parse(stored) : [];
    } catch (error) {
      console.error('Failed to load session cart:', error);
      return [];
    }
  }

  // Save session cart
  private saveSessionCart(items: LocalCartItem[]): void {
    try {
      localStorage.setItem(this.CART_STORAGE_KEY, JSON.stringify(items));
    } catch (error) {
      console.error('Failed to save session cart:', error);
    }
  }

  // Add item to session cart
  addToSessionCart(product: Product, quantity: number = 1, variants?: ProductVariant[]): void {
    const items = this.getSessionCart();
    const existingIndex = items.findIndex(item => 
      item.productId === product.id && 
      JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
    );

    if (existingIndex >= 0) {
      items[existingIndex].quantity += quantity;
    } else {
      items.push({
        productId: product.id,
        quantity,
        selectedVariants: variants,
        price: product.discountPrice || product.price
      });
    }

    this.saveSessionCart(items);
  }

  // Update session cart item quantity
  updateSessionCartItem(productId: number, quantity: number, variants?: ProductVariant[]): void {
    const items = this.getSessionCart();
    const index = items.findIndex(item => 
      item.productId === productId && 
      JSON.stringify(item.selectedVariants) === JSON.stringify(variants)
    );

    if (index >= 0) {
      if (quantity <= 0) {
        items.splice(index, 1);
      } else {
        items[index].quantity = quantity;
      }
      this.saveSessionCart(items);
    }
  }

  // Remove item from session cart
  removeFromSessionCart(productId: number, variants?: ProductVariant[]): void {
    const items = this.getSessionCart();
    const filtered = items.filter(item => 
      !(item.productId === productId && 
        JSON.stringify(item.selectedVariants) === JSON.stringify(variants))
    );
    this.saveSessionCart(filtered);
  }

  // Clear session cart
  clearSessionCart(): void {
    localStorage.removeItem(this.CART_STORAGE_KEY);
  }

  // ========== Persistent Cart (PostgreSQL-backed) ==========

  // Get user's persistent cart
  async getUserCart(userId: number): Promise<Cart | null> {
    try {
      const response = await apiService.get(`/carts/user/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No cart exists yet
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch cart');
    }
  }

  // Add item to user's persistent cart
  async addToUserCart(userId: number, productId: number, quantity: number = 1, variants?: ProductVariant[]): Promise<Cart> {
    try {
      const response = await apiService.post(`/carts/user/${userId}/items`, {
        productId,
        quantity,
        selectedVariants: variants
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to add item to cart');
    }
  }

  // Update cart item in persistent cart
  async updateUserCartItem(itemId: number, quantity: number): Promise<Cart> {
    try {
      const response = await apiService.patch(`/carts/items/${itemId}`, {
        quantity
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update cart item');
    }
  }

  // Remove item from persistent cart
  async removeFromUserCart(itemId: number): Promise<void> {
    try {
      await apiService.delete(`/carts/items/${itemId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to remove item from cart');
    }
  }

  // Clear user's persistent cart
  async clearUserCart(userId: number): Promise<void> {
    try {
      await apiService.delete(`/carts/user/${userId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to clear cart');
    }
  }

  // ========== Hybrid Cart Operations ==========

  // Merge session cart with user cart (when user logs in)
  async mergeSessionCartWithUserCart(userId: number): Promise<Cart> {
    try {
      const sessionItems = this.getSessionCart();
      if (sessionItems.length === 0) {
        // No session cart to merge, just return user cart
        return await this.getUserCart(userId) || { 
          id: 0, 
          customerId: userId, 
          items: [], 
          totalAmount: 0, 
          createdAt: new Date().toISOString(), 
          updatedAt: new Date().toISOString() 
        };
      }

      // Add session items to user cart
      for (const item of sessionItems) {
        await this.addToUserCart(userId, item.productId, item.quantity, item.selectedVariants);
      }

      // Clear session cart after merge
      this.clearSessionCart();

      // Return updated user cart
      return await this.getUserCart(userId) || { 
        id: 0, 
        customerId: userId, 
        items: [], 
        totalAmount: 0, 
        createdAt: new Date().toISOString(), 
        updatedAt: new Date().toISOString() 
      };
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to merge carts');
    }
  }

  // Get cart count (session or user)
  getCartItemCount(userId?: number): number {
    if (userId) {
      // For logged-in users, you'd need to fetch from server
      // This is a simplified version using session cart
      return this.getSessionCart().reduce((total, item) => total + item.quantity, 0);
    } else {
      return this.getSessionCart().reduce((total, item) => total + item.quantity, 0);
    }
  }

  // Calculate cart total (session cart)
  getCartTotal(): number {
    const items = this.getSessionCart();
    return items.reduce((total, item) => total + (item.price * item.quantity), 0);
  }
}

export const cartService = new CartService();
export default cartService;