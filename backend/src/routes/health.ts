import { Router } from 'express';

export const healthRouter = Router();

healthRouter.get('/', (_req, res) => {
  res.json({
    success: true,
    data: {
      status: 'ok',
      service: 'krishna-security-lab-api',
      version: '0.1.0',
      timestamp: new Date().toISOString(),
    },
  });
});
