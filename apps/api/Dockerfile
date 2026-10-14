FROM node:22-alpine AS base
RUN corepack enable
WORKDIR /app

FROM base AS pruner
RUN npm install -g turbo@^2.5.6
COPY . .
RUN turbo prune @repo/api --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .
RUN pnpm --filter @repo/api build

FROM base AS deps
COPY --from=pruner /app/out/json/ .
RUN pnpm install --frozen-lockfile --prod

FROM node:22-alpine AS runner
ENV NODE_ENV=production
ENV PORT=3000
WORKDIR /app
COPY --from=deps --chown=node:node /app .
COPY --from=builder --chown=node:node /app/apps/api/dist ./apps/api/dist
USER node
WORKDIR /app/apps/api
EXPOSE 3000
HEALTHCHECK --interval=30s --timeout=5s --start-period=10s --retries=3 \
  CMD wget -qO- http://127.0.0.1:${PORT}/check || exit 1
CMD ["node", "dist/index.js"]
