/**
 * INTENTIONALLY VULNERABLE NoSQL Injection Lab
 * Educational only. Uses in-memory "DB" so no real Mongo required for demo.
 * Do not expose publicly.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4002;

app.use(cors());
app.use(express.json());

// Fake user store (simulates MongoDB documents)
const users = [
  { username: 'alice', password: 'alicepass', role: 'user' },
  { username: 'bob', password: 'bobsecret', role: 'user' },
  { username: 'admin', password: 's3cureAdmin!', role: 'admin', flag: 'KSL{nosql_operator_injection_bypass}' },
];

/**
 * VULNERABLE login: directly uses req.body in a query-like filter.
 * Classic attack: { "username": { "$ne": "" }, "password": { "$ne": "" } }
 * or username: admin, password: { "$gt": "" }
 */
app.post('/login', (req, res) => {
  const { username, password } = req.body || {};

  // INTENTIONAL VULNERABILITY: no type checks — objects allowed
  const match = users.find((u) => {
    const userOk =
      typeof username === 'object'
        ? evalOperator(u.username, username)
        : u.username === username;
    const passOk =
      typeof password === 'object'
        ? evalOperator(u.password, password)
        : u.password === password;
    return userOk && passOk;
  });

  if (!match) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }

  res.json({
    success: true,
    user: { username: match.username, role: match.role },
    flag: match.flag || null,
    note: match.role === 'admin' ? 'Admin access granted via injection or credentials' : 'Logged in',
  });
});

function evalOperator(value, op) {
  if (op && typeof op === 'object') {
    if ('$ne' in op) return value !== op.$ne;
    if ('$gt' in op) return value > op.$gt;
    if ('$regex' in op) return new RegExp(op.$regex, op.$options || '').test(String(value));
  }
  return false;
}

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>NoSQL Injection Lab</title>
  <style>
    body { font-family: system-ui; background: #0a0e1a; color: #e2e8f0; max-width: 520px; margin: 3rem auto; padding: 1.5rem; }
    h1 { color: #22d3ee; font-size: 1.25rem; }
    textarea, button { width: 100%; margin: 0.5rem 0; padding: 0.6rem; border-radius: 6px; border: 1px solid #334155; background: #111827; color: #f1f5f9; box-sizing: border-box; }
    button { background: #22d3ee; color: #0a0e1a; font-weight: 600; border: none; cursor: pointer; }
    pre { background: #020617; padding: 0.75rem; border-radius: 6px; overflow: auto; font-size: 0.8rem; }
    .hint { color: #64748b; font-size: 0.8rem; margin-top: 1rem; }
  </style>
</head>
<body>
  <h1>NoSQL Injection Lab</h1>
  <p>POST JSON to <code>/login</code>. Body is used unsafely in the query.</p>
  <textarea id="body" rows="6">{
  "username": "admin",
  "password": "wrong"
}</textarea>
  <button id="btn">Send login</button>
  <pre id="out">Response will appear here</pre>
  <p class="hint">Try operator injection in JSON (e.g. password as an object with $ne). Educational only.</p>
  <script>
    document.getElementById('btn').onclick = async () => {
      let body;
      try { body = JSON.parse(document.getElementById('body').value); }
      catch (e) { document.getElementById('out').textContent = 'Invalid JSON'; return; }
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(body),
      });
      const data = await res.json();
      document.getElementById('out').textContent = JSON.stringify(data, null, 2);
    };
  </script>
</body>
</html>
  `);
});

app.listen(PORT, () => {
  console.log(`[NOSQL-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
