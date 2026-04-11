-- Add brand and category columns to products table
ALTER TABLE tbl_products
ADD COLUMN brand VARCHAR(255),
ADD COLUMN category VARCHAR(255);
ADD COLUMN IF NOT EXISTS in_stock TINYINT(1) DEFAULT 1;

-- Create indexes for better query performance
CREATE INDEX idx_tbl_products_brand ON tbl_products(brand);
CREATE INDEX idx_tbl_products_category ON tbl_products(category);
CREATE INDEX idx_tbl_products_brand_category ON tbl_products(brand, category);

