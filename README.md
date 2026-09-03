# Krishna Security Lab

**Learn Security. Break It. Fix It.**

Immersive cybersecurity learning platform: React + TypeScript frontend, Express API, MongoDB, Three.js security temple, and **isolated intentionally vulnerable labs**.

## Features

- User auth (Argon2id + JWT access/refresh)
- Dashboard, XP, levels
- 3D Security Temple (`/world`)
- Challenge engine with flags, hints, XP
- Knowledge Center (theory per vulnerability)
- 7 educational labs + Final Boss meta-challenge

## Labs (educational only — never expose publicly)

| Lab | Port | Challenge |
|-----|------|-----------|
| auth | 4001 | Weak Authentication |
| nosql-injection | 4002 | NoSQL Injection |
| xss | 4003 | XSS |
| idor | 4004 | IDOR |
| jwt | 4005 | JWT Security |
| api-security | 4006 | API Misconfig |
| rbac | 4007 | Broken RBAC |
| — | — | Final Security Core |

## Quick start

```bash
docker compose up mongodb -d
cd backend && npm install && cp -n .env.example .env && npm run dev
cd frontend && npm install && npm run dev
```

Labs:

```bash
docker compose --profile labs up
# or: cd labs/auth && npm i && npm start
```

## Security boundary

- **Platform** hardened (Helmet, rate limits, validation, hashed secrets).
- **Labs** intentionally vulnerable, fake data, isolated ports / Compose profile.
- Do not publish labs on the public internet without isolation.

## Docs

See `docs/` for architecture, API, database, security, UI/UX, 3D, challenges.

## License

Educational / portfolio use. Lab code must remain clearly marked vulnerable.
