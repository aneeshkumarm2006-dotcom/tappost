import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Enums ───

export const PLATFORM_OPTIONS = [
  'instagram_feed',
  'instagram_story',
  'facebook',
  'twitter',
  'tiktok',
  'google',
] as const;

export const POST_STATUS_OPTIONS = ['sent', 'failed'] as const;

// ─── Post History Document Interface ───

export interface IPostHistory extends Document {
  barId: mongoose.Types.ObjectId;
  contentId: mongoose.Types.ObjectId;
  platform: (typeof PLATFORM_OPTIONS)[number];
  platformPostId?: string;
  postedAt?: Date;
  status: (typeof POST_STATUS_OPTIONS)[number];
  errorMessage?: string;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Post History Schema (Phase 2 — define now) ───

const PostHistorySchema = new Schema<IPostHistory>(
  {
    barId: {
      type: Schema.Types.ObjectId,
      ref: 'Bar',
      required: true,
      index: true,
    },
    contentId: {
      type: Schema.Types.ObjectId,
      ref: 'GeneratedContent',
    },
    platform: {
      type: String,
      enum: PLATFORM_OPTIONS,
    },
    platformPostId: String,
    postedAt: Date,
    status: {
      type: String,
      enum: POST_STATUS_OPTIONS,
      default: 'sent',
    },
    errorMessage: String,
  },
  { timestamps: true }
);

// Compound index for querying post history per bar
PostHistorySchema.index({ barId: 1, createdAt: -1 });

// ─── Export Model ───

const PostHistory: Model<IPostHistory> =
  mongoose.models.PostHistory ||
  mongoose.model<IPostHistory>('PostHistory', PostHistorySchema);

export default PostHistory;
