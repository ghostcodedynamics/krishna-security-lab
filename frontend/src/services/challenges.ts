import { apiFetch } from './api';

export interface ChallengeSummary {
  id: string;
  slug: string;
  title: string;
  difficulty: string;
  category: string;
  description: string;
  learningObjective: string;
  targetApplication: string;
  xpReward: {
    discovered: number;
    understood: number;
    fixed: number;
    completed: number;
  };
  order: number;
  isLocked: boolean;
  userStatus: string;
  xpEarned: number;
}

export interface ChallengeDetail extends ChallengeSummary {
  hints: { order: number; text: string; xpCost: number }[];
  vulnerableEndpoint: string;
  expectedBehavior: string;
  secureBehavior: string;
  hintsUsed: number[];
  solutionExplanation?: string;
  remediation?: string;
}

interface ApiSuccess<T> {
  success: true;
  data: T;
}

export async function listChallenges() {
  const res = await apiFetch<ApiSuccess<ChallengeSummary[]>>('/challenges');
  return res.data;
}

export async function getChallenge(idOrSlug: string) {
  const res = await apiFetch<ApiSuccess<ChallengeDetail>>(`/challenges/${idOrSlug}`);
  return res.data;
}

export async function startChallenge(id: string) {
  const res = await apiFetch<ApiSuccess<{ attemptId: string; status: string; targetApplication: string }>>(
    `/challenges/${id}/start`,
    { method: 'POST' }
  );
  return res.data;
}

export async function submitFlag(id: string, flag: string) {
  const res = await apiFetch<
    ApiSuccess<{
      correct: boolean;
      xpEarned: number;
      solutionExplanation?: string;
      remediation?: string;
      message?: string;
    }>
  >(`/challenges/${id}/submit-flag`, {
    method: 'POST',
    body: JSON.stringify({ flag }),
  });
  return res.data;
}
