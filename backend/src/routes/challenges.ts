import { Router } from 'express';
import rateLimit from 'express-rate-limit';
import * as challengeController from '../controllers/challengeController.js';
import { requireAuth } from '../middleware/auth.js';

export const challengesRouter = Router();

const flagLimiter = rateLimit({
  windowMs: 15 * 60 * 1000,
  max: 40,
  standardHeaders: true,
  legacyHeaders: false,
  message: {
    success: false,
    error: { code: 'RATE_LIMITED', message: 'Too many flag submissions.' },
  },
});

challengesRouter.use(requireAuth);

challengesRouter.get('/', challengeController.listChallenges);
challengesRouter.get('/:id', challengeController.getChallenge);
challengesRouter.post('/:id/start', challengeController.startChallenge);
challengesRouter.post('/:id/submit-flag', flagLimiter, challengeController.submitFlag);
