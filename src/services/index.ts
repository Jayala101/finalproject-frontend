// Service exports for the hybrid database architecture
export { default as apiService } from './api';
export { default as authService } from './authService';
export { default as productService, categoryService } from './productService';
export { default as cartService } from './cartService';
export { default as orderService } from './orderService';
export { default as reviewService } from './reviewService';
export { default as analyticsService } from './analyticsService';
export { default as userBehaviorService } from './userBehaviorService';

// Import services for re-export
import apiService from './api';
import authService from './authService';
import productService, { categoryService } from './productService';
import cartService from './cartService';
import orderService from './orderService';
import reviewService from './reviewService';
import analyticsService from './analyticsService';
import userBehaviorService from './userBehaviorService';

// Re-export individual services for convenience
export {
  apiService as api,
  authService as auth,
  productService as products,
  categoryService as categories,
  cartService as cart,
  orderService as orders,
  reviewService as reviews,
  analyticsService as analytics,
  userBehaviorService as userBehavior
};

// Service groups for organized imports
export const coreServices = {
  api: apiService,
  auth: authService
};

export const productServices = {
  products: productService,
  categories: categoryService,
  reviews: reviewService
};

export const commerceServices = {
  cart: cartService,
  orders: orderService
};

export const analyticsServices = {
  analytics: analyticsService,
  userBehavior: userBehaviorService
};

// All services in one object
export const services = {
  ...coreServices,
  ...productServices,
  ...commerceServices,
  ...analyticsServices
};

export default services;
