# Full Database Setup Script for CCJ Backend
# This script sets up PostgreSQL database using Docker or local installation

param(
    [string]$Method = "docker",  # docker or local
    [string]$Environment = "development"
)

Write-Host "========================================" -ForegroundColor Cyan
Write-Host "  CCJ Backend - Full Database Setup" -ForegroundColor Cyan
Write-Host "========================================" -ForegroundColor Cyan
Write-Host ""

# Load YAML config (if using PowerShell module, otherwise use simple parsing)
function Get-DatabaseConfig {
    param([string]$env)
    
    $configPath = Join-Path $PSScriptRoot "..\config\database.yml"
    if (-not (Test-Path $configPath)) {
        Write-Host "Warning: database.yml not found. Using defaults." -ForegroundColor Yellow
        return @{
            host = "localhost"
            port = 5432
            database = "ccj_db"
            username = "postgres"
            password = "postgres"
        }
    }
    
    # Simple YAML parsing for this use case
    $content = Get-Content $configPath -Raw
    $envBlock = $content -split "$env`:" | Select-Object -Index 1
    if ($envBlock) {
        $config = @{}
        if ($envBlock -match "host:\s*(.+)") { $config.host = $matches[1].Trim() }
        if ($envBlock -match "port:\s*(\d+)") { $config.port = [int]$matches[1] }
        if ($envBlock -match "database:\s*(.+)") { $config.database = $matches[1].Trim() }
        if ($envBlock -match "username:\s*(.+)") { $config.username = $matches[1].Trim() }
        if ($envBlock -match "password:\s*(.+)") { $config.password = $matches[1].Trim() }
        return $config
    }
    
    return $null
}

$dbConfig = Get-DatabaseConfig -env $Environment

