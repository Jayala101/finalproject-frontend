import apiService from './api';
import type { Product, Category, ProductFilters, PaginatedResponse } from '../types';

class ProductService {
  // Get all products with optional filters (using hybrid service for PostgreSQL + MongoDB data)
  async getProducts(filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      // First try the hybrid endpoint
      try {
        const response = await apiService.get('/hybrid/products', filters);
        return response.data;
      } catch (hybridError) {
        console.warn('Hybrid endpoint not available, falling back to standard endpoint', hybridError);
        // Fallback to standard endpoint if hybrid is not available
        const fallbackResponse = await apiService.get('/products', filters);
        return fallbackResponse.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products');
    }
  }

  // Get single product by ID (using hybrid service for complete data)
  async getProduct(id: number): Promise<Product> {
    try {
      // First try the hybrid endpoint
      try {
        const response = await apiService.get(`/hybrid/products/${id}`);
        return response.data;
      } catch (hybridError) {
        console.warn(`Hybrid endpoint not available for product ${id}, falling back to standard endpoint`, hybridError);
        // Fallback to standard endpoint if hybrid is not available
        const fallbackResponse = await apiService.get(`/products/${id}`);
        return fallbackResponse.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product');
    }
  }

  // Search products (using hybrid service)
  async searchProducts(query: string, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      try {
        // Try hybrid endpoint first
        const response = await apiService.get('/hybrid/products', { 
          search: query, 
          ...filters 
        });
        return response.data;
      } catch (hybridError) {
        console.warn('Hybrid search endpoint not available, falling back to standard endpoint', hybridError);
        // Fallback to standard search endpoint
        const fallbackResponse = await apiService.get('/products/search', { 
          query, 
          ...filters 
        });
        return fallbackResponse.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to search products');
    }
  }

  // Get featured products (using analytics trending products)
  async getFeaturedProducts(limit: number = 10): Promise<Product[]> {
    // Try multiple fallback strategies
    try {
      // Strategy 1: Try analytics trending endpoint
      try {
        const analyticsResponse = await apiService.get('/analytics/trending', { limit });
        const trendingIds = analyticsResponse.data;
        
        if (trendingIds && trendingIds.length > 0) {
          // Get full product details for trending IDs
          const productPromises = trendingIds.map((id: string) => 
            this.getProduct(parseInt(id))
          );
          const products = await Promise.allSettled(productPromises);
          
          const validProducts = products
            .filter((result): result is PromiseFulfilledResult<Product> => 
              result.status === 'fulfilled'
            )
            .map(result => result.value);
            
          if (validProducts.length > 0) {
            return validProducts;
          }
        }
        // If we got trending IDs but couldn't fetch products, continue to next strategy
      } catch (analyticsError) {
        console.warn('Analytics trending endpoint not available', analyticsError);
      }
      
      // Strategy 2: Try hybrid products endpoint with newest sorting
      try {
        const response = await apiService.get('/hybrid/products', { 
          sortBy: 'newest', 
          limit 
        });
        const products = response.data.data || [];
        if (products.length > 0) {
          return products;
        }
      } catch (hybridError) {
        console.warn('Hybrid products endpoint not available', hybridError);
      }
      
      // Strategy 3: Try standard featured products endpoint
      try {
        const response = await apiService.get('/products/featured', { limit });
        return response.data.data || [];
      } catch (featuredError) {
        console.warn('Featured products endpoint not available', featuredError);
      }
      
      // Strategy 4: Last resort - get standard products
      const standardResponse = await apiService.get('/products', { 
        limit,
        sortBy: 'newest' 
      });
      return standardResponse.data.data || [];
      
    } catch (error: any) {
      console.error('All product fetching strategies failed', error);
      throw new Error('Failed to fetch featured products');
    }
  }

  // Get products by category (using hybrid service)
  async getProductsByCategory(categoryId: number, filters?: ProductFilters): Promise<PaginatedResponse<Product>> {
    try {
      try {
        // Try hybrid endpoint first
        const response = await apiService.get('/hybrid/products', { 
          categoryId, 
          ...filters 
        });
        return response.data;
      } catch (hybridError) {
        console.warn(`Hybrid endpoint not available for category ${categoryId}, falling back to standard endpoint`, hybridError);
        // Fallback to standard endpoint if hybrid is not available
        const fallbackResponse = await apiService.get(`/products/category/${categoryId}`, filters);
        return fallbackResponse.data;
      }
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch products by category');
    }
  }
}

class CategoryService {
  // Get all categories
  async getCategories(): Promise<Category[]> {
    try {
      const response = await apiService.get('/categories');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch categories');
    }
  }

  // Get category by ID
  async getCategory(id: number): Promise<Category> {
    try {
      const response = await apiService.get(`/categories/${id}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category');
    }
  }

  // Get category tree (with children)
  async getCategoryTree(): Promise<Category[]> {
    try {
      const response = await apiService.get('/categories/tree');
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch category tree');
    }
  }
}

export const productService = new ProductService();
export const categoryService = new CategoryService();
export { productService as default };
