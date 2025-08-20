# COWN1 Platform - Official Docker Image
FROM node:18-alpine

# Set working directory
WORKDIR /app

# Add metadata
LABEL maintainer="COWN1 Team <team@cown1.com>"
LABEL description="COWN1 - Modern social messaging platform with MTProto encryption"
LABEL version="1.0.0"

# Install system dependencies
RUN apk add --no-cache \
    git \
    python3 \
    make \
    g++ \
    && rm -rf /var/cache/apk/*

# Copy package files
COPY package*.json ./

# Install dependencies
RUN npm ci --only=production && npm cache clean --force

# Copy source code
COPY . .

# Create non-root user
RUN addgroup -g 1001 -S cown1 && \
    adduser -S cown1 -u 1001 -G cown1

# Create necessary directories
RUN mkdir -p /app/uploads /app/logs /app/temp && \
    chown -R cown1:cown1 /app

# Switch to non-root user
USER cown1

# Expose port
EXPOSE 10000

# Health check
HEALTHCHECK --interval=30s --timeout=10s --start-period=5s --retries=3 \
    CMD node -e "require('http').get('http://localhost:' + (process.env.PORT || 10000) + '/health', (res) => { process.exit(res.statusCode === 200 ? 0 : 1) }).on('error', () => process.exit(1))"

# Start application
CMD ["npm", "start"]
