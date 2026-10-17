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

-- Seed initial CCJ Asset records (1 Purchase, 1 Sales)
INSERT OR IGNORE INTO assets (id, date, bill_no, movement, item, category, qty, unit_amount, total_amount, vendor, status, notes) VALUES
('ast-001', '2026-10-01', 'CCJ-PUR-1001', 'Purchase', 'Dell Latitude 5490 (Refurbished i5 8th Gen)', 'Laptops', 10, 18000.00, 180000.00, 'Metro Tech Distributors', 'Completed', 'Lot of Grade A business laptops with chargers'),
('ast-002', '2026-10-05', 'CCJ-SAL-2001', 'Sales', 'Dell Latitude 5490 (Refurbished i5 8th Gen)', 'Laptops', 3, 24999.00, 74997.00, 'Apex Solutions Ltd', 'Completed', 'Supplied for new client project batch 1');
