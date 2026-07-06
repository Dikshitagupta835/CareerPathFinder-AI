# Stage 1: Build the React frontend client
FROM node:20-alpine AS client-builder
WORKDIR /app/client

# Copy package files and install dependencies
COPY client/package*.json ./
RUN npm ci

# Copy client source code and build
COPY client/ ./
RUN npm run build

# Stage 2: Run the Express backend server
FROM node:20-alpine AS runner
WORKDIR /app

# Set production environment
ENV NODE_ENV=production

# Copy server package files and install production dependencies
COPY server/package*.json ./server/
RUN cd server && npm ci --omit=dev

# Copy server source code
COPY server/ ./server/

# Copy compiled frontend from Stage 1
COPY --from=client-builder /app/client/dist ./client/dist

# Expose port (Cloud Run sets the PORT env variable automatically, typically 8080)
EXPOSE 8080

# Start the server
WORKDIR /app/server
CMD ["node", "server.js"]
