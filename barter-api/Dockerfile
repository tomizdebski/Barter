# Etap 1 – builder
FROM node:20-alpine AS builder

WORKDIR /app

COPY package*.json ./
RUN npm install

COPY . .
RUN npm run build

# Etap 2 – finalny obraz produkcyjny
FROM node:20-alpine

WORKDIR /app

# Skopiuj tylko potrzebne pliki z buildera
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

CMD ["node", "dist/main"]
