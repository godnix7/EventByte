# 🌌 EventByte: Platinum Edition

## Overview
EventByte is a high-performance, cinematic event management platform. Redesigned with the "Digital Aura" design system, it provides a premium suite for hosting, managing, and judging world-class hackathons, seminars, and workshops.

## ✨ Features
- **Cinematic Interface**: 3D parallax tilting cards, holographic gradients, and Framer Motion animations.
- **Unified Console**: Role-specific dashboards for Admins, Organizers, and Participants.
- **Precision Judging**: Live scoring interface with real-time WebSocket leaderboards.
- **Global Communication**: Instant announcements and integrated event group chats.

## 🛠️ Tech Stack
- **Frontend (Cinematic Tier)**: React 18, Vite, Tailwind CSS v3, Framer Motion, Zustand
- **Backend (Edge Tier)**: Fastify 4, Drizzle ORM, PostgreSQL 16
- **Infrastructure**: Redis, BullMQ, Docker

## 🚀 Installation & Usage
1. **Clone the repository**:
   ```bash
   git clone https://github.com/godnix7/EventByte.git
   ```
2. **Ignite Infrastructure**:
   ```bash
   docker-compose up -d
   ```
3. **Initialize Backend**:
   ```bash
   cd backend
   npm install
   npm run db:push
   npm run dev
   ```
4. **Deploy Frontend**:
   ```bash
   cd frontend
   npm install
   npm run dev
   ```

## 🔮 Future Improvements
- Automated certificate generation and emailing via background workers.
- Integration with third-party ticketing and payment gateways.
