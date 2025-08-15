# MTG Cubes Docker Management Script for Windows PowerShell
param(
    [Parameter(Position=0)]
    [string]$Command = "help"
)

# Set error action preference
$ErrorActionPreference = "Stop"

# Get script directory
$ScriptDir = Split-Path -Parent $MyInvocation.MyCommand.Path
Set-Location $ScriptDir

# Color functions for output
function Write-Info {
    param([string]$Message)
    Write-Host "[INFO] $Message" -ForegroundColor Blue
}

function Write-Success {
    param([string]$Message)
    Write-Host "[SUCCESS] $Message" -ForegroundColor Green
}

function Write-Warning {
    param([string]$Message)
    Write-Host "[WARNING] $Message" -ForegroundColor Yellow
}

function Write-Error {
    param([string]$Message)
    Write-Host "[ERROR] $Message" -ForegroundColor Red
}

# Show usage
function Show-Usage {
    Write-Host "MTG Cubes Docker Management Script for Windows" -ForegroundColor Cyan
    Write-Host ""
    Write-Host "Usage: .\run.ps1 [COMMAND]" -ForegroundColor White
    Write-Host ""
    Write-Host "Commands:" -ForegroundColor White
    Write-Host "  up          - Start the application (build if necessary)" -ForegroundColor Gray
    Write-Host "  down        - Stop the application" -ForegroundColor Gray
    Write-Host "  build       - Build the Docker image" -ForegroundColor Gray
    Write-Host "  rebuild     - Force rebuild the Docker image" -ForegroundColor Gray
    Write-Host "  logs        - Show application logs" -ForegroundColor Gray
    Write-Host "  status      - Show container status" -ForegroundColor Gray
    Write-Host "  clean       - Stop and remove containers, networks, and volumes" -ForegroundColor Gray
    Write-Host "  shell       - Open shell in running container" -ForegroundColor Gray
    Write-Host "  backup      - Backup the database" -ForegroundColor Gray
    Write-Host "  restore     - Restore database from backup" -ForegroundColor Gray
    Write-Host "  help        - Show this help message" -ForegroundColor Gray
    Write-Host ""
    Write-Host "Examples:" -ForegroundColor White
    Write-Host "  .\run.ps1 up" -ForegroundColor Gray
    Write-Host "  .\run.ps1 logs" -ForegroundColor Gray
    Write-Host "  .\run.ps1 down" -ForegroundColor Gray
    Write-Host ""
}

# Check if Docker is running
function Test-DockerRunning {
    try {
        $null = docker version 2>$null
        return $true
    }
    catch {
        Write-Error "Docker is not running or not installed. Please start Docker Desktop."
        return $false
    }
}

# Check if Docker Compose is available
function Test-DockerCompose {
    try {
        $null = docker-compose --version 2>$null
        return $true
    }
    catch {
        try {
            $null = docker compose version 2>$null
            return $true
        }
        catch {
            Write-Error "Docker Compose is not available. Please install Docker Desktop."
            return $false
        }
    }
}

# Get Docker Compose command
function Get-DockerComposeCommand {
    try {
        $null = docker-compose --version 2>$null
        return "docker-compose"
    }
    catch {
        return "docker compose"
    }
}

# Start the application
function Start-App {
    Write-Info "Starting MTG Cubes application..."
    
    if (-not (Test-Path ".env")) {
        Write-Warning ".env file not found. Creating from .env.example..."
        if (Test-Path ".env.example") {
            Copy-Item ".env.example" ".env"
        }
        else {
            Write-Error ".env.example file not found!"
            return
        }
    }
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose up -d --build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application started successfully!"
        Write-Info "Access the application at: http://localhost:3001"
    }
    else {
        Write-Error "Failed to start the application!"
    }
}

# Stop the application
function Stop-App {
    Write-Info "Stopping MTG Cubes application..."
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose down
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Application stopped successfully!"
    }
    else {
        Write-Error "Failed to stop the application!"
    }
}

# Build the image
function Build-Image {
    Write-Info "Building MTG Cubes Docker image..."
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose build
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Image built successfully!"
    }
    else {
        Write-Error "Failed to build the image!"
    }
}

# Force rebuild the image
function Rebuild-Image {
    Write-Info "Force rebuilding MTG Cubes Docker image..."
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose build --no-cache
    
    if ($LASTEXITCODE -eq 0) {
        Write-Success "Image rebuilt successfully!"
    }
    else {
        Write-Error "Failed to rebuild the image!"
    }
}

# Show logs
function Show-Logs {
    Write-Info "Showing MTG Cubes application logs..."
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose logs -f
}

