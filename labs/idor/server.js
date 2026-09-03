/**
 * INTENTIONALLY VULNERABLE IDOR Lab
 * Educational only. Fake users/orders.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4004;

app.use(cors());
app.use(express.json());

const users = {
  1: { id: 1, name: 'Alice', email: 'alice@lab.local', role: 'user' },
  2: { id: 2, name: 'Bob', email: 'bob@lab.local', role: 'user' },
  3: { id: 3, name: 'Admin', email: 'admin@lab.local', role: 'admin', secret: 'KSL{idor_horizontal_privilege_escalation}' },
};

const orders = {
  101: { id: 101, userId: 1, item: 'VPN subscription', total: 9.99 },
  102: { id: 102, userId: 2, item: 'Security course', total: 49.0 },
  103: { id: 103, userId: 3, item: 'Flag package', total: 0, note: 'Admin order — contains flag ref' },
};

// Simulated "logged in as Alice" via header (weak session demo)
app.use((req, _res, next) => {
  req.currentUserId = Number(req.headers['x-user-id'] || 1);
  next();
});

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>IDOR Lab</title>
<style>
body{font-family:system-ui;background:#0a0e1a;color:#e2e8f0;max-width:560px;margin:2rem auto;padding:1.5rem}
h1{color:#f0c75e;font-size:1.25rem} a{color:#22d3ee} pre{background:#020617;padding:0.75rem;border-radius:8px;overflow:auto}
.hint{color:#64748b;font-size:0.8rem}
</style></head>
<body>
<h1>IDOR Lab</h1>
<p>You are treated as user id <strong>1 (Alice)</strong> by default (<code>X-User-Id: 1</code>).</p>
<p>Try:</p>
<ul>
  <li><a href="/users/1">/users/1</a> (your profile)</li>
  <li><a href="/users/3">/users/3</a> (another user — should be forbidden)</li>
  <li><a href="/orders/101">/orders/101</a> · <a href="/orders/103">/orders/103</a></li>
  <li><a href="/profile/2">/profile/2</a></li>
</ul>
<p class="hint">IDOR: change the id in the URL. No ownership check. Educational only.</p>
</body></html>`);
});

// VULNERABLE: no ownership check
app.get('/users/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ user, requestedAs: req.currentUserId });
});

app.get('/orders/:id', (req, res) => {
  const order = orders[req.params.id];
  if (!order) return res.status(404).json({ error: 'Not found' });
  res.json({ order, requestedAs: req.currentUserId });
});

app.get('/profile/:id', (req, res) => {
  const user = users[req.params.id];
  if (!user) return res.status(404).json({ error: 'Not found' });
  res.json({ profile: user, requestedAs: req.currentUserId });
});

app.listen(PORT, () => {
  console.log(`[IDOR-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
