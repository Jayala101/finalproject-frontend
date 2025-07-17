import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Skeleton,
  Chip,
  IconButton,
  Tooltip,
  Alert
} from '@mui/material';
import {
  TrendingUp as TrendingIcon,
  Recommend as RecommendIcon,
  ShoppingCart as CartIcon,
  Refresh as RefreshIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { analyticsService, productService } from '../../services';
import type { Product } from '../../types';

interface RecommendationSectionProps {
  title: string;
  productIds: string[];
  icon?: React.ReactNode;
  maxItems?: number;
  onAddToCart?: (product: Product) => void;
  userId?: string;
}

const RecommendationSection: React.FC<RecommendationSectionProps> = ({
  title,
  productIds,
  icon,
  maxItems = 4,
  onAddToCart,
  userId
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchProducts = async () => {
      try {
        setLoading(true);
        setError(null);
        
        const limitedIds = productIds.slice(0, maxItems);
        const productPromises = limitedIds.map(id => 
          productService.getProduct(parseInt(id))
        );
        
        const results = await Promise.allSettled(productPromises);
        const successfulProducts = results
          .filter((result): result is PromiseFulfilledResult<Product> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);
        
        setProducts(successfulProducts);
      } catch (err) {
        setError('Failed to load recommendations');
        console.error('Error fetching recommended products:', err);
      } finally {
        setLoading(false);
      }
    };

    if (productIds.length > 0) {
      fetchProducts();
    } else {
      setLoading(false);
    }
  }, [productIds, maxItems]);

  const handleProductClick = async (product: Product) => {
    if (userId) {
      try {
        await analyticsService.recordProductView(String(product.id), userId);
      } catch (error) {
        console.warn('Failed to record product view:', error);
      }
    }
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(4, 1fr)'
            },
            gap: 2
          }}
        >
          {Array.from({ length: maxItems }).map((_, index) => (
            <Card key={index}>
              <Skeleton variant="rectangular" height={200} />
              <CardContent>
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={20} width="60%" />
                <Skeleton variant="text" height={20} width="40%" />
              </CardContent>
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (error || products.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Box sx={{ display: 'flex', alignItems: 'center', mb: 2 }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
        </Box>
        {error ? (
          <Alert severity="info" sx={{ mt: 2 }}>
            {error}
          </Alert>
        ) : (
          <Alert severity="info" sx={{ mt: 2 }}>
            No recommendations available at the moment.
          </Alert>
        )}
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Box sx={{ display: 'flex', alignItems: 'center' }}>
          {icon}
          <Typography variant="h6" sx={{ ml: 1 }}>
            {title}
          </Typography>
          <Chip 
            label={`${products.length} items`} 
            size="small" 
            color="primary" 
            variant="outlined"
            sx={{ ml: 2 }}
          />
        </Box>
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(4, 1fr)'
          },
          gap: 2
        }}
      >
        {products.map((product) => {
          const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          
          return (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'transform 0.2s ease-in-out',
                '&:hover': {
                  transform: 'translateY(-2px)',
                  boxShadow: (theme) => theme.shadows[4],
                }
              }}
              onClick={() => handleProductClick(product)}
            >
                <Box sx={{ position: 'relative' }}>
                  {primaryImage ? (
                    <CardMedia
                      component="img"
                      height="160"
                      image={primaryImage.url}
                      alt={primaryImage.altText || product.name}
                      sx={{ objectFit: 'cover' }}
                    />
                  ) : (
                    <Skeleton variant="rectangular" height={160} />
                  )}
                  
                  {hasDiscount && (
                    <Chip
                      label={`${Math.round(((product.price - product.discountPrice!) / product.price) * 100)}% OFF`}
                      color="error"
                      size="small"
                      sx={{
                        position: 'absolute',
                        top: 8,
                        left: 8,
                        fontWeight: 'bold'
                      }}
                    />
                  )}

                  {onAddToCart && (
                    <Tooltip title="Add to Cart">
                      <IconButton
                        size="small"
                        onClick={(e) => handleAddToCart(e, product)}
                        sx={{
                          position: 'absolute',
                          top: 8,
                          right: 8,
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                        }}
                      >
                        <CartIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>

                <CardContent sx={{ pb: 1 }}>
                  <Typography
                    variant="subtitle2"
                    gutterBottom
                    sx={{
                      display: '-webkit-box',
                      WebkitLineClamp: 2,
                      WebkitBoxOrient: 'vertical',
                      overflow: 'hidden',
                      minHeight: '2.5em',
                      lineHeight: 1.25
                    }}
                  >
                    {product.name}
                  </Typography>
                  
                  <Typography variant="caption" color="text.secondary" display="block">
                    {product.category?.name}
                  </Typography>
                  
                  <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mt: 1 }}>
                    <Box>
                      <Typography
                        variant="subtitle1"
                        color="primary"
                        sx={{ fontWeight: 600, fontSize: '0.9rem' }}
                      >
                        ${hasDiscount ? product.discountPrice!.toFixed(2) : product.price.toFixed(2)}
                      </Typography>
                      {hasDiscount && (
                        <Typography
                          variant="caption"
                          color="text.secondary"
                          sx={{ textDecoration: 'line-through', ml: 0.5 }}
                        >
                          ${product.price.toFixed(2)}
                        </Typography>
                      )}
                    </Box>
                    
                    <Typography
                      variant="caption"
                      color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 500 }}
                    >
                      {product.stockQuantity > 0 ? 'In Stock' : 'Out of Stock'}
                    </Typography>
                  </Box>
                </CardContent>
              </Card>
            );
          })}
        </Box>
    </Box>
  );
};

