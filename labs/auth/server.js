/**
 * INTENTIONALLY VULNERABLE AUTH LAB
 * Educational use only. Fake data. Do not deploy publicly.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4001;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// INTENTIONAL: default credentials
const USERS = [
  { username: 'admin', password: 'admin123', role: 'admin' },
  { username: 'guest', password: 'guest', role: 'user' },
];

const FLAG = 'KSL{weak_auth_default_creds_bypass}';

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>Auth Lab — Krishna Security Lab</title>
  <style>
    body { font-family: system-ui; background: #0a0e1a; color: #e2e8f0; max-width: 420px; margin: 4rem auto; padding: 1.5rem; }
    h1 { color: #d4af37; font-size: 1.25rem; }
    input, button { display: block; width: 100%; margin: 0.5rem 0; padding: 0.6rem; border-radius: 6px; border: 1px solid #334155; background: #111827; color: #f1f5f9; }
    button { background: #d4af37; color: #0a0e1a; font-weight: 600; cursor: pointer; border: none; }
    .msg { margin-top: 1rem; padding: 0.75rem; border-radius: 6px; font-size: 0.9rem; }
    .ok { background: #064e3b; color: #6ee7b7; }
    .err { background: #7f1d1d; color: #fca5a5; }
    .hint { color: #64748b; font-size: 0.8rem; margin-top: 1.5rem; }
  </style>
</head>
<body>
  <h1>Authentication Lab</h1>
  <p>Login to the vulnerable application.</p>
  <form id="f">
    <input name="username" placeholder="Username" autocomplete="username" />
    <input name="password" type="password" placeholder="Password" autocomplete="current-password" />
    <button type="submit">Login</button>
  </form>
  <div id="msg"></div>
  <p class="hint">Educational lab · Default credentials are intentional · Do not use in production</p>
  <script>
    document.getElementById('f').onsubmit = async (e) => {
      e.preventDefault();
      const fd = new FormData(e.target);
      const res = await fetch('/login', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ username: fd.get('username'), password: fd.get('password') }),
      });
      const data = await res.json();
      const el = document.getElementById('msg');
      if (data.success) {
        el.className = 'msg ok';
        el.textContent = 'Login OK. Flag: ' + data.flag;
      } else {
        el.className = 'msg err';
        el.textContent = data.message || 'Login failed';
      }
    };
  </script>
</body>
</html>
  `);
});

app.post('/login', (req, res) => {
  const { username, password } = req.body || {};
  const user = USERS.find((u) => u.username === username && u.password === password);
  if (!user) {
    return res.status(401).json({ success: false, message: 'Invalid credentials' });
  }
  // INTENTIONAL: return flag on successful weak login
  res.json({
    success: true,
    user: { username: user.username, role: user.role },
    flag: FLAG,
  });
});

app.listen(PORT, () => {
  console.log(`[AUTH-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
