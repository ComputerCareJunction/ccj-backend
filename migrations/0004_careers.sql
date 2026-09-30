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

INSERT OR IGNORE INTO career_openings (id, title, department, location, employment_type, description) VALUES
('career-it-support', 'IT Support Specialist', 'Technical Support', 'Mumbai, Maharashtra', 'Full-time', 'We are looking for an experienced IT Support Specialist to join our technical support team. You will be responsible for providing technical assistance and support to our clients.'),
('career-web-developer', 'Web Developer', 'Development', 'Remote / Mumbai', 'Full-time', 'Join our development team as a Web Developer. You will work on building and maintaining web applications for our clients using modern web technologies.'),
('career-network-engineer', 'Network Engineer', 'Network Infrastructure', 'Mumbai, Maharashtra', 'Full-time', 'We are seeking a Network Engineer to design, implement, and maintain network infrastructure for our clients. Experience with network security is preferred.'),
('career-sales-representative', 'Sales Representative', 'Sales', 'Mumbai, Maharashtra', 'Full-time', 'Join our sales team and help grow our business by building relationships with clients and promoting our IT services and solutions.');