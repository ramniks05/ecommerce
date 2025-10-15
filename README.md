# BrandStore - Brand-Focused Ecommerce Frontend

A modern, fully-featured ecommerce frontend built with React, Vite, and Tailwind CSS. This project emphasizes brand-specific pages and showcases, making it perfect for multi-brand retail platforms.

## 🌐 Live Demo

**Production URL:** https://ecommerce-156vkzyvs-ramesh-kumars-projects-1f5ac258.vercel.app

**GitHub Repository:** https://github.com/ramniks05/ecommerce.git

## 🚀 Features

### Core Features
- **Brand-Focused Architecture**: Dedicated brand pages with stories, products, and filtering
- **Product Catalog**: Comprehensive product listing with advanced filtering and sorting
- **Shopping Cart**: Full cart functionality with quantity management and persistence
- **Wishlist**: Save favorite products for later
- **Checkout Flow**: Multi-step checkout with form validation
- **User Authentication**: Mock authentication system with login/register
- **Order Management**: Order history and tracking
- **Responsive Design**: Mobile-first, fully responsive across all devices

### Brand Features (Key Differentiator)
- Brand listing page with all available brands
- Individual brand detail pages with:
  - Brand story and hero imagery
  - Brand-specific product filtering
  - Brand statistics and categories
  - Featured brand products
- Brand showcase on homepage
- Filter products by brand across the site

### Technical Features
- **React 18** with functional components and hooks
- **React Router** for navigation
- **Context API** for state management
- **Tailwind CSS** for styling
- **LocalStorage** for data persistence
- **Mock Data** for realistic product catalog

## 📦 Installation

1. **Clone the repository**
   ```bash
   cd ecommerce
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Start development server**
   ```bash
   npm run dev
   ```

4. **Open your browser**
   Navigate to `http://localhost:5173`

## 🏗️ Project Structure

```
src/
├── components/          # Reusable UI components
│   ├── Header.jsx
│   ├── Footer.jsx
│   ├── ProductCard.jsx
│   ├── BrandCard.jsx
│   ├── FilterSidebar.jsx
│   ├── Breadcrumb.jsx
│   └── Notification.jsx
├── pages/              # Route-based page components
│   ├── Home.jsx
│   ├── Products.jsx
│   ├── ProductDetail.jsx
│   ├── Brands.jsx
│   ├── BrandDetail.jsx
│   ├── Categories.jsx
│   ├── Cart.jsx
│   ├── Wishlist.jsx
│   ├── Checkout.jsx
│   ├── Login.jsx
│   ├── Register.jsx
│   ├── Profile.jsx
│   ├── Orders.jsx
│   └── OrderConfirmation.jsx
├── context/           # React Context for state management
│   ├── CartContext.jsx
│   ├── WishlistContext.jsx
│   ├── AuthContext.jsx
│   └── NotificationContext.jsx
├── data/             # Mock data
│   └── mockData.js
├── App.jsx           # Main app component with routing
├── main.jsx         # App entry point
└── index.css        # Global styles and Tailwind
```

## 🎨 Design Philosophy

- **Modern & Clean**: Professional UI with consistent spacing and typography
- **Brand-Centric**: Emphasizes brand identity and storytelling
- **User-Friendly**: Intuitive navigation and clear call-to-actions
- **Accessible**: ARIA labels, keyboard navigation, and semantic HTML
- **Performance**: Optimized images, lazy loading, and efficient rendering

## 🛠️ Technologies Used

- **React 18** - UI library
- **Vite** - Build tool and dev server
- **React Router** - Client-side routing
- **Tailwind CSS** - Utility-first CSS framework
- **React Icons** - Icon library (Feather Icons)
- **Context API** - State management
- **LocalStorage API** - Data persistence

## 📱 Key Pages

### Homepage
- Hero section with featured brands
- Brand showcase
- Category highlights
- Featured products
- New arrivals
- Brand stories
- Newsletter signup

### Brand Pages
- **Brand Listing**: Grid of all brands with logos and descriptions
- **Brand Detail**: Complete brand showcase with products, story, and filtering

### Product Pages
- **Product Listing**: Grid/list view with advanced filtering
- **Product Detail**: Full product information with image gallery, reviews, and related products

### Shopping Flow
- Cart with quantity management
- Wishlist for saved products
- Multi-step checkout (Shipping → Payment → Review)
- Order confirmation

### User Account
- Login/Register with mock authentication
- User profile management
- Order history

## 🎯 Mock Data

The application includes comprehensive mock data:
- **5 Brands** with detailed information and stories
- **19 Products** across multiple categories
- **5 Categories** with images
- **Mock User** for authentication (email: demo@example.com, password: demo123)
- **Sample Orders** for order history

## 🚀 Getting Started for Development

### Demo Credentials
- **Email**: demo@example.com
- **Password**: demo123

### Adding New Products
Edit `src/data/mockData.js` and add products to the `products` array following the existing structure.

### Adding New Brands
Edit `src/data/mockData.js` and add brands to the `brands` array. Products will automatically associate via `brandId`.

### Customizing Theme
Edit `tailwind.config.js` to customize colors, fonts, and other design tokens.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 🔄 Future Backend Integration

This frontend is ready for backend integration. You'll need to:

1. Replace mock data with API calls
2. Implement real authentication (JWT, OAuth, etc.)
3. Add actual payment processing
4. Implement real order management
5. Add image upload for user profiles

The context-based architecture makes it easy to swap out mock implementations with real API calls.

## 🤝 Contributing

This is a client project. For modifications or enhancements, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👥 Credits

Built with modern web technologies and best practices for a professional ecommerce experience.

---

**Note**: This is a frontend-only implementation with mock data. Backend integration is required for production use.