# Show status
function Show-Status {
    Write-Info "MTG Cubes container status:"
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose ps
    
    Write-Host ""
    Write-Info "Container health status:"
    
    try {
        $healthStatus = docker inspect mtgcubes-app --format='{{.State.Health.Status}}' 2>$null
        if ($healthStatus) {
            Write-Host $healthStatus -ForegroundColor Green
        }
        else {
            Write-Host "Container not running" -ForegroundColor Yellow
        }
    }
    catch {
        Write-Host "Container not running" -ForegroundColor Yellow
    }
}

# Clean up
function Invoke-CleanUp {
    Write-Warning "This will stop and remove all containers, networks, and volumes!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        Write-Info "Cleaning up..."
        
        $dockerCompose = Get-DockerComposeCommand
        & $dockerCompose down -v --remove-orphans
        docker system prune -f
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Cleanup completed!"
        }
        else {
            Write-Error "Cleanup failed!"
        }
    }
    else {
        Write-Info "Cleanup cancelled."
    }
}

# Open shell
function Open-Shell {
    Write-Info "Opening shell in MTG Cubes container..."
    
    $dockerCompose = Get-DockerComposeCommand
    & $dockerCompose exec mtgcubes /bin/sh
}

# Backup database
function Backup-Database {
    Write-Info "Backing up database..."
    
    $backupDir = ".\backups"
    if (-not (Test-Path $backupDir)) {
        New-Item -ItemType Directory -Path $backupDir | Out-Null
    }
    
    $timestamp = Get-Date -Format "yyyyMMdd-HHmmss"
    $backupFile = "$backupDir\mtgcubes-backup-$timestamp.db"
    
    $dockerCompose = Get-DockerComposeCommand
    $containerStatus = & $dockerCompose ps mtgcubes
    
    if ($containerStatus -match "Up") {
        & $dockerCompose exec mtgcubes cp /app/server/data/cubes.db /tmp/backup.db
        docker cp mtgcubes-app:/tmp/backup.db $backupFile
        
        if ($LASTEXITCODE -eq 0) {
            Write-Success "Database backed up to: $backupFile"
        }
        else {
            Write-Error "Failed to backup database!"
        }
    }
    else {
        Write-Error "Container is not running!"
    }
}

# Restore database
function Restore-Database {
    Write-Info "Available backup files:"
    
    $backupFiles = Get-ChildItem ".\backups\*.db" -ErrorAction SilentlyContinue
    
    if (-not $backupFiles) {
        Write-Error "No backup files found!"
        return
    }
    
    $backupFiles | ForEach-Object { Write-Host $_.FullName -ForegroundColor Gray }
    
    Write-Host ""
    $backupFile = Read-Host "Enter backup file path"
    
    if (-not (Test-Path $backupFile)) {
        Write-Error "Backup file not found: $backupFile"
        return
    }
    
    Write-Warning "This will replace the current database!"
    $confirmation = Read-Host "Are you sure? (y/N)"
    
    if ($confirmation -eq 'y' -or $confirmation -eq 'Y') {
        $dockerCompose = Get-DockerComposeCommand
        $containerStatus = & $dockerCompose ps mtgcubes
        
        if ($containerStatus -match "Up") {
            docker cp $backupFile mtgcubes-app:/tmp/restore.db
            & $dockerCompose exec mtgcubes cp /tmp/restore.db /app/server/data/cubes.db
            & $dockerCompose restart mtgcubes
            
            if ($LASTEXITCODE -eq 0) {
                Write-Success "Database restored successfully!"
            }
            else {
                Write-Error "Failed to restore database!"
            }
        }
        else {
            Write-Error "Container is not running!"
        }
    }
    else {
        Write-Info "Restore cancelled."
    }
}

# Main script logic
try {
    # Check prerequisites
    if (-not (Test-DockerRunning)) {
        exit 1
    }
    
    if (-not (Test-DockerCompose)) {
        exit 1
    }
    
    # Execute command
    switch ($Command.ToLower()) {
        "up" {
            Start-App
        }
        "down" {
            Stop-App
        }
        "build" {
            Build-Image
        }
        "rebuild" {
            Rebuild-Image
        }
        "logs" {
            Show-Logs
        }
        "status" {
            Show-Status
        }
        "clean" {
            Invoke-CleanUp
        }
        "shell" {
            Open-Shell
        }
        "backup" {
            Backup-Database
        }
        "restore" {
            Restore-Database
        }
        "help" {
            Show-Usage
        }
        default {
            Write-Error "Unknown command: $Command"
            Write-Host ""
            Show-Usage
            exit 1
        }
    }
}
catch {
    Write-Error "An error occurred: $($_.Exception.Message)"
    exit 1
}