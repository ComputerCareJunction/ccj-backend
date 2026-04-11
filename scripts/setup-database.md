# Database Setup - Alternative Methods

If `psql` command is not available, here are alternative ways to set up the database:

## Method 1: Using pgAdmin (GUI)

1. **Install pgAdmin** (usually installed with PostgreSQL)
   - Or download from: https://www.pgadmin.org/download/

2. **Connect to PostgreSQL server**
   - Open pgAdmin
   - Right-click "Servers" → "Create" → "Server"
   - General tab: Name = "CCJ Database"
   - Connection tab:
     - Host: localhost
     - Port: 5432
     - Username: postgres
     - Password: (your PostgreSQL password)

3. **Create database**
   - Right-click "Databases" → "Create" → "Database"
   - Name: `ccj_db`
   - Click "Save"

4. **Run migrations**
   - Right-click `ccj_db` → "Query Tool"
   - Open file: `migrations/001_initial_schema.sql`
   - Click "Execute" (F5)
   - Repeat for `migrations/002_seed_admin.sql`

## Method 2: Using PowerShell Script

Run the provided PowerShell script:

```powershell
cd "CCJ backend"
.\scripts\run-migrations.ps1
```

This script will:
- Auto-detect PostgreSQL installation
- Prompt for password
- Run migrations automatically

## Method 3: Manual Installation Steps

### Step 1: Install PostgreSQL

Download from: https://www.postgresql.org/download/windows/

**During installation:**
- Remember the password you set for `postgres` user
- Note the installation directory (usually `C:\Program Files\PostgreSQL\[version]`)

### Step 2: Add PostgreSQL to PATH

1. Find PostgreSQL bin directory:
   - Usually: `C:\Program Files\PostgreSQL\15\bin\`

2. Add to PATH:
   - Right-click "This PC" → "Properties"
   - "Advanced system settings" → "Environment Variables"
   - Under "System variables", find "Path" → "Edit"
   - "New" → Add PostgreSQL bin path
   - Click "OK" on all dialogs

3. **Restart PowerShell/Terminal**

4. Verify:
   ```powershell
   psql --version
   ```

### Step 3: Create Database

```powershell
# Set password (use your PostgreSQL password)
$env:PGPASSWORD = "your_password"

# Create database
createdb -U postgres ccj_db

# Or using psql
psql -U postgres
CREATE DATABASE ccj_db;
\q
```

### Step 4: Run Migrations

```powershell
cd "CCJ backend"
$env:PGPASSWORD = "your_password"
psql -U postgres -d ccj_db -f migrations/001_initial_schema.sql
psql -U postgres -d ccj_db -f migrations/002_seed_admin.sql
```

## Method 4: Using Docker (if installed)

```powershell
# Run PostgreSQL container
docker run --name ccj-postgres `
  -e POSTGRES_PASSWORD=postgres `
  -e POSTGRES_DB=ccj_db `
  -p 5432:5432 `
  -d postgres:15

# Then use psql in container
docker exec -i ccj-postgres psql -U postgres -d ccj_db < migrations/001_initial_schema.sql
docker exec -i ccj-postgres psql -U postgres -d ccj_db < migrations/002_seed_admin.sql

# Update .env:
# DB_PASSWORD=postgres
```

## Troubleshooting

### PostgreSQL Not Found
- Check if PostgreSQL is installed: Look in `C:\Program Files\PostgreSQL\`
- Install from: https://www.postgresql.org/download/windows/

### Password Issues
- If you forgot password, you may need to reset it via pgAdmin or reinstall PostgreSQL

### Port Already in Use
- Another PostgreSQL instance might be running
- Check: `netstat -ano | findstr :5432`
- Stop conflicting service or change port in `.env`

### Permission Denied
- Ensure PostgreSQL service is running
- Check Windows Services: `services.msc`
- Start PostgreSQL service if stopped


