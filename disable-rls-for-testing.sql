-- Disable Row Level Security for Testing
-- Run this in Supabase SQL Editor
-- WARNING: Only use for development/testing!
-- Re-enable RLS and add proper policies for production

-- =============================================
-- DISABLE RLS ON ALL TABLES (TESTING ONLY)
-- =============================================

-- User related tables
ALTER TABLE user_profiles DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS addresses DISABLE ROW LEVEL SECURITY;

-- Product related tables
ALTER TABLE brands DISABLE ROW LEVEL SECURITY;
ALTER TABLE categories DISABLE ROW LEVEL SECURITY;
ALTER TABLE products DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_variants DISABLE ROW LEVEL SECURITY;
ALTER TABLE IF EXISTS product_images DISABLE ROW LEVEL SECURITY;

-- Order related tables
ALTER TABLE orders DISABLE ROW LEVEL SECURITY;
ALTER TABLE order_items DISABLE ROW LEVEL SECURITY;

-- Shopping features
ALTER TABLE cart_items DISABLE ROW LEVEL SECURITY;
ALTER TABLE wishlist_items DISABLE ROW LEVEL SECURITY;

-- Reviews and ratings
ALTER TABLE reviews DISABLE ROW LEVEL SECURITY;

-- Admin and analytics
ALTER TABLE banners DISABLE ROW LEVEL SECURITY;
ALTER TABLE admin_users DISABLE ROW LEVEL SECURITY;
ALTER TABLE otp_verifications DISABLE ROW LEVEL SECURITY;
ALTER TABLE site_settings DISABLE ROW LEVEL SECURITY;
ALTER TABLE page_views DISABLE ROW LEVEL SECURITY;
ALTER TABLE product_views DISABLE ROW LEVEL SECURITY;

-- =============================================
-- VERIFICATION
-- =============================================

-- Check which tables have RLS disabled
SELECT 
  schemaname,
  tablename,
  rowsecurity
FROM pg_tables
WHERE schemaname = 'public'
ORDER BY tablename;

-- rowsecurity = false means RLS is disabled (good for testing)
-- rowsecurity = true means RLS is enabled

