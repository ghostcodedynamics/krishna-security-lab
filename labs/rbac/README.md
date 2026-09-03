# RBAC Lab (Intentionally Vulnerable)

Authorization trusts the client-supplied `X-Role` header.

## Flag

```
KSL{rbac_client_role_not_trusted}
```

Set header `X-Role: admin` (or superadmin) and call `GET /admin/flag`.

## Run

```bash
cd labs/rbac && npm install && npm start
# http://localhost:4007
```

## Fix direction

- Role comes only from server-side session / JWT claims after auth
- Permission matrix enforced in middleware
- Never trust client-provided role/permission fields
