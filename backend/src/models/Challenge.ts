import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type ChallengeDifficulty = 'easy' | 'medium' | 'hard' | 'boss';
export type ChallengeCategory =
  | 'authentication'
  | 'injection'
  | 'xss'
  | 'idor'
  | 'jwt'
  | 'api'
  | 'database'
  | 'rbac'
  | 'final';

export interface IHint {
  order: number;
  text: string;
  xpCost: number;
}

export interface IChallenge extends Document {
  slug: string;
  title: string;
  difficulty: ChallengeDifficulty;
  category: ChallengeCategory;
  description: string;
  learningObjective: string;
  targetApplication: string;
  hints: IHint[];
  flagHash: string;
  vulnerableEndpoint: string;
  expectedBehavior: string;
  secureBehavior: string;
  solutionExplanation: string;
  remediation: string;
  xpReward: {
    discovered: number;
    understood: number;
    fixed: number;
    completed: number;
  };
  order: number;
  isLocked: boolean;
  prerequisites: mongoose.Types.ObjectId[];
  knowledgeSlug?: string;
  createdAt: Date;
  updatedAt: Date;
}

const challengeSchema = new Schema<IChallenge>(
  {
    slug: { type: String, required: true, unique: true, index: true },
    title: { type: String, required: true },
    difficulty: {
      type: String,
      enum: ['easy', 'medium', 'hard', 'boss'],
      required: true,
    },
    category: {
      type: String,
      enum: [
        'authentication',
        'injection',
        'xss',
        'idor',
        'jwt',
        'api',
        'database',
        'rbac',
        'final',
      ],
      required: true,
      index: true,
    },
    description: { type: String, required: true },
    learningObjective: { type: String, required: true },
    targetApplication: { type: String, default: 'http://localhost:4001' },
    hints: [
      {
        order: Number,
        text: String,
        xpCost: { type: Number, default: 0 },
      },
    ],
    flagHash: { type: String, required: true, select: false },
    vulnerableEndpoint: { type: String, default: '' },
    expectedBehavior: { type: String, default: '' },
    secureBehavior: { type: String, default: '' },
    solutionExplanation: { type: String, default: '' },
    remediation: { type: String, default: '' },
    xpReward: {
      discovered: { type: Number, default: 100 },
      understood: { type: Number, default: 100 },
      fixed: { type: Number, default: 200 },
      completed: { type: Number, default: 300 },
    },
    order: { type: Number, default: 0 },
    isLocked: { type: Boolean, default: false },
    prerequisites: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    knowledgeSlug: String,
  },
  { timestamps: true }
);

challengeSchema.index({ category: 1, order: 1 });

export const Challenge: Model<IChallenge> =
  mongoose.models.Challenge || mongoose.model<IChallenge>('Challenge', challengeSchema);
