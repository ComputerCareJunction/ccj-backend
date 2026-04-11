-- Add detailed product information columns
-- Add specifications (JSON field for flexible specs like processor, RAM, storage, etc.)
ALTER TABLE tbl_products 
ADD COLUMN specifications JSON DEFAULT NULL,
ADD COLUMN features TEXT DEFAULT NULL,
ADD COLUMN warranty VARCHAR(255) DEFAULT NULL;
ALTER TABLE tbl_products 
ADD COLUMN IF NOT EXISTS warranty VARCHAR(100) DEFAULT NULL;

-- Add SKU/Model number
ALTER TABLE tbl_products 
ADD COLUMN IF NOT EXISTS sku VARCHAR(100) DEFAULT NULL;

-- Add dimensions
ALTER TABLE tbl_products 
ADD COLUMN IF NOT EXISTS dimensions VARCHAR(255) DEFAULT NULL;

-- Add weight
ALTER TABLE tbl_products 
ADD COLUMN IF NOT EXISTS weight VARCHAR(50) DEFAULT NULL;

-- Add color (if applicable)
ALTER TABLE tbl_products 
ADD COLUMN IF NOT EXISTS color VARCHAR(50) DEFAULT NULL;

