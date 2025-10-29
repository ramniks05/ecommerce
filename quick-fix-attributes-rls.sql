-- Quick Fix: Disable RLS for Attributes (TEMPORARY - FOR TESTING)
-- Run this in Supabase SQL Editor

-- =============================================
-- OPTION 1: Temporarily Disable RLS (EASIEST)
-- =============================================

ALTER TABLE attributes DISABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values DISABLE ROW LEVEL SECURITY;

-- This will allow all operations without checking policies
-- Use this for testing, then re-enable RLS with proper policies later

-- =============================================
-- OPTION 2: Drop all policies and create simple permissive ones
-- =============================================

-- Uncomment this section if Option 1 doesn't work:

/*
ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;

-- Drop ALL existing policies
DROP POLICY IF EXISTS "Public read active attributes" ON attributes;
DROP POLICY IF EXISTS "Public read active attribute values" ON attribute_values;
DROP POLICY IF EXISTS "Admin full access attributes" ON attributes;
DROP POLICY IF EXISTS "Admin full access attribute values" ON attribute_values;
DROP POLICY IF EXISTS "Authenticated admin access attributes" ON attributes;
DROP POLICY IF EXISTS "Authenticated admin access attribute values" ON attribute_values;

-- Create permissive policies for authenticated users
CREATE POLICY "Allow all authenticated users attributes" ON attributes 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

CREATE POLICY "Allow all authenticated users attribute values" ON attribute_values 
FOR ALL TO authenticated USING (true) WITH CHECK (true);

-- Allow public read for active items
CREATE POLICY "Public read active attributes" ON attributes 
FOR SELECT USING (is_active = true);

CREATE POLICY "Public read active attribute values" ON attribute_values 
FOR SELECT USING (is_active = true);
*/

-- =============================================
-- VERIFY
-- =============================================

-- Check if RLS is disabled
SELECT 
  tablename, 
  rowsecurity 
FROM pg_tables 
WHERE schemaname = 'public' 
  AND tablename IN ('attributes', 'attribute_values');

-- If rowsecurity is false, RLS is disabled

