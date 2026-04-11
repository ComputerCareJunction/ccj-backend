-- Create Admin/Users Table (tbl_users includes admin users)
CREATE TABLE IF NOT EXISTS tbl_users (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    password VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    role VARCHAR(20) NOT NULL DEFAULT 'customer',
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Dashboard Permissions Table
CREATE TABLE IF NOT EXISTS tbl_dashboard_permissions (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id INT NOT NULL,
    section VARCHAR(50) NOT NULL,
    can_view TINYINT(1) DEFAULT 0,
    can_create TINYINT(1) DEFAULT 0,
    can_update TINYINT(1) DEFAULT 0,
    can_delete TINYINT(1) DEFAULT 0,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_user_section (user_id, section),
    FOREIGN KEY (user_id) REFERENCES tbl_users(id) ON DELETE CASCADE
);

-- Create Products Table
CREATE TABLE IF NOT EXISTS tbl_products (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    slug VARCHAR(255) UNIQUE NOT NULL,
    image LONGTEXT,
    price DECIMAL(10, 2) NOT NULL,
    description LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Blogs Table
CREATE TABLE IF NOT EXISTS tbl_blogs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    title VARCHAR(255) NOT NULL,
    content LONGTEXT NOT NULL,
    excerpt TEXT,
    description TEXT,
    author VARCHAR(255) NOT NULL,
    date DATE NOT NULL,
    image LONGTEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Employees Table
CREATE TABLE IF NOT EXISTS tbl_employees (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id VARCHAR(50) UNIQUE NOT NULL,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) UNIQUE NOT NULL,
    phone VARCHAR(20),
    position VARCHAR(255),
    department VARCHAR(255),
    hire_date DATE NOT NULL,
    status VARCHAR(20) NOT NULL DEFAULT 'active',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Attendance Table
CREATE TABLE IF NOT EXISTS tbl_attendance (
    id INT AUTO_INCREMENT PRIMARY KEY,
    employee_id INT NOT NULL,
    date DATE NOT NULL,
    check_in TIME,
    check_out TIME,
    status VARCHAR(20) NOT NULL DEFAULT 'present',
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP,
    UNIQUE KEY unique_employee_date (employee_id, date),
    FOREIGN KEY (employee_id) REFERENCES tbl_employees(id) ON DELETE CASCADE
);

-- Create Indexes
CREATE INDEX idx_tbl_users_email ON tbl_users(email);
CREATE INDEX idx_tbl_users_role ON tbl_users(role);
CREATE INDEX idx_tbl_dashboard_permissions_user_id ON tbl_dashboard_permissions(user_id);
CREATE INDEX idx_tbl_dashboard_permissions_section ON tbl_dashboard_permissions(section);
CREATE INDEX idx_tbl_products_slug ON tbl_products(slug);
CREATE INDEX idx_tbl_employees_employee_id ON tbl_employees(employee_id);
CREATE INDEX idx_tbl_attendance_employee_id ON tbl_attendance(employee_id);
CREATE INDEX idx_tbl_attendance_date ON tbl_attendance(date);
