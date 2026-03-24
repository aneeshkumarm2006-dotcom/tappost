import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Enums ───

export const POSTER_THEME_OPTIONS = [
  'dark-neon',
  'minimal-black',
  'bold-type',
  'photo-bg',
] as const;

export const FONT_WEIGHT_OPTIONS = ['heavy', 'medium', 'light'] as const;

export const LAYOUT_STYLE_OPTIONS = ['centered', 'left-heavy', 'split'] as const;

// ─── Generation Inputs Sub-Schema ───

const GenerationInputsSchema = new Schema(
  {
    tone: String,
    vibe: [String],
    brandColor: String,
    posterTheme: {
      type: String,
      enum: POSTER_THEME_OPTIONS,
    },
    fontWeight: {
      type: String,
      enum: FONT_WEIGHT_OPTIONS,
    },
    layoutStyle: {
      type: String,
      enum: LAYOUT_STYLE_OPTIONS,
    },
    logoIncluded: Boolean,
    userPhotoUrl: String,
  },
  { _id: false }
);

// ─── Captions Sub-Schema ───

const CaptionsSchema = new Schema(
  {
    feed: String,
    story: String,
    facebook: String,
    twitter: String,
    tiktok: String,
    google: String,
    sms: String,
  },
  { _id: false }
);

// ─── Generated Content Document Interface ───

export interface IGeneratedContent extends Document {
  barId: mongoose.Types.ObjectId;
  specialIds: mongoose.Types.ObjectId[];
  generationInputs: {
    tone?: string;
    vibe?: string[];
    brandColor?: string;
    posterTheme?: (typeof POSTER_THEME_OPTIONS)[number];
    fontWeight?: (typeof FONT_WEIGHT_OPTIONS)[number];
    layoutStyle?: (typeof LAYOUT_STYLE_OPTIONS)[number];
    logoIncluded?: boolean;
    userPhotoUrl?: string;
  };
  nanabanaPrompt?: string;
  captions: {
    feed?: string;
    story?: string;
    facebook?: string;
    twitter?: string;
    tiktok?: string;
    google?: string;
    sms?: string;
  };
  posterUrl?: string;
  storyCardUrl?: string;
  selected: boolean;
  downloadCount: number;
  createdAt: Date;
  updatedAt: Date;
}

// ─── Generated Content Schema ───

const GeneratedContentSchema = new Schema<IGeneratedContent>(
  {
    barId: {
      type: Schema.Types.ObjectId,
      ref: 'Bar',
      required: true,
      index: true,
    },
    specialIds: [
      {
        type: Schema.Types.ObjectId,
        ref: 'Special',
      },
    ],
    generationInputs: {
      type: GenerationInputsSchema,
      default: () => ({}),
    },
    nanabanaPrompt: String,
    captions: {
      type: CaptionsSchema,
      default: () => ({}),
    },
    posterUrl: String,
    storyCardUrl: String,
    selected: {
      type: Boolean,
      default: false,
    },
    downloadCount: {
      type: Number,
      default: 0,
    },
  },
  { timestamps: true }
);

// Index for history page — sorted by newest first per bar
GeneratedContentSchema.index({ barId: 1, createdAt: -1 });

// ─── Export Model ───

const GeneratedContent: Model<IGeneratedContent> =
  mongoose.models.GeneratedContent ||
  mongoose.model<IGeneratedContent>('GeneratedContent', GeneratedContentSchema);

export default GeneratedContent;
