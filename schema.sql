-- Cloudflare D1 Database Schema for ccj-api
-- Database Name: ccj-api (ID: 9240e550-ccbc-4c99-a9e4-80d30c85b828)

-- 1. Contact Form Submissions
CREATE TABLE IF NOT EXISTS contact_submissions (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    looking_for TEXT,
    location TEXT,
    message TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 2. Consultation Bookings
CREATE TABLE IF NOT EXISTS consultations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    looking_for TEXT,
    location TEXT,
    message TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 3. Support Tickets
CREATE TABLE IF NOT EXISTS support_tickets (
    id TEXT PRIMARY KEY,
    ticket_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT,
    service_type TEXT NOT NULL,
    priority TEXT DEFAULT 'medium',
    status TEXT DEFAULT 'open',
    description TEXT NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Customer Orders
CREATE TABLE IF NOT EXISTS orders (
    id TEXT PRIMARY KEY,
    order_number TEXT UNIQUE NOT NULL,
    customer_name TEXT NOT NULL,
    email TEXT NOT NULL,
    phone TEXT NOT NULL,
    address TEXT NOT NULL,
    total_amount REAL NOT NULL,
    items_json TEXT NOT NULL,
    status TEXT DEFAULT 'pending',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 5. Products Catalog
CREATE TABLE IF NOT EXISTS products (
    id TEXT PRIMARY KEY,
    slug TEXT UNIQUE NOT NULL,
    name TEXT NOT NULL,
    brand TEXT NOT NULL,
    category TEXT NOT NULL,
    price REAL NOT NULL,
    description TEXT,
    image_url TEXT,
    in_stock INTEGER DEFAULT 1,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 6. Blogs
CREATE TABLE IF NOT EXISTS blogs (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    content TEXT NOT NULL,
    description TEXT,
    author TEXT DEFAULT 'CCJ Team',
    date TEXT,
    image TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 7. Career Openings
CREATE TABLE IF NOT EXISTS career_openings (
    id TEXT PRIMARY KEY,
    title TEXT NOT NULL,
    department TEXT NOT NULL,
    location TEXT NOT NULL,
    employment_type TEXT NOT NULL DEFAULT 'Full-time',
    description TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'closed')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

-- Seed Products Initial Data
INSERT OR IGNORE INTO products (id, slug, name, brand, category, price, description, in_stock) VALUES
('p1', 'refurbished-dell-latitude-5490', 'Dell Latitude 5490 (Refurbished)', 'Dell', 'Laptops', 24999.00, 'Intel Core i5 8th Gen, 8GB RAM, 256GB SSD, 14-inch FHD Display', 1),
('p2', 'refurbished-hp-elitebook-840-g5', 'HP EliteBook 840 G5 (Refurbished)', 'HP', 'Laptops', 26999.00, 'Intel Core i5 8th Gen, 16GB RAM, 512GB SSD, 14-inch FHD Display', 1),
('p3', 'refurbished-lenovo-thinkpad-t480', 'Lenovo ThinkPad T480 (Refurbished)', 'Lenovo', 'Laptops', 25999.00, 'Intel Core i5 8th Gen, 8GB RAM, 256GB SSD, Dual Battery', 1),
('p4', 'custom-workstation-pc-i7', 'High-Performance Workstation PC', 'Custom Build', 'Desktops', 54999.00, 'Intel Core i7 12th Gen, 32GB RAM, 1TB NVMe SSD, RTX 3060 12GB', 1),
('p5', 'hikvision-4ch-cctv-kit', 'Hikvision 4-Channel HD CCTV Surveillance System', 'Hikvision', 'Security', 14999.00, '4x 2MP Night Vision Cameras, 4CH DVR, 1TB Hard Drive', 1);

-- Seed Initial Blog Data
INSERT OR IGNORE INTO blogs (id, title, content, description, author, date) VALUES
('b1', 'Guide to Buying Refurbished Corporate Laptops', 'Detailed guide on selecting high quality refurbished Dell and HP laptops...', 'Tips for choosing reliable business laptops.', 'CCJ Tech Team', '2026-09-29');

INSERT OR IGNORE INTO career_openings (id, title, department, location, employment_type, description) VALUES
('career-it-support', 'IT Support Specialist', 'Technical Support', 'Mumbai, Maharashtra', 'Full-time', 'We are looking for an experienced IT Support Specialist to join our technical support team. You will be responsible for providing technical assistance and support to our clients.'),
('career-web-developer', 'Web Developer', 'Development', 'Remote / Mumbai', 'Full-time', 'Join our development team as a Web Developer. You will work on building and maintaining web applications for our clients using modern web technologies.'),
('career-network-engineer', 'Network Engineer', 'Network Infrastructure', 'Mumbai, Maharashtra', 'Full-time', 'We are seeking a Network Engineer to design, implement, and maintain network infrastructure for our clients. Experience with network security is preferred.'),
('career-sales-representative', 'Sales Representative', 'Sales', 'Mumbai, Maharashtra', 'Full-time', 'Join our sales team and help grow our business by building relationships with clients and promoting our IT services and solutions.');

-- 8. Assets (Purchase, Sales and Available Stock)
CREATE TABLE IF NOT EXISTS assets (
    id TEXT PRIMARY KEY,
    date TEXT NOT NULL,
    bill_no TEXT NOT NULL,
    movement TEXT NOT NULL CHECK(movement IN ('Purchase', 'Sales')),
    item TEXT NOT NULL,
    category TEXT NOT NULL,
    qty INTEGER NOT NULL CHECK(qty > 0),
    unit_amount REAL NOT NULL CHECK(unit_amount >= 0),
    total_amount REAL NOT NULL CHECK(total_amount >= 0),
    vendor TEXT NOT NULL,
    status TEXT NOT NULL DEFAULT 'Completed',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

CREATE INDEX IF NOT EXISTS idx_assets_date ON assets(date);
CREATE INDEX IF NOT EXISTS idx_assets_movement ON assets(movement);
CREATE INDEX IF NOT EXISTS idx_assets_category ON assets(category);
CREATE INDEX IF NOT EXISTS idx_assets_bill_no ON assets(bill_no);

INSERT OR IGNORE INTO assets (id, date, bill_no, movement, item, category, qty, unit_amount, total_amount, vendor, status, notes) VALUES
('ast-001', '2026-10-01', 'CCJ-PUR-1001', 'Purchase', 'Dell Latitude 5490 (Refurbished i5 8th Gen)', 'Laptops', 15, 18000.00, 270000.00, 'Metro Tech Distributors', 'Completed', 'Lot of Grade A business laptops with chargers'),
('ast-002', '2026-10-03', 'CCJ-PUR-1002', 'Purchase', 'HP EliteBook 840 G5 (i5 8th Gen 16GB)', 'Laptops', 10, 20000.00, 200000.00, 'Infoway Systems Pvt Ltd', 'Completed', 'Tested working units, battery health > 85%'),
('ast-003', '2026-10-05', 'CCJ-SAL-2001', 'Sales', 'Dell Latitude 5490 (Refurbished i5 8th Gen)', 'Laptops', 4, 24999.00, 99996.00, 'Apex Solutions Ltd', 'Completed', 'Supplied for new client project batch 1'),
('ast-004', '2026-10-07', 'CCJ-PUR-1003', 'Purchase', 'Hikvision 4CH HD CCTV Kit with 1TB HDD', 'CCTV & Security', 8, 11500.00, 92000.00, 'Security Vision Corp', 'Completed', 'Complete camera kits with BNC connectors'),
('ast-005', '2026-10-10', 'CCJ-SAL-2002', 'Sales', 'HP EliteBook 840 G5 (i5 8th Gen 16GB)', 'Laptops', 3, 26999.00, 80997.00, 'BlueChip Technologies', 'Completed', 'Invoice sent, paid via NEFT'),
('ast-006', '2026-10-11', 'CCJ-SAL-2003', 'Sales', 'Hikvision 4CH HD CCTV Kit with 1TB HDD', 'CCTV & Security', 2, 14999.00, 29998.00, 'Greenfield Realty Office', 'Completed', 'Installed at site by CCJ engineering team'),
('ast-007', '2026-10-14', 'CCJ-PUR-1004', 'Purchase', 'Custom Workstation PC (Core i7 12th Gen / 32GB / RTX 3060)', 'Desktops', 5, 42000.00, 210000.00, 'Prime PC Components', 'Completed', 'High performance rendering workstations'),
('ast-008', '2026-10-15', 'CCJ-SAL-2004', 'Sales', 'Dell Latitude 5490 (Refurbished i5 8th Gen)', 'Laptops', 2, 24999.00, 49998.00, 'Sunrise Digital Studio', 'Completed', 'Corporate order dispatched');

