# XSS Lab (Intentionally Vulnerable)

Educational only. Local / isolated.

## Vectors

1. **Reflected XSS** — `GET /?q=` reflects `q` into HTML without encoding.
2. **Stored XSS** — guestbook comments rendered without sanitization.

## Demo payload (local only)

```html
<img src=x onerror="window.__showFlag()">
```

Or classic:

```html
<script>window.__showFlag()</script>
```

## Flag

```
KSL{xss_reflected_and_stored_mastered}
```

## Run

```bash
cd labs/xss
npm install
npm start
# http://localhost:4003
```

## Fixes (for learning)

- Output encoding / React text nodes
- HTML sanitization libraries where rich text is required
- Content-Security-Policy (CSP)
