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
