#!/bin/sh

# MTG Cubes Application Startup Script

echo "Starting MTG Cubes Application..."

# Navigate to server directory
cd /app/server

# Check if database directory exists
if [ ! -d "data" ]; then
    echo "Creating data directory..."
    mkdir -p data
fi

# Set environment variables
export NODE_ENV=production
export PORT=3001

# Start the server
echo "Starting Node.js server on port $PORT..."
exec node index.js