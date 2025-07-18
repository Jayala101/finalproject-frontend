import { API_CONFIG } from '../config/api';

/**
 * Process image URLs to ensure they have full absolute URLs
 * This handles both API-provided images and local fallback images
 */
export const processImageUrl = (imageUrl: string | undefined): string => {
  if (!imageUrl) {
    return '/images/product-fallback-generic.jpg';
  }

  // If the URL already starts with http or https, it's already absolute
  if (imageUrl.startsWith('http://') || imageUrl.startsWith('https://')) {
    return imageUrl;
  }

  // If it starts with a slash, it could be a local public file or a relative API path
  if (imageUrl.startsWith('/')) {
    // If it starts with /images/, it's a local fallback image
    if (imageUrl.startsWith('/images/')) {
      return imageUrl;
    }
    
    // Otherwise, it's likely an API path that needs the base URL
    // Remove any leading slash for consistency when joining with base URL
    const cleanPath = imageUrl.startsWith('/') ? imageUrl.substring(1) : imageUrl;
    
    // Make sure the base URL doesn't end with a slash before concatenating
    const baseUrl = API_CONFIG.BASE_URL.endsWith('/') 
      ? API_CONFIG.BASE_URL.slice(0, -1) 
      : API_CONFIG.BASE_URL;
      
    return `${baseUrl}/${cleanPath}`;
  }
  
  // If it's a relative path without a leading slash, append to API base URL
  const baseUrl = API_CONFIG.BASE_URL.endsWith('/') 
    ? API_CONFIG.BASE_URL 
    : `${API_CONFIG.BASE_URL}/`;
    
  return `${baseUrl}${imageUrl}`;
};

/**
 * Process a product to ensure all image URLs are absolute
 */
export const processProductImages = (product: any): any => {
  if (!product) return product;
  
  // Deep clone the product to avoid mutation
  const processedProduct = { ...product };
  
  // Process the images array if it exists
  if (processedProduct.images && Array.isArray(processedProduct.images)) {
    processedProduct.images = processedProduct.images.map((image: { url?: string }) => ({
      ...image,
      processedUrl: processImageUrl(image.url)
    }));
  }
  
  return processedProduct;
};

/**
 * Process an array of products to ensure all image URLs are absolute
 */
export const processProductsImages = (products: any[]): any[] => {
  if (!products || !Array.isArray(products)) return [];
  
  return products.map(product => processProductImages(product));
};
