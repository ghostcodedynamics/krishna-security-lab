/**
 * INTENTIONALLY VULNERABLE API Security Lab
 * - No rate limiting
 * - Mass assignment
 * - Excessive data exposure
 * - Weak CORS
 * - Missing security headers
 * Educational only.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4006;

// WEAK CORS: reflect any origin
app.use(cors({ origin: true, credentials: true }));
app.use(express.json());

// No Helmet / no security headers (intentional)

const FLAG = 'KSL{api_mass_assignment_and_exposure}';

let profile = {
  id: 1,
  username: 'learner',
  email: 'learner@lab.local',
  role: 'user',
  isAdmin: false,
  internalNote: 'flag-hidden-until-admin',
  passwordHash: 'not_a_real_hash_but_should_not_leak',
};

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>API Security Lab</title>
<style>
body{font-family:system-ui;background:#0a0e1a;color:#e2e8f0;max-width:600px;margin:2rem auto;padding:1.5rem}
h1{color:#34d399;font-size:1.25rem} button,textarea{width:100%;margin:0.4rem 0;padding:0.55rem;border-radius:6px;border:1px solid #334155;background:#111827;color:#f1f5f9;box-sizing:border-box}
button{background:#34d399;color:#0a0e1a;font-weight:600;border:none;cursor:pointer}
pre{background:#020617;padding:0.75rem;border-radius:8px;overflow:auto;font-size:0.75rem}
.hint{color:#64748b;font-size:0.8rem}
</style></head>
<body>
<h1>API Security Lab</h1>
<p>Issues: mass assignment, excessive data exposure, open CORS, no rate limit, missing headers.</p>
<button id="get">GET /api/profile</button>
<textarea id="body" rows="5">{
  "email": "hacker@evil.test",
  "isAdmin": true,
  "role": "admin"
}</textarea>
<button id="patch">PATCH /api/profile (mass assignment)</button>
<button id="admin">GET /api/admin/flag</button>
<pre id="out"></pre>
<p class="hint">PATCH with isAdmin:true then call admin flag. Educational only.</p>
<script>
const out = (d) => document.getElementById('out').textContent = JSON.stringify(d, null, 2);
document.getElementById('get').onclick = async () => out(await (await fetch('/api/profile')).json());
document.getElementById('patch').onclick = async () => {
  const body = JSON.parse(document.getElementById('body').value);
  out(await (await fetch('/api/profile', { method: 'PATCH', headers: { 'Content-Type': 'application/json' }, body: JSON.stringify(body) })).json());
};
document.getElementById('admin').onclick = async () => out(await (await fetch('/api/admin/flag')).json());
</script>
</body></html>`);
});

// EXCESSIVE DATA EXPOSURE: returns passwordHash and internal fields
app.get('/api/profile', (_req, res) => {
  res.json({ success: true, data: profile });
});

// MASS ASSIGNMENT: blindly assign body onto profile
app.patch('/api/profile', (req, res) => {
  const body = req.body || {};
  profile = { ...profile, ...body };
  res.json({ success: true, data: profile, warning: 'Mass assignment applied (intentional)' });
});

app.get('/api/admin/flag', (_req, res) => {
  if (profile.isAdmin === true || profile.role === 'admin') {
    return res.json({ success: true, flag: FLAG });
  }
  res.status(403).json({ success: false, error: 'Admin only' });
});

// No rate limit on sensitive-looking endpoint
app.post('/api/login-attempt', (req, res) => {
  res.json({ ok: true, received: req.body, note: 'No rate limiting (intentional)' });
});

app.listen(PORT, () => {
  console.log(`[API-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
