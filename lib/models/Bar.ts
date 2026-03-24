import mongoose, { Schema, Document, Model } from 'mongoose';

// ─── Vibe & Tone Enums ───

export const VIBE_OPTIONS = [
  'sports bar',
  'craft cocktails',
  'dive bar',
  'gastropub',
  'rooftop',
  'live music',
  'nightclub',
  'LGBTQ+',
  'karaoke',
  'pool bar',
  'whiskey bar',
  'cocktail lounge',
] as const;

export const TONE_OPTIONS = [
  'hype',
  'casual',
  'premium',
  'cheeky',
  'minimal',
] as const;

export const TIER_OPTIONS = ['trial', 'starter', 'pro', 'multi'] as const;

export const SUBSCRIPTION_STATUS_OPTIONS = ['active', 'expired', 'cancelled'] as const;

// ─── Subscription Sub-Schema ───

const SubscriptionSchema = new Schema(
  {
    tier: {
      type: String,
      enum: TIER_OPTIONS,
      default: 'trial',
    },
    stripeCustomerId: String,
    stripeSubscriptionId: String,
    trialEndsAt: Date,
    currentPeriodEnd: Date,
    status: {
      type: String,
      enum: SUBSCRIPTION_STATUS_OPTIONS,
      default: 'active',
    },
  },
  { _id: false }
);

// ─── Bar Document Interface ───

export interface IBar extends Document {
  userId: string;                              // stores the user's email as unique ID
  passwordHash?: string;                       // bcrypt hash, select: false
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor: string;
  vibe: (typeof VIBE_OPTIONS)[number][];
  defaultTone: (typeof TONE_OPTIONS)[number];
  address?: string;
  city?: string;
  instagramAccountId?: string;
  instagramAccessToken?: string;
  instagramConnectedAt?: Date;
  subscription: {
    tier: (typeof TIER_OPTIONS)[number];
    stripeCustomerId?: string;
    stripeSubscriptionId?: string;
    trialEndsAt?: Date;
    currentPeriodEnd?: Date;
    status: (typeof SUBSCRIPTION_STATUS_OPTIONS)[number];
  };
  createdAt: Date;
  updatedAt: Date;
}

// ─── Bar Schema ───

const BarSchema = new Schema<IBar>(
  {
    userId: {
      type: String,
      required: true,
      unique: true,
    },
    passwordHash: {
      type: String,
      select: false, // never returned in queries unless explicitly requested
    },
    name: {
      type: String,
      required: true,
    },
    slug: {
      type: String,
      unique: true,
    },
    logoUrl: String,
    brandColor: {
      type: String,
      default: '#B5FF4D',
    },
    vibe: [
      {
        type: String,
        enum: VIBE_OPTIONS,
      },
    ],
    defaultTone: {
      type: String,
      enum: TONE_OPTIONS,
      default: 'hype',
    },
    address: String,
    city: String,
    instagramAccountId: String,
    instagramAccessToken: String, // encrypted, Phase 2
    instagramConnectedAt: Date,
    subscription: {
      type: SubscriptionSchema,
      default: () => ({
        tier: 'trial',
        status: 'active',
      }),
    },
  },
  { timestamps: true }
);

// Auto-generate slug from bar name before saving
BarSchema.pre('save', async function () {
  if (this.isModified('name') || !this.slug) {
    this.slug = this.name
      .toLowerCase()
      .replace(/[^a-z0-9]+/g, '-')
      .replace(/(^-|-$)/g, '');
  }
});

// ─── Export Model ───

const Bar: Model<IBar> =
  mongoose.models.Bar || mongoose.model<IBar>('Bar', BarSchema);

export default Bar;
