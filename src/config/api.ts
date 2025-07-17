/// <reference types="vite/client" />

// API Configuration
export const API_CONFIG = {
  // Base API URL - prefer local API_URL for development if available
  BASE_URL: import.meta.env.VITE_API_URL || import.meta.env.VITE_API_BASE_URL || 'https://nestjs-blog-backend-ecommerce.desarrollo-software.xyz',
  
  // Environment settings
  IS_DEV: import.meta.env.DEV === true,
  IS_PROD: import.meta.env.PROD === true,
  
  // Feature flags
  ENABLE_ANALYTICS: import.meta.env.VITE_ENABLE_ANALYTICS === 'true',
  ENABLE_MOCK_DATA: import.meta.env.VITE_ENABLE_MOCK_DATA === 'true',
  DEBUG: import.meta.env.VITE_DEBUG === 'true',
  
  // Request timeout in milliseconds
  TIMEOUT: 10000,
  
  // API version
  API_VERSION: 'v1',
  
  // Endpoints
  ENDPOINTS: {
    // PostgreSQL endpoints
    POSTGRES: {
      USERS: '/users',
      CATEGORIES: '/categories',
      PRODUCTS: '/products',
      ORDERS: '/orders',
      CARTS: '/carts',
      SHIPPING: '/shipping-methods',
      DISCOUNTS: '/discounts',
      POSTS: '/posts',
    },
    
    // MongoDB endpoints
    MONGO: {
      PRODUCT_CONTENT: '/product-content',
      USER_BEHAVIOR: '/user-behavior',
      SESSIONS: '/session-data',
      REVIEWS: '/reviews',
      ANALYTICS: '/analytics',
      CONTENT: '/content',
    },
    
    // Hybrid endpoints
    HYBRID: {
      PRODUCTS: '/hybrid/products',
      USERS: '/hybrid/users',
      RECOMMENDATIONS: '/hybrid/recommendations',
    },
    
    // Auth endpoints
    AUTH: {
      LOGIN: '/auth/login',
      REGISTER: '/auth/register',
      PROFILE: '/auth/profile',
      RESET_PASSWORD: '/auth/reset-password',
    },
  },
};

export default API_CONFIG;