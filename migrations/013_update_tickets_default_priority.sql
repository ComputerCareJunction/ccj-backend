-- Update default priority to 'high' for tickets table
ALTER TABLE tbl_tickets MODIFY COLUMN priority VARCHAR(50) DEFAULT 'high';

-- Update existing tickets with 'medium' priority to 'high' (optional - only if you want to update existing ones)
-- UPDATE tbl_tickets SET priority = 'high' WHERE priority = 'medium' OR priority IS NULL;

