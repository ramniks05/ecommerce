-- Create Attributes and Attribute Values Tables
-- Run this in Supabase SQL Editor

-- =============================================
-- ATTRIBUTES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS attributes (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  name TEXT NOT NULL,
  slug TEXT UNIQUE NOT NULL,
  type TEXT NOT NULL CHECK (type IN ('select', 'radio', 'checkbox', 'text', 'textarea', 'number', 'color', 'date')),
  description TEXT,
  is_required BOOLEAN DEFAULT FALSE,
  is_filterable BOOLEAN DEFAULT TRUE,
  is_active BOOLEAN DEFAULT TRUE,
  sort_order INTEGER DEFAULT 0,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- ATTRIBUTE VALUES TABLE
-- =============================================

CREATE TABLE IF NOT EXISTS attribute_values (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  attribute_id UUID REFERENCES attributes(id) ON DELETE CASCADE,
  value TEXT NOT NULL,
  label TEXT,
  color TEXT,
  image_url TEXT,
  sort_order INTEGER DEFAULT 0,
  is_active BOOLEAN DEFAULT TRUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- =============================================
-- INDEXES
-- =============================================

CREATE INDEX IF NOT EXISTS idx_attributes_slug ON attributes(slug);
CREATE INDEX IF NOT EXISTS idx_attributes_type ON attributes(type);
CREATE INDEX IF NOT EXISTS idx_attributes_active ON attributes(is_active);
CREATE INDEX IF NOT EXISTS idx_attribute_values_attribute_id ON attribute_values(attribute_id);
CREATE INDEX IF NOT EXISTS idx_attribute_values_active ON attribute_values(is_active);

-- =============================================
-- ROW LEVEL SECURITY (RLS)
-- =============================================

ALTER TABLE attributes ENABLE ROW LEVEL SECURITY;
ALTER TABLE attribute_values ENABLE ROW LEVEL SECURITY;

-- Drop existing policies if they exist
DROP POLICY IF EXISTS "Public read active attributes" ON attributes;
DROP POLICY IF EXISTS "Public read active attribute values" ON attribute_values;
DROP POLICY IF EXISTS "Admin full access attributes" ON attributes;
DROP POLICY IF EXISTS "Admin full access attribute values" ON attribute_values;
DROP POLICY IF EXISTS "Authenticated admin access attributes" ON attributes;
DROP POLICY IF EXISTS "Authenticated admin access attribute values" ON attribute_values;

-- Public read policies (for active attributes)
CREATE POLICY "Public read active attributes" ON attributes FOR SELECT USING (is_active = true);
CREATE POLICY "Public read active attribute values" ON attribute_values FOR SELECT USING (is_active = true);

-- Admin full access policies (check user_profiles)
CREATE POLICY "Admin full access attributes" ON attributes FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

CREATE POLICY "Admin full access attribute values" ON attribute_values FOR ALL USING (
  EXISTS (SELECT 1 FROM user_profiles WHERE id = auth.uid() AND is_admin = true)
);

-- Alternative: Authenticated users with admin role (if user_profiles check fails)
-- This allows any authenticated user to manage attributes (for testing)
-- Remove or comment out in production!
CREATE POLICY "Authenticated admin access attributes" ON attributes FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

CREATE POLICY "Authenticated admin access attribute values" ON attribute_values FOR ALL 
TO authenticated 
USING (true) 
WITH CHECK (true);

-- =============================================
-- TRIGGERS
-- =============================================

-- Drop existing triggers if they exist
DROP TRIGGER IF EXISTS update_attributes_updated_at ON attributes;
DROP TRIGGER IF EXISTS update_attribute_values_updated_at ON attribute_values;

-- Update updated_at timestamp
CREATE TRIGGER update_attributes_updated_at BEFORE UPDATE ON attributes FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();
CREATE TRIGGER update_attribute_values_updated_at BEFORE UPDATE ON attribute_values FOR EACH ROW EXECUTE FUNCTION update_updated_at_column();

-- =============================================
-- VERIFICATION
-- =============================================

-- Check if tables were created
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public' 
  AND table_name IN ('attributes', 'attribute_values')
ORDER BY table_name;

-- Should show:
-- attribute_values
-- attributes

