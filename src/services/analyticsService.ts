import apiService from './api';

// Analytics data types
interface ProductView {
  productId: string;
  userId?: string;
  sessionId?: string;
  timestamp: string;
}

interface TrendingProduct {
  productId: string;
  viewCount: number;
  rank: number;
}

interface UserBehaviorData {
  mostViewedProducts: Array<{
    productId: string;
    viewCount: number;
  }>;
  recentlyViewed: string[];
  preferredCategories: Array<{
    categoryId: string;
    interactionCount: number;
  }>;
}

class AnalyticsService {
  // ========== Product View Tracking ==========

  // Record product view
  async recordProductView(productId: string, userId?: string, sessionId?: string): Promise<void> {
    try {
      await apiService.post('/analytics/product-view', {
        productId,
        userId,
        sessionId: sessionId || this.getSessionId()
      });
    } catch (error: any) {
      // Don't throw error for analytics failures, just log
      console.warn('Failed to record product view:', error.response?.data?.message || error.message);
    }
  }

  // Record category view
  async recordCategoryView(categoryId: string, userId?: string, sessionId?: string): Promise<void> {
    try {
      await apiService.post('/analytics/category-view', {
        categoryId,
        userId,
        sessionId: sessionId || this.getSessionId()
      });
    } catch (error: any) {
      console.warn('Failed to record category view:', error.response?.data?.message || error.message);
    }
  }

  // ========== Trending & Popular Content ==========

  // Get trending products
  async getTrendingProducts(limit: number = 10): Promise<string[]> {
    try {
      const response = await apiService.get('/analytics/trending', { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch trending products');
    }
  }

  // Get most viewed products
  async getMostViewedProducts(limit: number = 10): Promise<TrendingProduct[]> {
    try {
      const response = await apiService.get('/analytics/most-viewed', { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch most viewed products');
    }
  }

  // Get popular products by category
  async getPopularProductsByCategory(categoryId: string, limit: number = 10): Promise<string[]> {
    try {
      const response = await apiService.get(`/analytics/popular-by-category/${categoryId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch popular products by category');
    }
  }

  // ========== User Behavior Analytics ==========

  // Get user's most viewed products
  async getUserMostViewedProducts(userId: string, limit: number = 5): Promise<UserBehaviorData['mostViewedProducts']> {
    try {
      const response = await apiService.get(`/user-behavior/most-viewed/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user most viewed products');
    }
  }

  // Get user's browsing history
  async getUserBrowsingHistory(userId: string, limit: number = 20): Promise<ProductView[]> {
    try {
      const response = await apiService.get(`/user-behavior/browsing-history/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch browsing history');
    }
  }

  // Get session's product views
  async getSessionProductViews(sessionId?: string, limit: number = 10): Promise<ProductView[]> {
    try {
      const response = await apiService.get('/user-behavior/session-views', { 
        sessionId: sessionId || this.getSessionId(),
        limit 
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch session product views');
    }
  }

  // ========== Recommendation Engine ==========

  // Get product recommendations for user
  async getUserRecommendations(userId: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await apiService.get(`/recommendations/user/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user recommendations');
    }
  }

  // Get frequently bought together products
  async getFrequentlyBoughtTogether(productId: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await apiService.get(`/analytics/frequently-bought-together/${productId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch frequently bought together');
    }
  }

  // Get similar products
  async getSimilarProducts(productId: string, limit: number = 5): Promise<string[]> {
    try {
      const response = await apiService.get(`/analytics/similar-products/${productId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch similar products');
    }
  }

  // ========== Dashboard Analytics (Admin) ==========

  // Get product view analytics
  async getProductViewAnalytics(productId: string, days: number = 30): Promise<{
    totalViews: number;
    uniqueViews: number;
    dailyViews: Array<{ date: string; views: number }>;
  }> {
    try {
      const response = await apiService.get(`/analytics/product/${productId}/views`, { days });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product analytics');
    }
  }

  // Get overall site analytics
  async getSiteAnalytics(days: number = 30): Promise<{
    totalPageViews: number;
    uniqueVisitors: number;
    topProducts: TrendingProduct[];
    topCategories: Array<{ categoryId: string; views: number }>;
  }> {
    try {
      const response = await apiService.get('/analytics/site-overview', { days });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch site analytics');
    }
  }

  // ========== Utility Methods ==========

  // Get or create session ID
  private getSessionId(): string {
    let sessionId = sessionStorage.getItem('analytics_session_id');
    if (!sessionId) {
      sessionId = 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
      sessionStorage.setItem('analytics_session_id', sessionId);
    }
    return sessionId;
  }

  // Get current session ID (public method)
  getCurrentSessionId(): string {
    return this.getSessionId();
  }

  // Track page view (generic)
  async trackPageView(page: string, userId?: string): Promise<void> {
    try {
      await apiService.post('/analytics/page-view', {
        page,
        userId,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to track page view:', error.response?.data?.message || error.message);
    }
  }

  // Track search query
  async trackSearch(query: string, userId?: string, resultsCount?: number): Promise<void> {
    try {
      await apiService.post('/analytics/search', {
        query,
        userId,
        sessionId: this.getSessionId(),
        resultsCount,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to track search:', error.response?.data?.message || error.message);
    }
  }
}

export const analyticsService = new AnalyticsService();
export default analyticsService;
