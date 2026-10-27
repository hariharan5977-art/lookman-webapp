# Multi-stage production build for Lookman Full-Stack Application
FROM node:20-alpine AS builder

WORKDIR /app

# Install dependencies for both backend and frontend
COPY package*.json ./
COPY backend/package*.json ./backend/
COPY frontend/package*.json ./frontend/

RUN npm install --prefix backend && npm install --prefix frontend

# Copy entire source tree
COPY . .

# Build the frontend production bundle (outputs to frontend/dist)
RUN npm run build --prefix frontend

# Production runtime image
FROM node:20-alpine AS runner

WORKDIR /app

ENV NODE_ENV=production
ENV PORT=5000

# Copy root manifest and backend source
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/backend ./backend
COPY --from=builder /app/backend/node_modules ./backend/node_modules

# Copy compiled frontend dist bundle
COPY --from=builder /app/frontend/dist ./frontend/dist

EXPOSE 5000

CMD ["npm", "start"]
