-- Add original_price and discount columns to tbl_products
ALTER TABLE tbl_products
ADD COLUMN original_price VARCHAR(255),
ADD COLUMN discount VARCHAR(255);

