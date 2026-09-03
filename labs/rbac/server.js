/**
 * INTENTIONALLY VULNERABLE RBAC Lab
 * Client-sent role trusted; missing server-side authorization.
 * Educational only.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4007;

app.use(cors());
app.use(express.json());

const FLAG = 'KSL{rbac_client_role_not_trusted}';

const actions = {
  user: ['read:own'],
  analyst: ['read:own', 'read:reports'],
  admin: ['read:own', 'read:reports', 'write:users', 'read:flag'],
  superadmin: ['*'],
};

app.get('/', (_req, res) => {
  res.type('html').send(`
<!DOCTYPE html>
<html><head><meta charset="UTF-8"/><title>RBAC Lab</title>
<style>
body{font-family:system-ui;background:#0a0e1a;color:#e2e8f0;max-width:560px;margin:2rem auto;padding:1.5rem}
h1{color:#f472b6;font-size:1.25rem} select,button{width:100%;margin:0.4rem 0;padding:0.55rem;border-radius:6px;border:1px solid #334155;background:#111827;color:#f1f5f9}
button{background:#f472b6;color:#0a0e1a;font-weight:600;border:none;cursor:pointer}
pre{background:#020617;padding:0.75rem;border-radius:8px;font-size:0.8rem}
.hint{color:#64748b;font-size:0.8rem}
</style></head>
<body>
<h1>RBAC Lab</h1>
<p>Server trusts the <code>X-Role</code> header (intentional flaw).</p>
<label>Role header</label>
<select id="role">
  <option>user</option>
  <option>analyst</option>
  <option>admin</option>
  <option>superadmin</option>
</select>
<button id="flag">GET /admin/flag</button>
<button id="users">GET /admin/users</button>
<pre id="out"></pre>
<p class="hint">Pick admin/superadmin without proving identity. Educational only.</p>
<script>
const out = async (path) => {
  const r = await fetch(path, { headers: { 'X-Role': document.getElementById('role').value } });
  document.getElementById('out').textContent = JSON.stringify(await r.json(), null, 2);
};
document.getElementById('flag').onclick = () => out('/admin/flag');
document.getElementById('users').onclick = () => out('/admin/users');
</script>
</body></html>`);
});

function roleFromReq(req) {
  // VULNERABLE: trust client header
  return req.headers['x-role'] || 'user';
}

function can(role, permission) {
  const perms = actions[role] || [];
  return perms.includes('*') || perms.includes(permission);
}

app.get('/admin/flag', (req, res) => {
  const role = roleFromReq(req);
  if (!can(role, 'read:flag') && !can(role, '*')) {
    return res.status(403).json({ error: 'Forbidden', role });
  }
  res.json({ success: true, role, flag: FLAG });
});

app.get('/admin/users', (req, res) => {
  const role = roleFromReq(req);
  if (!can(role, 'write:users') && !can(role, '*')) {
    return res.status(403).json({ error: 'Forbidden', role });
  }
  res.json({
    success: true,
    users: [
      { id: 1, name: 'Alice', role: 'user' },
      { id: 2, name: 'Admin', role: 'admin' },
    ],
  });
});

app.listen(PORT, () => {
  console.log(`[RBAC-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
