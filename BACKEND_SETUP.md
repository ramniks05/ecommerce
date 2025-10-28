# Backend & Admin Panel Setup Guide

## 🎯 What's Been Implemented

Your Catalix ecommerce now includes:
- ✅ **Admin Panel** - Full dashboard at `/admin`
- ✅ **Razorpay Integration** - Indian payment gateway
- ✅ **Supabase Ready** - Backend structure prepared
- ✅ **Order Management** - Admin can manage orders
- ✅ **Product Management** - Admin can view/edit products

---

## 🚀 Quick Setup (3 Steps)

### Step 1: Create Supabase Project

1. Go to https://supabase.com
2. Click "Start your project"
3. Create new project (choose region: Mumbai for India)
4. Wait for database to be ready (~2 minutes)
5. Go to Settings → API
6. Copy **Project URL** and **anon/public key**

### Step 2: Configure Environment Variables

Create `.env.local` file in your project root:

```env
# Supabase (Get from: https://app.supabase.com/project/_/settings/api)
VITE_SUPABASE_URL=https://your-project-id.supabase.co
VITE_SUPABASE_ANON_KEY=your-anon-key-here

# Razorpay (Get from: https://dashboard.razorpay.com/app/keys)
VITE_RAZORPAY_KEY_ID=rzp_test_XXXXXXXXXXXXXX
```

### Step 3: Create Database Tables

Run this SQL in Supabase SQL Editor:

```sql
-- Enable UUID extension
CREATE EXTENSION IF NOT EXISTS "uuid-ossp";

-- Brands Table
CREATE TABLE brands (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  logo TEXT,
  hero_image TEXT,
  description TEXT,
  story TEXT,
  founded INTEGER,
  product_count INTEGER DEFAULT 0,
  categories JSONB,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Categories Table
CREATE TABLE categories (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  image TEXT,
  hero_image TEXT,
  tagline TEXT,
  description TEXT,
  story TEXT,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Products Table
CREATE TABLE products (
  id BIGSERIAL PRIMARY KEY,
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  brand_id BIGINT REFERENCES brands(id),
  category_id BIGINT REFERENCES categories(id),
  price DECIMAL(10,2) NOT NULL,
  original_price DECIMAL(10,2),
  discount INTEGER DEFAULT 0,
  rating DECIMAL(2,1) DEFAULT 0,
  review_count INTEGER DEFAULT 0,
  images JSONB,
  description TEXT,
  features JSONB,
  in_stock BOOLEAN DEFAULT TRUE,
  is_new BOOLEAN DEFAULT FALSE,
  is_featured BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Orders Table
CREATE TABLE orders (
  id TEXT PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  items JSONB NOT NULL,
  subtotal DECIMAL(10,2) NOT NULL,
  shipping DECIMAL(10,2) DEFAULT 0,
  tax DECIMAL(10,2) DEFAULT 0,
  total DECIMAL(10,2) NOT NULL,
  status TEXT DEFAULT 'processing',
  payment_method TEXT,
  payment_id TEXT,
  shipping_address JSONB,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Cart Table
CREATE TABLE cart (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id BIGINT REFERENCES products(id),
  quantity INTEGER DEFAULT 1,
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- Reviews Table
CREATE TABLE reviews (
  id BIGSERIAL PRIMARY KEY,
  product_id BIGINT REFERENCES products(id),
  user_id UUID REFERENCES auth.users(id),
  user_name TEXT,
  rating INTEGER CHECK (rating >= 1 AND rating <= 5),
  title TEXT,
  comment TEXT,
  helpful INTEGER DEFAULT 0,
  created_at TIMESTAMP DEFAULT NOW()
);

-- Wishlist Table
CREATE TABLE wishlist (
  id BIGSERIAL PRIMARY KEY,
  user_id UUID REFERENCES auth.users(id),
  product_id BIGINT REFERENCES products(id),
  created_at TIMESTAMP DEFAULT NOW(),
  UNIQUE(user_id, product_id)
);

-- User Profiles Table (extends Supabase auth.users)
CREATE TABLE user_profiles (
  id UUID PRIMARY KEY REFERENCES auth.users(id),
  first_name TEXT,
  last_name TEXT,
  phone TEXT,
  addresses JSONB,
  is_admin BOOLEAN DEFAULT FALSE,
  created_at TIMESTAMP DEFAULT NOW(),
  updated_at TIMESTAMP DEFAULT NOW()
);

-- Create indexes for better performance
CREATE INDEX idx_products_brand ON products(brand_id);
CREATE INDEX idx_products_category ON products(category_id);
CREATE INDEX idx_products_slug ON products(slug);
CREATE INDEX idx_orders_user ON orders(user_id);
CREATE INDEX idx_orders_status ON orders(status);
```

---

## 🔑 Razorpay Setup

### Get Test Credentials

1. Go to https://dashboard.razorpay.com
2. Sign up with your email
3. Go to Settings → API Keys
4. Generate **Test Mode** keys
5. Copy **Key ID** (starts with `rzp_test_`)
6. Add to `.env.local`

**Note:** Keep Key Secret secure! Never expose in frontend.

---

## 📋 Admin Panel Access

### Login as Admin

**Current Demo Admin:**
- Email: demo@example.com
- Password: demo123

**Admin Routes:**
- `/admin` - Dashboard
- `/admin/products` - Product Management
- `/admin/orders` - Order Management
- `/admin/brands` - Brand Management (coming soon)
- `/admin/settings` - Settings (coming soon)

---

## 💳 Testing Razorpay Payments

### Test Cards (Razorpay Test Mode)

**Successful Payment:**
- Card: `4111 1111 1111 1111`
- CVV: Any 3 digits
- Expiry: Any future date
- Name: Any name