interface RecommendationContainerProps {
  userId?: string;
  currentProductId?: string;
  onAddToCart?: (product: Product) => void;
}

const RecommendationContainer: React.FC<RecommendationContainerProps> = ({
  userId,
  currentProductId,
  onAddToCart
}) => {
  const [trendingProducts, setTrendingProducts] = useState<string[]>([]);
  const [userRecommendations, setUserRecommendations] = useState<string[]>([]);
  const [similarProducts, setSimilarProducts] = useState<string[]>([]);
  const [frequentlyBought, setFrequentlyBought] = useState<string[]>([]);
  const [loading, setLoading] = useState(true);

  const fetchRecommendations = async () => {
    try {
      setLoading(true);

      // Fetch trending products
      const trending = await analyticsService.getTrendingProducts(8);
      setTrendingProducts(trending);

      // Fetch user-specific recommendations if user is logged in
      if (userId) {
        try {
          const userRecs = await analyticsService.getUserRecommendations(userId, 6);
          setUserRecommendations(userRecs);
        } catch (error) {
          console.warn('Failed to fetch user recommendations:', error);
        }
      }

      // Fetch product-specific recommendations if on product page
      if (currentProductId) {
        try {
          const [similar, frequentBought] = await Promise.all([
            analyticsService.getSimilarProducts(currentProductId, 4),
            analyticsService.getFrequentlyBoughtTogether(currentProductId, 4)
          ]);
          setSimilarProducts(similar);
          setFrequentlyBought(frequentBought);
        } catch (error) {
          console.warn('Failed to fetch product recommendations:', error);
        }
      }
    } catch (error) {
      console.error('Failed to fetch recommendations:', error);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchRecommendations();
  }, [userId, currentProductId]);

  if (loading) {
    return (
      <Box sx={{ mt: 4 }}>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        <Skeleton variant="rectangular" height={300} />
      </Box>
    );
  }

  return (
    <Box sx={{ mt: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 3 }}>
        <Typography variant="h5" gutterBottom>
          Recommendations
        </Typography>
        <Tooltip title="Refresh Recommendations">
          <IconButton onClick={fetchRecommendations} color="primary">
            <RefreshIcon />
          </IconButton>
        </Tooltip>
      </Box>

      {/* User-specific recommendations */}
      {userId && userRecommendations.length > 0 && (
        <RecommendationSection
          title="Recommended for You"
          productIds={userRecommendations}
          icon={<RecommendIcon color="primary" />}
          maxItems={4}
          onAddToCart={onAddToCart}
          userId={userId}
        />
      )}

      {/* Product-specific recommendations */}
      {currentProductId && similarProducts.length > 0 && (
        <RecommendationSection
          title="Similar Products"
          productIds={similarProducts}
          icon={<RecommendIcon color="secondary" />}
          maxItems={4}
          onAddToCart={onAddToCart}
          userId={userId}
        />
      )}

      {currentProductId && frequentlyBought.length > 0 && (
        <RecommendationSection
          title="Frequently Bought Together"
          productIds={frequentlyBought}
          icon={<CartIcon color="success" />}
          maxItems={4}
          onAddToCart={onAddToCart}
          userId={userId}
        />
      )}

      {/* Trending products */}
      {trendingProducts.length > 0 && (
        <RecommendationSection
          title="Trending Now"
          productIds={trendingProducts}
          icon={<TrendingIcon color="warning" />}
          maxItems={6}
          onAddToCart={onAddToCart}
          userId={userId}
        />
      )}
    </Box>
  );
};

export default RecommendationContainer;
export { RecommendationSection };
