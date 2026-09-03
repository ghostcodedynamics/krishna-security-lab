import argon2 from 'argon2';
import { Challenge } from '../models/Challenge.js';
import { logger } from '../config/logger.js';

const CHALLENGES = [
  {
    slug: 'weak-auth',
    title: 'Weak Authentication',
    difficulty: 'easy' as const,
    category: 'authentication' as const,
    description:
      'The authentication lab ships with a dangerously weak login. Discover the weakness, obtain access, and capture the flag.',
    learningObjective:
      'Understand authentication vs authorization, password handling risks, and basic login flow flaws.',
    targetApplication: 'http://localhost:4001',
    hints: [
      { order: 1, text: 'Check if the application uses predictable or default credentials.', xpCost: 0 },
      { order: 2, text: 'Try common combinations like admin/admin or look at the lab seed data documentation.', xpCost: 25 },
      { order: 3, text: 'The lab README and seed users often reveal the path. Flag format: KSL{...}', xpCost: 50 },
    ],
    flag: 'KSL{weak_auth_default_creds_bypass}',
    vulnerableEndpoint: 'POST /login',
    expectedBehavior: 'Login should reject invalid credentials and not use default passwords.',
    secureBehavior: 'Strong unique passwords, rate limiting, no default accounts in production.',
    solutionExplanation:
      'The lab included a default account (admin / admin123). Using these credentials granted access and revealed the flag.',
    remediation:
      'Remove default accounts, enforce strong password policy, hash passwords with Argon2/bcrypt, add rate limiting and account lockout.',
    order: 1,
    isLocked: false,
    knowledgeSlug: 'weak-authentication',
  },
  {
    slug: 'nosql-injection',
    title: 'NoSQL Injection',
    difficulty: 'medium' as const,
    category: 'injection' as const,
    description:
      'The login API builds queries from user JSON without validation. Inject operators to bypass authentication and retrieve the admin flag.',
    learningObjective:
      'Understand NoSQL operator injection ($ne, $gt, $regex), why typed input validation matters, and how to query safely.',
    targetApplication: 'http://localhost:4002',
    hints: [
      { order: 1, text: 'The lab accepts raw JSON. What if password is not a string but an object?', xpCost: 0 },
      { order: 2, text: 'MongoDB operators like $ne (not equal) can make comparisons always true.', xpCost: 25 },
      { order: 3, text: 'Try username "admin" with password { "$ne": "" } via the lab UI or curl.', xpCost: 50 },
    ],
    flag: 'KSL{nosql_operator_injection_bypass}',
    vulnerableEndpoint: 'POST /login',
    expectedBehavior: 'Only exact string credentials should authenticate.',
    secureBehavior: 'Validate types with Zod; never pass user objects into query operators; use parameterized/explicit equality.',
    solutionExplanation:
      'Sending password as { "$ne": "" } made the password check always true for the admin user, bypassing authentication and returning the flag.',
    remediation:
      'Validate that username and password are strings (Zod). Use explicit equality only. Reject objects in credential fields. Apply mongo-sanitize where queries are dynamic.',
    order: 2,
    isLocked: false,
    knowledgeSlug: 'nosql-injection',
  },
  {
    slug: 'xss-reflected-stored',
    title: 'Cross-Site Scripting (XSS)',
    difficulty: 'medium' as const,
    category: 'xss' as const,
    description:
      'The XSS lab has reflected search and a stored guestbook. Trigger XSS in the controlled lab and capture the flag.',
    learningObjective:
      'Understand reflected vs stored XSS, output encoding, sanitization, and CSP basics.',
    targetApplication: 'http://localhost:4003',
    hints: [
      { order: 1, text: 'Reflected: the search query is written into the page. What if it contains HTML?', xpCost: 0 },
      { order: 2, text: 'Stored: comments are saved and rendered later for every visitor.', xpCost: 25 },
      { order: 3, text: 'In the lab, payloads can call window.__showFlag() to reveal the flag.', xpCost: 50 },
    ],
    flag: 'KSL{xss_reflected_and_stored_mastered}',
    vulnerableEndpoint: 'GET /?q=  and  POST /comment',
    expectedBehavior: 'User input must not execute as script in the browser.',
    secureBehavior: 'Context-aware output encoding, sanitize HTML if needed, deploy CSP.',
    solutionExplanation:
      'Reflected XSS used the q parameter; stored XSS used the guestbook. Both executed script because output was not encoded. Calling __showFlag() (or reading lab docs) yields the flag.',
    remediation:
      'Encode output for HTML context; use safe frameworks defaults; sanitize rich text; add Content-Security-Policy.',
    order: 3,
    isLocked: false,
    knowledgeSlug: 'xss',
  },
  {
    slug: 'idor',
    title: 'Insecure Direct Object Reference',
    difficulty: 'medium' as const,
    category: 'idor' as const,
    description:
      'Resources are fetched by id without ownership checks. Access another user\'s data and find the flag.',
    learningObjective:
      'Understand IDOR, horizontal privilege escalation, and server-side authorization checks.',
    targetApplication: 'http://localhost:4004',
    hints: [
      { order: 1, text: 'You start as user id 1. What happens if you request /users/3?', xpCost: 0 },
      { order: 2, text: 'Try /orders/:id and /profile/:id with different numbers.', xpCost: 25 },
      { order: 3, text: 'Admin profile embeds the flag in a secret field.', xpCost: 50 },
    ],
    flag: 'KSL{idor_horizontal_privilege_escalation}',
    vulnerableEndpoint: 'GET /users/:id, /orders/:id, /profile/:id',
    expectedBehavior: 'Only the resource owner (or authorized role) may access the object.',
    secureBehavior: 'Authenticate, then authorize ownership or RBAC on every object access.',
    solutionExplanation:
      'Changing the id parameter accessed other users\' records because the server never checked that the requester owned the resource. User 3 contained the flag.',
    remediation:
      'After authentication, verify resource.userId === currentUser.id (or admin role). Use opaque ids carefully; never trust client-supplied ids alone.',
    order: 4,
    isLocked: false,
    knowledgeSlug: 'idor',
  },
  {
    slug: 'jwt-security',
    title: 'JWT Security',
    difficulty: 'hard' as const,
    category: 'jwt' as const,
    description:
      'The JWT lab uses a weak HMAC secret and accepts alg:none. Forge an admin token and retrieve the flag.',
    learningObjective:
      'Understand JWT structure, algorithm confusion / none attacks, secret strength, and secure verification.',
    targetApplication: 'http://localhost:4005',
    hints: [
      { order: 1, text: 'Decode the JWT header and payload (base64url). What algorithm is used?', xpCost: 0 },
      { order: 2, text: 'Some libraries historically accepted alg none. The lab intentionally does.', xpCost: 25 },
      { order: 3, text: 'Forge payload role=admin with alg none, or sign with the weak secret "secret".', xpCost: 50 },
    ],
    flag: 'KSL{jwt_none_alg_and_weak_secret}',
    vulnerableEndpoint: 'GET /admin',
    expectedBehavior: 'Only properly signed tokens with allowed algorithms and strong secrets should verify.',
    secureBehavior: 'Explicit algorithms whitelist, strong secrets, never trust alg none, short expiry.',
    solutionExplanation:
      'Either forged HS256 with secret "secret" and role admin, or sent alg none with role admin. Both granted /admin and the flag.',
    remediation:
      'Use strong secrets or asymmetric keys; pass algorithms explicitly to verify; reject none; short TTL + refresh rotation.',
    order: 5,
    isLocked: false,
    knowledgeSlug: 'jwt-security',
  },
  {
    slug: 'api-security',
    title: 'API Security Misconfigurations',
    difficulty: 'medium' as const,
    category: 'api' as const,
    description:
      'The API lab has mass assignment, excessive data exposure, weak CORS, and missing controls. Escalate to admin and capture the flag.',
    learningObjective:
      'Recognize mass assignment, oversharing in JSON responses, CORS pitfalls, rate limiting, and security headers.',
    targetApplication: 'http://localhost:4006',
    hints: [
      { order: 1, text: 'GET /api/profile returns more fields than a client needs. Look closely.', xpCost: 0 },
      { order: 2, text: 'PATCH /api/profile accepts any field — including isAdmin or role.', xpCost: 25 },
      { order: 3, text: 'After becoming admin, call GET /api/admin/flag.', xpCost: 50 },
    ],
    flag: 'KSL{api_mass_assignment_and_exposure}',
    vulnerableEndpoint: 'PATCH /api/profile, GET /api/admin/flag',
    expectedBehavior: 'Only allowlisted fields updatable; responses omit secrets; CORS restricted; rate limits + headers present.',
    secureBehavior: 'DTOs / Zod pick lists, response serializers, Helmet, CORS allowlist, rate limiting.',
    solutionExplanation:
      'Mass assignment set isAdmin true. Admin endpoint then returned the flag. Profile also leaked sensitive fields.',
    remediation:
      'Whitelist updatable fields; never bind raw body to models; strip sensitive fields from responses; Helmet + strict CORS + rate limits.',
    order: 6,
    isLocked: false,
    knowledgeSlug: 'api-security',
  },
];

export async function seedChallenges(): Promise<void> {
  for (const c of CHALLENGES) {
    const existing = await Challenge.findOne({ slug: c.slug });
    if (existing) {
      logger.info(`Challenge already exists: ${c.slug}`);
      continue;
    }
    const flagHash = await argon2.hash(c.flag, { type: argon2.argon2id });
    const { flag, ...rest } = c;
    await Challenge.create({
      ...rest,
      flagHash,
      xpReward: { discovered: 100, understood: 100, fixed: 200, completed: 300 },
    });
    logger.info(`Seeded challenge: ${c.slug}`);
  }
}
