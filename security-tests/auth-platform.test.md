# Platform security checks (manual / future automated)

## Auth

- [ ] Passwords stored as Argon2 hashes only
- [ ] Register rejects weak passwords
- [ ] Login rate limited
- [ ] /auth/me requires Bearer token
- [ ] Invalid token → 401

## Challenges

- [ ] Flag submit rate limited
- [ ] Wrong flag does not leak solution
- [ ] Solution only after correct flag
- [ ] Flags stored hashed server-side

## Labs isolation

- [ ] Labs on separate ports 4001–4007
- [ ] No production credentials in lab code
- [ ] README marks intentional vulnerabilities
