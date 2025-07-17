import React, { useState, useEffect } from 'react';
import {
  Box,
  Typography,
  Card,
  CardContent,
  CardMedia,
  Chip,
  Rating,
  Skeleton,
  Button,
  IconButton,
  Tooltip,
  CardActions,
  Divider
} from '@mui/material';
import {
  Favorite as FavoriteIcon,
  FavoriteBorder as FavoriteBorderIcon,
  Share as ShareIcon,
  CompareArrows as CompareIcon,
  ShoppingCart as CartIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { analyticsService, productService } from '../../services';
import type { Product } from '../../types';

interface PersonalizedRecommendationsProps {
  userId: string;
  maxItems?: number;
  title?: string;
  showActions?: boolean;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  onShare?: (product: Product) => void;
  onCompare?: (product: Product) => void;
}

const PersonalizedRecommendations: React.FC<PersonalizedRecommendationsProps> = ({
  userId,
  maxItems = 6,
  title = "Recommended for You",
  showActions = true,
  onAddToCart,
  onAddToWishlist,
  onShare,
  onCompare
}) => {
  const navigate = useNavigate();
  const [products, setProducts] = useState<Product[]>([]);
  const [loading, setLoading] = useState(true);
  const [wishlist, setWishlist] = useState<Set<number>>(new Set());
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const fetchRecommendations = async () => {
      try {
        setLoading(true);
        setError(null);

        // Get personalized recommendations based on user behavior
        const recommendedIds = await analyticsService.getUserRecommendations(userId, maxItems);
        
        if (recommendedIds.length === 0) {
          // Fallback to trending products if no personal recommendations
          const trendingIds = await analyticsService.getTrendingProducts(maxItems);
          recommendedIds.push(...trendingIds);
        }

        // Fetch product details
        const productPromises = recommendedIds
          .slice(0, maxItems)
          .map(id => productService.getProduct(parseInt(id)));
        
        const results = await Promise.allSettled(productPromises);
        const successfulProducts = results
          .filter((result): result is PromiseFulfilledResult<Product> => 
            result.status === 'fulfilled'
          )
          .map(result => result.value);

        setProducts(successfulProducts);
      } catch (err) {
        setError('Failed to load personalized recommendations');
        console.error('Error fetching personalized recommendations:', err);
      } finally {
        setLoading(false);
      }
    };

    fetchRecommendations();
  }, [userId, maxItems]);

  const handleProductClick = async (product: Product) => {
    try {
      await analyticsService.recordProductView(String(product.id), userId);
    } catch (error) {
      console.warn('Failed to record product view:', error);
    }
    navigate(`/products/${product.id}`);
  };

  const handleWishlistToggle = (e: React.MouseEvent, product: Product) => {
    e.stopPropagation();
    const newWishlist = new Set(wishlist);
    
    if (wishlist.has(product.id)) {
      newWishlist.delete(product.id);
    } else {
      newWishlist.add(product.id);
    }
    
    setWishlist(newWishlist);
    onAddToWishlist?.(product);
  };

  const handleAction = (e: React.MouseEvent, action: () => void) => {
    e.stopPropagation();
    action();
  };

  if (loading) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Box 
          sx={{
            display: 'grid',
            gridTemplateColumns: {
              xs: '1fr',
              sm: 'repeat(2, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(6, 1fr)'
            },
            gap: 2
          }}
        >
          {Array.from({ length: maxItems }).map((_, index) => (
            <Card key={index} sx={{ height: '100%' }}>
              <Skeleton variant="rectangular" height={180} />
              <CardContent>
                <Skeleton variant="text" height={24} />
                <Skeleton variant="text" height={20} width="80%" />
                <Skeleton variant="text" height={20} width="60%" />
                <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                  <Skeleton variant="rectangular" width={80} height={16} />
                  <Skeleton variant="text" width={40} height={16} sx={{ ml: 1 }} />
                </Box>
              </CardContent>
              {showActions && (
                <CardActions>
                  <Skeleton variant="rectangular" width={100} height={32} />
                </CardActions>
              )}
            </Card>
          ))}
        </Box>
      </Box>
    );
  }

  if (error || products.length === 0) {
    return (
      <Box sx={{ mb: 4 }}>
        <Typography variant="h6" gutterBottom>
          {title}
        </Typography>
        <Typography color="text.secondary">
          {error || "No recommendations available at the moment."}
        </Typography>
      </Box>
    );
  }

  return (
    <Box sx={{ mb: 4 }}>
      <Box sx={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', mb: 2 }}>
        <Typography variant="h6">
          {title}
        </Typography>
        <Chip 
          label={`${products.length} items`} 
          size="small" 
          color="primary" 
          variant="outlined"
        />
      </Box>

      <Box 
        sx={{
          display: 'grid',
          gridTemplateColumns: {
            xs: '1fr',
            sm: 'repeat(2, 1fr)',
            md: 'repeat(3, 1fr)',
            lg: 'repeat(6, 1fr)'
          },
          gap: 2
        }}
      >
        {products.map((product) => {
          const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
          const hasDiscount = product.discountPrice && product.discountPrice < product.price;
          const discountPercentage = hasDiscount 
            ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
            : 0;
          const isInWishlist = wishlist.has(product.id);
          
          return (
            <Card
              key={product.id}
              sx={{
                height: '100%',
                cursor: 'pointer',
                transition: 'all 0.3s ease-in-out',
                position: 'relative',
                '&:hover': {
                  transform: 'translateY(-4px)',
                  boxShadow: (theme) => theme.shadows[8],
                  '& .product-actions': {
                    opacity: 1,
                    transform: 'translateY(0)'
                  }
                }
              }}
              onClick={() => handleProductClick(product)}
            >
              <Box sx={{ position: 'relative' }}>
                {primaryImage ? (
                  <CardMedia
                    component="img"
                    height="180"
                    image={primaryImage.url}
                    alt={primaryImage.altText || product.name}
                    sx={{ objectFit: 'cover' }}
                  />
                ) : (
                  <Skeleton variant="rectangular" height={180} />
                )}
                
                {hasDiscount && (
                  <Chip
                    label={`${discountPercentage}% OFF`}
                    color="error"
                    size="small"
                    sx={{
                      position: 'absolute',
                      top: 8,
                      left: 8,
                      fontWeight: 'bold',
                      fontSize: '0.7rem'
                    }}
                  />
                )}

                <Box
                  className="product-actions"
                  sx={{
                    position: 'absolute',
                    top: 8,
                    right: 8,
                    display: 'flex',
                    flexDirection: 'column',
                    gap: 0.5,
                    opacity: 0,
                    transform: 'translateY(-10px)',
                    transition: 'all 0.3s ease-in-out'
                  }}
                >
                  <Tooltip title={isInWishlist ? "Remove from Wishlist" : "Add to Wishlist"}>
                    <IconButton
                      size="small"
                      onClick={(e) => handleWishlistToggle(e, product)}
                      sx={{
                        backgroundColor: 'rgba(255, 255, 255, 0.9)',
                        '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                      }}
                    >
                      {isInWishlist ? (
                        <FavoriteIcon fontSize="small" color="error" />
                      ) : (
                        <FavoriteBorderIcon fontSize="small" />
                      )}
                    </IconButton>
                  </Tooltip>

                  {onShare && (
                    <Tooltip title="Share">
                      <IconButton
                        size="small"
                        onClick={(e) => handleAction(e, () => onShare(product))}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                        }}
                      >
                        <ShareIcon fontSize="small" color="primary" />
                      </IconButton>
                    </Tooltip>
                  )}

                  {onCompare && (
                    <Tooltip title="Compare">
                      <IconButton
                        size="small"
                        onClick={(e) => handleAction(e, () => onCompare(product))}
                        sx={{
                          backgroundColor: 'rgba(255, 255, 255, 0.9)',
                          '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                        }}
                      >
                        <CompareIcon fontSize="small" color="info" />
                      </IconButton>
                    </Tooltip>
                  )}
                </Box>
              </Box>

              <CardContent sx={{ pb: showActions ? 1 : 2 }}>
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
                </Box>

                {product.reviews && product.reviews.length > 0 && (
                  <Box sx={{ display: 'flex', alignItems: 'center', mt: 1 }}>
                    <Rating
                      value={product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length}
                      precision={0.1}
                      size="small"
                      readOnly
                    />
                    <Typography variant="caption" color="text.secondary" sx={{ ml: 0.5 }}>
                      ({product.reviews.length})
                    </Typography>
                  </Box>
                )}
              </CardContent>

              {showActions && (
                <>
                  <Divider />
                  <CardActions sx={{ justifyContent: 'space-between', px: 2 }}>
                    <Typography
                      variant="caption"
                      color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
                      sx={{ fontWeight: 500 }}
                    >
                      {product.stockQuantity > 0 ? `${product.stockQuantity} in stock` : 'Out of Stock'}
                    </Typography>
                    
                    {onAddToCart && (
                      <Button
                        size="small"
                        variant="contained"
                        startIcon={<CartIcon />}
                        disabled={product.stockQuantity === 0}
                        onClick={(e) => handleAction(e, () => onAddToCart(product))}
                        sx={{ ml: 'auto' }}
                      >
                        Add to Cart
                      </Button>
                    )}
                  </CardActions>
                </>
              )}
            </Card>
          );
        })}
      </Box>
    </Box>
  );
};

export default PersonalizedRecommendations;
