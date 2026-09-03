# IDOR Lab (Intentionally Vulnerable)

Insecure Direct Object Reference — no ownership checks on `/users/:id`, `/orders/:id`, `/profile/:id`.

## Flag

Found on user id **3** (admin profile):

```
KSL{idor_horizontal_privilege_escalation}
```

## Run

```bash
cd labs/idor && npm install && npm start
# http://localhost:4004
```

Default session acts as user `1`. Change the id in the URL to access other resources.
