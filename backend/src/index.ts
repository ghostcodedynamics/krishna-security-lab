import express from 'express';
import helmet from 'helmet';
import cors from 'cors';
import rateLimit from 'express-rate-limit';
import mongoSanitize from 'express-mongo-sanitize';
import cookieParser from 'cookie-parser';
import { env } from './config/env.js';
import { logger } from './config/logger.js';
import { healthRouter } from './routes/health.js';
import { authRouter } from './routes/auth.js';
import { challengesRouter } from './routes/challenges.js';
import { connectDatabase } from './config/database.js';
import { seedChallenges } from './seeds/challenges.js';

const app = express();

app.use(helmet());
app.use(
  cors({
    origin: env.CORS_ORIGIN.split(',').map((o) => o.trim()),
    credentials: true,
  })
);
app.use(
  rateLimit({
    windowMs: 15 * 60 * 1000,
    max: 200,
    standardHeaders: true,
    legacyHeaders: false,
  })
);
app.use(mongoSanitize());
app.use(express.json({ limit: '10kb' }));
app.use(cookieParser());

app.use('/api/v1/health', healthRouter);
app.use('/api/v1/auth', authRouter);
app.use('/api/v1/challenges', challengesRouter);

app.use((_req, res) => {
  res.status(404).json({ success: false, error: { code: 'NOT_FOUND', message: 'Resource not found' } });
});

app.use((err: Error, _req: express.Request, res: express.Response, _next: express.NextFunction) => {
  logger.error(err);
  res.status(500).json({
    success: false,
    error: { code: 'INTERNAL_ERROR', message: 'Internal server error' },
  });
});

async function start() {
  try {
    await connectDatabase();
    await seedChallenges();
  } catch (err) {
    logger.warn({ err }, 'MongoDB not available — continuing without DB');
  }

  app.listen(env.PORT, () => {
    logger.info(`🛡️  Krishna Security Lab API running on port ${env.PORT} [${env.NODE_ENV}]`);
  });
}

start();

export default app;
