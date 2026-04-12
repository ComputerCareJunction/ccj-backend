-- One-time password codes for forgot-password flow (hashed at rest)
CREATE TABLE IF NOT EXISTS tbl_password_reset_otps (
    id INT AUTO_INCREMENT PRIMARY KEY,
    email VARCHAR(255) NOT NULL,
    otp_hash VARCHAR(255) NOT NULL,
    expires_at DATETIME NOT NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    INDEX idx_password_reset_email (email),
    INDEX idx_password_reset_expires (expires_at)
);
