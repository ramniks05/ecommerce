-- Add product_type column to products table
-- B2C = Business to Consumer (default, shows price, can add to cart)
-- B2B = Business to Business (no price shown, request price instead)

-- Add column with default value 'b2c' for existing products
ALTER TABLE products 
ADD COLUMN IF NOT EXISTS product_type TEXT NOT NULL DEFAULT 'b2c' 
CHECK (product_type IN ('b2b', 'b2c'));

-- Create index for filtering
CREATE INDEX IF NOT EXISTS idx_products_product_type ON products(product_type);

-- Add comment
COMMENT ON COLUMN products.product_type IS 'Product type: b2c (Business to Consumer) or b2b (Business to Business)';

