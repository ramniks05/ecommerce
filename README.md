# Catalix - Brand-Focused Ecommerce Frontend

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
- **Checkout Flow**: Multi-step checkout with Razorpay payment integration
- **Multi-Method Authentication**: Email/Password, Mobile OTP, and Google OAuth login
- **Order Management**: Order history and tracking
- **Admin Panel**: Complete backend management for products, brands, orders, and users
- **Responsive Design**: Mobile-first, fully responsive across all devices
- **Indian Market Focus**: Rupees (₹), 18% GST, Razorpay payments

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

## 📦 Quick Start

### Option 1: Demo Mode (Instant - No Setup!)

```bash
# Install dependencies
npm install

# Start development server
npm run dev

# Open http://localhost:5173
```

**Test Credentials:**
- Email Login: `demo@example.com` / `demo123`
- Mobile Login: Any 10-digit number + any 6-digit OTP (check console)
- Google Login: Requires Supabase setup (see below)

### Option 2: Full Setup (Database + Google OAuth)

```bash
# Install dependencies
npm install

# Setup environment (interactive)
node setup-env.js

# OR manually create .env.local (see SETUP_ENVIRONMENT.md)

# Start development server
npm run dev
```

**See detailed setup guides:**
- `SETUP_ENVIRONMENT.md` - Environment variables setup
- `YOUR_GOOGLE_OAUTH_STEPS.txt` - Google OAuth setup (you have Client ID!)
- `QUICK_GOOGLE_OAUTH_SETUP.md` - Detailed OAuth guide

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

## 🔐 Authentication

### Three Login Methods

1. **📧 Email/Password**
   - Traditional login
   - Works with Supabase database or demo mode
   - Demo: `demo@example.com` / `demo123`

2. **📱 Mobile OTP**
   - Passwordless login
   - OTP sent to phone (console in demo mode)
   - Any 10-digit Indian number works in demo

3. **🔗 Google OAuth**
   - One-click sign in
   - Requires Supabase setup
   - Your Client ID: `176363690527-5u61mmur3v6jdht688mghdegtu6ouqjl...`

**Setup Guide:** See `AUTHENTICATION_GUIDE.md` for complete details

## 🗄️ Database

### Supabase Integration

The app supports full database integration with Supabase:

- User authentication and profiles
- Product management
- Order tracking
- Admin panel
- Google OAuth

**Setup:**
1. Create Supabase project at https://supabase.com
2. Run `database-schema.sql` in SQL Editor
3. Configure `.env.local` (see `SETUP_ENVIRONMENT.md`)
4. Restart server

**Without Setup:** App works in demo mode with localStorage

## 🛠️ Development

### Adding New Products
Edit `src/data/mockData.js` - products are loaded from database when Supabase is configured.

### Admin Panel
Access at `/admin` - manage products, brands, orders, banners, and users.

### Customizing Theme
Edit `tailwind.config.js` or `src/index.css` for custom colors and styles.

## 📝 Available Scripts

- `npm run dev` - Start development server
- `npm run build` - Build for production
- `npm run preview` - Preview production build locally

## 📚 Documentation

- **`README.md`** (this file) - Project overview
- **`SETUP_ENVIRONMENT.md`** - Environment variables and Supabase setup
- **`YOUR_GOOGLE_OAUTH_STEPS.txt`** - Simple steps for Google OAuth (START HERE!)
- **`QUICK_GOOGLE_OAUTH_SETUP.md`** - Detailed Google OAuth guide
- **`AUTHENTICATION_GUIDE.md`** - Complete authentication system docs
- **`SETUP_CHECKLIST.md`** - Project status and next steps
- **`COMPLETE_BACKEND_SETUP.md`** - Full Supabase backend guide
- **`GOOGLE_OAUTH_SETUP.md`** - Comprehensive OAuth documentation
- **`MSG91_WIDGET_QUICK_START.md`** - MSG91 Widget setup (5 minutes!)
- **`SMS_SETUP_GUIDE.md`** - Real SMS integration (Fast2SMS, MSG91, Twilio)
- **`database-schema.sql`** - Complete database schema
- **`env.local.template`** - Environment variables template
- **`setup-env.js`** - Interactive environment setup script

## 🔄 Backend Integration

### Current Status

✅ **Frontend**: 100% Complete
✅ **Authentication**: Email, Mobile OTP, Google OAuth
✅ **Database Schema**: Ready to use
✅ **Integration Code**: Fully implemented
⏳ **Configuration**: Need Supabase credentials

### What's Integrated

- ✅ Supabase Authentication (Email, Phone, Google OAuth)
- ✅ User profile management
- ✅ Product CRUD operations  
- ✅ Order management
- ✅ Admin panel
- ✅ Razorpay payment gateway
- ✅ Image storage (Supabase Storage)

### To Go Live

1. Create Supabase project
2. Run database-schema.sql
3. Configure `.env.local`
4. Set up Google OAuth
5. Deploy to Vercel
6. Add environment variables to Vercel
7. Test production

**Estimated time: 20-30 minutes**

## 🤝 Contributing

This is a client project. For modifications or enhancements, please contact the development team.

## 📄 License

Proprietary - All rights reserved

## 👥 Credits

Built with modern web technologies and best practices for a professional ecommerce experience.

---

**Note**: This is a frontend-only implementation with mock data. Backend integration is required for production use.
