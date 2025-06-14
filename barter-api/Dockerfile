# Etap 1 – builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalacja zależności
COPY package*.json ./
RUN npm install

# Kopiowanie całego projektu
COPY . .

# Generowanie klienta Prisma
RUN echo "🛠 Generating Prisma client..."
RUN npx prisma generate

# Budowanie projektu (Nest -> dist/)
RUN echo "🏗 Building NestJS..."
RUN npm run build

# Etap 2 – finalny obraz produkcyjny
FROM node:20-alpine

WORKDIR /app

# Skopiuj tylko potrzebne pliki z buildera
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./

ENV NODE_ENV=production

# Uruchom backend
CMD ["node", "dist/main"]

