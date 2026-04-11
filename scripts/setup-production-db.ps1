# Local Production Database Setup - Import SQL Dump
# This script creates a production database and imports the SQL dump file

param(
    [string]$DbName = "ccj_db_prod",
    [string]$DbUser = "root",
    [string]$DbPassword = "root",
    [string]$DbHost = "localhost",
    [int]$DbPort = 3306,
    [string]$DumpFile = "C:\Users\Admin\dump-ccj_db-202601171159.sql"
)

# Add MySQL to PATH
$env:PATH = "C:\Program Files\MySQL\MySQL Server 8.4\bin;" + $env:PATH

Write-Host "Local Production Database Setup - Import SQL Dump" -ForegroundColor Green
Write-Host "===================================================" -ForegroundColor Green
Write-Host ""

# Step 1: Check if MySQL is installed and start it
Write-Host "1. Starting MySQL Server..." -ForegroundColor Cyan
$mysqlExePath = "C:\Program Files\MySQL\MySQL Server 8.4\bin\mysqld.exe"
if (-not (Test-Path $mysqlExePath)) {
    Write-Host "[ERROR] MySQL not found at $mysqlExePath" -ForegroundColor Red
    exit 1
}

# Kill any existing mysqld processes
Get-Process mysqld -ErrorAction SilentlyContinue | Stop-Process -Force -ErrorAction SilentlyContinue
Start-Sleep -Seconds 2

# Initialize data directory if needed
$dataDir = "C:\ProgramData\MySQL\MySQL Server 8.4\data"
if (-not (Test-Path "$dataDir\mysql")) {
    Write-Host "[INITIALIZING] Creating data directory..." -ForegroundColor Yellow
    & $mysqlExePath --initialize-insecure --datadir=$dataDir 2>$null
    Start-Sleep -Seconds 2
}

# Start MySQL server
Write-Host "[STARTING] Launching MySQL Server..." -ForegroundColor Cyan
Start-Process -FilePath $mysqlExePath -ArgumentList "--datadir=$dataDir", "--console" -NoNewWindow -PassThru | Out-Null
Start-Sleep -Seconds 5
Write-Host "[OK] MySQL Server started" -ForegroundColor Green

# Step 2: Test connection
Write-Host ""
Write-Host "2. Testing MySQL connection..." -ForegroundColor Cyan
try {
    $result = mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort -e "SELECT VERSION();" 2>&1
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] MySQL connection successful" -ForegroundColor Green
        Write-Host "   Version: $result" -ForegroundColor Gray
    } else {
        throw "Connection failed: $result"
    }
} catch {
    Write-Host "[ERROR] Cannot connect to MySQL" -ForegroundColor Red
    Write-Host "   Error: $_" -ForegroundColor Yellow
    Write-Host "   Make sure:" -ForegroundColor Yellow
    Write-Host "   - MySQL is running and accessible on $DbHost`:$DbPort" -ForegroundColor Yellow
    Write-Host "   - Default credentials are: root/root" -ForegroundColor Yellow
    Start-Sleep -Seconds 2
}

# Step 3: Check if dump file exists
Write-Host ""
Write-Host "3. Checking dump file..." -ForegroundColor Cyan
if (Test-Path $DumpFile) {
    $fileSize = (Get-Item $DumpFile).Length
    $fileSizeMB = [math]::Round($fileSize / 1MB, 2)
    Write-Host "[OK] Dump file found: $DumpFile" -ForegroundColor Green
    Write-Host "   File size: $fileSizeMB MB" -ForegroundColor Gray
} else {
    Write-Host "[ERROR] Dump file not found: $DumpFile" -ForegroundColor Red
    Write-Host "   Please verify the file path." -ForegroundColor Yellow
    exit 1
}

# Step 4: Check if production database already exists
Write-Host ""
Write-Host "Step 4: Checking for existing production database..." -ForegroundColor Cyan
$checkDb = mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort -e "SHOW DATABASES LIKE '$DbName';" 2>&1
if ($checkDb -like "*$DbName*") {
    Write-Host "[WARNING] Database '$DbName' already exists" -ForegroundColor Yellow
    $response = Read-Host "   Drop and recreate? (y/n)"
    if ($response -eq "y") {
        Write-Host "   Dropping database..." -ForegroundColor Yellow
        mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort -e "DROP DATABASE IF EXISTS $DbName;" 2>&1 | Out-Null
        Write-Host "   [OK] Database dropped" -ForegroundColor Green
    } else {
        Write-Host "   Using existing database" -ForegroundColor Gray
    }
} else {
    Write-Host "[OK] No existing production database (will create new)" -ForegroundColor Green
}

# Step 5: Create production database
Write-Host ""
Write-Host "Step 5: Creating production database..." -ForegroundColor Cyan
mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort -e "CREATE DATABASE IF NOT EXISTS $DbName CHARACTER SET utf8mb4 COLLATE utf8mb4_unicode_ci;" 2>&1 | Out-Null
if ($LASTEXITCODE -eq 0) {
    Write-Host "[OK] Database '$DbName' created/verified" -ForegroundColor Green
} else {
    Write-Host "[ERROR] Failed to create database" -ForegroundColor Red
    exit 1
}

# Step 6: Import dump file
Write-Host ""
Write-Host "Step 6: Importing SQL dump file..." -ForegroundColor Cyan
Write-Host "   This may take a few moments..." -ForegroundColor Gray

