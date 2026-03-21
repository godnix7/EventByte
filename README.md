# 🚀 EventByte: Premium Event Management Platform

EventByte is a high-performance, production-ready full-stack platform designed for college hackathons, workshops, and meetups. 

## ⚡ Tech Stack

### Frontend
- **React 18** (Vite 5)
- **TypeScript 5**
- **Tailwind CSS v3** (Utility-first styling)
- **shadcn/ui** (Premium accessible components)
- **Zustand** (Lightweight state management)
- **Framer Motion** (Dynamic animations)
- **TanStack Query v5** (Server state management)
- **Socket.io-client** (Real-time features)

### Backend
- **Fastify 4** (High-performance web framework)
- **Drizzle ORM** (Type-safe SQL)
- **PostgreSQL 16** (Core database)
- **Redis 7** (Caching & Queues)
- **BullMQ** (Background job processing)
- **Socket.io** (Real-time broadcasts)
- **Argon2** (Secure password hashing)

---

## 🛠️ Getting Started (Workflow)

### 1. Requirements
- **Node.js v20+**
- **Docker Desktop** (Required for DB & Redis)

### 2. Infrastructure Setup (Isolated Environment)
In Node.js, we use `node_modules` (via `npm install`) to isolate all project libraries. This functions similarly to a Python virtual environment, ensuring the project libraries don't interfere with your system.

```powershell
# Open Docker Desktop first
# Then start the database and cache
docker-compose up -d
```

### 3. Backend Setup
```powershell
cd backend
npm install
# Sync database schema
npm run db:push
# Start development server
npm run dev
```

### 4. Frontend Setup
```powershell
cd frontend
npm install
# Start development server
npm run dev
```

---

## 🔑 Environment Variables

### Backend (`/backend/.env`)
- `DATABASE_URL`: Connection string for PostgreSQL.
- `JWT_ACCESS_SECRET`: Secret key for auth tokens.
- `SMTP_USER / SMTP_PASS`: Credentials for email notifications.

### Frontend (`/frontend/.env`)
- `VITE_API_BASE_URL`: Pointer to the Backend API.
- `VITE_APP_NAME`: Dynamic branding title.
- `VITE_APP_PRIMARY_COLOR`: Dynamic theme color (CSS).

---

## 📡 Real-time Features
The platform captures real-time events globally:
- `announcement:new`: Broadcasts toast notifications to all active users.
- `chat:message`: Powers the live event group chat.
- `leaderboard:updated`: Live score updates for judging modules.

## 📁 Project Structure
- `/backend`: Fastify API, Database schemas, and Background jobs.
- `/frontend`: React application, dynamic branding logic, and UI components.
- `/docker-compose.yml`: Infrastructure-as-code for Postgres & Redis.