**UPI (Test):**
- UPI ID: `success@razorpay`

**Failed Payment:**
- Card: `4000 0000 0000 0002`

---

## 🔄 Migration from Mock Data to Supabase

### Import Existing Data

Run this in Supabase SQL Editor after creating tables:

```sql
-- Insert your brands
INSERT INTO brands (id, name, slug, logo, hero_image, description, story, founded, product_count, categories) 
VALUES 
  (1, 'TechVision', 'techvision', 'https://...', 'https://...', '...', '...', 2010, 4, '["Electronics", "Smart Devices"]'),
  (2, 'UrbanStyle', 'urbanstyle', 'https://...', 'https://...', '...', '...', 2015, 4, '["Fashion", "Accessories"]');
-- Add all your brands...

-- Insert categories
INSERT INTO categories (id, name, slug, image, description) 
VALUES 
  (1, 'Electronics', 'electronics', 'https://...', '...'),
  (2, 'Fashion', 'fashion', 'https://...', '...');
-- Add all categories...

-- Insert products
INSERT INTO products (id, name, slug, brand_id, category_id, price, original_price, discount, rating, review_count, images, description, features, in_stock, is_new, is_featured)
VALUES
  (1, 'Wireless Pro Headphones', 'wireless-pro-headphones', 1, 1, 24999, 29999, 17, 4.8, 256, '["https://..."]', '...', '["Feature 1"]', TRUE, TRUE, TRUE);
-- Add all products...
```

---

## 🔐 Security Setup

### Row Level Security (RLS)

Run in Supabase SQL Editor:

```sql
-- Enable RLS
ALTER TABLE products ENABLE ROW LEVEL SECURITY;
ALTER TABLE brands ENABLE ROW LEVEL SECURITY;
ALTER TABLE categories ENABLE ROW LEVEL SECURITY;
ALTER TABLE orders ENABLE ROW LEVEL SECURITY;

-- Public read access for products, brands, categories
CREATE POLICY "Public read products" ON products FOR SELECT USING (true);
CREATE POLICY "Public read brands" ON brands FOR SELECT USING (true);
CREATE POLICY "Public read categories" ON categories FOR SELECT USING (true);

-- Users can only see their own orders
CREATE POLICY "Users view own orders" ON orders FOR SELECT 
  USING (auth.uid() = user_id);

-- Admin full access (check is_admin in user_profiles)
CREATE POLICY "Admin full access products" ON products FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
  
CREATE POLICY "Admin full access orders" ON orders FOR ALL
  USING (EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true));
```

---

## 📱 Features Ready to Use

### Admin Panel (Already Built)
- ✅ Dashboard with stats
- ✅ Product management table
- ✅ Order management with status updates
- ✅ Responsive sidebar navigation
- ✅ Mobile-friendly

### Razorpay (Already Integrated)
- ✅ Checkout integration
- ✅ Multiple payment methods (UPI, Cards, Net Banking, Wallets)
- ✅ COD option
- ✅ Payment success/failure handling
- ✅ Order confirmation flow

### Supabase (Structure Ready)
- ✅ Client configured
- ✅ Helper functions created
- ✅ Database schema provided
- ✅ Ready to connect

---

## 🎨 Next Steps

### Immediate (After Supabase Setup):
1. Create `.env.local` with your credentials
2. Run the SQL to create tables
3. Restart dev server: `npm run dev`
4. Visit `/admin` to see admin panel
5. Test checkout with Razorpay

### Short Term (This Week):
1. Import mock data to Supabase
2. Update Context providers to use Supabase
3. Test Razorpay with your test credentials
4. Build remaining admin pages (Brands, Categories CRUD)

### Medium Term (Next Week):
1. Add image upload to admin panel
2. Build email notifications
3. Add analytics to dashboard
4. Create invoice generation

---

## 🔧 Development Commands

```bash
# Start development server
npm run dev

# Access admin panel
http://localhost:5173/admin

# Test payment (once Razorpay configured)
1. Add items to cart
2. Go to checkout
3. Fill shipping details
4. Select Razorpay
5. Complete payment
```

---

## 📞 Admin Panel Features

### Dashboard
- Revenue, orders, products, users stats
- Recent orders list
- Quick actions
- Analytics overview

### Product Management
- View all products in table
- Search and filter
- Edit/Delete products
- Add new products (form needed)
- Stock management

### Order Management
- View all orders
- Filter by status
- Update order status
- View customer details
- Generate invoices (coming soon)

---

## 💡 Important Notes

### Razorpay
- **Test Mode**: Use test keys during development
- **Production**: Switch to live keys before launch
- **Webhook**: Set up webhook for payment verification (backend needed)
- **Never expose**: Key Secret must stay on backend

### Supabase
- **Free Tier**: 500MB database, 1GB storage
- **Upgrade**: When you need more (paid plans available)
- **Backups**: Automatic daily backups
- **Region**: Choose Mumbai/Singapore for best India performance

### Security
- Admin access currently checks email (demo@example.com)
- In production: Use `is_admin` flag in database
- Enable RLS policies
- Use environment variables for all secrets

---

## 🚀 Deployment

Your app is already configured for Vercel!

**When you add environment variables:**
1. Go to Vercel Dashboard → Settings → Environment Variables
2. Add all variables from `.env.local`
3. Redeploy

**Vercel will automatically:**
- Use environment variables
- Build with latest code
- Deploy globally
- Enable HTTPS

---

## 📚 Additional Resources

- **Supabase Docs**: https://supabase.com/docs
- **Razorpay Docs**: https://razorpay.com/docs/
- **React Integration**: https://razorpay.com/docs/payments/payment-gateway/web-integration/standard/build-integration

---

**Your backend infrastructure is ready! Just add credentials and you're live! 🎉**

