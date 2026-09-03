import type { Response } from 'express';
import argon2 from 'argon2';
import { Challenge } from '../models/Challenge.js';
import { ChallengeAttempt } from '../models/ChallengeAttempt.js';
import { User } from '../models/User.js';
import type { AuthRequest } from '../middleware/auth.js';
import { z } from 'zod';

function publicChallenge(c: InstanceType<typeof Challenge>, includeSolution = false) {
  const base = {
    id: c._id,
    slug: c.slug,
    title: c.title,
    difficulty: c.difficulty,
    category: c.category,
    description: c.description,
    learningObjective: c.learningObjective,
    targetApplication: c.targetApplication,
    hints: c.hints.map((h) => ({ order: h.order, text: h.text, xpCost: h.xpCost })),
    vulnerableEndpoint: c.vulnerableEndpoint,
    expectedBehavior: c.expectedBehavior,
    secureBehavior: c.secureBehavior,
    xpReward: c.xpReward,
    order: c.order,
    isLocked: c.isLocked,
    knowledgeSlug: c.knowledgeSlug,
  };
  if (includeSolution) {
    return {
      ...base,
      solutionExplanation: c.solutionExplanation,
      remediation: c.remediation,
    };
  }
  return base;
}

export async function listChallenges(req: AuthRequest, res: Response): Promise<void> {
  const challenges = await Challenge.find().sort({ order: 1 }).select('-flagHash');
  const attempts = await ChallengeAttempt.find({ userId: req.user!.id });
  const attemptMap = new Map(attempts.map((a) => [a.challengeId.toString(), a]));

  const data = challenges.map((c) => {
    const attempt = attemptMap.get(c._id.toString());
    return {
      ...publicChallenge(c),
      userStatus: attempt?.status ?? 'not_started',
      xpEarned: attempt?.xpEarned ?? 0,
    };
  });

  res.json({ success: true, data });
}

export async function getChallenge(req: AuthRequest, res: Response): Promise<void> {
  const { id } = req.params;
  const challenge = await Challenge.findOne({
    $or: [{ _id: id.match(/^[a-f\d]{24}$/i) ? id : null }, { slug: id }],
  }).select('-flagHash');

  if (!challenge) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Challenge not found' },
    });
    return;
  }

  const attempt = await ChallengeAttempt.findOne({
    userId: req.user!.id,
    challengeId: challenge._id,
  });

  const includeSolution = attempt?.status === 'completed' || attempt?.isCorrect === true;

  res.json({
    success: true,
    data: {
      ...publicChallenge(challenge, includeSolution),
      userStatus: attempt?.status ?? 'not_started',
      xpEarned: attempt?.xpEarned ?? 0,
      hintsUsed: attempt?.hintsUsed ?? [],
    },
  });
}

export async function startChallenge(req: AuthRequest, res: Response): Promise<void> {
  const challenge = await Challenge.findById(req.params.id);
  if (!challenge) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Challenge not found' },
    });
    return;
  }

  if (challenge.isLocked) {
    res.status(403).json({
      success: false,
      error: { code: 'CHALLENGE_LOCKED', message: 'Challenge is locked' },
    });
    return;
  }

  let attempt = await ChallengeAttempt.findOne({
    userId: req.user!.id,
    challengeId: challenge._id,
  });

  if (!attempt) {
    attempt = await ChallengeAttempt.create({
      userId: req.user!.id,
      challengeId: challenge._id,
      status: 'started',
    });
  }

  res.json({
    success: true,
    data: {
      attemptId: attempt._id,
      status: attempt.status,
      targetApplication: challenge.targetApplication,
    },
  });
}

const flagSchema = z.object({
  flag: z.string().min(1).max(200),
});

export async function submitFlag(req: AuthRequest, res: Response): Promise<void> {
  const parsed = flagSchema.safeParse(req.body);
  if (!parsed.success) {
    res.status(400).json({
      success: false,
      error: { code: 'VALIDATION_ERROR', message: 'Flag required' },
    });
    return;
  }

  const challenge = await Challenge.findById(req.params.id).select('+flagHash');
  if (!challenge) {
    res.status(404).json({
      success: false,
      error: { code: 'NOT_FOUND', message: 'Challenge not found' },
    });
    return;
  }

  const correct = await argon2.verify(challenge.flagHash, parsed.data.flag.trim());

  let attempt = await ChallengeAttempt.findOne({
    userId: req.user!.id,
    challengeId: challenge._id,
  });

  if (!attempt) {
    attempt = await ChallengeAttempt.create({
      userId: req.user!.id,
      challengeId: challenge._id,
      status: 'started',
    });
  }

  if (correct && !attempt.isCorrect) {
    const xpGain = challenge.xpReward.completed;
    attempt.isCorrect = true;
    attempt.status = 'completed';
    attempt.xpEarned += xpGain;
    attempt.completedAt = new Date();
    await attempt.save();

    await User.findByIdAndUpdate(req.user!.id, {
      $inc: { xp: xpGain },
      $addToSet: { completedChallenges: challenge._id },
    });

    // Simple level calculation
    const user = await User.findById(req.user!.id);
    if (user) {
      const newLevel = Math.min(5, Math.floor(user.xp / 500) + 1);
      if (newLevel !== user.level) {
        user.level = newLevel;
        await user.save();
      }
    }

    res.json({
      success: true,
      data: {
        correct: true,
        xpEarned: xpGain,
        totalXpEarned: attempt.xpEarned,
        solutionExplanation: challenge.solutionExplanation,
        remediation: challenge.remediation,
      },
    });
    return;
  }

  if (correct) {
    res.json({
      success: true,
      data: {
        correct: true,
        xpEarned: 0,
        message: 'Already completed',
        solutionExplanation: challenge.solutionExplanation,
        remediation: challenge.remediation,
      },
    });
    return;
  }

  attempt.status = 'flag_submitted';
  await attempt.save();

  res.status(400).json({
    success: false,
    error: { code: 'FLAG_INCORRECT', message: 'Incorrect flag. Keep investigating.' },
  });
}
