import React, { useState } from 'react';
import {
  Card,
  CardContent,
  CardMedia,
  Typography,
  Box,
  Chip,
  Rating,
  IconButton,
  Tooltip,
  Skeleton,
  Fade
} from '@mui/material';
import {
  FavoriteOutlined as FavoriteIcon,
  ShoppingCartOutlined as CartIcon,
  Visibility as ViewIcon,
  LocalOffer as OfferIcon
} from '@mui/icons-material';
import { useNavigate } from 'react-router-dom';
import { analyticsService } from '../../services';
import type { Product } from '../../types';

interface ProductCardProps {
  product: Product;
  onAddToCart?: (product: Product) => void;
  onAddToWishlist?: (product: Product) => void;
  showAnalytics?: boolean;
  userId?: string;
}

const ProductCard: React.FC<ProductCardProps> = ({
  product,
  onAddToCart,
  onAddToWishlist,
  showAnalytics = true,
  userId
}) => {
  const navigate = useNavigate();
  const [imageLoaded, setImageLoaded] = useState(false);
  const [isHovered, setIsHovered] = useState(false);

  // Find primary image or use fallback
  const primaryImage = product.images?.find(img => img.isPrimary) || product.images?.[0];
  const hasDiscount = product.discountPrice && product.discountPrice < product.price;
  const discountPercentage = hasDiscount 
    ? Math.round(((product.price - product.discountPrice!) / product.price) * 100)
    : 0;
    
  // Generate a fallback image URL if none exists
  const getFallbackImageUrl = () => {
    const categoryName = product.category?.name?.toLowerCase() || '';
    
    // Use appropriate category-based fallbacks
    if (categoryName.includes('electronics') || categoryName.includes('phone')) {
      return '/images/product-fallback-electronics.jpg';
    } else if (categoryName.includes('clothing') || categoryName.includes('apparel')) {
      return '/images/product-fallback-clothing.jpg';
    } else if (categoryName.includes('book')) {
      return '/images/product-fallback-books.jpg';
    } else {
      // Default fallback
      return '/images/product-fallback-generic.jpg';
    }
  };

  // Get first few tags for display
  const displayTags = product.content?.[0]?.tags?.slice(0, 2) || [];

  // Record product view when card is clicked
  const handleCardClick = async () => {
    if (showAnalytics) {
      try {
        await analyticsService.recordProductView(String(product.id), userId);
      } catch (error) {
        console.warn('Failed to record product view:', error);
      }
    }
    navigate(`/products/${product.id}`);
  };

  const handleAddToCart = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToCart?.(product);
  };

  const handleAddToWishlist = (e: React.MouseEvent) => {
    e.stopPropagation();
    onAddToWishlist?.(product);
  };

  // Calculate average rating
  const averageRating = product.reviews?.length > 0
    ? product.reviews.reduce((sum, review) => sum + review.rating, 0) / product.reviews.length
    : 0;

  return (
    <Card
      sx={{
        height: '100%',
        display: 'flex',
        flexDirection: 'column',
        cursor: 'pointer',
        transition: 'all 0.3s ease-in-out',
        '&:hover': {
          transform: 'translateY(-4px)',
          boxShadow: (theme) => theme.shadows[8],
        },
        position: 'relative',
        overflow: 'visible'
      }}
      onMouseEnter={() => setIsHovered(true)}
      onMouseLeave={() => setIsHovered(false)}
      onClick={handleCardClick}
    >
      {/* Discount Badge */}
      {hasDiscount && (
        <Chip
          icon={<OfferIcon />}
          label={`${discountPercentage}% OFF`}
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            left: 8,
            zIndex: 1,
            fontWeight: 'bold'
          }}
        />
      )}

      {/* Stock Badge */}
      {product.stockQuantity <= 5 && product.stockQuantity > 0 && (
        <Chip
          label={`Only ${product.stockQuantity} left`}
          color="warning"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}

      {/* Out of Stock Badge */}
      {product.stockQuantity === 0 && (
        <Chip
          label="Out of Stock"
          color="error"
          size="small"
          sx={{
            position: 'absolute',
            top: 8,
            right: 8,
            zIndex: 1
          }}
        />
      )}

      {/* Product Image */}
      <Box sx={{ position: 'relative', paddingTop: '75%' }}>
        {!imageLoaded && (
          <Skeleton
            variant="rectangular"
            sx={{
              position: 'absolute',
              top: 0,
              left: 0,
              width: '100%',
              height: '100%'
            }}
          />
        )}
        <CardMedia
          component="img"
          image={primaryImage?.url || getFallbackImageUrl()}
          alt={primaryImage?.altText || product.name}
          onError={(e) => {
            // If image fails to load, use fallback
            const target = e.target as HTMLImageElement;
            if (target.src !== getFallbackImageUrl()) {
              target.src = getFallbackImageUrl();
            }
          }}
          onLoad={() => setImageLoaded(true)}
          sx={{
            position: 'absolute',
            top: 0,
            left: 0,
            width: '100%',
            height: '100%',
            objectFit: 'cover',
            opacity: imageLoaded ? 1 : 0,
            transition: 'opacity 0.3s ease-in-out'
          }}
        />

        {/* Hover Actions */}
        <Fade in={isHovered}>
          <Box
            sx={{
              position: 'absolute',
              top: '50%',
              left: '50%',
              transform: 'translate(-50%, -50%)',
              display: 'flex',
              gap: 1,
              opacity: isHovered ? 1 : 0,
              transition: 'opacity 0.3s ease-in-out'
            }}
          >
            <Tooltip title="Quick View">
              <IconButton
                size="small"
                sx={{
                  backgroundColor: 'rgba(255, 255, 255, 0.9)',
                  '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                }}
              >
                <ViewIcon fontSize="small" />
              </IconButton>
            </Tooltip>
            
            {onAddToWishlist && (
              <Tooltip title="Add to Wishlist">
                <IconButton
                  size="small"
                  onClick={handleAddToWishlist}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                  }}
                >
                  <FavoriteIcon fontSize="small" color="error" />
                </IconButton>
              </Tooltip>
            )}
            
            {onAddToCart && product.stockQuantity > 0 && (
              <Tooltip title="Add to Cart">
                <IconButton
                  size="small"
                  onClick={handleAddToCart}
                  sx={{
                    backgroundColor: 'rgba(255, 255, 255, 0.9)',
                    '&:hover': { backgroundColor: 'rgba(255, 255, 255, 1)' }
                  }}
                >
                  <CartIcon fontSize="small" color="primary" />
                </IconButton>
              </Tooltip>
            )}
          </Box>
        </Fade>
      </Box>

      <CardContent sx={{ flexGrow: 1, display: 'flex', flexDirection: 'column' }}>
        {/* Category */}
        <Typography variant="caption" color="text.secondary" gutterBottom>
          {product.category?.name}
        </Typography>

        {/* Product Name */}
        <Typography
          variant="h6"
          component="h3"
          gutterBottom
          sx={{
            fontSize: '1rem',
            fontWeight: 600,
            lineHeight: 1.3,
            display: '-webkit-box',
            WebkitLineClamp: 2,
            WebkitBoxOrient: 'vertical',
            overflow: 'hidden',
            minHeight: '2.6em'
          }}
        >
          {product.name}
        </Typography>

        {/* Rich Content Preview */}
        {product.content?.[0]?.description && (
          <Typography
            variant="body2"
            color="text.secondary"
            sx={{
              display: '-webkit-box',
              WebkitLineClamp: 2,
              WebkitBoxOrient: 'vertical',
              overflow: 'hidden',
              mb: 1
            }}
          >
            {product.content[0].description}
          </Typography>
        )}

        {/* Rating */}
        {averageRating > 0 && (
          <Box sx={{ display: 'flex', alignItems: 'center', mb: 1 }}>
            <Rating value={averageRating} precision={0.5} size="small" readOnly />
            <Typography variant="caption" color="text.secondary" sx={{ ml: 1 }}>
              ({product.reviews?.length || 0})
            </Typography>
          </Box>
        )}

        {/* Tags */}
        {displayTags.length > 0 && (
          <Box sx={{ display: 'flex', gap: 0.5, mb: 1, flexWrap: 'wrap' }}>
            {displayTags.map((tag, index) => (
              <Chip
                key={index}
                label={typeof tag === 'object' ? tag.name : String(tag)}
                size="small"
                variant="outlined"
                sx={{ fontSize: '0.7rem', height: 20 }}
              />
            ))}
          </Box>
        )}

        {/* Price */}
        <Box sx={{ mt: 'auto' }}>
          <Box sx={{ display: 'flex', alignItems: 'center', gap: 1 }}>
            <Typography
              variant="h6"
              color="primary"
              sx={{ fontWeight: 600 }}
            >
              ${hasDiscount ? product.discountPrice!.toFixed(2) : product.price.toFixed(2)}
            </Typography>
            {hasDiscount && (
              <Typography
                variant="body2"
                color="text.secondary"
                sx={{ textDecoration: 'line-through' }}
              >
                ${product.price.toFixed(2)}
              </Typography>
            )}
          </Box>

          {/* Stock Status */}
          <Typography
            variant="caption"
            color={product.stockQuantity > 0 ? 'success.main' : 'error.main'}
            sx={{ fontWeight: 500 }}
          >
            {product.stockQuantity > 0 
              ? `${product.stockQuantity} in stock` 
              : 'Out of stock'
            }
          </Typography>
        </Box>
      </CardContent>
    </Card>
  );
};

export default ProductCard;
