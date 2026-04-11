-- Migration to remove slug column from tbl_blogs table
-- This migration should be run if the database already exists with the slug column

-- Drop the index on slug column first (if it exists)
DROP INDEX IF EXISTS idx_tbl_blogs_slug ON tbl_blogs;

-- Drop the slug column from tbl_blogs table (if it exists)
ALTER TABLE tbl_blogs DROP COLUMN IF EXISTS slug;

