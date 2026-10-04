CREATE TABLE IF NOT EXISTS application_users (
    id TEXT PRIMARY KEY,
    firebase_uid TEXT UNIQUE,
    name TEXT NOT NULL,
    email TEXT NOT NULL UNIQUE COLLATE NOCASE,
    phone TEXT NOT NULL DEFAULT '',
    role TEXT NOT NULL DEFAULT 'user',
    status TEXT NOT NULL DEFAULT 'active' CHECK (status IN ('active', 'inactive')),
    created_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP,
    updated_at TEXT NOT NULL DEFAULT CURRENT_TIMESTAMP
);

INSERT OR IGNORE INTO application_users (id, name, email, phone, role, status, created_at, updated_at)
SELECT id, name, email, phone, role,
       CASE WHEN lower(status) = 'inactive' THEN 'inactive' ELSE 'active' END,
       created_at, updated_at
FROM users;

CREATE INDEX IF NOT EXISTS idx_application_users_status ON application_users(status);