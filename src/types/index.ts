// User and Authentication Types
export interface User {
  id: number;
  email: string;
  name: string;
  profilePicture?: string;
  role: 'customer' | 'admin';
  createdAt: string;
  updatedAt: string;
}

export interface LoginCredentials {
  email: string;
  password: string;
}

export interface RegisterData {
  name: string;
  email: string;
  password: string;
}

export interface AuthResponse {
  access_token: string;
  user: User;
}

// Product Types
export interface Product {
  id: number;
  name: string;
  description: string;
  price: number;
  discountPrice?: number;
  stockQuantity: number;
  sku: string;
  weight?: number;
  dimensions?: string;
  images: ProductImage[];
  category: Category;
  variants: ProductVariant[];
  attributes: ProductAttribute[];
  reviews: Review[];
  createdAt: string;
  updatedAt: string;
  // MongoDB content (from hybrid service)
  content?: ProductContent[];
}

// MongoDB Product Content Types
export interface ProductContent {
  id: string;
  productId: string;
  description?: string;
  features?: string[];
  specifications?: Record<string, any>;
  tags?: ProductTag[];
  richDescription?: string; // HTML content
  videoUrls?: string[];
  documents?: ProductDocument[];
  createdAt: string;
  updatedAt: string;
}

export interface ProductTag {
  id: string;
  productId: string;
  name: string;
  value?: string;
  color?: string;
  category?: string;
}

export interface ProductDocument {
  id: string;
  name: string;
  url: string;
  type: 'manual' | 'warranty' | 'specification' | 'other';
  size?: number;
}

export interface ProductImage {
  id: number;
  url: string;
  altText?: string;
  isPrimary: boolean;
}

export interface ProductVariant {
  id: number;
  name: string;
  value: string;
  priceAdjustment: number;
  stockQuantity: number;
}

export interface ProductAttribute {
  id: number;
  name: string;
  value: string;
}

// Category Types
export interface Category {
  id: number;
  name: string;
  description?: string;
  imageUrl?: string;
  parentId?: number;
  children?: Category[];
  products?: Product[];
  createdAt: string;
  updatedAt: string;
}

// Cart Types
export interface CartItem {
  id: number;
  product: Product;
  quantity: number;
  selectedVariants?: ProductVariant[];
  price: number;
}

export interface Cart {
  id: number;
  customerId: number;
  items: CartItem[];
  totalAmount: number;
  createdAt: string;
  updatedAt: string;
}

// Order Types
export interface Order {
  id: number;
  customerId: number;
  items: OrderItem[];
  shippingMethod: ShippingMethod;
  totalAmount: number;
  status: 'pending' | 'processing' | 'shipped' | 'delivered' | 'cancelled';
  shippingAddress: string;
  billingAddress: string;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  createdAt: string;
  updatedAt: string;
}

export interface OrderItem {
  id: number;
  product: Product;
  quantity: number;
  price: number;
  selectedVariants?: ProductVariant[];
}

export interface ShippingMethod {
  id: number;
  name: string;
  description?: string;
  cost: number;
  estimatedDays: number;
}

// Review Types
export interface Review {
  id: number;
  productId: number;
  customerId: number;
  customer: User;
  rating: number;
  comment?: string;
  createdAt: string;
  updatedAt: string;
}

// Customer Types
export interface Customer {
  id: number;
  user: User;
  phone?: string;
  dateOfBirth?: string;
  addresses: CustomerAddress[];
  orders: Order[];
  wishlist: Wishlist;
  createdAt: string;
  updatedAt: string;
}

export interface CustomerAddress {
  id: number;
  street: string;
  city: string;
  state: string;
  postalCode: string;
  country: string;
  isDefault: boolean;
}

// Wishlist Types
export interface Wishlist {
  id: number;
  customerId: number;
  items: WishlistItem[];
}

export interface WishlistItem {
  id: number;
  product: Product;
  addedAt: string;
}

// Invoice Types
export interface Invoice {
  id: number;
  orderId: number;
  customerId: number;
  totalAmount: number;
  taxAmount: number;
  status: 'paid' | 'pending' | 'overdue';
  dueDate: string;
  paidDate?: string;
  items: InvoiceItem[];
  payments: Payment[];
  createdAt: string;
  updatedAt: string;
}

export interface InvoiceItem {
  id: number;
  description: string;
  quantity: number;
  unitPrice: number;
  totalPrice: number;
}

export interface Payment {
  id: number;
  amount: number;
  paymentMethod: 'credit_card' | 'paypal' | 'bank_transfer';
  status: 'completed' | 'pending' | 'failed';
  transactionId?: string;
  createdAt: string;
}

// API Response Types
export interface ApiResponse<T> {
  data: T;
  message?: string;
  success: boolean;
}

export interface PaginatedResponse<T> {
  data: T[];
  meta: {
    totalItems: number;
    itemCount: number;
    itemsPerPage: number;
    totalPages: number;
    currentPage: number;
  };
  links: {
    first: string;
    previous?: string;
    next?: string;
    last: string;
  };
}

// Filter and Search Types
export interface ProductFilters {
  categoryId?: number;
  minPrice?: number;
  maxPrice?: number;
  inStock?: boolean;
  search?: string;
  sortBy?: 'price' | 'name' | 'rating' | 'newest';
  sortOrder?: 'asc' | 'desc';
  page?: number;
  limit?: number;
}

export interface OrderFilters {
  status?: string;
  customerId?: number;
  startDate?: string;
  endDate?: string;
  page?: number;
  limit?: number;
}

// Analytics Types (MongoDB)
export interface ProductView {
  id: string;
  productId: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
  userAgent?: string;
  referrer?: string;
}

export interface CategoryView {
  id: string;
  categoryId: string;
  userId?: string;
  sessionId: string;
  timestamp: string;
}

export interface SearchQuery {
  id: string;
  query: string;
  userId?: string;
  sessionId: string;
  resultsCount: number;
  timestamp: string;
  filtersApplied?: Record<string, any>;
}

export interface UserBehavior {
  id: string;
  userId: string;
  sessionId: string;
  action: 'view' | 'click' | 'add_to_cart' | 'purchase' | 'search';
  entityType: 'product' | 'category' | 'page';
  entityId: string;
  metadata?: Record<string, any>;
  timestamp: string;
}

// Session Data Types (MongoDB)
export interface SessionData {
  sessionId: string;
  userId?: string;
  startTime: string;
  endTime?: string;
  deviceInfo: {
    userAgent: string;
    platform: string;
    isMobile: boolean;
  };
  pages: Array<{
    url: string;
    title: string;
    timestamp: string;
    duration?: number;
  }>;
  interactions: UserBehavior[];
}

// Recommendation Types
export interface RecommendationData {
  userId: string;
  productId: string;
  score: number;
  reason: 'viewed_together' | 'bought_together' | 'similar_users' | 'category_affinity';
  createdAt: string;
}
