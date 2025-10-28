-- Fix Supabase Storage Policies for Image Uploads
-- Run this in Supabase SQL Editor

-- =============================================
-- STORAGE BUCKET POLICIES
-- =============================================

-- Create storage bucket for brand images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('brands', 'brands', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for product images (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('products', 'products', true)
ON CONFLICT (id) DO NOTHING;

-- Create storage bucket for banners (if not exists)
INSERT INTO storage.buckets (id, name, public)
VALUES ('banners', 'banners', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ALLOW PUBLIC READ ACCESS
-- =============================================

-- Policy: Anyone can view brand images
CREATE POLICY "Public Access for Brand Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'brands');

-- Policy: Anyone can view product images
CREATE POLICY "Public Access for Product Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'products');

-- Policy: Anyone can view banner images
CREATE POLICY "Public Access for Banner Images"
ON storage.objects FOR SELECT
TO public
USING (bucket_id = 'banners');

-- =============================================
-- ALLOW AUTHENTICATED USERS TO UPLOAD
-- =============================================

-- Policy: Authenticated users can upload brand images
CREATE POLICY "Authenticated users can upload brand images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'brands');

-- Policy: Authenticated users can upload product images
CREATE POLICY "Authenticated users can upload product images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'products');

-- Policy: Authenticated users can upload banner images
CREATE POLICY "Authenticated users can upload banner images"
ON storage.objects FOR INSERT
TO authenticated
WITH CHECK (bucket_id = 'banners');

-- =============================================
-- ALLOW AUTHENTICATED USERS TO UPDATE/DELETE
-- =============================================

-- Policy: Authenticated users can update brand images
CREATE POLICY "Authenticated users can update brand images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'brands')
WITH CHECK (bucket_id = 'brands');

-- Policy: Authenticated users can delete brand images
CREATE POLICY "Authenticated users can delete brand images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'brands');

-- Policy: Authenticated users can update product images
CREATE POLICY "Authenticated users can update product images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'products')
WITH CHECK (bucket_id = 'products');

-- Policy: Authenticated users can delete product images
CREATE POLICY "Authenticated users can delete product images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'products');

-- Policy: Authenticated users can update banner images
CREATE POLICY "Authenticated users can update banner images"
ON storage.objects FOR UPDATE
TO authenticated
USING (bucket_id = 'banners')
WITH CHECK (bucket_id = 'banners');

-- Policy: Authenticated users can delete banner images
CREATE POLICY "Authenticated users can delete banner images"
ON storage.objects FOR DELETE
TO authenticated
USING (bucket_id = 'banners');

-- =============================================
-- TEMPORARY: ALLOW ANONYMOUS UPLOADS (FOR TESTING)
-- Remove these in production!
-- =============================================

-- Policy: Allow anonymous uploads to brands (TESTING ONLY)
CREATE POLICY "Allow anonymous brand uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'brands');

-- Policy: Allow anonymous uploads to products (TESTING ONLY)
CREATE POLICY "Allow anonymous product uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'products');

-- Policy: Allow anonymous uploads to banners (TESTING ONLY)
CREATE POLICY "Allow anonymous banner uploads"
ON storage.objects FOR INSERT
TO anon
WITH CHECK (bucket_id = 'banners');

-- =============================================
-- VERIFICATION QUERIES
-- =============================================

-- Verify buckets created
SELECT * FROM storage.buckets;

-- Verify policies created
SELECT * FROM pg_policies WHERE schemaname = 'storage' AND tablename = 'objects';

