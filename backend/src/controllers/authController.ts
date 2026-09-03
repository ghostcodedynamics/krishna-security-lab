import type { Request, Response } from 'express';
import argon2 from 'argon2';
import { User } from '../models/User.js';
import { registerSchema, loginSchema } from '../validators/auth.js';
import { signAccessToken, signRefreshToken, verifyRefreshToken } from '../utils/tokens.js';
import type { AuthRequest } from '../middleware/auth.js';
import { logger } from '../config/logger.js';

function publicUser(user: InstanceType<typeof User>) {
  return {
    id: user._id,
    name: user.name,
    email: user.email,
    role: user.role,
    xp: user.xp,
    level: user.level,
    preferences: user.preferences,
  };
}

export async function register(req: Request, res: Response): Promise<void> {
  const parsed = registerSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const { name, email, password } = parsed.data;

  const existing = await User.findOne({ email });
  if (existing) {
    res.status(409).json({
      success: false,
      error: { code: 'EMAIL_TAKEN', message: 'Email already registered' },
    });
    return;
  }

  const passwordHash = await argon2.hash(password, { type: argon2.argon2id });
  const user = await User.create({ name, email, passwordHash });

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });

  logger.info({ userId: user._id }, 'User registered');

  res.status(201).json({
    success: true,
    data: {
      user: publicUser(user),
      accessToken,
      refreshToken,
    },
  });
}

export async function login(req: Request, res: Response): Promise<void> {
  const parsed = loginSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: {
        code: 'VALIDATION_ERROR',
        message: 'Invalid input',
        details: parsed.error.flatten().fieldErrors,
      },
    });
    return;
  }

  const { email, password } = parsed.data;

  const user = await User.findOne({ email }).select('+passwordHash');
  if (!user) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
    return;
  }

  const valid = await argon2.verify(user.passwordHash, password);
  if (!valid) {
    res.status(401).json({
      success: false,
      error: { code: 'INVALID_CREDENTIALS', message: 'Invalid email or password' },
    });
    return;
  }

  user.lastLoginAt = new Date();
  await user.save();

  const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
  const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });

  logger.info({ userId: user._id }, 'User logged in');

  res.json({
    success: true,
    data: {
      user: publicUser(user),
      accessToken,
      refreshToken,
    },
  });
}

export async function refresh(req: Request, res: Response): Promise<void> {
  const token = req.body.refreshToken || req.cookies?.refreshToken;
  if (!token) {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Refresh token required' },
    });
    return;
  }

  try {
    const payload = verifyRefreshToken(token);
    const user = await User.findById(payload.sub);
    if (!user) {
      res.status(401).json({
        success: false,
        error: { code: 'UNAUTHORIZED', message: 'User not found' },
      });
      return;
    }

    const accessToken = signAccessToken({ sub: user._id.toString(), role: user.role });
    const refreshToken = signRefreshToken({ sub: user._id.toString(), role: user.role });

    res.json({
      success: true,
      data: { accessToken, refreshToken },
    });
  } catch {
    res.status(401).json({
      success: false,
      error: { code: 'UNAUTHORIZED', message: 'Invalid refresh token' },
    });
  }
}

export async function me(req: AuthRequest, res: Response): Promise<void> {
  const user = await User.findById(req.user!.id);
  if (!user) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'User not found' },
    });
    return;
  }

  res.json({
    success: true,
    data: { user: publicUser(user) },
  });
}

export async function logout(_req: Request, res: Response): Promise<void> {
  // Client should discard tokens. Server-side revocation can be added with session store.
  res.json({ success: true, data: { message: 'Logged out' } });
}
