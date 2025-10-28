# Quick Start Guide

## Installation & Setup

1. **Install Dependencies**
   ```bash
   npm install
   ```

2. **Start Development Server**
   ```bash
   npm run dev
   ```
   The application will open at `http://localhost:5173`

3. **Build for Production**
   ```bash
   npm run build
   ```
   Production files will be in the `dist` folder.

## Demo Account

Use these credentials to test the authentication system:
- **Email**: demo@example.com
- **Password**: demo123

## Key Features to Explore

### 1. Brand Pages (Main Feature)
- Visit `/brands` to see all brands
- Click on any brand to see the brand detail page with:
  - Brand story and information
  - All products from that brand
  - Category filtering within the brand
  - Sorting options

### 2. Product Browsing
- Browse all products at `/products`
- Use filters on the left sidebar (brands, categories, price, rating)
- Switch between grid and list views
- Search for products using the header search bar

### 3. Shopping Experience
- Add products to cart or wishlist
- View and manage cart at `/cart`
- Proceed through the checkout flow (3 steps: Shipping, Payment, Review)
- View order history at `/orders`

### 4. Brand-Focused Homepage
- Featured brands section
- Brand stories showcase
- Products categorized by brand
- Category browsing

## Project Features

✅ **Brand-Focused Architecture**
- Dedicated brand pages
- Brand filtering across products
- Brand stories and showcases

✅ **Complete Shopping Cart**
- Add/remove items
- Quantity management
- Persistent storage (LocalStorage)
- Price calculations with tax and shipping

✅ **Wishlist System**
- Save favorite products
- Move to cart
- Persistent storage

✅ **Checkout Flow**
- Multi-step process
- Form validation
- Multiple payment methods
- Order confirmation

✅ **User Authentication (Mock)**
- Login/Register
- User profile management
- Order history

✅ **Advanced Product Filtering**
- Filter by brand, category, price, rating
- Sort by various criteria
- Search functionality

✅ **Responsive Design**
- Mobile-first approach
- Works on all screen sizes
- Touch-friendly interface

## Customization

### Change Brand/Product Data
Edit `src/data/mockData.js` to add/modify:
- Brands
- Products
- Categories
- User data
- Orders

### Customize Styles
Edit `tailwind.config.js` to change:
- Color scheme
- Fonts
- Spacing
- Breakpoints

### Add New Pages
1. Create component in `src/pages/`
2. Add route in `src/App.jsx`
3. Add navigation links where needed

## Mock Data Overview

### Brands (5 brands)
- TechVision (Electronics)
- UrbanStyle (Fashion)
- HomeHaven (Home & Living)
- FitLife (Sports & Fitness)
- NaturePure (Beauty & Wellness)

### Products (19 products)
- Multiple products per brand
- Varied prices and discounts
- Product images from Unsplash
- Ratings and reviews

### Categories (5 categories)
- Electronics
- Fashion
- Home & Living
- Sports & Fitness
- Beauty & Wellness

## Tech Stack

- **React 18** - UI Framework
- **Vite** - Build Tool
- **Tailwind CSS** - Styling
- **React Router** - Routing
- **Context API** - State Management
- **React Icons** - Icons

## Folder Structure

```
src/
├── components/     # Reusable components
├── pages/         # Page components
├── context/       # State management
├── data/          # Mock data
├── App.jsx        # Main app with routing
├── main.jsx       # Entry point
└── index.css      # Global styles
```

## Need Help?

- Check `README.md` for detailed documentation
- Review mock data in `src/data/mockData.js`
- Inspect components for implementation details

## Production Deployment

When ready to deploy:

1. Build the project: `npm run build`
2. Test production build: `npm run preview`
3. Deploy the `dist` folder to your hosting service

Popular hosting options:
- Vercel (recommended for Vite projects)
- Netlify
- GitHub Pages
- AWS S3 + CloudFront

## Next Steps

To integrate with a backend:

1. Replace mock data with API calls
2. Implement real authentication (JWT, OAuth)
3. Add payment gateway integration
4. Set up order management system
5. Add image upload capabilities
6. Implement email notifications

---

**Happy Building! 🚀**

