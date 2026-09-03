# Krishna Security Lab

**Learn Security. Break It. Fix It.**

An immersive 3D cybersecurity learning and CTF platform. Learners enter a virtual security environment, discover vulnerabilities in intentionally isolated labs, understand root causes, implement fixes, and progress through levels while earning XP and badges.

---

## Current Status

**Phase 0 — Planning: Complete**  
**Phase 1 — Project Foundation: In Progress**

---

## Documentation

| Document | Description |
|----------|-------------|
| [Architecture](docs/architecture.md) | High-level system design |
| [Database](docs/database.md) | MongoDB schemas & indexes |
| [API](docs/api.md) | REST API specification |
| [UI/UX](docs/ui-ux.md) | Design system & page layouts |
| [3D Architecture](docs/3d-architecture.md) | Three.js / R3F scene design |
| [Security Model](docs/security.md) | Platform + lab security boundaries |
| [Challenges](docs/challenges.md) | Challenge structure & roadmap |
| [Implementation Plan](docs/implementation-plan.md) | Phase-by-phase plan |

---

## Tech Stack

**Frontend:** React · TypeScript · Vite · Tailwind · Zustand · React Three Fiber · Framer Motion · GSAP  

**Backend:** Node.js · Express · TypeScript · MongoDB · Mongoose · JWT · Argon2 · Zod · Helmet · Pino  

**Labs:** Isolated Docker containers  

**Testing:** Vitest · React Testing Library · Supertest · Playwright  

---

## Security Notice

Intentionally vulnerable labs are **educational only**. They run in isolated environments with fake data and must never be exposed publicly without strong isolation. The main platform itself is built to modern security standards.

---

## Quick Start (After Phase 1)

```bash
docker compose up --build
```

---

## License

Educational / open-source intended.
