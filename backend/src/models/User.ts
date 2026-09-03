import mongoose, { Schema, type Document, type Model } from 'mongoose';

export type UserRole = 'user' | 'analyst' | 'admin' | 'superadmin';

export interface IUser extends Document {
  name: string;
  email: string;
  passwordHash: string;
  role: UserRole;
  xp: number;
  level: number;
  completedChallenges: mongoose.Types.ObjectId[];
  badges: mongoose.Types.ObjectId[];
  preferences: {
    audioEnabled: boolean;
    reducedMotion: boolean;
    theme: 'dark' | 'system';
  };
  lastLoginAt?: Date;
  createdAt: Date;
  updatedAt: Date;
}

const userSchema = new Schema<IUser>(
  {
    name: { type: String, required: true, trim: true, maxlength: 80 },
    email: {
      type: String,
      required: true,
      unique: true,
      lowercase: true,
      trim: true,
      index: true,
    },
    passwordHash: { type: String, required: true, select: false },
    role: {
      type: String,
      enum: ['user', 'analyst', 'admin', 'superadmin'],
      default: 'user',
    },
    xp: { type: Number, default: 0, min: 0 },
    level: { type: Number, default: 1, min: 1, max: 5 },
    completedChallenges: [{ type: Schema.Types.ObjectId, ref: 'Challenge' }],
    badges: [{ type: Schema.Types.ObjectId, ref: 'Badge' }],
    preferences: {
      audioEnabled: { type: Boolean, default: false },
      reducedMotion: { type: Boolean, default: false },
      theme: { type: String, enum: ['dark', 'system'], default: 'dark' },
    },
    lastLoginAt: { type: Date },
  },
  { timestamps: true }
);

userSchema.index({ xp: -1 });

export const User: Model<IUser> =
  mongoose.models.User || mongoose.model<IUser>('User', userSchema);
