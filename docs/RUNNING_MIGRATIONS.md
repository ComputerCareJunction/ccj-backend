# Running Database Migrations on Supabase

## Overview

Your project includes multiple database migrations to set up the schema. This guide walks through running them on Supabase.

## Prerequisites

- Supabase account with CCJ-DATABASE project
- Connection string from Supabase
- `.env` file configured with `DATABASE_URL`
- Node.js and npm installed
- All dependencies installed (`npm install`)

## Migration Files

Your migrations are located in `migrations/` directory:

| # | File | Purpose |
|---|------|---------|
| 001 | `001_initial_schema.sql` | Create core tables (users, products, blogs, etc.) |
| 002 | `002_seed_admin.sql` | Create default admin user |
| 003 | `003_remove_blog_slug.sql` | Cleanup blog table |
| 004 | `004_rename_excerpt_to_description.sql` | Rename blog field |
| 005 | `005_create_contact_table.sql` | Create contact submissions table |
| 006 | `006_add_screening_status_to_contact.sql` | Add status field to contacts |
| 007 | `007_add_brand_category_to_products.sql` | Add brand_category field |
| 008 | `008_add_product_details.sql` | Add product details |
| 009 | `009_change_specifications_to_text.sql` | Update field types |
| 010 | `010_add_original_price_discount_to_products.sql` | Add pricing fields |
| 011 | `011_create_orders_table.sql` | Create orders table |
| 012 | `012_create_tickets_table.sql` | Create support tickets table |
| 013 | `013_update_tickets_default_priority.sql` | Set ticket defaults |

## Method 1: Using npm Scripts (Recommended)

The easiest way is using the provided npm scripts:

### Run All Migrations

```bash
npm run migrate:run
```

This script:
- Reads all migration files from the `migrations/` folder
- Executes them in order
- Reports success/failure

### Run Specific Migrations

```bash
# Run migrations for specific features
npm run migrate:tickets    # Tickets table
npm run migrate:priority   # Ticket priority defaults
```

## Method 2: Using psql (CLI)

If you have PostgreSQL installed locally, use `psql`:

### Get Supabase Connection Details

From your `.env` file or Supabase dashboard, extract:
- HOST (e.g., `xxxxxxxxxxx.supabase.co`)
- PASSWORD (your database password)

### Run Migrations via psql

```bash
# Set your connection variables
$HOST = "your-host.supabase.co"
$PASS = "your-password"

# Run each migration file
psql -h $HOST -U postgres -d postgres -c "SET password='$PASS'" -f migrations/001_initial_schema.sql
psql -h $HOST -U postgres -d postgres -c "SET password='$PASS'" -f migrations/002_seed_admin.sql
# ... continue with remaining migrations
```

### Or as a single command (PowerShell):

```powershell
$env:PGPASSWORD = "your-password"
psql -h your-host.supabase.co -U postgres -d postgres -f migrations/001_initial_schema.sql
```

## Method 3: Using DBeaver or pgAdmin GUI

### Using DBeaver

1. Open DBeaver and create a new connection:
   - Click **Database** → **New Database Connection**
   - Select **PostgreSQL**
   - Enter Supabase credentials

2. Connect and open SQL Editor

3. Open each migration file:
   - File → **Open File**
   - Select migration file from `migrations/`
   - Review the SQL
   - Execute (Ctrl+Enter)

4. Repeat for all migration files in order

## Method 4: Using Supabase SQL Editor

### Direct in Web Dashboard

1. Go to [app.supabase.com](https://app.supabase.com)
2. Click **SQL Editor** in the left menu
3. Click **New Query**
4. Copy SQL from migration file
5. Paste into the editor
6. Click **Run**

**Note:** This method requires copy-pasting each file, but is good for verification.

## Verifying Migrations

After running migrations, verify the tables were created:

```bash
# Using Node.js script
npm run dev

# Check logs for: ✅ Database connection established
```

Or via SQL query:

```sql
-- View all tables
\dt

-- View specific table structure
\d users          -- Shows users table structure
\d products       -- Shows products table structure
```

### Quick Verification

Connect to your Supabase database and run:

```sql
SELECT table_name 
FROM information_schema.tables 
WHERE table_schema = 'public'
ORDER BY table_name;
```

You should see these tables:
- `users`
- `products`
- `blogs`
- `contact`
- `orders`
- `tickets`
- `employees`
- `attendance`
- `dashboard_permissions`

## Seeding Initial Data

After migrations, seed the admin user:

```bash
npm run seed
```

This creates:
- Default admin user (credentials shown in output)
- Initial permission settings
- Basic employee data

## Troubleshooting

### "ERROR: permission denied"
- Ensure you're using the correct password
- Verify the user has sufficient permissions
- Check Supabase user role settings

### "ERROR: relation ... already exists"
- Migrations may have already been run
- Check if tables exist in Supabase SQL Editor
- Safe to re-run migrations (they check for existing objects)

### "ERROR: syntax error in SQL statement"
- Copy the exact error message
- Check the migration file at the specified line
- Verify PostgreSQL version compatibility

### Connection Issues
- Verify `DATABASE_URL` in `.env`
- Test with: `npm run dev`
- Check firewall/network settings
- Ensure database is not in maintenance mode

### Migration Hangs
- Press Ctrl+C to cancel
- Try running migrations individually
- Check Supabase dashboard for running queries

## Running Migrations in Production

### Important Notes

⚠️ **Before running in production:**

1. **Backup your database**
   - Go to Supabase Dashboard → Settings → Backups
   - Click "Request a backup"
   - Wait for completion

2. **Test migrations locally**
   - Set up local Supabase instance or Docker container
   - Run all migrations
   - Verify data integrity

3. **Plan downtime**
   - Schedule migration during low-traffic periods
   - Notify users of potential downtime

4. **Have a rollback plan**
   - Understand what each migration does
   - Know how to rollback if needed

### Automated Migrations in Deployment

For CI/CD deployments:

```bash
#!/bin/bash
# In your deployment script

# Wait for database to be ready
sleep 10

# Run migrations
npm run migrate:run

# Seed if needed
npm run seed

# Start application
npm start
```

## Additional Resources

- [Supabase Migrations Guide](https://supabase.com/docs/guides/cli/managing-db-migrations)
- [PostgreSQL Constraints](https://www.postgresql.org/docs/current/ddl-constraints.html)
- [Node PostgreSQL Client](https://node-postgres.com/)
- [DBeaver Documentation](https://dbeaver.io/docs/)

## Getting Help

If migrations fail:

1. Check the error message carefully
2. Review the migration file at the specified line
3. Verify your database credentials
4. Check Supabase dashboard for status
5. Review logs in Supabase dashboard
