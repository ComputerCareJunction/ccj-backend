# Script to run database migrations
# This script helps locate PostgreSQL and run migrations

Write-Host "CCJ Backend Migration Script" -ForegroundColor Green
Write-Host "============================" -ForegroundColor Green
Write-Host ""

# Try to find PostgreSQL installation
$postgresPaths = @(
    "C:\Program Files\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files\PostgreSQL\14\bin\psql.exe",
    "C:\Program Files\PostgreSQL\13\bin\psql.exe",
    "C:\Program Files\PostgreSQL\12\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\15\bin\psql.exe",
    "C:\Program Files (x86)\PostgreSQL\14\bin\psql.exe"
)

$psqlPath = $null
foreach ($path in $postgresPaths) {
    if (Test-Path $path) {
        $psqlPath = $path
        Write-Host "Found PostgreSQL at: $psqlPath" -ForegroundColor Green
        break
    }
}

if (-not $psqlPath) {
    Write-Host "ERROR: PostgreSQL not found!" -ForegroundColor Red
    Write-Host ""
    Write-Host "Please either:" -ForegroundColor Yellow
    Write-Host "1. Install PostgreSQL from https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
    Write-Host "2. Add PostgreSQL bin directory to your PATH environment variable" -ForegroundColor Yellow
    Write-Host "3. Or manually run the SQL files using pgAdmin or another PostgreSQL client" -ForegroundColor Yellow
    Write-Host ""
    Write-Host "Migration files are located in:" -ForegroundColor Cyan
    Write-Host "  - migrations\001_initial_schema.sql" -ForegroundColor Cyan
    Write-Host "  - migrations\002_seed_admin.sql" -ForegroundColor Cyan
    exit 1
}

# Get database credentials from .env or use defaults
$envFile = Join-Path $PSScriptRoot "..\\.env"
$dbUser = "postgres"
$dbName = "ccj_db"

if (Test-Path $envFile) {
    $envContent = Get-Content $envFile
    foreach ($line in $envContent) {
        if ($line -match "^DB_USER=(.+)$") {
            $dbUser = $matches[1].Trim()
        }
        if ($line -match "^DB_NAME=(.+)$") {
            $dbName = $matches[1].Trim()
        }
    }
}

Write-Host "Using database: $dbName" -ForegroundColor Cyan
Write-Host "Using user: $dbUser" -ForegroundColor Cyan
Write-Host ""

# Get password
$securePassword = Read-Host "Enter PostgreSQL password for user '$dbUser'" -AsSecureString
$bstr = [System.Runtime.InteropServices.Marshal]::SecureStringToBSTR($securePassword)
$dbPassword = [System.Runtime.InteropServices.Marshal]::PtrToStringAuto($bstr)

# Set password environment variable for psql
$env:PGPASSWORD = $dbPassword

# Get script directory
$scriptDir = Split-Path -Parent $PSScriptRoot
$migrationDir = Join-Path $scriptDir "migrations"

Write-Host ""
Write-Host "Running migrations..." -ForegroundColor Yellow
Write-Host ""

# Run initial schema
$schemaFile = Join-Path $migrationDir "001_initial_schema.sql"
if (Test-Path $schemaFile) {
    Write-Host "Running: 001_initial_schema.sql" -ForegroundColor Cyan
    & $psqlPath -U $dbUser -d $dbName -f $schemaFile
    if ($LASTEXITCODE -ne 0) {
        Write-Host "ERROR: Migration failed!" -ForegroundColor Red
        exit 1
    }
} else {
    Write-Host "ERROR: Migration file not found: $schemaFile" -ForegroundColor Red
    exit 1
}

Write-Host ""
Write-Host "✅ Initial schema migration completed!" -ForegroundColor Green
Write-Host ""

# Run seed admin (optional)
$seedFile = Join-Path $migrationDir "002_seed_admin.sql"
if (Test-Path $seedFile) {
    $runSeed = Read-Host "Run admin seed migration? (y/n)"
    if ($runSeed -eq "y" -or $runSeed -eq "Y") {
        Write-Host "Running: 002_seed_admin.sql" -ForegroundColor Cyan
        & $psqlPath -U $dbUser -d $dbName -f $seedFile
        if ($LASTEXITCODE -eq 0) {
            Write-Host ""
            Write-Host "✅ Admin seed completed!" -ForegroundColor Green
            Write-Host ""
            Write-Host "Default admin credentials:" -ForegroundColor Yellow
            Write-Host "  Email: admin@ccj.com" -ForegroundColor Yellow
            Write-Host "  Password: admin123" -ForegroundColor Yellow
        }
    }
}

Write-Host ""
Write-Host "Migration process completed!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Seed admin user (if not done): npm run seed" -ForegroundColor Cyan
Write-Host "2. Start backend server: npm run dev" -ForegroundColor Cyan

# Clear password from environment
Remove-Item Env:\PGPASSWORD