try {
    Write-Host "   Importing from: $DumpFile" -ForegroundColor Gray
    $importOutput = Get-Content $DumpFile | mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort $DbName 2>&1
    
    if ($LASTEXITCODE -eq 0) {
        Write-Host "[OK] SQL dump imported successfully" -ForegroundColor Green
    } else {
        Write-Host "[WARNING] Import completed with exit code: $LASTEXITCODE" -ForegroundColor Yellow
        if ($importOutput) {
            Write-Host "   Details: $importOutput" -ForegroundColor Gray
        }
    }
} catch {
    Write-Host "[ERROR] Error importing dump file:" -ForegroundColor Red
    Write-Host $_.Exception.Message -ForegroundColor Red
    exit 1
}

# Step 7: Verify import
Write-Host ""
Write-Host "Step 7: Verifying database..." -ForegroundColor Cyan
$tableOutput = mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort $DbName -e "SHOW TABLES;" 2>&1
$tableCount = @($tableOutput).Count - 1

Write-Host "[OK] Database verification:" -ForegroundColor Green
Write-Host "   Tables imported: $tableCount" -ForegroundColor Gray

if ($tableOutput -and $tableCount -gt 0) {
    Write-Host "   Table list:" -ForegroundColor Gray
    $tableOutput | Select-Object -Skip 1 | ForEach-Object { Write-Host "     - $_" -ForegroundColor Gray }
}

# Step 8: Get database info
Write-Host ""
Write-Host "8. Database Information" -ForegroundColor Cyan
Write-Host "   Host: $DbHost" -ForegroundColor Gray
Write-Host "   Port: $DbPort" -ForegroundColor Gray
Write-Host "   Database: $DbName" -ForegroundColor Gray
Write-Host "   User: $DbUser" -ForegroundColor Gray

# Step 9: Create .env.production file
Write-Host ""
Write-Host "Step 9: Creating .env.production file..." -ForegroundColor Cyan

$envContent = @"
# Local Production Database Configuration
NODE_ENV=production
PORT=5000

# Database Configuration (Local Production)
DATABASE_URL=mysql://$DbUser`:$DbPassword@$DbHost`:$DbPort/$DbName

# Or use individual parameters:
DB_HOST=$DbHost
DB_PORT=$DbPort
DB_USER=$DbUser
DB_PASSWORD=$DbPassword
DB_NAME=$DbName

# Frontend Configuration
FRONTEND_URL=http://localhost:3000
API_URL=http://localhost:5000/api

# Authentication
JWT_SECRET=your-production-secret-key-change-this-immediately
JWT_EXPIRES_IN=7d

# Image Upload (Cloudinary)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
"@

$envContent | Out-File -FilePath ".env.production" -Encoding UTF8 -Force
Write-Host "[OK] File .env.production created" -ForegroundColor Green

# Step 10: Create connection string reference
Write-Host ""
Write-Host "Step 10: Connection String" -ForegroundColor Cyan
Write-Host "   MySQL: mysql://$DbUser`:$DbPassword@$DbHost`:$DbPort/$DbName" -ForegroundColor Cyan

# Final Summary
Write-Host ""
Write-Host "===============================" -ForegroundColor Green
Write-Host "Local Production Database Ready!" -ForegroundColor Green
Write-Host "===============================" -ForegroundColor Green
Write-Host ""
Write-Host "Summary:" -ForegroundColor Cyan
Write-Host "   [OK] MySQL service running" -ForegroundColor Green
Write-Host "   [OK] Database $DbName created" -ForegroundColor Green
Write-Host "   [OK] SQL dump imported" -ForegroundColor Green
Write-Host "   [OK] .env.production created" -ForegroundColor Green
Write-Host ""
Write-Host "Next Steps:" -ForegroundColor Cyan
Write-Host "   1. Review .env.production file" -ForegroundColor Gray
Write-Host "   2. Copy to .env for production use:" -ForegroundColor Gray
Write-Host "      cp .env.production .env" -ForegroundColor Gray
Write-Host "   3. Start development server:" -ForegroundColor Gray
Write-Host "      npm run dev" -ForegroundColor Gray
Write-Host "   4. Test API at:" -ForegroundColor Gray
Write-Host "      http://localhost:5000/api-docs" -ForegroundColor Gray
Write-Host ""
Write-Host "Important Notes:" -ForegroundColor Yellow
Write-Host "   - Update JWT_SECRET in .env.production for production use" -ForegroundColor Yellow
Write-Host "   - Update Cloudinary credentials if using image uploads" -ForegroundColor Yellow
Write-Host "   - Database: $DbName contains all imported production data" -ForegroundColor Yellow
Write-Host ""
Write-Host "Useful Commands:" -ForegroundColor Cyan
Write-Host "   Connect to MySQL:" -ForegroundColor Gray
Write-Host "      mysql -u $DbUser -p$DbPassword -h $DbHost -P $DbPort $DbName" -ForegroundColor Gray
Write-Host ""
Write-Host "   Backup database:" -ForegroundColor Gray
$timestamp = Get-Date -Format "yyyyMMdd_HHmmss"
Write-Host "      mysqldump -u $DbUser -p$DbPassword $DbName > backup_$timestamp.sql" -ForegroundColor Gray
Write-Host ""
