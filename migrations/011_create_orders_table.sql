-- Create Orders Table
CREATE TABLE IF NOT EXISTS tbl_orders (
    id INT AUTO_INCREMENT PRIMARY KEY,
    order_number VARCHAR(50) UNIQUE NOT NULL,
    customer_name VARCHAR(255) NOT NULL,
    customer_email VARCHAR(255) NOT NULL,
    customer_phone VARCHAR(20) NOT NULL,
    shipping_address TEXT NOT NULL,
    city VARCHAR(100) NOT NULL,
    pincode VARCHAR(20) NOT NULL,
    payment_method VARCHAR(50) NOT NULL DEFAULT 'cash',
    status VARCHAR(50) NOT NULL DEFAULT 'pending',
    total_amount DECIMAL(10, 2) NOT NULL,
    items JSON NOT NULL,
    notes TEXT,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    updated_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP ON UPDATE CURRENT_TIMESTAMP
);

-- Create Order Items Table (optional - can also store items as JSON in orders table)
-- For now, we'll use JSON in orders table for simplicity

-- Create Indexes
CREATE INDEX idx_tbl_orders_order_number ON tbl_orders(order_number);
CREATE INDEX idx_tbl_orders_customer_email ON tbl_orders(customer_email);
CREATE INDEX idx_tbl_orders_status ON tbl_orders(status);
CREATE INDEX idx_tbl_orders_created_at ON tbl_orders(created_at);

-- Note: Order number generation should be handled in application code
-- For MySQL, consider using triggers or application-level generation
-- Example trigger for order number generation:
-- 
-- CREATE TRIGGER generate_order_number_trigger 
-- BEFORE INSERT ON tbl_orders
-- FOR EACH ROW
-- BEGIN
--     IF NEW.order_number IS NULL THEN
--         SET NEW.order_number = CONCAT('ORD-', DATE_FORMAT(NOW(), '%Y%m%d'), '-', LPAD(LAST_INSERT_ID() + 1, 5, '0'));
--     END IF;
-- END;

