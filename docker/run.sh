#!/bin/bash

# MTG Cubes Docker Management Script

set -e

SCRIPT_DIR="$(cd "$(dirname "${BASH_SOURCE[0]}")" && pwd)"
cd "$SCRIPT_DIR"

# Colors for output
RED='\033[0;31m'
GREEN='\033[0;32m'
YELLOW='\033[1;33m'
BLUE='\033[0;34m'
NC='\033[0m' # No Color

# Print colored output
print_status() {
    echo -e "${BLUE}[INFO]${NC} $1"
}

print_success() {
    echo -e "${GREEN}[SUCCESS]${NC} $1"
}

print_warning() {
    echo -e "${YELLOW}[WARNING]${NC} $1"
}

print_error() {
    echo -e "${RED}[ERROR]${NC} $1"
}

# Show usage
show_usage() {
    echo "MTG Cubes Docker Management Script"
    echo ""
    echo "Usage: $0 [COMMAND]"
    echo ""
    echo "Commands:"
    echo "  up          - Start the application (build if necessary)"
    echo "  down        - Stop the application"
    echo "  build       - Build the Docker image"
    echo "  rebuild     - Force rebuild the Docker image"
    echo "  logs        - Show application logs"
    echo "  status      - Show container status"
    echo "  clean       - Stop and remove containers, networks, and volumes"
    echo "  shell       - Open shell in running container"
    echo "  backup      - Backup the database"
    echo "  restore     - Restore database from backup"
    echo "  help        - Show this help message"
    echo ""
}

# Start the application
start_app() {
    print_status "Starting MTG Cubes application..."
    
    if [ ! -f .env ]; then
        print_warning ".env file not found. Creating from .env.example..."
        cp .env.example .env
    fi
    
    docker-compose up -d --build
    print_success "Application started successfully!"
    print_status "Access the application at: http://localhost:3001"
}

# Stop the application
stop_app() {
    print_status "Stopping MTG Cubes application..."
    docker-compose down
    print_success "Application stopped successfully!"
}

# Build the image
build_image() {
    print_status "Building MTG Cubes Docker image..."
    docker-compose build
    print_success "Image built successfully!"
}

# Force rebuild the image
rebuild_image() {
    print_status "Force rebuilding MTG Cubes Docker image..."
    docker-compose build --no-cache
    print_success "Image rebuilt successfully!"
}

# Show logs
show_logs() {
    print_status "Showing MTG Cubes application logs..."
    docker-compose logs -f
}

# Show status
show_status() {
    print_status "MTG Cubes container status:"
    docker-compose ps
    echo ""
    print_status "Container health status:"
    docker inspect mtgcubes-app --format='{{.State.Health.Status}}' 2>/dev/null || echo "Container not running"
}

# Clean up
clean_up() {
    print_warning "This will stop and remove all containers, networks, and volumes!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        print_status "Cleaning up..."
        docker-compose down -v --remove-orphans
        docker system prune -f
        print_success "Cleanup completed!"
    else
        print_status "Cleanup cancelled."
    fi
}

# Open shell
open_shell() {
    print_status "Opening shell in MTG Cubes container..."
    docker-compose exec mtgcubes /bin/sh
}

# Backup database
backup_database() {
    print_status "Backing up database..."
    BACKUP_DIR="./backups"
    mkdir -p "$BACKUP_DIR"
    
    BACKUP_FILE="$BACKUP_DIR/mtgcubes-backup-$(date +%Y%m%d-%H%M%S).db"
    
    if docker-compose ps mtgcubes | grep -q "Up"; then
        docker-compose exec mtgcubes cp /app/server/data/cubes.db /tmp/backup.db
        docker cp mtgcubes-app:/tmp/backup.db "$BACKUP_FILE"
        print_success "Database backed up to: $BACKUP_FILE"
    else
        print_error "Container is not running!"
    fi
}

# Restore database
restore_database() {
    print_status "Available backup files:"
    ls -la backups/*.db 2>/dev/null || {
        print_error "No backup files found!"
        exit 1
    }
    
    echo ""
    read -p "Enter backup file path: " BACKUP_FILE
    
    if [ ! -f "$BACKUP_FILE" ]; then
        print_error "Backup file not found: $BACKUP_FILE"
        exit 1
    fi
    
    print_warning "This will replace the current database!"
    read -p "Are you sure? (y/N): " -n 1 -r
    echo
    
    if [[ $REPLY =~ ^[Yy]$ ]]; then
        if docker-compose ps mtgcubes | grep -q "Up"; then
            docker cp "$BACKUP_FILE" mtgcubes-app:/tmp/restore.db
            docker-compose exec mtgcubes cp /tmp/restore.db /app/server/data/cubes.db
            docker-compose restart mtgcubes
            print_success "Database restored successfully!"
        else
            print_error "Container is not running!"
        fi
    else
        print_status "Restore cancelled."
    fi
}

# Main script logic
case "${1:-help}" in
    up)
        start_app
        ;;
    down)
        stop_app
        ;;
    build)
        build_image
        ;;
    rebuild)
        rebuild_image
        ;;
    logs)
        show_logs
        ;;
    status)
        show_status
        ;;
    clean)
        clean_up
        ;;
    shell)
        open_shell
        ;;
    backup)
        backup_database
        ;;
    restore)
        restore_database
        ;;
    help|--help|-h)
        show_usage
        ;;
    *)
        print_error "Unknown command: $1"
        echo ""
        show_usage
        exit 1
        ;;
esac