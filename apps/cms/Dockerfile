# Monorepo-aware Dockerfile for PayloadCMS
FROM node:22.11.0-alpine AS base

# Install dependencies only when needed
FROM base AS deps
RUN apk add --no-cache libc6-compat
WORKDIR /app

# Install pnpm
RUN corepack enable pnpm

# Copy root lockfile and package.json
COPY pnpm-lock.yaml pnpm-workspace.yaml package.json ./

# Copy the cms package.json
COPY apps/cms/package.json ./apps/cms/

# Install dependencies for the whole workspace (filtered to cms if possible, but usually pnpm needs the whole tree for resolution)
RUN pnpm install --frozen-lockfile

# Rebuild the source code only when needed
FROM base AS builder
WORKDIR /app
RUN corepack enable pnpm

COPY --from=deps /app/node_modules ./node_modules
COPY --from=deps /app/apps/cms/node_modules ./apps/cms/node_modules
COPY . .

# Build the CMS
RUN pnpm --filter @ma3/cms build

# Production image, copy all the files and run next
FROM base AS runner
WORKDIR /app

ENV NODE_ENV production
ENV PAYLOAD_CONFIG_PATH apps/cms/src/payload.config.ts

RUN addgroup --system --gid 1001 nodejs
RUN adduser --system --uid 1001 nextjs

# Copy standalone build from the apps/cms directory
COPY --from=builder /app/apps/cms/public ./apps/cms/public
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/standalone ./
COPY --from=builder --chown=nextjs:nodejs /app/apps/cms/.next/static ./apps/cms/.next/static

USER nextjs

EXPOSE 3000

ENV PORT 3000

# server.js is created by next build from the standalone output
# For monorepos, standalone output usually puts the entry point at the root or within the app folder
# Depending on how Next.js wraps the standalone, we might need to point to apps/cms/server.js
CMD HOSTNAME="0.0.0.0" node apps/cms/server.js
