# 🚀 Barter — Skill Exchange Platform

[![Built with ❤️ using NestJS, Next.js & Docker](https://img.shields.io/badge/Built%20with-%E2%9D%A4%EF%B8%8F%20NestJS%2C%20Next.js%20%26%20Docker-blueviolet?style=for-the-badge)](https://github.com/your-username/barter)
[![License](https://img.shields.io/badge/license-MIT-green?style=for-the-badge)](LICENSE)
[![Status](https://img.shields.io/badge/status-Active-brightgreen?style=for-the-badge)](https://github.com/your-username/barter)
[![Dockerized](https://img.shields.io/badge/Dockerized-%E2%9C%94%EF%B8%8F-blue?style=for-the-badge)](https://www.docker.com/)

## 📦 About the Project

**Barter** is a web application that enables users to **exchange lessons, skills, and knowledge in a barter model**.  
It’s built with **NestJS (backend)**, **Next.js (frontend)**, **PostgreSQL**, and **Docker Compose**.

## 🗂 Project Structure

```
Barter/
├── barter-api/         # Backend (NestJS)
├── barter-web/         # Frontend (Next.js)
├── webhook/            # Webhook server for auto-deploy (git pull)
├── .env                # Global environment variables
├── docker-compose.yml  # Docker Compose file for the entire project
├── README.md           # Project documentation (this file)
```

## 🛠 Technologies

- ⚡ **Frontend**: Next.js, React, TailwindCSS
- 🛡️ **Backend**: NestJS, Prisma ORM, JWT Auth
- 🗄️ **Database**: PostgreSQL (Docker)
- 🤖 **LLM (AI)**: Ollama with Mistral model
- 🐳 **Docker & Docker Compose**
- 🌐 **Webhook for auto-deployment**

## 🚀 Getting Started

### 1. Clone the repository

```bash
git clone https://github.com/tomizdebski/Barter
cd Barter
```

### 2. Configure environment variables

Create a `.env` file in the root directory:

```env
# PostgreSQL Database Configuration
DATABASE_URL=postgresql://postgres:postgres@postgres:5432/barterdb

# JWT Authentication Secret
JWT_SECRET=your-very-strong-secret-key

# Application URLs
FRONTEND_URL=http://localhost:3000
BACKEND_URL=http://localhost:4000

# Webhook URL (optional, for auto-deploy)
WEBHOOK_URL=http://localhost:9000/webhook

# Ollama AI Service URL (optional, for LLM integration)
OLLAMA_URL=http://localhost:11434
```

### 3. Run the application with Docker Compose

```bash
docker-compose up --build
```

### 4. Application will be available at:

- Frontend: [http://localhost:3000](http://localhost:3000)
- Backend API: [http://localhost:4000](http://localhost:4000)
- Webhook: [http://localhost:9000/webhook](http://localhost:9000/webhook)

## 🧪 Useful Development Commands

### Backend (NestJS)

```bash
cd barter-api
npm install
npm run start:dev
```

### Frontend (Next.js)

```bash
cd barter-web
npm install
npm run dev
```

### Prisma Migrate

```bash
cd barter-api
npx prisma migrate dev
```

## 📊 Features

✅ User registration & JWT authentication  
✅ Skill & lesson management  
✅ Barter exchange system  
✅ Educational quiz module  
✅ AI assistant (Mistral via Ollama)  
✅ Favorites system  
✅ User dashboard  
✅ Fully responsive design

## 📝 Roadmap

- [ ] Push notifications
- [ ] Barter rating & reviews
- [ ] Premium barter (payments & subscriptions)
- [ ] Calendar integration (lesson bookings)

## 🔗 Webhook for Auto-Deploy

The webhook listens for POST requests (e.g., from GitHub) and automatically executes:

- `git pull` for the latest code
- Docker service restart (if needed)

Endpoint: `/webhook`

## 👨‍💻 Author

- **Tomasz Izdebski**  
  [GitHub](https://github.com/tomizdebski) | [LinkedIn](https://linkedin.com/in/izdebski-tomasz-21058925)
