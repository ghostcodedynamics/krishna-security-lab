/**
 * INTENTIONALLY VULNERABLE JWT Lab
 * - None algorithm acceptance
 * - Weak secret
 * Educational only.
 */
import express from 'express';
import cors from 'cors';
import jwt from 'jsonwebtoken';

const app = express();
const PORT = 4005;

app.use(cors());
app.use(express.json());

const WEAK_SECRET = 'secret'; // INTENTIONAL
const FLAG = 'KSL{jwt_none_alg_and_weak_secret}';

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>JWT Lab</title>
<style>
body{font-family:system-ui;background:#0a0e1a;color:#e2e8f0;max-width:560px;margin:2rem auto;padding:1.5rem}
h1{color:#a78bfa;font-size:1.25rem} input,button{width:100%;margin:0.4rem 0;padding:0.55rem;border-radius:6px;border:1px solid #334155;background:#111827;color:#f1f5f9;box-sizing:border-box}
button{background:#a78bfa;color:#0a0e1a;font-weight:600;border:none;cursor:pointer}
pre{background:#020617;padding:0.75rem;border-radius:8px;overflow:auto;font-size:0.75rem}
.hint{color:#64748b;font-size:0.8rem}
</style></head>
<body>
<h1>JWT Security Lab</h1>
<p>Login issues a JWT signed with a <strong>weak secret</strong>. The verify endpoint also accepts <code>alg: none</code>.</p>
<button id="login">Login as user</button>
<pre id="token"></pre>
<input id="tok" placeholder="Paste token to access /admin" />
<button id="admin">Call /admin</button>
<pre id="out"></pre>
<p class="hint">Try forging a token with alg none or cracking the weak HMAC secret. Educational only.</p>
<script>
document.getElementById('login').onclick = async () => {
  const r = await fetch('/login', { method: 'POST', headers: { 'Content-Type': 'application/json' }, body: '{}' });
  const d = await r.json();
  document.getElementById('token').textContent = JSON.stringify(d, null, 2);
  document.getElementById('tok').value = d.token || '';
};
document.getElementById('admin').onclick = async () => {
  const token = document.getElementById('tok').value;
  const r = await fetch('/admin', { headers: { Authorization: 'Bearer ' + token } });
  document.getElementById('out').textContent = JSON.stringify(await r.json(), null, 2);
};
</script>
</body></html>`);
});

app.post('/login', (_req, res) => {
  const token = jwt.sign({ sub: 'user', role: 'user' }, WEAK_SECRET, { algorithm: 'HS256' });
  res.json({ token, hint: 'Secret is weak. Or try alg none.' });
});

// VULNERABLE verify
app.get('/admin', (req, res) => {
  const header = req.headers.authorization || '';
  const token = header.startsWith('Bearer ') ? header.slice(7) : '';
  if (!token) return res.status(401).json({ error: 'No token' });

  try {
    // INTENTIONAL: decode without verifying first
    const parts = token.split('.');
    const headerJson = JSON.parse(Buffer.from(parts[0], 'base64url').toString());

    // INTENTIONAL: accept alg none
    if (headerJson.alg === 'none' || headerJson.alg === 'None') {
      const payload = JSON.parse(Buffer.from(parts[1], 'base64url').toString());
      if (payload.role === 'admin') {
        return res.json({ success: true, message: 'Admin via alg none', flag: FLAG });
      }
      return res.status(403).json({ error: 'Need role admin in payload' });
    }

    const payload = jwt.verify(token, WEAK_SECRET, { algorithms: ['HS256'] });
    if (payload.role === 'admin') {
      return res.json({ success: true, message: 'Admin via forged HMAC', flag: FLAG });
    }
    return res.status(403).json({ error: 'user role only', payload });
  } catch (e) {
    return res.status(401).json({ error: 'Invalid token', detail: String(e.message) });
  }
});

app.listen(PORT, () => {
  console.log(`[JWT-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
