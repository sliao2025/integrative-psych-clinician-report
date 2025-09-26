# ---- Build stage ----
FROM node:20-alpine AS builder
WORKDIR /app

# Install deps with good cache behavior
COPY package.json package-lock.json* yarn.lock* pnpm-lock.yaml* ./
RUN \
  if [ -f pnpm-lock.yaml ]; then npm i -g pnpm && pnpm i --frozen-lockfile; \
  elif [ -f yarn.lock ]; then yarn --frozen-lockfile; \
  else npm ci; fi

# Copy only Prisma schema first to cache prisma generate when app code changes
COPY prisma ./prisma

# Copy the rest of the source
COPY . .

ENV NODE_ENV=production

# Ensure Prisma client is generated BEFORE Next build (no DB connection required)
RUN npx prisma generate

# Build Next.js for production
RUN npm run build

# ---- Runtime stage ----
FROM node:20-alpine AS runner
WORKDIR /app
ENV NODE_ENV=production
ENV PORT=8080

# Copy only what is needed to run
COPY --from=builder /app/package.json ./
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/.next ./.next
COPY --from=builder /app/public ./public
COPY --from=builder /app/prisma ./prisma

EXPOSE 8080
CMD ["npm", "run", "start", "--", "-p", "8080"]