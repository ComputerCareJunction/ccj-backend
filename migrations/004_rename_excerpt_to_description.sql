-- Migration to rename excerpt column to description in tbl_blogs table
-- This migration should be run if the database already exists with the excerpt column

-- Rename the excerpt column to description
ALTER TABLE tbl_blogs RENAME COLUMN excerpt TO description;

