# Database Setup Scripts

## Quick Start

### Option 1: Docker (Recommended - Easiest)

```powershell
cd "CCJ backend"
.\scripts\setup-database-full.ps1 -Method docker
```

This will:
- Start PostgreSQL in Docker
- Create database
- Run all migrations
- Create .env file
- Seed admin user

### Option 2: Local PostgreSQL

```powershell
cd "CCJ backend"
.\scripts\setup-database-full.ps1 -Method local
```

## Manual Setup

### 1. Using Docker Compose

```powershell
# Start PostgreSQL
docker-compose up -d

# Run migrations
npm run migrate:run

# Seed admin user
npm run seed
```

### 2. Using Node.js Migration Script

```powershell
npm run migrate:run
```

### 3. Using PowerShell Script

```powershell
.\scripts\run-migrations.ps1
```

## Database Configuration

Database settings are maintained in `config/database.yml`:

```yaml
development:
  host: localhost
  port: 5432
  database: ccj_db
  username: postgres
  password: postgres
```

The `.env` file is generated from this configuration during setup.

## Docker Commands

```powershell
# Start database
docker-compose up -d

# Stop database
docker-compose down

# Stop and remove data
docker-compose down -v

# View logs
docker-compose logs -f postgres

# Access PostgreSQL CLI
docker exec -it ccj-postgres psql -U postgres -d ccj_db
```

## Troubleshooting

### Docker Issues
- Ensure Docker Desktop is installed and running
- Check: `docker --version`
- Start Docker Desktop if not running

### Connection Refused
- Ensure PostgreSQL/Docker container is running
- Check port 5432 is not in use: `netstat -ano | findstr :5432`
- Verify .env file has correct credentials

### Migration Errors
- Ensure database exists
- Check database credentials in .env
- Verify migrations folder exists with SQL files


