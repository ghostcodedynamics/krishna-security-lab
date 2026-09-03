import argon2 from 'argon2';
import { Challenge } from '../models/Challenge.js';
import { logger } from '../config/logger.js';

const FLAG_WEAK_AUTH = 'KSL{weak_auth_default_creds_bypass}';

export async function seedChallenges(): Promise<void> {
  const count = await Challenge.countDocuments();
  if (count > 0) {
    logger.info('Challenges already seeded');
    return;
  }

  const flagHash = await argon2.hash(FLAG_WEAK_AUTH, { type: argon2.argon2id });

  await Challenge.create({
    slug: 'weak-auth',
    title: 'Weak Authentication',
    difficulty: 'easy',
    category: 'authentication',
    description:
      'The authentication lab ships with a dangerously weak login. Discover the weakness, obtain access, and capture the flag.',
    learningObjective:
      'Understand authentication vs authorization, password handling risks, and basic login flow flaws.',
    targetApplication: 'http://localhost:4001',
    hints: [
      {
        order: 1,
        text: 'Check if the application uses predictable or default credentials.',
        xpCost: 0,
      },
      {
        order: 2,
        text: 'Try common combinations like admin/admin or look at the lab seed data documentation.',
        xpCost: 25,
      },
      {
        order: 3,
        text: 'The lab README and seed users often reveal the path. Flag format: KSL{...}',
        xpCost: 50,
      },
    ],
    flagHash,
    vulnerableEndpoint: 'POST /login',
    expectedBehavior: 'Login should reject invalid credentials and not use default passwords.',
    secureBehavior: 'Strong unique passwords, rate limiting, no default accounts in production.',
    solutionExplanation:
      'The lab included a default account (admin / admin123). Using these credentials granted access and revealed the flag. Default credentials are a classic weak authentication issue.',
    remediation:
      'Remove default accounts, enforce strong password policy, hash passwords with Argon2/bcrypt, add rate limiting and account lockout.',
    xpReward: {
      discovered: 100,
      understood: 100,
      fixed: 200,
      completed: 300,
    },
    order: 1,
    isLocked: false,
    knowledgeSlug: 'weak-authentication',
  });

  logger.info('Seeded challenge: weak-auth');
}
