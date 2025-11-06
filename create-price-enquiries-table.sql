-- Create price_enquiries table for B2B product price requests

CREATE TABLE IF NOT EXISTS price_enquiries (
  id UUID PRIMARY KEY DEFAULT gen_random_uuid(),
  product_id UUID NOT NULL REFERENCES products(id) ON DELETE CASCADE,
  product_name TEXT NOT NULL,
  user_id UUID REFERENCES auth.users(id) ON DELETE SET NULL,
  name TEXT NOT NULL,
  email TEXT NOT NULL,
  phone TEXT,
  company TEXT,
  message TEXT,
  quantity INTEGER DEFAULT 1,
  status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'contacted', 'quoted', 'closed')),
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Create index for faster queries
CREATE INDEX IF NOT EXISTS idx_price_enquiries_product_id ON price_enquiries(product_id);
CREATE INDEX IF NOT EXISTS idx_price_enquiries_user_id ON price_enquiries(user_id);
CREATE INDEX IF NOT EXISTS idx_price_enquiries_status ON price_enquiries(status);

-- Enable RLS
ALTER TABLE price_enquiries ENABLE ROW LEVEL SECURITY;

-- Policy: Users can view their own enquiries
CREATE POLICY "Users can view own enquiries"
  ON price_enquiries FOR SELECT
  TO authenticated
  USING (auth.uid() = user_id);

-- Policy: Anyone can create enquiries (public)
CREATE POLICY "Anyone can create enquiries"
  ON price_enquiries FOR INSERT
  TO authenticated, anon
  WITH CHECK (true);

-- Policy: Admins can view all enquiries
CREATE POLICY "Admins can view all enquiries"
  ON price_enquiries FOR SELECT
  TO authenticated
  USING (
    EXISTS (
      SELECT 1 FROM user_profiles
      WHERE user_profiles.id = auth.uid()
      AND user_profiles.is_admin = true
    )
  );

-- Add comment
COMMENT ON TABLE price_enquiries IS 'Stores price enquiry requests for B2B products';

