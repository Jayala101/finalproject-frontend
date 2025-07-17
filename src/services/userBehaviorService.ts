import apiService from './api';

// User behavior tracking types
interface BrowsingSession {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  pages: Array<{
    page: string;
    timestamp: string;
    duration?: number;
  }>;
}

interface UserPreferences {
  favoriteCategories: string[];
  priceRange: { min: number; max: number };
  brands: string[];
  lastUpdated: string;
}

interface SearchBehavior {
  query: string;
  timestamp: string;
  resultsClicked: number;
  resultsCount: number;
}

class UserBehaviorService {
  // ========== Browsing History ==========

  // Record browsing activity
  async recordBrowsingActivity(data: {
    userId?: string;
    productId?: string;
    categoryId?: string;
    page: string;
    duration?: number;
  }): Promise<void> {
    try {
      await apiService.post('/user-behavior/browsing', {
        ...data,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to record browsing activity:', error.response?.data?.message || error.message);
    }
  }

  // Get user's browsing history
  async getUserBrowsingHistory(userId: string, limit: number = 50): Promise<Array<{
    productId?: string;
    categoryId?: string;
    page: string;
    timestamp: string;
    duration?: number;
  }>> {
    try {
      const response = await apiService.get(`/user-behavior/browsing-history/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch browsing history');
    }
  }

  // Get recently viewed products
  async getRecentlyViewedProducts(userId: string, limit: number = 10): Promise<string[]> {
    try {
      const response = await apiService.get(`/user-behavior/recently-viewed/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recently viewed products');
    }
  }

  // ========== User Preferences ==========

  // Update user preferences
  async updateUserPreferences(userId: string, preferences: Partial<UserPreferences>): Promise<UserPreferences> {
    try {
      const response = await apiService.patch(`/user-behavior/preferences/${userId}`, preferences);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update user preferences');
    }
  }

  // Get user preferences
  async getUserPreferences(userId: string): Promise<UserPreferences | null> {
    try {
      const response = await apiService.get(`/user-behavior/preferences/${userId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null; // No preferences set yet
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch user preferences');
    }
  }

  // Infer preferences from behavior
  async inferUserPreferences(userId: string): Promise<UserPreferences> {
    try {
      const response = await apiService.post(`/user-behavior/infer-preferences/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to infer user preferences');
    }
  }

  // ========== Search Behavior ==========

  // Record search activity
  async recordSearchActivity(data: {
    userId?: string;
    query: string;
    resultsCount: number;
    filtersApplied?: Record<string, any>;
  }): Promise<void> {
    try {
      await apiService.post('/user-behavior/search', {
        ...data,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to record search activity:', error.response?.data?.message || error.message);
    }
  }

  // Get user's search history
  async getUserSearchHistory(userId: string, limit: number = 20): Promise<SearchBehavior[]> {
    try {
      const response = await apiService.get(`/user-behavior/search-history/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch search history');
    }
  }

  // Get popular search queries
  async getPopularSearchQueries(limit: number = 10): Promise<Array<{
    query: string;
    count: number;
  }>> {
    try {
      const response = await apiService.get('/user-behavior/popular-searches', { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch popular searches');
    }
  }

  // ========== Purchase Behavior ==========

  // Record purchase behavior
  async recordPurchaseBehavior(data: {
    userId: string;
    orderId: string;
    products: Array<{
      productId: string;
      categoryId: string;
      price: number;
      quantity: number;
    }>;
    totalAmount: number;
  }): Promise<void> {
    try {
      await apiService.post('/user-behavior/purchase', {
        ...data,
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to record purchase behavior:', error.response?.data?.message || error.message);
    }
  }

  // Get user's purchase patterns
  async getUserPurchasePatterns(userId: string): Promise<{
    averageOrderValue: number;
    favoriteCategories: Array<{ categoryId: string; purchaseCount: number }>;
    purchaseFrequency: number; // days between purchases
    seasonalTrends: Array<{ month: number; purchaseCount: number }>;
  }> {
    try {
      const response = await apiService.get(`/user-behavior/purchase-patterns/${userId}`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch purchase patterns');
    }
  }

  // ========== Session Management ==========

  // Start new session
  async startSession(userId?: string): Promise<string> {
    const sessionId = this.generateSessionId();
    try {
      await apiService.post('/user-behavior/session/start', {
        sessionId,
        userId,
        startTime: new Date().toISOString()
      });
      this.setSessionId(sessionId);
      return sessionId;
    } catch (error: any) {
      console.warn('Failed to start session:', error.response?.data?.message || error.message);
      return sessionId;
    }
  }

  // End current session
  async endSession(): Promise<void> {
    const sessionId = this.getSessionId();
    if (!sessionId) return;

    try {
      await apiService.post('/user-behavior/session/end', {
        sessionId,
        endTime: new Date().toISOString()
      });
      this.clearSessionId();
    } catch (error: any) {
      console.warn('Failed to end session:', error.response?.data?.message || error.message);
    }
  }

  // Get session data
  async getSessionData(sessionId: string): Promise<BrowsingSession | null> {
    try {
      const response = await apiService.get(`/user-behavior/session/${sessionId}`);
      return response.data;
    } catch (error: any) {
      if (error.response?.status === 404) {
        return null;
      }
      throw new Error(error.response?.data?.message || 'Failed to fetch session data');
    }
  }

  // ========== Recommendation Data ==========

  // Get user's interaction score with products
  async getUserProductAffinities(userId: string, limit: number = 20): Promise<Array<{
    productId: string;
    affinityScore: number;
    interactions: number;
  }>> {
    try {
      const response = await apiService.get(`/user-behavior/product-affinities/${userId}`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product affinities');
    }
  }

  // Record product interaction (view, add to cart, etc.)
  async recordProductInteraction(data: {
    userId?: string;
    productId: string;
    interactionType: 'view' | 'add_to_cart' | 'purchase' | 'wishlist' | 'share';
    value?: number; // For weighted interactions
  }): Promise<void> {
    try {
      await apiService.post('/user-behavior/product-interaction', {
        ...data,
        sessionId: this.getSessionId(),
        timestamp: new Date().toISOString()
      });
    } catch (error: any) {
      console.warn('Failed to record product interaction:', error.response?.data?.message || error.message);
    }
  }

  // ========== Utility Methods ==========

  private generateSessionId(): string {
    return 'session_' + Date.now() + '_' + Math.random().toString(36).substr(2, 9);
  }

  private getSessionId(): string | null {
    return sessionStorage.getItem('user_behavior_session_id');
  }

  private setSessionId(sessionId: string): void {
    sessionStorage.setItem('user_behavior_session_id', sessionId);
  }

  private clearSessionId(): void {
    sessionStorage.removeItem('user_behavior_session_id');
  }

  // Public method to get current session ID
  getCurrentSessionId(): string | null {
    return this.getSessionId();
  }

  // Auto-start session if none exists
  async ensureSession(userId?: string): Promise<string> {
    let sessionId = this.getSessionId();
    if (!sessionId) {
      sessionId = await this.startSession(userId);
    }
    return sessionId;
  }
}

export const userBehaviorService = new UserBehaviorService();
export default userBehaviorService;
