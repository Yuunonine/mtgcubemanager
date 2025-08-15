@echo off
REM MTG Cubes Docker Management Script for Windows Command Prompt

setlocal enabledelayedexpansion

REM Get the directory where this batch file is located
cd /d "%~dp0"

REM Set command variable
set "COMMAND=%~1"
if "%COMMAND%"=="" set "COMMAND=help"

REM Color codes (limited in batch)
set "INFO_PREFIX=[INFO]"
set "SUCCESS_PREFIX=[SUCCESS]"
set "WARNING_PREFIX=[WARNING]"
set "ERROR_PREFIX=[ERROR]"

REM Show usage function
if "%COMMAND%"=="help" goto :show_usage
if "%COMMAND%"=="--help" goto :show_usage
if "%COMMAND%"=="-h" goto :show_usage

REM Check if Docker is running
docker version >nul 2>&1
if errorlevel 1 (
    echo %ERROR_PREFIX% Docker is not running or not installed. Please start Docker Desktop.
    exit /b 1
)

REM Check if Docker Compose is available
docker-compose --version >nul 2>&1
if errorlevel 1 (
    docker compose version >nul 2>&1
    if errorlevel 1 (
        echo %ERROR_PREFIX% Docker Compose is not available. Please install Docker Desktop.
        exit /b 1
    ) else (
        set "DOCKER_COMPOSE=docker compose"
    )
) else (
    set "DOCKER_COMPOSE=docker-compose"
)

REM Execute commands
if "%COMMAND%"=="up" goto :start_app
if "%COMMAND%"=="down" goto :stop_app
if "%COMMAND%"=="build" goto :build_image
if "%COMMAND%"=="rebuild" goto :rebuild_image
if "%COMMAND%"=="logs" goto :show_logs
if "%COMMAND%"=="status" goto :show_status
if "%COMMAND%"=="clean" goto :clean_up
if "%COMMAND%"=="shell" goto :open_shell
if "%COMMAND%"=="backup" goto :backup_database

echo %ERROR_PREFIX% Unknown command: %COMMAND%
echo.
goto :show_usage

:show_usage
echo MTG Cubes Docker Management Script for Windows
echo.
echo Usage: run.bat [COMMAND]
echo.
echo Commands:
echo   up          - Start the application (build if necessary)
echo   down        - Stop the application
echo   build       - Build the Docker image
echo   rebuild     - Force rebuild the Docker image
echo   logs        - Show application logs
echo   status      - Show container status
echo   clean       - Stop and remove containers, networks, and volumes
echo   shell       - Open shell in running container
echo   backup      - Backup the database
echo   help        - Show this help message
echo.
echo Examples:
echo   run.bat up
echo   run.bat logs
echo   run.bat down
echo.
echo Note: For more advanced features, use run.ps1 with PowerShell
goto :end

:start_app
echo %INFO_PREFIX% Starting MTG Cubes application...

if not exist ".env" (
    echo %WARNING_PREFIX% .env file not found. Creating from .env.example...
    if exist ".env.example" (
        copy ".env.example" ".env" >nul
    ) else (
        echo %ERROR_PREFIX% .env.example file not found!
        exit /b 1
    )
)

%DOCKER_COMPOSE% up -d --build
if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to start the application!
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% Application started successfully!
    echo %INFO_PREFIX% Access the application at: http://localhost:3001
)
goto :end

:stop_app
echo %INFO_PREFIX% Stopping MTG Cubes application...
%DOCKER_COMPOSE% down
if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to stop the application!
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% Application stopped successfully!
)
goto :end

:build_image
echo %INFO_PREFIX% Building MTG Cubes Docker image...
%DOCKER_COMPOSE% build
if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to build the image!
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% Image built successfully!
)
goto :end

:rebuild_image
echo %INFO_PREFIX% Force rebuilding MTG Cubes Docker image...
%DOCKER_COMPOSE% build --no-cache
if errorlevel 1 (
    echo %ERROR_PREFIX% Failed to rebuild the image!
    exit /b 1
) else (
    echo %SUCCESS_PREFIX% Image rebuilt successfully!
)
goto :end

:show_logs
echo %INFO_PREFIX% Showing MTG Cubes application logs...
%DOCKER_COMPOSE% logs -f
goto :end

:show_status
echo %INFO_PREFIX% MTG Cubes container status:
%DOCKER_COMPOSE% ps
echo.
echo %INFO_PREFIX% Container health status:
docker inspect mtgcubes-app --format="{{.State.Health.Status}}" 2>nul
if errorlevel 1 echo Container not running
goto :end

:clean_up
echo %WARNING_PREFIX% This will stop and remove all containers, networks, and volumes!
set /p "CONFIRM=Are you sure? (y/N): "
if /i "%CONFIRM%"=="y" (
    echo %INFO_PREFIX% Cleaning up...
    %DOCKER_COMPOSE% down -v --remove-orphans
    docker system prune -f
    if errorlevel 1 (
        echo %ERROR_PREFIX% Cleanup failed!
        exit /b 1
    ) else (
        echo %SUCCESS_PREFIX% Cleanup completed!
    )
) else (
    echo %INFO_PREFIX% Cleanup cancelled.
)
goto :end

:open_shell
echo %INFO_PREFIX% Opening shell in MTG Cubes container...
%DOCKER_COMPOSE% exec mtgcubes /bin/sh
goto :end

:backup_database
echo %INFO_PREFIX% Backing up database...

if not exist "backups" mkdir backups

REM Get timestamp
for /f "tokens=2 delims==" %%a in ('wmic OS Get localdatetime /value') do set "dt=%%a"
set "YY=%dt:~2,2%" & set "YYYY=%dt:~0,4%" & set "MM=%dt:~4,2%" & set "DD=%dt:~6,2%"
set "HH=%dt:~8,2%" & set "Min=%dt:~10,2%" & set "Sec=%dt:~12,2%"
set "timestamp=%YYYY%%MM%%DD%-%HH%%Min%%Sec%"

set "BACKUP_FILE=backups\mtgcubes-backup-%timestamp%.db"

%DOCKER_COMPOSE% ps mtgcubes | findstr "Up" >nul
if errorlevel 1 (
    echo %ERROR_PREFIX% Container is not running!
    exit /b 1
) else (
    %DOCKER_COMPOSE% exec mtgcubes cp /app/server/data/cubes.db /tmp/backup.db
    docker cp mtgcubes-app:/tmp/backup.db "%BACKUP_FILE%"
    if errorlevel 1 (
        echo %ERROR_PREFIX% Failed to backup database!
        exit /b 1
    ) else (
        echo %SUCCESS_PREFIX% Database backed up to: %BACKUP_FILE%
    )
)
goto :end

:end
endlocal