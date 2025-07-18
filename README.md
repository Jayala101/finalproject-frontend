# E-Commerce Frontend

Modern React e-commerce frontend built with TypeScript, Vite, and Material-UI.

## 🚀 Quick Start

### Development
```bash
# Install dependencies
npm install

# Start development server
npx vite --host

# View in browser
http://localhost:5173
```

### Production Build
```bash
# Build for production
npm run build

# Preview production build
npm run preview
```

## 📦 Features

- ✅ **Modern Stack**: React 19, TypeScript, Vite 6
- ✅ **UI Framework**: Material-UI v7 with custom theme
- ✅ **Routing**: React Router Dom v7
- ✅ **Optimized Icons**: Individual MUI icon imports
- ✅ **Responsive Design**: Mobile-first approach
- ✅ **Performance**: Optimized bundle splitting
- ✅ **Windows Compatible**: Resolved EMFILE issues

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── PublicHeader.tsx
│   └── PublicFooter.tsx
├── layouts/             # Page layouts
│   └── PublicLayout.tsx
├── pages/               # Page components
│   └── public/          # Public pages
│       ├── Login.tsx
│       ├── Register.tsx
│       └── ProductCatalogSimple.tsx
├── routes/              # Routing configuration
│   ├── index.tsx
│   └── publicRoutes.tsx
├── App.tsx              # Root application component
└── main.tsx             # Application entry point
```

## 🛠️ Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build
- `npm run lint` - Run ESLint
- `npm run lint:fix` - Fix ESLint issues
- `npm run type-check` - Type checking without emit
- `npm run clean` - Clean build artifacts

## 🌐 Environment Variables

### Development (`.env.development`)
```bash
VITE_API_URL=http://localhost:3000
VITE_APP_NAME=E-Commerce Store (Development)
VITE_DEBUG=true
```

### Production (`.env.production`)
```bash
VITE_API_URL=https://your-backend-api.com
VITE_APP_NAME=E-Commerce Store
VITE_DEBUG=false
```

## 🚀 Deployment

### Netlify
1. Connect your repository
2. Set build command: `npm run build`
3. Set publish directory: `dist`
4. Configure environment variables in dashboard

### Vercel
1. Import your repository
2. Framework preset: Vite
3. Build command: `npm run build`
4. Output directory: `dist`

## 📱 Current Features

### Public Pages
- **Product Catalog**: Browse products with search and filters
- **User Authentication**: Login and registration forms
- **Responsive Navigation**: Header and footer components

### Mock Data
- Sample products with images and pricing
- Basic shopping cart functionality
- User authentication flow

## 🔧 Performance Optimizations

- **Bundle Splitting**: Vendor, MUI, and Router chunks
- **Tree Shaking**: Individual icon imports
- **Build Optimization**: ESBuild minification
- **Windows Compatible**: Reduced file operations
- **Pre-bundling**: Essential dependencies

## 🐛 Troubleshooting

### Windows EMFILE Errors
The project includes optimizations for Windows file handle limitations:
- Reduced `maxParallelFileOps` in Vite config
- Individual icon imports instead of bulk imports
- Excluded problematic directories from builds

### Build Issues
1. Clear cache: `npm run clean`
2. Reinstall dependencies: `rm -rf node_modules && npm install`
3. Check TypeScript errors: `npm run type-check`

## 📄 License

MIT License - see LICENSE file for details.

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Test thoroughly
5. Submit a pull request

---

Built with ❤️ using React, TypeScript, and Material-UI
