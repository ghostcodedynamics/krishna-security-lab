# Krishna Security Lab — Architecture

**Version:** 0.1.0 | **Phase 0 Complete**

## Vision
Immersive 3D cybersecurity learning + CTF platform.  
Tagline: **“Learn Security. Break It. Fix It.”**

Learners enter a nighttime Vrindavan-inspired cyber temple, progress through chambers (Auth, API, Database, Access Control, JWT, Final Core), exploit intentionally vulnerable isolated labs, understand root causes, fix them, earn XP/badges, and harden the full application.

## High-Level Architecture

```
React (UI + 3D + CTF)  →  Express API Gateway  →  Auth / Lab / User modules
                                                      ↓
                                                   MongoDB
                                                      ↓
                                            Isolated Lab Containers (Docker)
```

**MVP:** Modular monolith (easy to extract microservices later).

## Tech Stack
- **Frontend:** React 18, TypeScript, Vite, Tailwind, Zustand, React Router, RHF + Zod, Framer Motion, GSAP, Three.js, R3F, Drei, Lucide
- **Backend:** Node 20, Express, TypeScript, MongoDB, Mongoose, JWT, Argon2, Zod, Helmet, CORS, rate-limit, Pino
- **Labs:** Docker-isolated intentionally vulnerable apps
- **Testing:** Vitest, RTL, Supertest, Playwright

## Core Modules
Auth, User Management, Dashboard, 3D World, Challenge Engine, Lab Engine, Terminal, Hints, Flags, XP/Levels/Badges, Progress, Leaderboard, Knowledge Center, Security Score, Admin, Audit Logs

## Security Boundary (Non-negotiable)
- Labs: isolated containers, fake data only, no real credentials, no external targeting, no malware
- Platform: production-grade (Helmet, rate limiting, validation, hashed secrets, etc.)

## Phases
0 ✅ Planning → 1 Foundation → 2 Design System → 3 Landing → 4 Auth → 5 Dashboard → 6 3D World → 7 Challenge Engine → 8–15 Labs + Final Boss → 16–19 Audit / Perf / Docs / Demo
