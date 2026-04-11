#!/bin/bash

echo "CCJ Backend Setup Script"
echo "========================"

# Check if PostgreSQL is installed
if ! command -v psql &> /dev/null; then
    echo "Error: PostgreSQL is not installed. Please install PostgreSQL first."
    exit 1
fi

# Check if .env file exists
if [ ! -f .env ]; then
    echo "Creating .env file from .env.example..."
    cp .env.example .env
    echo "Please update .env with your database credentials"
fi

echo "Setup complete!"
echo ""
echo "Next steps:"
echo "1. Update .env file with your database credentials"
echo "2. Create PostgreSQL database: createdb ccj_db"
echo "3. Run migrations: psql -U postgres -d ccj_db -f migrations/001_initial_schema.sql"
echo "4. Seed admin user: npm run seed"
echo "5. Start server: npm run dev"

