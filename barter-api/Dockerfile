FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
COPY prisma ./prisma
COPY tsconfig*.json ./
COPY src ./src

RUN npm install --legacy-peer-deps
RUN npx prisma generate
RUN npm run build


FROM node:20-alpine

WORKDIR /app

COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/prisma ./prisma

ENV NODE_ENV=production

# 👇 debug: sprawdź, czy main.js faktycznie istnieje
RUN ls -la dist

CMD ["sh", "-c", "npx prisma migrate deploy && node dist/main"]


