-- Create Contact Table
CREATE TABLE IF NOT EXISTS tbl_contact (
    id INT AUTO_INCREMENT PRIMARY KEY,
    name VARCHAR(255) NOT NULL,
    email VARCHAR(255) NOT NULL,
    phone VARCHAR(20),
    subject VARCHAR(255),
    looking_for VARCHAR(255),
    location VARCHAR(255),
    message TEXT NOT NULL,
    form_type VARCHAR(50) DEFAULT 'contact', -- 'contact' or 'consultation'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create index on email for faster queries
CREATE INDEX idx_tbl_contact_email ON tbl_contact(email);
CREATE INDEX idx_tbl_contact_created_at ON tbl_contact(created_at);

