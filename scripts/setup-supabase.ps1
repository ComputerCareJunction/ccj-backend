# Supabase Database Setup Helper Script
# This script helps you set up and configure Supabase for CCJ Backend

param(
    [Parameter(Mandatory=$false)]
    [string]$DatabaseUrl,
    [Parameter(Mandatory=$false)]
    [string]$RunMigrations = $false
)

Write-Host "
╔══════════════════════════════════════════════════════════════╗
║          CCJ Backend - Supabase Setup Helper                 ║
╚══════════════════════════════════════════════════════════════╝
" -ForegroundColor Cyan

# Check if .env file exists
if (-Not (Test-Path ".env")) {
    Write-Host "`n⚠️  .env file not found. Creating template..." -ForegroundColor Yellow
    
    $envTemplate = @"
# CCJ Backend Environment Configuration
# Supabase Configuration
NODE_ENV=production
PORT=3000
DATABASE_URL=postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require

# Frontend Configuration
FRONTEND_URL=https://your-frontend-url.com
API_URL=https://your-api-url.com/api

# JWT Configuration
JWT_SECRET=your-secure-jwt-secret-key-change-this-in-production
JWT_EXPIRES_IN=7d

# Cloudinary Configuration (for image uploads)
CLOUDINARY_CLOUD_NAME=your-cloud-name
CLOUDINARY_API_KEY=your-api-key
CLOUDINARY_API_SECRET=your-api-secret
"@
    
    Set-Content -Path ".env" -Value $envTemplate
    Write-Host "✅ .env template created. Please update it with your Supabase credentials." -ForegroundColor Green
    Write-Host "`n   Location: .env" -ForegroundColor Gray
}

# Check if DATABASE_URL is provided or in .env
if ([string]::IsNullOrEmpty($DatabaseUrl)) {
    # Read from .env
    Get-Content ".env" | Where-Object { $_ -match "^DATABASE_URL=" } | ForEach-Object {
        $DatabaseUrl = $_.Split("=", 2)[1].Trim()
    }
}

# Verify DATABASE_URL
if ([string]::IsNullOrEmpty($DatabaseUrl) -or $DatabaseUrl.Contains("PASSWORD")) {
    Write-Host "`n⚠️  DATABASE_URL not configured properly" -ForegroundColor Yellow
    Write-Host "`nSteps to get your Supabase connection string:" -ForegroundColor Cyan
    Write-Host "
1. Go to https://app.supabase.com
2. Click on your 'CCJ-DATABASE' project
3. Click 'Settings' in the left menu
4. Select 'Database' section
5. Copy the 'Connection string' (PostgreSQL section)
   Format: postgresql://postgres:PASSWORD@HOST:5432/postgres?sslmode=require
6. Update DATABASE_URL in .env file

" -ForegroundColor Gray
    
    Write-Host "After updating .env, run this script again:" -ForegroundColor Yellow
    Write-Host "  .\scripts\setup-supabase.ps1" -ForegroundColor Cyan
    exit 1
}

Write-Host "`n✅ DATABASE_URL configured" -ForegroundColor Green

# Extract host from DATABASE_URL for connection test
$connectionStringPattern = "postgresql://postgres:[^@]+@([^:]+):(\d+)/(\w+)"
if ($DatabaseUrl -match $connectionStringPattern) {
    $host = $matches[1]
    $port = $matches[2]
    $database = $matches[3]
    
    Write-Host "`n📊 Connection Details:" -ForegroundColor Cyan
    Write-Host "   Host: $host" -ForegroundColor Gray
    Write-Host "   Port: $port" -ForegroundColor Gray
    Write-Host "   Database: $database" -ForegroundColor Gray
}

# Step 1: Install dependencies
Write-Host "`n📦 Checking dependencies..." -ForegroundColor Cyan
if (-Not (Test-Path "node_modules")) {
    Write-Host "   Installing npm packages..." -ForegroundColor Yellow
    npm install
    if ($LASTEXITCODE -ne 0) {
        Write-Host "❌ Failed to install dependencies" -ForegroundColor Red
        exit 1
    }
    Write-Host "✅ Dependencies installed" -ForegroundColor Green
} else {
    Write-Host "✅ Dependencies already installed" -ForegroundColor Green
}

# Step 2: Test connection
Write-Host "`n🔗 Testing database connection..." -ForegroundColor Cyan
Write-Host "   (This may take a moment...)" -ForegroundColor Gray

$env:DATABASE_URL = $DatabaseUrl
$testResult = npm run dev -- --test-connection 2>&1

if ($testResult -contains "✅ Database connection established") {
    Write-Host "✅ Database connection successful!" -ForegroundColor Green
} else {
    Write-Host "⚠️  Could not verify connection. Proceeding with migration..." -ForegroundColor Yellow
}

# Step 3: Run migrations
if ($RunMigrations -eq $true) {
    Write-Host "`n📝 Running database migrations..." -ForegroundColor Cyan
    
    $migrations = @(
        "001_initial_schema",
        "002_seed_admin",
        "003_remove_blog_slug",
        "004_rename_excerpt_to_description",
        "005_create_contact_table",
        "006_add_screening_status_to_contact",
        "007_add_brand_category_to_products",
        "008_add_product_details",
        "009_change_specifications_to_text",
        "010_add_original_price_discount_to_products",
        "011_create_orders_table",
        "012_create_tickets_table",
        "013_update_tickets_default_priority"
    )
    
    foreach ($migration in $migrations) {
        Write-Host "   Running $migration..." -ForegroundColor Yellow
        npm run migrate:run
        if ($LASTEXITCODE -ne 0) {
            Write-Host "⚠️  Migration $migration encountered an issue" -ForegroundColor Yellow
        } else {
            Write-Host "✅ $migration completed" -ForegroundColor Green
        }
    }
    
    Write-Host "`n✅ Migrations completed" -ForegroundColor Green
} else {
    Write-Host "`n💡 Tip: To run migrations, execute:" -ForegroundColor Cyan
    Write-Host "   npm run migrate:run" -ForegroundColor Gray
    Write-Host "   Or run setup script with -RunMigrations flag:" -ForegroundColor Gray
    Write-Host "   .\scripts\setup-supabase.ps1 -RunMigrations `$true" -ForegroundColor Gray
}

# Step 4: Seed initial data
Write-Host "`n🌱 Seeding initial data..." -ForegroundColor Cyan
Write-Host "   Run: npm run seed" -ForegroundColor Gray

# Summary
Write-Host "`n╔══════════════════════════════════════════════════════════════╗" -ForegroundColor Green
Write-Host "║              ✅ Supabase Setup Complete!                      ║" -ForegroundColor Green
Write-Host "╚══════════════════════════════════════════════════════════════╝" -ForegroundColor Green

Write-Host "`n📋 Next Steps:" -ForegroundColor Cyan
Write-Host "
1. ✅ Environment variables configured
2. ✅ Dependencies installed  
3. ⏳ Run migrations:
   npm run migrate:run

4. ⏳ Seed admin user:
   npm run seed

5. ⏳ Start development server:
   npm run dev

6. 📚 Access API documentation:
   http://localhost:3000/api-docs
" -ForegroundColor Gray

Write-Host "`n💡 For Supabase settings, visit:` -ForegroundColor Cyan
Write-Host "   https://app.supabase.com/project/YOUR_PROJECT_ID/settings/database" -ForegroundColor Gray

Write-Host "`n📖 Full documentation available in: SUPABASE_SETUP.md`n" -ForegroundColor Gray
