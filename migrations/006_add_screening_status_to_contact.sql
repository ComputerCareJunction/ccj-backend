-- Add screening_status column to tbl_contact
-- Status values: null or '' = unassigned, 'screening' = assigned/screening, 'done' = completed

ALTER TABLE tbl_contact 
ADD COLUMN screening_status VARCHAR(20) DEFAULT NULL;

CREATE INDEX idx_tbl_contact_screening_status 
ON tbl_contact(screening_status);

