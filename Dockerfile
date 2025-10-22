# Dockerfile (multi-stage para API e Worker - separados via context)
# --------------------------
# Etapa de build
FROM node:20 AS builder

WORKDIR /app

COPY package.json yarn.lock ./
RUN yarn install --frozen-lockfile

COPY . .
RUN yarn build

# Etapa de runtime
FROM node:20-slim AS runtime

WORKDIR /app
COPY --from=builder /app ./

ENV NODE_ENV=production
EXPOSE 80

# API
FROM runtime AS api
CMD ["node", "dist/main/server.js"]

# # WORKER
# FROM runtime AS worker
# CMD ["node", "dist/main/workers/genericWorker.js"]