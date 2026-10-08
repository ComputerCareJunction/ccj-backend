UPDATE support_tickets
SET ticket_number = 'LEGACY-' || id;

UPDATE support_tickets
SET ticket_number = 'CCJ-' || printf(
    '%02d',
    (
        SELECT COUNT(*)
        FROM support_tickets AS earlier
        WHERE earlier.created_at < support_tickets.created_at
            OR (earlier.created_at = support_tickets.created_at AND earlier.id <= support_tickets.id)
    )
);

CREATE TABLE ticket_sequence (
    id INTEGER PRIMARY KEY CHECK (id = 1),
    current_value INTEGER NOT NULL
);

INSERT INTO ticket_sequence (id, current_value)
SELECT 1, COUNT(*) FROM support_tickets;

UPDATE support_tickets
SET updated_at = COALESCE(created_at, CURRENT_TIMESTAMP)
WHERE updated_at IS NULL OR TRIM(updated_at) = '';

CREATE TRIGGER support_tickets_set_updated_at_after_insert
AFTER INSERT ON support_tickets
WHEN NEW.updated_at IS NULL OR TRIM(NEW.updated_at) = ''
BEGIN
    UPDATE support_tickets
    SET updated_at = COALESCE(NEW.created_at, CURRENT_TIMESTAMP)
    WHERE id = NEW.id;
END;
