/**
 * INTENTIONALLY VULNERABLE XSS Lab
 * Reflected + Stored XSS. Educational only. Local use.
 */
import express from 'express';
import cors from 'cors';

const app = express();
const PORT = 4003;

app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// In-memory "comments" for stored XSS
const comments = [];

const FLAG = 'KSL{xss_reflected_and_stored_mastered}';

app.get('/', (req, res) => {
  const q = req.query.q || '';
  // REFLECTED XSS: q is reflected without encoding
  res.type('html').send(`
<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8" />
  <title>XSS Lab</title>
  <style>
    body { font-family: system-ui; background: #0a0e1a; color: #e2e8f0; max-width: 560px; margin: 2rem auto; padding: 1.5rem; }
    h1 { color: #fb7185; font-size: 1.25rem; }
    input, textarea, button { width: 100%; margin: 0.4rem 0; padding: 0.55rem; border-radius: 6px; border: 1px solid #334155; background: #111827; color: #f1f5f9; box-sizing: border-box; }
    button { background: #fb7185; color: #0a0e1a; font-weight: 600; border: none; cursor: pointer; }
    .box { background: #020617; padding: 0.75rem; border-radius: 8px; margin: 1rem 0; border: 1px solid #1e293b; }
    .hint { color: #64748b; font-size: 0.8rem; }
    .comment { border-bottom: 1px solid #1e293b; padding: 0.5rem 0; }
  </style>
</head>
<body>
  <h1>XSS Lab — Reflected + Stored</h1>

  <h2 style="font-size:1rem;color:#94a3b8">1. Reflected search</h2>
  <form method="GET" action="/">
    <input name="q" value="${String(q).replace(/"/g, '&quot;')}" placeholder="Search..." />
    <button type="submit">Search</button>
  </form>
  <div class="box">
    <p>Results for: ${q}</p>
    <p class="hint">Payload tip: try script tags in the query string (local lab only).</p>
  </div>

  <h2 style="font-size:1rem;color:#94a3b8">2. Stored guestbook</h2>
  <form method="POST" action="/comment">
    <input name="author" placeholder="Name" />
    <textarea name="body" rows="3" placeholder="Comment (HTML not escaped)"></textarea>
    <button type="submit">Post comment</button>
  </form>
  <div class="box">
    ${comments
      .map(
        (c) =>
          `<div class="comment"><strong>${c.author}</strong>: ${c.body}</div>`
      )
      .join('') || '<p class="hint">No comments yet.</p>'}
  </div>

  <p class="hint">When you trigger XSS in either path, the page can reveal the flag via a demo hook. Educational only.</p>
  <script>
    // Demo: if a payload sets window.__xss, show flag (simulates successful exploit detection in lab)
    window.__showFlag = function() {
      document.body.insertAdjacentHTML('beforeend',
        '<div class="box" style="border-color:#34d399;color:#6ee7b7">Flag: ${FLAG}</div>');
    };
  </script>
</body>
</html>
  `);
});

app.post('/comment', (req, res) => {
  const author = req.body.author || 'anon';
  const body = req.body.body || '';
  // STORED XSS: no sanitization
  comments.push({ author, body });
  if (comments.length > 50) comments.shift();
  res.redirect('/');
});

// Helper endpoint for learners to confirm exploit in automation
app.get('/flag-if-xss', (req, res) => {
  // Not a real browser XSS check — lab documents that successful XSS should call __showFlag
  // For platform challenge, flag is documented after understanding both vectors
  res.json({
    hint: 'Trigger XSS then call window.__showFlag() in the lab page, or use the known lab flag after both vectors work.',
    flag: FLAG,
  });
});

app.listen(PORT, () => {
  console.log(`[XSS-LAB] Intentionally vulnerable lab on http://localhost:${PORT}`);
});
