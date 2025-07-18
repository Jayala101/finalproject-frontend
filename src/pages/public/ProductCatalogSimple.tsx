import React, { useState, useEffect } from 'react';
import {
  Box,
  Card,
  CardMedia,
  CardContent,
  Typography,
  Button,
  TextField,
  InputAdornment,
  Chip,
  Rating,
  Container,
  Fab,
  CircularProgress,
  Alert,
} from '@mui/material';
import SearchIcon from '@mui/icons-material/Search';
import ShoppingCartIcon from '@mui/icons-material/ShoppingCart';
import { useNavigate } from 'react-router-dom';
import { productService } from '../../services/productService';
import { API_CONFIG } from '../../config/api';
import { processProductsImages } from '../../utils/imageProcessor';
import type { Product } from '../../types';

// Fallback products in case API fails
const FALLBACK_PRODUCTS: Product[] = [
  {
    id: 1,
    name: 'Samsung Galaxy Smartphone',
    price: 599.99,
    description: 'Latest Samsung Galaxy smartphone with advanced features',
    stockQuantity: 10,
    sku: 'GALAXY-001',
    images: [{ id: 1, url: '/images/product-fallback-electronics.jpg', altText: 'Samsung Galaxy', isPrimary: true }],
    category: { id: 1, name: 'Electronics', createdAt: '', updatedAt: '' },
    variants: [],
    attributes: [],
    reviews: [],
    createdAt: '',
    updatedAt: ''
  },
  {
    id: 2,
    name: 'Nike Air Max Sneakers',
    price: 129.99,
    description: 'Comfortable and stylish Nike Air Max sneakers',
    stockQuantity: 5,
    sku: 'NIKE-001',
    images: [{ id: 2, url: '/images/product-fallback-generic.jpg', altText: 'Nike Air Max', isPrimary: true }],
    category: { id: 2, name: 'Fashion', createdAt: '', updatedAt: '' },
    variants: [],
    attributes: [],
    reviews: [],
    createdAt: '',
    updatedAt: ''
  }
];

const ProductCatalogSimple: React.FC = () => {
  const [searchTerm, setSearchTerm] = useState('');
  const [cartCount, setCartCount] = useState(0);
  // Initialize products as an empty array to prevent undefined errors
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string>('');
  const navigate = useNavigate();

  useEffect(() => {
    fetchProducts();
  }, []);

  const fetchProducts = async () => {
    try {
      setLoading(true);
      setError('');
      
      // If we're in debug mode, log the API URL being used
      if (API_CONFIG.DEBUG) {
        console.log('🔍 Fetching products from:', API_CONFIG.BASE_URL);
      }
      
      const response = await productService.getProducts({ page: 1, limit: 12 });
      
      // Check if the response has valid data
      if (response && response.data && Array.isArray(response.data)) {
        // Process all product images to ensure URLs are absolute
        const processedProducts = processProductsImages(response.data);
        setProducts(processedProducts);
      } else {
        // If response doesn't have expected data structure, throw an error
        throw new Error('Invalid response format from API');
      }
    } catch (error: any) {
      console.error('Error fetching products:', error);
      setError(error.message || 'Failed to fetch products');
      
      // Always use the fallback products when there's an error
      setProducts(FALLBACK_PRODUCTS);
      
      // Log detailed error in debug mode
      if (API_CONFIG.DEBUG) {
        console.error('Detailed error:', error);
      }
    } finally {
      setLoading(false);
    }
  };

  // Ensure products is always an array before filtering
  const filteredProducts = (products || []).filter(product =>
    product?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    product?.category?.name?.toLowerCase().includes(searchTerm.toLowerCase()) ||
    false // Add fallback for undefined cases
  );

  const addToCart = (productId: number) => {
    setCartCount(prev => prev + 1);
    console.log(`Added product ${productId} to cart`);
  };

  if (loading) {
    return (
      <Container maxWidth="xl" sx={{ py: 4, display: 'flex', justifyContent: 'center' }}>
        <CircularProgress />
      </Container>
    );
  }

  if (error && products.length === 0) {
    return (
      <Container maxWidth="xl" sx={{ py: 4 }}>
        <Alert severity="error">{error}</Alert>
      </Container>
    );
  }

  return (
    <Container maxWidth="xl" sx={{ py: 4 }}>
      {/* Search Bar */}
      <Box sx={{ mb: 4 }}>
        <TextField
          fullWidth
          placeholder="Search products..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          InputProps={{
            startAdornment: (
              <InputAdornment position="start">
                <SearchIcon />
              </InputAdornment>
            ),
          }}
          sx={{ maxWidth: 600, mx: 'auto', display: 'block' }}
        />
      </Box>

      {/* Products Grid */}
      <Box sx={{ 
        display: 'grid', 
        gridTemplateColumns: 'repeat(auto-fill, minmax(280px, 1fr))', 
        gap: 3 
      }}>
        {filteredProducts.map((product) => (            <Card key={product.id} sx={{ height: '100%', display: 'flex', flexDirection: 'column' }}>
              <CardMedia
                component="img"
                height="200"
                image={product.images?.[0]?.processedUrl || product.images?.[0]?.url || '/images/product-fallback-generic.jpg'}
                alt={product.name || 'Product image'}
                onError={(e) => {
                  // If image fails to load, use a local fallback
                  const target = e.target as HTMLImageElement;
                  const categoryName = product?.category?.name?.toLowerCase() || '';
                  let fallbackImage = '/images/product-fallback-generic.jpg';
                  
                  // Use category-specific fallbacks if available
                  if (categoryName.includes('electronics') || categoryName.includes('phone')) {
                    fallbackImage = '/images/product-fallback-electronics.jpg';
                  }
                  
                  if (target.src !== fallbackImage) {
                    target.src = fallbackImage;
                  }
                }}
              />
              <CardContent sx={{ flexGrow: 1 }}>
                <Typography gutterBottom variant="h6" component="div" noWrap>
                  {product.name}
                </Typography>
                <Typography variant="body2" color="text.secondary" sx={{ mb: 1 }}>
                  {product.description}
                </Typography>
                <Chip 
                  label={product.category?.name || 'Uncategorized'} 
                  size="small" 
                  sx={{ mb: 1 }}
                />
                <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
                  <Rating value={4.0} precision={0.1} readOnly size="small" />
                  <Typography variant="body2" sx={{ ml: 1 }}>
                    (4.0)
                  </Typography>
                </Box>
                <Typography variant="h6" color="primary" sx={{ fontWeight: 'bold' }}>
                  ${product.price.toFixed(2)}
                </Typography>
              </CardContent>
            <Box sx={{ p: 2, pt: 0 }}>
              <Button
                fullWidth
                variant="contained"
                onClick={() => addToCart(product.id)}
                sx={{ mb: 1 }}
              >
                Add to Cart
              </Button>
            </Box>
          </Card>
        ))}
      </Box>

      {/* Floating Action Button for Cart */}
      <Fab
        color="primary"
        aria-label="cart"
        sx={{ position: 'fixed', bottom: 16, right: 16 }}
        onClick={() => navigate('/cart')}
      >
        <Box sx={{ position: 'relative' }}>
          <ShoppingCartIcon />
          {cartCount > 0 && (
            <Chip
              label={cartCount}
              size="small"
              color="error"
              sx={{
                position: 'absolute',
                top: -8,
                right: -8,
                minWidth: 20,
                height: 20,
                fontSize: '0.75rem'
              }}
            />
          )}
        </Box>
      </Fab>
    </Container>
  );
};

export default ProductCatalogSimple;
