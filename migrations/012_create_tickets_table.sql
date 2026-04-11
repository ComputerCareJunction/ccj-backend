-- Create Tickets Table
CREATE TABLE IF NOT EXISTS tbl_tickets (
    id INT AUTO_INCREMENT PRIMARY KEY,
    ticket_name VARCHAR(255) NOT NULL,
    ticket_type VARCHAR(255) NOT NULL,
    requested_by VARCHAR(255) NOT NULL,
    phone_number VARCHAR(20) NOT NULL,
    message TEXT NOT NULL,
    status VARCHAR(50) DEFAULT 'todo', -- 'todo', 'in_progress', 'done', 'closed'
    priority VARCHAR(50) DEFAULT 'medium', -- 'low', 'medium', 'high'
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create indexes for faster queries
CREATE INDEX idx_tbl_tickets_status ON tbl_tickets(status);
CREATE INDEX idx_tbl_tickets_priority ON tbl_tickets(priority);
CREATE INDEX idx_tbl_tickets_created_at ON tbl_tickets(created_at);
CREATE INDEX idx_tbl_tickets_requested_by ON tbl_tickets(requested_by);

