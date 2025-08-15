# Multi-stage build for React + Node.js application
FROM node:18-alpine AS base

# Install dependencies for native modules
RUN apk add --no-cache python3 make g++

# Set working directory
WORKDIR /app

# Copy root package.json for workspace setup
COPY package*.json ./
COPY server/package*.json ./server/
COPY client/package*.json ./client/

# Install all dependencies
RUN npm run install:all

# Build stage for client
FROM base AS client-build
COPY client/ ./client/
RUN cd client && npm run build

# Build stage for server
FROM base AS server-build
COPY server/ ./server/

# Final production image
FROM node:18-alpine AS production

# Install production dependencies
RUN apk add --no-cache sqlite

# Create app directory
WORKDIR /app

# Create non-root user
RUN addgroup -g 1001 -S nodejs && \
    adduser -S mtgcube -u 1001

# Copy server files
COPY --from=server-build /app/server ./server
COPY --from=server-build /app/server/package*.json ./server/

# Copy client build
COPY --from=client-build /app/client/build ./client/build

# Install production dependencies only
RUN cd server && npm ci --only=production && npm cache clean --force

# Create data directory with proper permissions
RUN mkdir -p /app/server/data && \
    chown -R mtgcube:nodejs /app/server/data

# Copy startup script
COPY docker/start.sh ./
RUN chmod +x start.sh

# Switch to non-root user
USER mtgcube

# Expose port
EXPOSE 3001

# Health check
HEALTHCHECK --interval=30s --timeout=3s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:3001/api/health', (res) => process.exit(res.statusCode === 200 ? 0 : 1))"

# Start the application
CMD ["./start.sh"]