# 🌌 EventByte: Platinum Edition

EventByte is a high-performance, cinematic event management platform redesigned for the "Digital Aura" / "Stitch Platinum" design system. It provides a premium suite for hosting, managing, and judging world-class hackathons, seminars, and workshops.

---

## ✨ The Platinum Overhaul (v2.0)
The latest version introduces a comprehensive visual and structural transformation:

- **Digital Aura Design System**: A foundation of deep charcoal backgrounds, holographic mesh gradients, and advanced glassmorphism.
- **The "Blade" Console**: Unified, role-specific floating sidebars for **Admin** (Control Center Red), **Organizer** (Primary Purple), and **Participant** (Community Cyan).
- **Interactive Team Cards**: 3D parallax tilting cards with responsive mouse-follow logic and glowing accents.
- **Cinematic Auth**: Immersive split-screen authentication flows featuring custom-generated 3D holographic assets.

---

## 🚀 Key Features

### 📅 Event Lifecycle & Management
- **Universal Dashboard**: Real-time stats and management tools for event organizers.
- **Multi-Tenant Branding**: Dynamic CSS variable-based branding for every event instance.
- **Force Staffing**: Advanced team management with role-based permissions and hierarchical access control.

### ⚖️ Precision Judging Module
- **Live Scoring**: Interactive judging interface for evaluating submissions in real-time.
- **Dynamic Leaderboards**: Real-time leaderboard updates powered by Socket.io for high-stakes competition.
- **Judge Management**: Efficient onboarding and assignment of judges to event tracks.

### 📡 Real-time Communication
- **Global Announcements**: Instant toast notifications for all active participants.
- **Event Group Chat**: Seamless real-time coordination via integrated socket communication.
- **Check-in Engine**: High-speed registration and QR-ready participant check-in flow.

---

## 🛠️ Technology Stack

### Frontend (Cinematic Tier)
- **React 18 & Vite**: Lightning-fast development and build cycles.
- **Tailwind CSS v3**: Advanced utility-first styling with custom "Aura" extensions.
- **Framer Motion**: High-end physics-based animations and layout transitions.
- **Zustand**: Lightweight, reactive state management.
- **Lucide React**: Modern, consistent iconography.

### Backend (Edge Tier)
- **Fastify 4**: High-performance Node.js framework optimized for low latency.
- **Drizzle ORM**: Next-generation TypeScript ORM for type-safe database interactions.
- **PostgreSQL 16**: Robust, scalable core data storage.
- **Redis & BullMQ**: Scalable background processing for certificates and notifications.

---

## 📁 Project Structure

```bash
├── backend/            # Fastify API, Database Schemas, & Job Processors
├── frontend/           # React Application & Platinum Design System
│   ├── src/components/ # Reusable UI & Layout Components
│   ├── src/pages/      # Feature-specific Page Modules
│   └── src/styles/     # Core Global Theme & Design Tokens
├── docker-compose.yml  # Infrastructure-as-code for Postgres & Redis
└── nginx.conf          # Production Reverse Proxy Configuration
```

---

## 🔑 Installation & Deployment

1. **Clone the Identity**: `git clone https://github.com/nischay/EventByte.git`
2. **Ignite Infrastructure**: `docker-compose up -d`
3. **Initialize Backend**:
   ```bash
   cd backend && npm install
   npm run db:push
   npm run dev
   ```
4. **Deploy Frontend**:
   ```bash
   cd frontend && npm install
   npm run dev
   ```

---

*Built with ❤️ by the EventByte Visionary Team.*
