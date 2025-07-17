# Image Optimization Guidelines

This folder contains optimized images for the blog application.

## Folder Structure

- `/blog/` - Blog post featured images and content images
- `/avatars/` - User profile pictures and author avatars
- `/icons/` - Application icons and UI elements

## Image Guidelines

### Blog Images
- **Format**: WebP preferred, JPG fallback
- **Size**: Maximum 1200px width
- **Quality**: 80-85% for JPG, 75-80% for WebP
- **Naming**: Use descriptive names with hyphens (e.g., `modern-web-development.webp`)

### Avatar Images
- **Format**: WebP preferred, PNG fallback
- **Size**: 200x200px for profile pictures
- **Quality**: 85-90%
- **Naming**: Use user ID or username (e.g., `user-123.webp`)

### Icons
- **Format**: SVG preferred for scalability
- **Size**: Various sizes (16px, 24px, 32px, 48px)
- **Optimization**: Minified SVG code

## Optimization Tools

1. **ImageOptim** (macOS)
2. **TinyPNG** (online)
3. **Squoosh** (Google, online)
4. **Sharp** (Node.js library)

## Performance Tips

1. Use responsive images with `srcset`
2. Implement lazy loading for below-the-fold images
3. Provide WebP with fallback formats
4. Use proper alt text for accessibility
5. Consider using a CDN for image delivery

## Example Usage

```jsx
<picture>
  <source srcSet="/images/blog/article.webp" type="image/webp" />
  <img src="/images/blog/article.jpg" alt="Article title" loading="lazy" />
</picture>
```
