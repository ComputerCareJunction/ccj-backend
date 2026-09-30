ALTER TABLE employees ADD COLUMN firebase_uid TEXT;
CREATE UNIQUE INDEX IF NOT EXISTS idx_employees_firebase_uid ON employees(firebase_uid) WHERE firebase_uid IS NOT NULL;