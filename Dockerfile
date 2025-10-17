# Simple Dockerfile for Node-based backend
FROM node:18-alpine

WORKDIR /usr/src/app
COPY package*.json ./
RUN npm ci --only=production

# Copy source
COPY . .

# Create data dir
RUN mkdir -p /usr/src/app/data

ENV NODE_ENV=production
EXPOSE 3000
CMD ["node", "server.js"]
