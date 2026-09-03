# Security Model

## Dual Posture
1. **Main Platform** — production hardened
2. **Labs** — intentionally vulnerable, strictly isolated

## Platform Requirements
- Argon2id passwords
- Short-lived JWT + refresh rotation
- Zod validation everywhere
- Helmet, CORS allowlist, rate limiting, mongo-sanitize
- No plaintext secrets
- Audit logging

## Lab Rules (Critical)
- Docker isolated only
- Fake/generated data
- No real credentials
- No external targeting
- No malware / persistence
- Resource limits + non-privileged

## Flags
Stored as hashes only. Constant-time comparison. Rate limited.

## Security Score
Weighted: Auth 20%, Authz 20%, Input 15%, API 15%, DB 10%, Session 10%, Headers 5%, Logging 5%
