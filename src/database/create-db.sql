-- Create database script for CCJ Backend
-- Run this file to create the database (if not using createdb command)

-- Create database
CREATE DATABASE ccj_db;

-- Connect to database (uncomment if running from command line)
-- \c ccj_db

-- Note: Run migrations after creating database
-- psql -U postgres -d ccj_db -f migrations/001_initial_schema.sql
-- psql -U postgres -d ccj_db -f migrations/002_seed_admin.sql

