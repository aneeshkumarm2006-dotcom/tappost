/* ─── TapPost TypeScript Interfaces ─── */

// ─── Enums / Unions ───

export type VibeName =
  | 'sports bar'
  | 'craft cocktails'
  | 'dive bar'
  | 'gastropub'
  | 'rooftop'
  | 'live music'
  | 'nightclub'
  | 'LGBTQ+'
  | 'karaoke'
  | 'pool bar'
  | 'whiskey bar'
  | 'cocktail lounge';

export type ToneName = 'hype' | 'casual' | 'premium' | 'cheeky' | 'minimal';

export type SubscriptionTier = 'trial' | 'starter' | 'pro' | 'multi';

export type SubscriptionStatus = 'active' | 'expired' | 'cancelled';

export type PosterTheme = 'dark-neon' | 'minimal-black' | 'bold-type' | 'photo-bg';

export type FontWeight = 'heavy' | 'medium' | 'light';

export type LayoutStyle = 'centered' | 'left-heavy' | 'split';

export type Platform =
  | 'instagram_feed'
  | 'instagram_story'
  | 'facebook'
  | 'twitter'
  | 'tiktok'
  | 'google';

export type PostStatus = 'sent' | 'failed';

// ─── Subscription ───

export interface Subscription {
  tier: SubscriptionTier;
  stripeCustomerId?: string;
  stripeSubscriptionId?: string;
  trialEndsAt?: Date;
  currentPeriodEnd?: Date;
  status: SubscriptionStatus;
}

// ─── Bar ───

export interface Bar {
  _id?: string;
  userId: string;
  name: string;
  slug: string;
  logoUrl?: string;
  brandColor: string;
  vibe: VibeName[];
  defaultTone: ToneName;
  address?: string;
  city?: string;
  instagramAccountId?: string;
  instagramAccessToken?: string;
  instagramConnectedAt?: Date;
  subscription: Subscription;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Special ───

export interface Special {
  _id?: string;
  barId: string;
  name: string;
  price?: string;
  timeWindow?: string;
  notes?: string;
  photoUrl?: string;
  activeDate: Date;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Generation Inputs ───

export interface GenerationInputs {
  tone: ToneName;
  vibe: VibeName[];
  brandColor: string;
  posterTheme: PosterTheme;
  fontWeight: FontWeight;
  layoutStyle: LayoutStyle;
  logoIncluded: boolean;
  userPhotoUrl?: string;
}

// ─── Captions ───

export interface Captions {
  feed?: string;
  story?: string;
  facebook?: string;
  twitter?: string;
  tiktok?: string;
  google?: string;
  sms?: string;
}

// ─── Generated Content ───

export interface GeneratedContent {
  _id?: string;
  barId: string;
  specialIds: string[];
  generationInputs: GenerationInputs;
  nanabanaPrompt: string;
  captions: Captions;
  posterUrl?: string;
  storyCardUrl?: string;
  selected: boolean;
  downloadCount: number;
  createdAt?: Date;
  updatedAt?: Date;
}

// ─── Post History (Phase 2) ───

export interface PostHistory {
  _id?: string;
  barId: string;
  contentId: string;
  platform: Platform;
  platformPostId?: string;
  postedAt?: Date;
  status: PostStatus;
  errorMessage?: string;
  createdAt?: Date;
  updatedAt?: Date;
}
