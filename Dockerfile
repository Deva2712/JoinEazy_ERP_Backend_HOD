# ─── Base: shared foundation ──────────────────────────────────────────────────
FROM public.ecr.aws/docker/library/node:20-alpine AS base
WORKDIR /app

# Copy dependency manifests first (better layer caching)
COPY package.json package-lock.json* ./

# ─── Development stage ────────────────────────────────────────────────────────
FROM base AS development

# Install ALL deps including nodemon for hot reload
RUN npm ci

# Copy source code
COPY . .

# PORT env var is injected at runtime via docker-compose
EXPOSE 5000

# Start with nodemon — auto-restarts on file changes
CMD ["npm", "run", "dev"]

# ─── Production stage ─────────────────────────────────────────────────────────
FROM base AS production

# Install production deps only — no nodemon
RUN npm ci --omit=dev

# Copy source code
COPY . .

EXPOSE 5000

# Start with node directly
CMD ["npm", "run", "start"]
