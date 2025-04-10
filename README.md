
# Barter — Frontend Application

**Barter** is a modern peer-to-peer skill exchange platform designed to empower users to trade knowledge, mentor others, and learn collaboratively. This is the frontend codebase, built with **Next.js 14**, **TypeScript**, and **Tailwind CSS**, and connected to a NestJS backend.

---

## 🚀 Features

- 🔐 Authentication with Zod validation and secure form handling
- 🖼️ Avatar upload with live file name preview
- 🧑‍🎓 Hero section, testimonials, trending offers, and more
- 💬 AI chatbot interface with eye-tracking interaction
- 🌐 Language-ready with i18n support structure
- 📚 Skill categories like Python, Git, DevOps, SQL, Security, and more
- 🎨 Custom design inspired by edX and Vercel aesthetics

---

## 🛠️ Tech Stack

| Technology          | Description                          |
|---------------------|--------------------------------------|
| **Next.js 14**       | App Router, SSR, and file-based routing |
| **TypeScript**       | Fully typed frontend development     |
| **Tailwind CSS**     | Utility-first CSS framework          |
| **Zod**              | Schema-based form validation         |
| **React Hook Form**  | Form state management                |
| **SessionStorage**   | Persistent session handling          |
| **Vercel**           | Continuous deployment & hosting      |

---

## 📁 Folder Structure

```
barter-web/
├── app/                 # App Router (layouts, pages)
│   ├── auth/            # Login & registration pages
│   ├── layout.tsx       # Root layout
│   └── page.tsx         # Landing page
├── components/          # Reusable UI components (Header, Hero, Chat, etc.)
├── public/              # Static assets (logo, icons, images)
├── styles/              # Global styles (if applicable)
├── .env.local           # Environment variables
└── README.md
```

---

## ⚙️ Getting Started

### 1. Install dependencies

```bash
npm install
```

### 2. Run development server

```bash
npm run dev
```

The app will be available at: [http://localhost:3000](http://localhost:3000)

---

## 🌐 API Integration

The frontend connects to the NestJS backend (`barter-api`) via environment-based URLs.

Add your backend URL in `.env.local`:

```env
NEXT_PUBLIC_URL_API=http://localhost:4000
```

Make sure CORS is properly configured on the API side.

---

## 📦 Deployment (Vercel)

This app is deployed via **Vercel**, using the `barter-web` folder as the root.

**Vercel Project Settings:**

- Framework: `Next.js`
- Root Directory: `barter-web`
- Build Command: `npm run build`
- Output Directory: `.next`

Automatic deployments from GitHub are supported.

---

## 🧠 Author

**Tomasz Izdebski**  
Fullstack Developer | Passionate about clean UI, efficient code, and learning through collaboration.

This project is part of a 2025 engineering thesis.

---

## 📝 License

This project is licensed under the **MIT License**.  
Feel free to use, contribute, and build upon it — barter knowledge, not just code!
