FROM node:22-alpine AS base
RUN apk add --no-cache libc6-compat openssl && corepack enable
WORKDIR /app

FROM base AS pruner
RUN npm install -g turbo@^2.5.6
COPY . .
RUN turbo prune web --docker

FROM base AS builder
COPY --from=pruner /app/out/json/ .
COPY --from=pruner /app/out/full/packages/db/prisma ./packages/db/prisma
RUN pnpm install --frozen-lockfile
COPY --from=pruner /app/out/full/ .

ARG NEXT_PUBLIC_WS_URL
ENV NEXT_PUBLIC_WS_URL=$NEXT_PUBLIC_WS_URL
ENV NEXT_TELEMETRY_DISABLED=1
ENV DOCKER_BUILD=1
RUN pnpm --filter web build

FROM base AS runner
ENV NODE_ENV=production
ENV NEXT_TELEMETRY_DISABLED=1
ENV PORT=4000
ENV HOSTNAME=0.0.0.0
WORKDIR /app

COPY --from=builder --chown=node:node /app/apps/web/.next/standalone ./
COPY --from=builder --chown=node:node /app/apps/web/.next/static ./apps/web/.next/static
COPY --from=builder --chown=node:node /app/apps/web/public ./apps/web/public
COPY --from=builder --chown=node:node /app/packages/db/src/generated ./packages/db/src/generated

USER node
EXPOSE 4000
CMD ["node", "apps/web/server.js"]
