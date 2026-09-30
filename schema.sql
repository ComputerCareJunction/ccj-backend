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
