import apiService from './api';
import type { Review, PaginatedResponse } from '../types';

// Review creation data
interface CreateReviewData {
  productId: number;
  customerId: number;
  rating: number; // 1-5
  comment?: string;
}

// Review with aggregate data
interface ProductReviewSummary {
  productId: number;
  averageRating: number;
  totalReviews: number;
  ratingDistribution: {
    1: number;
    2: number;
    3: number;
    4: number;
    5: number;
  };
}

class ReviewService {
  // Create new review
  async createReview(reviewData: CreateReviewData): Promise<Review> {
    try {
      const response = await apiService.post('/reviews', reviewData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to create review');
    }
  }

  // Get all reviews (admin)
  async getAllReviews(page?: number, limit?: number): Promise<PaginatedResponse<Review>> {
    try {
      const response = await apiService.get('/reviews', { page, limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch reviews');
    }
  }

  // Get reviews for a specific product
  async getProductReviews(productId: number, page?: number, limit?: number): Promise<PaginatedResponse<Review>> {
    try {
      const response = await apiService.get(`/reviews/product/${productId}`, { page, limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product reviews');
    }
  }

  // Get reviews by a specific user
  async getUserReviews(userId: number, page?: number, limit?: number): Promise<PaginatedResponse<Review>> {
    try {
      const response = await apiService.get(`/reviews/user/${userId}`, { page, limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch user reviews');
    }
  }

  // Get average rating for a product
  async getProductAverageRating(productId: number): Promise<{ averageRating: number; totalReviews: number }> {
    try {
      const response = await apiService.get(`/reviews/product/${productId}/average-rating`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch product rating');
    }
  }

  // Get comprehensive review summary for a product
  async getProductReviewSummary(productId: number): Promise<ProductReviewSummary> {
    try {
      const response = await apiService.get(`/reviews/product/${productId}/summary`);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch review summary');
    }
  }

  // Update review
  async updateReview(reviewId: number, updateData: Partial<CreateReviewData>): Promise<Review> {
    try {
      const response = await apiService.patch(`/reviews/${reviewId}`, updateData);
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to update review');
    }
  }

  // Delete review
  async deleteReview(reviewId: number): Promise<void> {
    try {
      await apiService.delete(`/reviews/${reviewId}`);
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to delete review');
    }
  }

  // Check if user can review product (has purchased and not already reviewed)
  async canUserReviewProduct(userId: number, productId: number): Promise<{ canReview: boolean; reason?: string }> {
    try {
      const response = await apiService.get(`/reviews/can-review`, {
        userId,
        productId
      });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to check review eligibility');
    }
  }

  // Get recent reviews (for homepage, etc.)
  async getRecentReviews(limit: number = 5): Promise<Review[]> {
    try {
      const response = await apiService.get('/reviews/recent', { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch recent reviews');
    }
  }

  // Get top-rated products based on reviews
  async getTopRatedProducts(limit: number = 10): Promise<Array<{
    productId: number;
    averageRating: number;
    totalReviews: number;
  }>> {
    try {
      const response = await apiService.get('/reviews/top-rated-products', { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch top-rated products');
    }
  }

  // Report inappropriate review
  async reportReview(reviewId: number, reason: string): Promise<void> {
    try {
      await apiService.post(`/reviews/${reviewId}/report`, { reason });
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to report review');
    }
  }

  // Get helpful reviews for a product (most liked/useful)
  async getHelpfulReviews(productId: number, limit: number = 3): Promise<Review[]> {
    try {
      const response = await apiService.get(`/reviews/product/${productId}/helpful`, { limit });
      return response.data;
    } catch (error: any) {
      throw new Error(error.response?.data?.message || 'Failed to fetch helpful reviews');
    }
  }
}

export const reviewService = new ReviewService();
export default reviewService;