if ($Method -eq "docker") {
    Write-Host "🐳 Setting up database using Docker..." -ForegroundColor Green
    Write-Host ""
    
    # Check if Docker is installed
    try {
        $dockerVersion = docker --version 2>&1
        Write-Host "✅ Docker found: $dockerVersion" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker is not installed!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install Docker Desktop from:" -ForegroundColor Yellow
        Write-Host "https://www.docker.com/products/docker-desktop" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or use local PostgreSQL installation:" -ForegroundColor Yellow
        Write-Host "  .\scripts\setup-database-full.ps1 -Method local" -ForegroundColor Yellow
        exit 1
    }
    
    # Check if Docker is running
    try {
        docker ps | Out-Null
        Write-Host "✅ Docker is running" -ForegroundColor Green
    } catch {
        Write-Host "❌ Docker is not running!" -ForegroundColor Red
        Write-Host "Please start Docker Desktop and try again." -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host ""
    Write-Host "Starting PostgreSQL container..." -ForegroundColor Yellow
    
    # Navigate to backend directory
    $backendDir = Split-Path -Parent $PSScriptRoot
    Set-Location $backendDir
    
    # Stop and remove existing container if exists
    docker-compose down -v 2>$null
    
    # Start PostgreSQL
    docker-compose up -d postgres
    
    Write-Host ""
    Write-Host "⏳ Waiting for PostgreSQL to be ready..." -ForegroundColor Yellow
    
    $maxAttempts = 30
    $attempt = 0
    $isReady = $false
    
    while ($attempt -lt $maxAttempts -and -not $isReady) {
        Start-Sleep -Seconds 2
        try {
            $result = docker exec ccj-postgres pg_isready -U postgres 2>&1
            if ($result -match "accepting connections") {
                $isReady = $true
                Write-Host "✅ PostgreSQL is ready!" -ForegroundColor Green
            }
        } catch {
            # Continue waiting
        }
        $attempt++
        Write-Host "." -NoNewline
    }
    
    Write-Host ""
    
    if (-not $isReady) {
        Write-Host "❌ PostgreSQL failed to start in time" -ForegroundColor Red
        exit 1
    }
    
    Write-Host ""
    Write-Host "📊 Database Information:" -ForegroundColor Cyan
    Write-Host "  Host: localhost" -ForegroundColor White
    Write-Host "  Port: 5432" -ForegroundColor White
    Write-Host "  Database: ccj_db" -ForegroundColor White
    Write-Host "  Username: postgres" -ForegroundColor White
    Write-Host "  Password: postgres" -ForegroundColor White
    Write-Host ""
    
} elseif ($Method -eq "local") {
    Write-Host "💻 Setting up database using local PostgreSQL..." -ForegroundColor Green
    Write-Host ""
    
    # Check for PostgreSQL
    $psqlPaths = @(
        "C:\Program Files\PostgreSQL\15\bin\psql.exe",
        "C:\Program Files\PostgreSQL\14\bin\psql.exe",
        "C:\Program Files\PostgreSQL\13\bin\psql.exe"
    )
    
    $psqlPath = $null
    foreach ($path in $psqlPaths) {
        if (Test-Path $path) {
            $psqlPath = $path
            break
        }
    }
    
    if (-not $psqlPath) {
        Write-Host "❌ PostgreSQL not found!" -ForegroundColor Red
        Write-Host ""
        Write-Host "Please install PostgreSQL from:" -ForegroundColor Yellow
        Write-Host "https://www.postgresql.org/download/windows/" -ForegroundColor Yellow
        Write-Host ""
        Write-Host "Or use Docker instead:" -ForegroundColor Yellow
        Write-Host "  .\scripts\setup-database-full.ps1 -Method docker" -ForegroundColor Yellow
        exit 1
    }
    
    Write-Host "✅ PostgreSQL found at: $psqlPath" -ForegroundColor Green
    Write-Host ""
    
    # Check if PostgreSQL service is running
    $pgService = Get-Service | Where-Object { $_.Name -like "*postgres*" } | Select-Object -First 1
    if ($pgService) {
        if ($pgService.Status -ne "Running") {
            Write-Host "⚠️  PostgreSQL service is not running. Starting..." -ForegroundColor Yellow
            Start-Service $pgService.Name
            Start-Sleep -Seconds 5
        }
        Write-Host "✅ PostgreSQL service is running" -ForegroundColor Green
    } else {
        Write-Host "⚠️  Could not find PostgreSQL service. Please ensure PostgreSQL is running." -ForegroundColor Yellow
    }
    
    Write-Host ""
}

# Run migrations
Write-Host "📝 Running database migrations..." -ForegroundColor Yellow
Write-Host ""

$backendDir = Split-Path -Parent $PSScriptRoot
Set-Location $backendDir

# Check if .env exists
$envPath = Join-Path $backendDir ".env"
if (-not (Test-Path $envPath)) {
    Write-Host "Creating .env file from database.yml..." -ForegroundColor Yellow
    
    $envContent = @"
PORT=5000
NODE_ENV=$Environment

DB_HOST=$($dbConfig.host)
DB_PORT=$($dbConfig.port)
DB_NAME=$($dbConfig.database)
DB_USER=$($dbConfig.username)
DB_PASSWORD=$($dbConfig.password)

JWT_SECRET=your-super-secret-jwt-key-change-this-in-production
JWT_EXPIRES_IN=7d

FRONTEND_URL=http://localhost:3000
"@
    
    $envContent | Out-File -FilePath $envPath -Encoding utf8
    Write-Host "✅ Created .env file" -ForegroundColor Green
    Write-Host ""
}

# Run migrations using Node.js script
Write-Host "Running migrations..." -ForegroundColor Cyan
npm run migrate:run

if ($LASTEXITCODE -eq 0) {
    Write-Host ""
    Write-Host "✅ Database setup completed successfully!" -ForegroundColor Green
    Write-Host ""
    Write-Host "Next steps:" -ForegroundColor Cyan
    Write-Host "1. Seed admin user: npm run seed" -ForegroundColor White
    Write-Host "2. Start backend server: npm run dev" -ForegroundColor White
    Write-Host ""
    
    if ($Method -eq "docker") {
        Write-Host "📌 Docker Commands:" -ForegroundColor Cyan
        Write-Host "  Stop database: docker-compose down" -ForegroundColor White
        Write-Host "  Start database: docker-compose up -d" -ForegroundColor White
        Write-Host "  View logs: docker-compose logs -f postgres" -ForegroundColor White
        Write-Host ""
    }
} else {
    Write-Host ""
    Write-Host "❌ Migration failed. Please check the error above." -ForegroundColor Red
    exit 1
}


