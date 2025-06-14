# Etap 1 – builder
FROM node:20-alpine AS builder

WORKDIR /app

# Instalacja zależności
COPY package*.json ./
RUN npm install

# Skopiuj plik schema.prisma i inne zasoby potrzebne do generacji klienta
COPY src/prisma ./src/prisma

# Skopiuj resztę projektu
COPY . .

# Ustawienie tymczasowego DATABASE_URL, żeby prisma generate nie wywalił się
ENV DATABASE_URL="postgresql://user:password@localhost:5432/dummy"

# Generowanie klienta Prisma z niestandardowej lokalizacji schema.prisma
RUN echo "🛠 Generating Prisma client..."
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Budowanie projektu NestJS (do katalogu dist/)
RUN echo "🏗 Building NestJS..."
RUN npm run build

# Etap 2 – finalny obraz produkcyjny
FROM node:20-alpine

WORKDIR /app

# Skopiuj z buildera tylko to, co potrzebne
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/prisma ./src/prisma

ENV NODE_ENV=production

# Uruchom backend
CMD ["node", "dist/main"]
