import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type AttemptStatus =
  | 'started'
  | 'flag_submitted'
  | 'understood'
  | 'fixed'
  | 'completed'
  | 'failed';

export interface IChallengeAttempt extends Document {
  userId: mongoose.Types.ObjectId;
  challengeId: mongoose.Types.ObjectId;
  status: AttemptStatus;
  isCorrect: boolean;
  hintsUsed: number[];
  xpEarned: number;
  startedAt: Date;
  completedAt?: Date;
}

const attemptSchema = new Schema<IChallengeAttempt>(
  {
    userId: { type: Schema.Types.ObjectId, ref: 'User', required: true, index: true },
    challengeId: { type: Schema.Types.ObjectId, ref: 'Challenge', required: true },
    status: {
      type: String,
      enum: ['started', 'flag_submitted', 'understood', 'fixed', 'completed', 'failed'],
      default: 'started',
    },
    isCorrect: { type: Boolean, default: false },
    hintsUsed: [{ type: Number }],
    xpEarned: { type: Number, default: 0 },
    startedAt: { type: Date, default: Date.now },
    completedAt: Date,
  },
  { timestamps: true }
);

attemptSchema.index({ userId: 1, challengeId: 1 }, { unique: true });

export const ChallengeAttempt: Model<IChallengeAttempt> =
  mongoose.models.ChallengeAttempt ||
  mongoose.model<IChallengeAttempt>('ChallengeAttempt', attemptSchema);
