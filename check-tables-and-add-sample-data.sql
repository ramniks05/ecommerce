-- Check Tables and Add Sample Data
-- Run this in Supabase SQL Editor

-- =============================================
-- CHECK IF TABLES EXIST
-- =============================================

-- Check if main tables exist
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('brands', 'categories', 'products', 'admin_users')
ORDER BY table_name;

-- =============================================
-- ADD SAMPLE BRANDS
-- =============================================

-- Insert sample brands
INSERT INTO brands (name, slug, description, story, website_url, founded_year, country, is_featured, is_active, sort_order)
VALUES 
  ('Nike', 'nike', 'Just Do It - Innovation and performance in every product', 'Founded in 1964, Nike has been at the forefront of athletic innovation, creating products that help athletes push their limits.', 'https://nike.com', 1964, 'United States', true, true, 1),
  ('Adidas', 'adidas', 'Impossible is Nothing - Three stripes of excellence', 'Adidas has been creating innovative sports products since 1949, combining performance with style.', 'https://adidas.com', 1949, 'Germany', true, true, 2),
  ('Apple', 'apple', 'Think Different - Technology that changes everything', 'Apple revolutionized personal technology with the iPhone, iPad, and Mac, creating products that are both beautiful and functional.', 'https://apple.com', 1976, 'United States', true, true, 3),
  ('Samsung', 'samsung', 'Innovation for Everyone - Technology that connects the world', 'Samsung has been leading the way in consumer electronics and mobile technology for decades.', 'https://samsung.com', 1938, 'South Korea', true, true, 4),
  ('Sony', 'sony', 'Be Moved - Entertainment and technology excellence', 'Sony has been creating innovative products in electronics, gaming, and entertainment for over 70 years.', 'https://sony.com', 1946, 'Japan', true, true, 5)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ADD SAMPLE CATEGORIES
-- =============================================

-- Insert sample categories
INSERT INTO categories (name, slug, description, is_active, sort_order)
VALUES 
  ('Electronics', 'electronics', 'Latest gadgets and electronic devices', true, 1),
  ('Fashion', 'fashion', 'Trendy clothing and accessories', true, 2),
  ('Sports', 'sports', 'Sports equipment and athletic wear', true, 3),
  ('Home & Garden', 'home-garden', 'Everything for your home and garden', true, 4),
  ('Books', 'books', 'Books for all ages and interests', true, 5),
  ('Beauty', 'beauty', 'Beauty and personal care products', true, 6),
  ('Toys', 'toys', 'Toys and games for children', true, 7),
  ('Automotive', 'automotive', 'Car accessories and parts', true, 8)
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ADD SAMPLE PRODUCTS
-- =============================================

-- Get brand and category IDs for product creation
WITH brand_cat AS (
  SELECT 
    (SELECT id FROM brands WHERE slug = 'nike') as nike_id,
    (SELECT id FROM brands WHERE slug = 'apple') as apple_id,
    (SELECT id FROM brands WHERE slug = 'samsung') as samsung_id,
    (SELECT id FROM categories WHERE slug = 'electronics') as electronics_id,
    (SELECT id FROM categories WHERE slug = 'fashion') as fashion_id,
    (SELECT id FROM categories WHERE slug = 'sports') as sports_id
)
INSERT INTO products (name, slug, brand_id, category_id, sku, price, original_price, stock_quantity, description, short_description, is_featured, is_new, is_bestseller, is_active)
SELECT 
  'iPhone 15 Pro', 'iphone-15-pro', apple_id, electronics_id, 'IPH15PRO-001', 99999.00, 109999.00, 50, 
  'The most advanced iPhone ever with titanium design and A17 Pro chip.', 
  'Latest iPhone with titanium design', true, true, true, true
FROM brand_cat
UNION ALL
SELECT 
  'Samsung Galaxy S24', 'samsung-galaxy-s24', samsung_id, electronics_id, 'SGS24-001', 79999.00, 89999.00, 30,
  'Powerful Android smartphone with AI features and stunning display.',
  'AI-powered Android smartphone', true, true, false, true
FROM brand_cat
UNION ALL
SELECT 
  'Nike Air Max 270', 'nike-air-max-270', nike_id, sports_id, 'NAM270-001', 8999.00, 9999.00, 100,
  'Comfortable running shoes with Max Air cushioning for all-day comfort.',
  'Comfortable running shoes', false, false, true, true
FROM brand_cat
ON CONFLICT (slug) DO NOTHING;

-- =============================================
-- ADD ADMIN USER (if not exists)
-- =============================================

-- Insert admin user with hashed password (password: admin123)
INSERT INTO admin_users (email, password_hash, name, role, permissions, is_active)
VALUES 
  ('admin@catalix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Super Admin', 'super_admin', '["all"]', true),
  ('demo@catalix.com', '$2a$10$92IXUNpkjO0rOQ5byMi.Ye4oKoEa3Ro9llC/.og/at2.uheWG/igi', 'Demo Admin', 'admin', '["products", "orders", "brands", "categories", "banners"]', true)
ON CONFLICT (email) DO NOTHING;

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check brands
SELECT id, name, slug, is_active FROM brands ORDER BY sort_order;

-- Check categories  
SELECT id, name, slug, is_active FROM categories ORDER BY sort_order;

-- Check products
SELECT p.id, p.name, p.slug, b.name as brand, c.name as category, p.price, p.is_active 
FROM products p 
LEFT JOIN brands b ON p.brand_id = b.id 
LEFT JOIN categories c ON p.category_id = c.id 
ORDER BY p.created_at DESC;

-- Check admin users
SELECT id, email, name, role, is_active FROM admin_users;
