-- Fix Hero Image Upload Issue
-- Run this in Supabase SQL Editor

-- =============================================
-- CHECK CURRENT STORAGE BUCKETS
-- =============================================

-- Check if brand-heroes bucket exists
SELECT id, name, public FROM storage.buckets WHERE id = 'brand-heroes';

-- =============================================
-- CREATE BRAND-HEROES BUCKET IF MISSING
-- =============================================

-- Create brand-heroes bucket
INSERT INTO storage.buckets (id, name, public)
VALUES ('brand-heroes', 'brand-heroes', true)
ON CONFLICT (id) DO NOTHING;

-- =============================================
-- ADD STORAGE POLICIES FOR BRAND-HEROES
-- =============================================

-- Drop existing policies for brand-heroes (if any)
DROP POLICY IF EXISTS "Public read brand-heroes" ON storage.objects;
DROP POLICY IF EXISTS "Authenticated upload brand-heroes" ON storage.objects;
DROP POLICY IF EXISTS "Anonymous upload brand-heroes" ON storage.objects;

-- Create new policies for brand-heroes
CREATE POLICY "Public read brand-heroes" ON storage.objects FOR SELECT USING (bucket_id = 'brand-heroes');

CREATE POLICY "Authenticated upload brand-heroes" ON storage.objects FOR INSERT 
TO authenticated WITH CHECK (bucket_id = 'brand-heroes');

-- TEMPORARY: Allow anonymous uploads for testing
CREATE POLICY "Anonymous upload brand-heroes" ON storage.objects FOR INSERT 
TO anon WITH CHECK (bucket_id = 'brand-heroes');

-- =============================================
-- VERIFY ALL BRAND BUCKETS AND POLICIES
-- =============================================

-- Check all brand-related buckets
SELECT id, name, public FROM storage.buckets WHERE id IN ('brand-logos', 'brand-heroes');

-- Check all brand-related policies
SELECT policyname, cmd, roles, qual, with_check 
FROM pg_policies 
WHERE schemaname = 'storage' 
  AND tablename = 'objects' 
  AND (policyname LIKE '%brand%' OR policyname LIKE '%hero%')
ORDER BY policyname;

-- =============================================
-- TEST UPLOAD PERMISSIONS
-- =============================================

-- This query will show if the bucket is accessible
SELECT 
  bucket_id,
  COUNT(*) as file_count
FROM storage.objects 
WHERE bucket_id = 'brand-heroes'
GROUP BY bucket_id;
