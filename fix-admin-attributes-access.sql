-- Fix Admin User Profile for Attributes Access
-- Run this in Supabase SQL Editor AFTER running create-attributes-tables.sql

-- =============================================
-- CHECK CURRENT ADMIN USER SETUP
-- =============================================

-- Check if you have a user_profiles entry with is_admin = true
SELECT 
  id,
  first_name,
  last_name,
  is_admin,
  is_active
FROM user_profiles 
WHERE is_admin = true;

-- Check your current auth user
SELECT auth.uid() as current_user_id;

-- =============================================
-- FIX: Ensure your admin user has is_admin = true
-- =============================================

-- Replace 'YOUR_ADMIN_EMAIL@example.com' with your actual admin email
-- This will find the auth user and set is_admin = true in user_profiles

-- First, get your user ID from auth.users
DO $$
DECLARE
  admin_user_id UUID;
BEGIN
  -- Get the user ID from auth.users table (replace email with your admin email)
  SELECT id INTO admin_user_id 
  FROM auth.users 
  WHERE email = 'admin@catalix.com'; -- Change this to your admin email
  
  IF admin_user_id IS NOT NULL THEN
    -- Upsert user_profiles entry with is_admin = true
    INSERT INTO user_profiles (id, is_admin, is_active)
    VALUES (admin_user_id, true, true)
    ON CONFLICT (id) 
    DO UPDATE SET 
      is_admin = true,
      is_active = true,
      updated_at = NOW();
    
    RAISE NOTICE 'Admin user profile updated successfully for user ID: %', admin_user_id;
  ELSE
    RAISE NOTICE 'User not found. Please check the email address.';
  END IF;
END $$;

-- =============================================
-- ALTERNATIVE: Set is_admin for all authenticated users (TEMPORARY - FOR TESTING ONLY)
-- =============================================

-- WARNING: This is for testing only! Remove in production.
-- UPDATE user_profiles 
-- SET is_admin = true 
-- WHERE id IN (SELECT id FROM auth.users);

-- =============================================
-- VERIFY ADMIN ACCESS
-- =============================================

-- Check if you can now access attributes (should return your user info)
SELECT 
  auth.uid() as current_user_id,
  EXISTS (
    SELECT 1 FROM user_profiles 
    WHERE id = auth.uid() AND is_admin = true
  ) as is_admin_check;

