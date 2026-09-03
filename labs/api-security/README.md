# API Security Lab (Intentionally Vulnerable)

## Issues demonstrated

1. **Mass assignment** — `PATCH /api/profile` merges entire JSON body
2. **Excessive data exposure** — profile includes `passwordHash`, internal fields
3. **Weak CORS** — reflects any origin
4. **Missing security headers** — no Helmet
5. **No rate limiting** on login-attempt style endpoint

## Flag

```
KSL{api_mass_assignment_and_exposure}
```

Path: set `isAdmin: true` via mass assignment → `GET /api/admin/flag`

## Run

```bash
cd labs/api-security && npm install && npm start
# http://localhost:4006
```
