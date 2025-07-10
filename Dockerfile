# Multi-stage build for optimized production image
FROM node:18-alpine AS dependencies

# Set working directory
WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install dependencies
RUN npm install --production --verbose && \
    ls -la /app && \
    npm cache clean --force

# Build stage
FROM node:18-alpine AS builder

WORKDIR /app

# Copy package files
COPY src/package*.json ./

# Install all dependencies (including dev dependencies)
RUN npm install

# Copy source code
COPY src/ ./

# Build the application
RUN npm run build && ls -la /app

# Production stage
FROM node:18-alpine AS runner

WORKDIR /app

# Create non-root user
RUN addgroup --system --gid 1001 nodejs
RUN adduser -S -u 1001 -G nodejs nextjs

# Copy built application
COPY --from=builder /app/public ./public
COPY --from=builder /app/build ./build
COPY --from=builder /app/pages ./pages
COPY --from=builder /app/components ./components
COPY --from=builder /app/config ./config
COPY --from=builder /app/server.js ./server.js
COPY --from=builder /app/next.config.js ./next.config.js
COPY --from=builder /app/knexfile.js ./knexfile.js
COPY --from=builder /app/lib ./lib

# Copy production dependencies
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package.json ./package.json

# Create data directory and set permissions
RUN mkdir -p /data-jdih && \
    mkdir -p /app/build/cache && \
    chown -R nextjs:nodejs /data-jdih && \
    chown -R nextjs:nodejs /app/build

# Switch to non-root user
USER nextjs

# Expose port
EXPOSE 3000

# Health check (curl not available in alpine, using wget)
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
  CMD wget --no-verbose --tries=1 --spider http://localhost:3000/ || exit 1

# Start the application
CMD ["node", "server.js"]