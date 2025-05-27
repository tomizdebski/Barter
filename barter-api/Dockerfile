# Etap 1: Budowanie aplikacji NestJS + Prisma
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

RUN npm install --legacy-peer-deps
RUN npx prisma generate --schema=src/prisma/schema.prisma
RUN npm run build

# Etap 2: Produkcyjny
FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/prisma ./src/prisma

ENV NODE_ENV=production

CMD ["sh", "-c", "npx prisma db push --schema=src/prisma/schema.prisma && node dist/main"]


