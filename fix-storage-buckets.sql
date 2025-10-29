-- Fix Storage Buckets for Image Uploads
-- Run this in Supabase SQL Editor to create the correct storage buckets

-- =============================================
-- CREATE STORAGE BUCKETS (with correct names)
-- =============================================

-- Create storage buckets with the exact names used in the code
INSERT INTO storage.buckets (id, name, public)
VALUES 
  ('brand-logos', 'brand-logos', true),
  ('brand-heroes', 'brand-heroes', true),
  ('category-images', 'category-images', true),
  ('product-images', 'product-images', true),
  ('banner-images', 'banner-images', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- STORAGE POLICIES FOR PUBLIC READ ACCESS
-- =============================================

-- Allow public read access to all image buckets
CREATE POLICY "Public read brand-logos" ON storage.objects FOR SELECT USING (bucket_id = 'brand-logos');
CREATE POLICY "Public read brand-heroes" ON storage.objects FOR SELECT USING (bucket_id = 'brand-heroes');
CREATE POLICY "Public read category-images" ON storage.objects FOR SELECT USING (bucket_id = 'category-images');
CREATE POLICY "Public read product-images" ON storage.objects FOR SELECT USING (bucket_id = 'product-images');
CREATE POLICY "Public read banner-images" ON storage.objects FOR SELECT USING (bucket_id = 'banner-images');

-- =============================================
-- STORAGE POLICIES FOR AUTHENTICATED UPLOADS
-- =============================================

-- Allow authenticated users to upload images
CREATE POLICY "Authenticated upload brand-logos" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'brand-logos');

CREATE POLICY "Authenticated upload brand-heroes" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'brand-heroes');

CREATE POLICY "Authenticated upload category-images" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Authenticated upload product-images" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated upload banner-images" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'banner-images');

-- =============================================
-- STORAGE POLICIES FOR UPDATES AND DELETES
-- =============================================

-- Allow authenticated users to update images
CREATE POLICY "Authenticated update brand-logos" ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'brand-logos') WITH CHECK (bucket_id = 'brand-logos');

CREATE POLICY "Authenticated update brand-heroes" ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'brand-heroes') WITH CHECK (bucket_id = 'brand-heroes');

CREATE POLICY "Authenticated update category-images" ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'category-images') WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Authenticated update product-images" ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'product-images') WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Authenticated update banner-images" ON storage.objects FOR UPDATE 
TO authenticated USING (bucket_id = 'banner-images') WITH CHECK (bucket_id = 'banner-images');

-- Allow authenticated users to delete images
CREATE POLICY "Authenticated delete brand-logos" ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'brand-logos');

CREATE POLICY "Authenticated delete brand-heroes" ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'brand-heroes');

CREATE POLICY "Authenticated delete category-images" ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'category-images');

CREATE POLICY "Authenticated delete product-images" ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'product-images');

CREATE POLICY "Authenticated delete banner-images" ON storage.objects FOR DELETE 
TO authenticated USING (bucket_id = 'banner-images');

-- =============================================
-- TEMPORARY: ALLOW ANONYMOUS UPLOADS (FOR TESTING)
-- Remove these in production!
-- =============================================

-- Allow anonymous uploads for testing (REMOVE IN PRODUCTION!)
CREATE POLICY "Anonymous upload brand-logos" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'brand-logos');

CREATE POLICY "Anonymous upload brand-heroes" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'brand-heroes');

CREATE POLICY "Anonymous upload category-images" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'category-images');

CREATE POLICY "Anonymous upload product-images" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'product-images');

CREATE POLICY "Anonymous upload banner-images" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'banner-images');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Check if buckets were created
SELECT id, name, public FROM storage.buckets WHERE id IN (
  'brand-logos', 'brand-heroes', 'category-images', 'product-images', 'banner-images'
);

-- Check if policies were created
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND policyname LIKE '%brand%' OR policyname LIKE '%category%' OR policyname LIKE '%product%' OR policyname LIKE '%banner%'
ORDER BY policyname;
