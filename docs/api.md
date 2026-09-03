# API Design — /api/v1

## Auth
- POST /auth/register
- POST /auth/login
- POST /auth/refresh
- POST /auth/logout
- GET  /auth/me

## Users
- GET/PATCH /users/me
- GET /users/me/progress

## Challenges
- GET  /challenges
- GET  /challenges/:id | /:slug
- POST /challenges/:id/start
- POST /challenges/:id/submit-flag
- POST /challenges/:id/hint
- GET  /challenges/:id/solution (gated)

## Labs
- GET  /labs
- POST /labs/:id/start
- GET  /labs/:id/status

## Progress / Gamification
- GET /progress
- GET /badges | /badges/me
- GET /leaderboard
- GET /security/score

## Knowledge
- GET /knowledge | /knowledge/:slug

## Admin (role-protected)
- /admin/users, /admin/challenges, /admin/audit-logs, /admin/stats

## Conventions
- Consistent JSON envelope
- Zod validation on all inputs
- Rate limiting (strict on auth + flag submit)
- Helmet, CORS allowlist, mongo-sanitize
- Proper HTTP status codes
