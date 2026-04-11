# CCJ Backend Setup Script for Windows

Write-Host "CCJ Backend Setup Script" -ForegroundColor Green
Write-Host "========================" -ForegroundColor Green

# Check if .env file exists
if (-Not (Test-Path .env)) {
    Write-Host "Creating .env file from .env.example..." -ForegroundColor Yellow
    Copy-Item .env.example .env
    Write-Host "Please update .env with your database credentials" -ForegroundColor Yellow
}

Write-Host ""
Write-Host "Setup complete!" -ForegroundColor Green
Write-Host ""
Write-Host "Next steps:" -ForegroundColor Cyan
Write-Host "1. Update .env file with your database credentials"
Write-Host "2. Create PostgreSQL database"
Write-Host "3. Run migrations from migrations/ folder"
Write-Host "4. Seed admin user: npm run seed"
Write-Host "5. Start server: npm run dev"

