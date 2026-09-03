export interface KnowledgeArticle {
  slug: string;
  title: string;
  category: string;
  summary: string;
  sections: { heading: string; body: string }[];
  owasp?: string;
  relatedChallenge?: string;
}

export const knowledgeArticles: KnowledgeArticle[] = [
  {
    slug: 'weak-authentication',
    title: 'Weak Authentication',
    category: 'authentication',
    summary: 'Default or weak credentials and missing login protections.',
    owasp: 'A07:2021 Identification and Authentication Failures',
    relatedChallenge: 'weak-auth',
    sections: [
      {
        heading: 'What is it?',
        body: 'Authentication verifies identity. Weak authentication includes default passwords, predictable credentials, missing rate limits, and poor password storage.',
      },
      {
        heading: 'Why does it happen?',
        body: 'Shipping defaults for convenience, incomplete production hardening, or no password policy enforcement.',
      },
      {
        heading: 'How to recognize it',
        body: 'Vendor defaults in docs, successful login with admin/admin, no lockout after failures, credentials in repositories.',
      },
      {
        heading: 'How to fix',
        body: 'Remove default accounts, enforce strong passwords, hash with Argon2/bcrypt, rate-limit and lock out brute force, use MFA where appropriate.',
      },
    ],
  },
  {
    slug: 'nosql-injection',
    title: 'NoSQL Injection',
    category: 'injection',
    summary: 'User-controlled objects injected into MongoDB-style queries.',
    owasp: 'A03:2021 Injection',
    relatedChallenge: 'nosql-injection',
    sections: [
      {
        heading: 'What is it?',
        body: 'Attackers supply query operators ($ne, $gt, $regex) so authentication or filters evaluate in unintended ways.',
      },
      {
        heading: 'Why does it happen?',
        body: 'Passing raw req.body into find() without type checks; treating JSON as trusted structure.',
      },
      {
        heading: 'How to fix',
        body: 'Validate types with Zod (strings only for credentials), use explicit equality, sanitize operators, avoid dynamic operator construction from user input.',
      },
    ],
  },
  {
    slug: 'xss',
    title: 'Cross-Site Scripting (XSS)',
    category: 'xss',
    summary: 'Untrusted input executed as script in a victim browser.',
    owasp: 'A03:2021 Injection',
    relatedChallenge: 'xss-reflected-stored',
    sections: [
      {
        heading: 'Types',
        body: 'Reflected (immediate response), Stored (persisted then shown to others), DOM-based (client-side sink).',
      },
      {
        heading: 'How to fix',
        body: 'Context-aware output encoding, framework safe defaults (e.g. React text), sanitize HTML only when required, deploy Content-Security-Policy.',
      },
    ],
  },
  {
    slug: 'idor',
    title: 'Insecure Direct Object Reference (IDOR)',
    category: 'idor',
    summary: 'Accessing objects by id without authorization checks.',
    owasp: 'A01:2021 Broken Access Control',
    relatedChallenge: 'idor',
    sections: [
      {
        heading: 'What is it?',
        body: 'Changing /users/1 to /users/2 returns another user’s data because the server never checks ownership.',
      },
      {
        heading: 'How to fix',
        body: 'After authentication, enforce ownership or role on every object access. Prefer server-side lookups scoped to the current user.',
      },
    ],
  },
  {
    slug: 'jwt-security',
    title: 'JWT Security',
    category: 'jwt',
    summary: 'Token design flaws: weak secrets, alg none, long-lived tokens.',
    relatedChallenge: 'jwt-security',
    sections: [
      {
        heading: 'Common issues',
        body: 'Accepting alg none, weak HMAC secrets, not validating exp, storing tokens insecurely, algorithm confusion.',
      },
      {
        heading: 'How to fix',
        body: 'Whitelist algorithms explicitly, strong secrets or asymmetric keys, short access TTL + refresh rotation, secure storage guidance.',
      },
    ],
  },
  {
    slug: 'api-security',
    title: 'API Security Misconfigurations',
    category: 'api',
    summary: 'Mass assignment, oversharing, CORS, missing headers and rate limits.',
    relatedChallenge: 'api-security',
    sections: [
      {
        heading: 'Mass assignment',
        body: 'Binding raw JSON to models lets attackers set isAdmin or role. Use allowlists / DTOs.',
      },
      {
        heading: 'Excessive data exposure',
        body: 'Return only fields the client needs; never send password hashes or internal notes.',
      },
      {
        heading: 'Hardening',
        body: 'Helmet, CORS allowlist, rate limiting, consistent error shapes without stack traces in production.',
      },
    ],
  },
  {
    slug: 'rbac',
    title: 'Broken RBAC',
    category: 'rbac',
    summary: 'Roles supplied by the client or missing server checks.',
    relatedChallenge: 'rbac',
    sections: [
      {
        heading: 'Principle',
        body: 'Authorization is a server-side decision. Role must come from the authenticated session or token claims, never from a client header alone.',
      },
      {
        heading: 'How to fix',
        body: 'Permission matrix in middleware, deny by default, test negative cases (user cannot hit admin routes).',
      },
    ],
  },
  {
    slug: 'final-boss',
    title: 'Security Core — Putting It Together',
    category: 'final',
    summary: 'End-to-end attack and defense across the lab path.',
    relatedChallenge: 'final-boss',
    sections: [
      {
        heading: 'Mindset',
        body: 'Every fix should be verified with a failing test that becomes passing. Labs stay isolated; the main platform stays hardened.',
      },
    ],
  },
];

export function getArticle(slug: string) {
  return knowledgeArticles.find((a) => a.slug === slug);
}
