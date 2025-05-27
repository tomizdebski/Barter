# Etap 1: Budowanie aplikacji NestJS + Prisma
FROM node:20-alpine AS builder

WORKDIR /app

# Kopiujemy tylko potrzebne pliki
COPY package*.json ./
COPY tsconfig*.json ./
COPY src ./src

# Instalujemy zależności
RUN npm install --legacy-peer-deps

# Generujemy Prisma Client – podając ścieżkę do schema.prisma
RUN npx prisma generate --schema=src/prisma/schema.prisma

# Budujemy aplikację NestJS (do /dist)
RUN npm run build


# Etap 2: Obraz produkcyjny – lekki, tylko to co potrzebne
FROM node:20-alpine

WORKDIR /app

# Kopiujemy gotowe rzeczy z buildera
COPY --from=builder /app/dist ./dist
COPY --from=builder /app/node_modules ./node_modules
COPY --from=builder /app/package*.json ./
COPY --from=builder /app/src/prisma ./src/prisma  

ENV NODE_ENV=production

# Debug – pokaż co jest w dist
RUN echo "--- FINAL CONTAINER /dist ---" && ls -la dist && echo "----------------------------"

# Uruchomienie: migracje Prisma i start aplikacji
CMD ["sh", "-c", "npx prisma migrate deploy --schema=src/prisma/schema.prisma && node dist/main"]




