-- Insert default admin user (password: admin123)
-- Password hash: $2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy
-- Generated using: bcrypt.hash('admin123', 10)
INSERT IGNORE INTO tbl_users (name, email, password, phone, role, status)
VALUES ('Administrator', 'admin@ccj.com', '$2a$10$N9qo8uLOickgx2ZMRZoMyeIjZAgcfl7p92ldGxad68LJZdL17lhWy', '+1234567890', 'admin', 'active');

-- Grant all permissions to admin user for all dashboard sections
INSERT INTO tbl_dashboard_permissions (user_id, section, can_view, can_create, can_update, can_delete)
SELECT u.id, section, true, true, true, true
FROM tbl_users u
CROSS JOIN (VALUES ('products'), ('users'), ('blogs'), ('employees')) AS sections(section)
WHERE u.role = 'admin'
ON CONFLICT (user_id, section) DO UPDATE
SET can_view = true, can_create = true, can_update = true, can_delete = true;
