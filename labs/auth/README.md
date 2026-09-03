# Authentication Lab (Intentionally Vulnerable)

**Purpose:** Educational only. Runs locally / in isolated Docker. Fake data only.

## Weakness (intentional)

Default credentials exist for learning weak authentication:

- Username: `admin`
- Password: `admin123`

After login, the lab exposes a flag for the main platform challenge.

## Flag (for main platform)

```
KSL{weak_auth_default_creds_bypass}
```

## Run locally

```bash
cd labs/auth
npm install
npm start
# listens on http://localhost:4001
```

## Endpoints

- `GET /` — simple info page
- `POST /login` — body `{ "username", "password" }`
- `GET /flag` — requires successful session (simplified: returns flag if query `?token=ok` after login demo)

This lab is deliberately insecure. Do not expose it publicly.
