'use client';

// Stage 7 (Brand Customizer Panel) + Stage 8 (Results Page) — combined
// This is the core generator page with 3 states:
//   1. Pre-generation: 2-col layout — customizer panel (left) + live CSS preview (right)
//   2. Generating: progress indicator
//   3. Results ready: generated image + caption picker + download pack

import { useState, useEffect, useRef, useCallback } from 'react';
import { useRouter } from 'next/navigation';
import { useSession } from 'next-auth/react';
import {
  Check,
  ChevronDown,
  ChevronUp,
  Upload,
  X,
  Zap,
  Image,
  AlignLeft,
  AlignCenter,
  Columns2,
} from 'lucide-react';
import CaptionPicker, { type Captions } from '@/components/generator/CaptionPicker';
import DownloadPack from '@/components/generator/DownloadPack';

// ─── Constants ────────────────────────────────────────────────────────────────

const TONES = ['HYPE', 'CASUAL', 'PREMIUM', 'CHEEKY', 'MINIMAL'] as const;
type Tone = (typeof TONES)[number];

const VIBES = [
  'SPORTS BAR', 'CRAFT BEER', 'COCKTAIL LOUNGE', 'DIVE BAR', 'ROOFTOP',
  'LIVE MUSIC', 'TRIVIA NIGHT', 'GAY BAR', 'WINE BAR', 'KARAOKE',
] as const;
type Vibe = (typeof VIBES)[number];

const POSTER_THEMES = [
  { key: 'dark-neon',     label: 'DARK NEON',     bg: '#000',   textColor: '#B5FF4D' },
  { key: 'minimal-black', label: 'MINIMAL BLACK',  bg: '#000',   textColor: '#FFF'   },
  { key: 'bold-type',     label: 'BOLD TYPE',      bg: '#111',   textColor: '#FFF'   },
  { key: 'photo-bg',      label: 'PHOTO BG',       bg: '#222',   textColor: '#FFF'   },
] as const;
type PosterTheme = (typeof POSTER_THEMES)[number]['key'];

const FONT_WEIGHTS = ['HEAVY', 'MEDIUM', 'LIGHT'] as const;
type FontWeight = (typeof FONT_WEIGHTS)[number];

const LAYOUT_STYLES = [
  { key: 'centered', label: 'CENTERED', icon: AlignCenter },
  { key: 'left',     label: 'LEFT',     icon: AlignLeft   },
  { key: 'split',    label: 'SPLIT',    icon: Columns2    },
] as const;
type LayoutStyle = (typeof LAYOUT_STYLES)[number]['key'];

const PLATFORMS = [
  { key: 'instagram-feed',  label: 'INSTAGRAM FEED'  },
  { key: 'instagram-story', label: 'INSTAGRAM STORY' },
  { key: 'facebook',        label: 'FACEBOOK'        },
  { key: 'tiktok',          label: 'TIKTOK'          },
  { key: 'google',          label: 'GOOGLE'          },
  { key: 'sms',             label: 'SMS'             },
] as const;
type Platform = (typeof PLATFORMS)[number]['key'];

// Generation steps
const STEPS = [
  { label: 'WRITING YOUR CAPTIONS...', short: 'CAPTIONS' },
  { label: 'DESIGNING YOUR POSTER...', short: 'POSTER'   },
  { label: 'GENERATING YOUR IMAGE...', short: 'IMAGE'    },
];

// ─── Types ────────────────────────────────────────────────────────────────────

interface Special {
  _id: string;
  name: string;
  price?: string;
}

interface GeneratedResult {
  contentId: string;
  posterUrl: string;
  storyCardUrl: string;
  captions: Captions;
}

// ─── Section Chip ─────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
  id,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  id?: string;
}) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className="font-mono-custom text-xs px-3 py-1.5 transition-colors shrink-0"
      style={{
        background: active ? '#B5FF4D' : 'transparent',
        color: active ? '#000' : 'rgba(255,255,255,0.40)',
        border: active ? '1px solid #B5FF4D' : '1px solid rgba(255,255,255,0.20)',
      }}
    >
      {label}
    </button>
  );
}

// ─── Section Header ───────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <p
      className="font-mono-custom text-xs tracking-widest pb-3 mb-5"
      style={{
        color: '#B5FF4D',
        borderBottom: '1px solid rgba(255,255,255,0.10)',
      }}
    >
      {label}
    </p>
  );
}

// ─── Live CSS Poster Preview ──────────────────────────────────────────────────

function PosterPreviewDisplay({
  barName,
  specialName,
  brandColor,
  posterTheme,
  fontWeight,
  layoutStyle,
  aspect,
}: {
  barName?: string;
  specialName?: string;
  brandColor: string;
  posterTheme: PosterTheme;
  fontWeight: FontWeight;
  layoutStyle: LayoutStyle;
  aspect: '1:1' | '9:16';
}) {
  const theme = POSTER_THEMES.find((t) => t.key === posterTheme)!;

  const fontSizeMap: Record<FontWeight, string> = {
    HEAVY: '3rem',
    MEDIUM: '2.2rem',
    LIGHT: '1.6rem',
  };

  const fontWeightMap: Record<FontWeight, number> = {
    HEAVY: 900,
    MEDIUM: 700,
    LIGHT: 700,
  };

  const justifyMap: Record<LayoutStyle, string> = {
    centered: 'center',
    left: 'flex-start',
    split: 'flex-start',
  };

  const alignMap: Record<LayoutStyle, string> = {
    centered: 'center',
    left: 'flex-start',
    split: 'flex-start',
  };

  const textAlignMap: Record<LayoutStyle, 'center' | 'left'> = {
    centered: 'center',
    left: 'left',
    split: 'left',
  };

  const accentColor = posterTheme === 'dark-neon' ? brandColor : brandColor;

  return (
    <div
      style={{
        background: theme.bg,
        width: '100%',
        aspectRatio: aspect === '1:1' ? '1/1' : '9/16',
        display: 'flex',
        flexDirection: 'column',
        justifyContent: justifyMap[layoutStyle],
        alignItems: alignMap[layoutStyle],
        padding: '2rem',
        position: 'relative',
        overflow: 'hidden',
        maxHeight: aspect === '9:16' ? '400px' : undefined,
        border: '2px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* Grid bg */}
      <div
        className="grid-bg"
        style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}
      />

      {/* Glow orb */}
      {posterTheme === 'dark-neon' && (
        <div
          style={{
            position: 'absolute',
            top: '-30%',
            left: '50%',
            transform: 'translateX(-50%)',
            width: '300px',
            height: '300px',
            background: `${accentColor}22`,
            filter: 'blur(80px)',
            pointerEvents: 'none',
          }}
        />
      )}

      {/* Bar name */}
      <p
        className="font-mono-custom"
        style={{
          color: 'rgba(255,255,255,0.40)',
          fontSize: '0.6rem',
          letterSpacing: '0.2em',
          marginBottom: '0.5rem',
          position: 'relative',
          textAlign: textAlignMap[layoutStyle],
          width: layoutStyle === 'centered' ? '100%' : 'auto',
        }}
      >
        {barName?.toUpperCase() ?? 'YOUR BAR'}
      </p>

      {/* Accent line */}
      <div
        style={{
          width: layoutStyle === 'centered' ? '40px' : '60px',
          height: '3px',
          background: accentColor,
          marginBottom: '1rem',
          position: 'relative',
          alignSelf: layoutStyle === 'centered' ? 'center' : 'flex-start',
        }}
      />

      {/* Special name */}
      <p
        className="font-display"
        style={{
          color: theme.textColor,
          fontSize: fontSizeMap[fontWeight],
          fontWeight: fontWeightMap[fontWeight],
          position: 'relative',
          textAlign: textAlignMap[layoutStyle],
          width: layoutStyle === 'centered' ? '100%' : 'auto',
          lineHeight: '0.9',
          textTransform: 'uppercase',
          letterSpacing: '-0.03em',
        }}
      >
        {specialName ?? 'TONIGHT\'S SPECIAL'}
      </p>

      {/* Bottom neon for dark-neon */}
      {posterTheme === 'dark-neon' && (
        <div
          style={{
            position: 'absolute',
            bottom: '1rem',
            right: '1rem',
            width: '8px',
            height: '8px',
            background: accentColor,
          }}
        />
      )}

      {/* LIVE PREVIEW label */}
      <p
        className="font-mono-custom"
        style={{
          position: 'absolute',
          bottom: '0.5rem',
          left: '0.5rem',
          color: 'rgba(255,255,255,0.20)',
          fontSize: '9px',
          letterSpacing: '0.1em',
        }}
      >
        LIVE PREVIEW — NOT FINAL
      </p>
    </div>
  );
}

// ─── Generating State ─────────────────────────────────────────────────────────

function GeneratingDisplay({ step }: { step: number }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-6"
      style={{
        minHeight: 320,
        background: '#111111',
        border: '2px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* Step indicators */}
      <div className="flex gap-2">
        {STEPS.map((s, i) => (
          <div
            key={s.short}
            style={{
              width: 48,
              height: 6,
              background: i <= step ? '#B5FF4D' : 'rgba(255,255,255,0.10)',
              transition: 'background 0.4s ease',
            }}
          />
        ))}
      </div>

      {/* Current step label */}
      <p
        className="font-mono-custom text-sm"
        style={{ color: '#B5FF4D', letterSpacing: '0.05em' }}
      >
        {STEPS[step]?.label ?? 'PROCESSING...'}
      </p>

      {/* Animated dots */}
      <div className="flex gap-1">
        {[0, 1, 2].map((i) => (
          <div
            key={i}
            style={{
              width: 6,
              height: 6,
              background: '#B5FF4D',
              animation: `blink 1s step-start ${i * 0.33}s infinite`,
            }}
          />
        ))}
      </div>

      {/* Step mini-list */}
      <div className="flex flex-col gap-2 w-full max-w-xs px-6">
        {STEPS.map((s, i) => (
          <div key={s.short} className="flex items-center gap-2">
            <div
              style={{
                width: 8,
                height: 8,
                background: i < step ? '#B5FF4D' : i === step ? '#B5FF4D' : 'rgba(255,255,255,0.10)',
                flexShrink: 0,
              }}
            />
            <span
              className="font-mono-custom"
              style={{
                fontSize: 10,
                color: i <= step ? '#B5FF4D' : 'rgba(255,255,255,0.20)',
                letterSpacing: '0.1em',
              }}
            >
              {s.short}
            </span>
          </div>
        ))}
      </div>
    </div>
  );
}

// ─── Generate Page ────────────────────────────────────────────────────────────

export default function GeneratePage() {
  const router = useRouter();
  const { data: session } = useSession();

  // ── Specials from session storage / route state ──────────────────────────
  const [specials, setSpecials] = useState<Special[]>([]);
  const [selectedSpecials, setSelectedSpecials] = useState<Set<string>>(new Set());

  // ── Brand panel state (Section 2) ────────────────────────────────────────
  const [tone, setTone] = useState<Tone>('HYPE');
  const [selectedVibes, setSelectedVibes] = useState<Set<string>>(new Set());
  const [brandColor, setBrandColor] = useState('#B5FF4D');
  const [logoOn, setLogoOn] = useState(true);
  const [userPhoto, setUserPhoto] = useState<string | null>(null);
  const photoInputRef = useRef<HTMLInputElement>(null);

  // ── Style customizer state (Section 3) ───────────────────────────────────
  const [posterTheme, setPosterTheme] = useState<PosterTheme>('dark-neon');
  const [fontWeight, setFontWeight] = useState<FontWeight>('HEAVY');
  const [layoutStyle, setLayoutStyle] = useState<LayoutStyle>('centered');

  // ── Platform selector state (Section 4) ──────────────────────────────────
  const [platforms, setPlatforms] = useState<Set<Platform>>(
    new Set(['instagram-feed', 'instagram-story', 'facebook', 'tiktok'])
  );

  // ── Preview tabs ─────────────────────────────────────────────────────────
  const [previewAspect, setPreviewAspect] = useState<'1:1' | '9:16'>('1:1');

  // ── Generator state ──────────────────────────────────────────────────────
  const [pageState, setPageState] = useState<'idle' | 'generating' | 'results'>('idle');
  const [generatingStep, setGeneratingStep] = useState(0);
  const [result, setResult] = useState<GeneratedResult | null>(null);
  const [editedCaptions, setEditedCaptions] = useState<Captions>({});
  const [generateError, setGenerateError] = useState('');

  // ── Fetch today's specials ───────────────────────────────────────────────
  useEffect(() => {
    if (session) {
      fetch('/api/specials')
        .then((r) => r.json())
        .then((d) => {
          const s: Special[] = d.specials ?? [];
          setSpecials(s);
          // Pre-select all
          setSelectedSpecials(new Set(s.map((x) => x._id)));
        })
        .catch(console.error);
    }
  }, [session]);

  // ── Vibe toggle (max 3) ───────────────────────────────────────────────────
  const toggleVibe = (v: string) => {
    setSelectedVibes((prev) => {
      const next = new Set(prev);
      if (next.has(v)) {
        next.delete(v);
      } else if (next.size < 3) {
        next.add(v);
      }
      return next;
    });
  };

  // ── Platform toggle ───────────────────────────────────────────────────────
  const togglePlatform = (p: Platform) => {
    setPlatforms((prev) => {
      const next = new Set(prev);
      if (next.has(p)) next.delete(p);
      else next.add(p);
      return next;
    });
  };

  // ── Special chip toggle ───────────────────────────────────────────────────
  const toggleSpecial = (id: string) => {
    setSelectedSpecials((prev) => {
      const next = new Set(prev);
      if (next.has(id)) next.delete(id);
      else next.add(id);
      return next;
    });
  };

  // ── Photo upload ──────────────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    try {
      const res = await fetch('/api/upload', { method: 'POST', body: fd });
      const json = await res.json();
      if (res.ok && json.url) setUserPhoto(json.url);
    } catch {
      // stub: use object URL as preview
      setUserPhoto(URL.createObjectURL(file));
    }
  };

  // ── Generate disabled logic ───────────────────────────────────────────────
  const canGenerate = selectedSpecials.size > 0;

  // ── Generate handler (stubbed — will call real APIs in Phase B) ───────────
  const handleGenerate = useCallback(async () => {
    if (!canGenerate) return;
    setGenerateError('');
    setPageState('generating');
    setGeneratingStep(0);

    try {
      // Simulate 3-step pipeline (real calls wired in Stage 14.4)
      // Step 0: Captions
      await new Promise((r) => setTimeout(r, 800));
      setGeneratingStep(1);

      // Step 1: Image prompt
      await new Promise((r) => setTimeout(r, 800));
      setGeneratingStep(2);

      // Step 2: Image generation
      await new Promise((r) => setTimeout(r, 1000));

      // Stub result — will be replaced by real API response in Phase B
      const stubResult: GeneratedResult = {
        contentId: 'stub-' + Date.now(),
        posterUrl: '',
        storyCardUrl: '',
        captions: {
          instagram: `🍺 Tonight's specials are LIVE! Don't miss ${Array.from(selectedSpecials).map(id => specials.find(s => s._id === id)?.name).filter(Boolean).join(' + ')}. Limited time — come in now! #HappyHour #BarLife`,
          facebook: `📣 TONIGHT ONLY — special deals are on! ${Array.from(selectedSpecials).map(id => specials.find(s => s._id === id)?.name).filter(Boolean).join(', ')}. Tag a friend and make it a night!`,
          tiktok: `POV: It's ${new Date().toLocaleDateString('en-US', { weekday: 'long' })} and the specials just dropped 👀🔥 #BarTok #HappyHour #${tone.charAt(0) + tone.slice(1).toLowerCase()}Vibes`,
          google: `Today's specials: ${Array.from(selectedSpecials).map(id => specials.find(s => s._id === id)?.name).filter(Boolean).join(', ')}. Limited availability.`,
          sms: `🍺 Tonight's specials are on! ${Array.from(selectedSpecials).map(id => specials.find(s => s._id === id)?.name).filter(Boolean).join(' + ')}. Come in now!`,
        },
      };

      setResult(stubResult);
      setEditedCaptions(stubResult.captions);
      setPageState('results');
    } catch {
      setGenerateError('Generation failed. Please try again.');
      setPageState('idle');
    }
  }, [canGenerate, selectedSpecials, specials, tone]);

  // ── Regenerate ────────────────────────────────────────────────────────────
  const handleRegenerate = () => {
    setResult(null);
    setEditedCaptions({});
    setPageState('idle');
  };

  // ── First special name for preview ───────────────────────────────────────
  const firstSelectedSpecial = specials.find((s) => selectedSpecials.has(s._id));
  const barName = session?.user?.name ?? undefined;

  // ─────────────────────────────────────────────────────────────────────────
  // RENDER
  // ─────────────────────────────────────────────────────────────────────────

  return (
    <div
      className="flex h-full"
      style={{ background: '#000', minHeight: 'calc(100vh - 4rem)' }}
    >
      {/* ════════════════════════════════════════════════════
          LEFT — Brand Customizer Panel
          ════════════════════════════════════════════════════ */}
      <div
        className="flex flex-col overflow-y-auto shrink-0"
        style={{
          width: 480,
          background: '#111111',
          borderRight: '2px solid rgba(255,255,255,0.10)',
        }}
      >
        <div className="p-6 flex flex-col gap-8 flex-1">

          {/* ─── Page Title ──────────────────────────────────────────────── */}
          <div>
            <h1 className="font-display text-4xl text-white">GENERATE</h1>
            <p className="font-mono-custom text-xs mt-1" style={{ color: 'rgba(255,255,255,0.30)' }}>
              CUSTOMISE YOUR POST
            </p>
          </div>

          {/* ─── SECTION 1: CONTENT ──────────────────────────────────────── */}
          <section>
            <SectionHeader label="01 — CONTENT" />
            {specials.length === 0 ? (
              <div className="flex flex-col gap-3">
                <p className="font-mono-custom text-xs" style={{ color: 'rgba(255,255,255,0.30)' }}>
                  No specials yet.
                </p>
                <button
                  type="button"
                  onClick={() => router.push('/dashboard')}
                  className="font-mono-custom text-xs px-3 py-2 transition-colors"
                  style={{
                    border: '1px solid #B5FF4D',
                    color: '#B5FF4D',
                    background: 'transparent',
                    width: 'fit-content',
                  }}
                >
                  ← ADD SPECIALS FIRST
                </button>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                {specials.map((s) => {
                  const active = selectedSpecials.has(s._id);
                  return (
                    <button
                      key={s._id}
                      type="button"
                      id={`special-chip-${s._id}`}
                      onClick={() => toggleSpecial(s._id)}
                      className="font-mono-custom text-xs px-3 py-1.5 transition-colors"
                      style={{
                        background: active ? '#B5FF4D' : 'transparent',
                        color: active ? '#000' : 'rgba(255,255,255,0.40)',
                        border: active ? '1px solid #B5FF4D' : '1px solid rgba(255,255,255,0.20)',
                      }}
                    >
                      {s.name.toUpperCase()}
                      {s.price && (
                        <span style={{ marginLeft: 6, opacity: active ? 0.6 : 0.4 }}>
                          {s.price}
                        </span>
                      )}
                    </button>
                  );
                })}
              </div>
            )}
          </section>

          {/* ─── SECTION 2: BRAND ────────────────────────────────────────── */}
          <section>
            <SectionHeader label="02 — BRAND" />
            <div className="flex flex-col gap-5">

              {/* Tone */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  TONE
                </label>
                <div className="flex flex-wrap gap-2">
                  {TONES.map((t) => (
                    <Chip
                      key={t}
                      id={`tone-chip-${t.toLowerCase()}`}
                      label={t}
                      active={tone === t}
                      onClick={() => setTone(t)}
                    />
                  ))}
                </div>
              </div>

              {/* Vibe */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 flex items-center justify-between" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  <span>VIBE</span>
                  <span style={{ color: 'rgba(255,255,255,0.20)' }}>(up to 3)</span>
                </label>
                <div className="flex flex-wrap gap-2">
                  {VIBES.map((v) => (
                    <Chip
                      key={v}
                      id={`vibe-chip-${v.toLowerCase().replace(/\s+/g, '-')}`}
                      label={v}
                      active={selectedVibes.has(v)}
                      onClick={() => toggleVibe(v)}
                    />
                  ))}
                </div>
              </div>

              {/* Brand Color */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  BRAND COLOUR
                </label>
                <div className="flex items-center gap-3">
                  <div
                    style={{
                      width: 40,
                      height: 40,
                      background: brandColor,
                      border: '2px solid rgba(255,255,255,0.20)',
                      cursor: 'pointer',
                      flexShrink: 0,
                      position: 'relative',
                    }}
                  >
                    <input
                      id="brand-color-picker"
                      type="color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      style={{
                        position: 'absolute',
                        inset: 0,
                        width: '100%',
                        height: '100%',
                        opacity: 0,
                        cursor: 'pointer',
                      }}
                    />
                  </div>
                  <input
                    id="brand-color-hex"
                    type="text"
                    value={brandColor}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBrandColor(v);
                    }}
                    className="font-mono-custom text-sm"
                    style={{
                      background: '#000',
                      border: '2px solid rgba(255,255,255,0.20)',
                      color: '#fff',
                      padding: '8px 12px',
                      outline: 'none',
                      width: 120,
                    }}
                    onFocus={(e) => { e.currentTarget.style.borderColor = '#B5FF4D'; }}
                    onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
                  />
                </div>
              </div>

              {/* Logo toggle */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  INCLUDE LOGO
                </label>
                <button
                  type="button"
                  id="logo-toggle"
                  role="switch"
                  aria-checked={logoOn}
                  onClick={() => setLogoOn((v) => !v)}
                  style={{
                    width: 48,
                    height: 26,
                    border: logoOn ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.20)',
                    background: logoOn ? 'rgba(181,255,77,0.20)' : '#000',
                    position: 'relative',
                    cursor: 'pointer',
                    transition: 'border 0.2s, background 0.2s',
                  }}
                >
                  <span
                    style={{
                      position: 'absolute',
                      top: 3,
                      left: logoOn ? 22 : 2,
                      width: 16,
                      height: 16,
                      background: logoOn ? '#B5FF4D' : 'rgba(255,255,255,0.30)',
                      transition: 'left 0.2s, background 0.2s',
                    }}
                  />
                </button>
              </div>

              {/* Photo upload */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  UPLOAD PHOTO (OPTIONAL)
                </label>
                {userPhoto ? (
                  <div className="flex items-center gap-3">
                    {/* eslint-disable-next-line @next/next/no-img-element */}
                    <img
                      src={userPhoto}
                      alt="Uploaded"
                      style={{ width: 64, height: 64, objectFit: 'cover', border: '2px solid rgba(255,255,255,0.20)' }}
                    />
                    <button
                      type="button"
                      id="remove-photo"
                      onClick={() => setUserPhoto(null)}
                      className="font-mono-custom text-xs transition-colors"
                      style={{ color: 'rgba(255,255,255,0.30)' }}
                      onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3B30'; }}
                      onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; }}
                    >
                      <X size={16} />
                    </button>
                  </div>
                ) : (
                  <button
                    type="button"
                    id="upload-photo-zone"
                    onClick={() => photoInputRef.current?.click()}
                    className="flex flex-col items-center justify-center gap-2 w-full py-6 font-mono-custom text-xs transition-colors"
                    style={{
                      border: '2px dashed rgba(255,255,255,0.20)',
                      color: 'rgba(255,255,255,0.20)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#B5FF4D';
                      e.currentTarget.style.color = '#B5FF4D';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.20)';
                    }}
                  >
                    <Upload size={20} />
                    UPLOAD PHOTO (OPTIONAL)
                  </button>
                )}
                <input
                  ref={photoInputRef}
                  type="file"
                  accept="image/*"
                  className="hidden"
                  onChange={(e) => {
                    const file = e.target.files?.[0];
                    if (file) handlePhotoUpload(file);
                  }}
                />
              </div>
            </div>
          </section>

          {/* ─── SECTION 3: VISUAL STYLE ──────────────────────────────────── */}
          <section>
            <SectionHeader label="03 — VISUAL STYLE" />
            <div className="flex flex-col gap-5">

              {/* Poster Theme — 2×2 grid */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  POSTER THEME
                </label>
                <div className="grid grid-cols-2 gap-2">
                  {POSTER_THEMES.map((theme) => {
                    const active = posterTheme === theme.key;
                    return (
                      <button
                        key={theme.key}
                        type="button"
                        id={`theme-${theme.key}`}
                        onClick={() => setPosterTheme(theme.key as PosterTheme)}
                        className="flex flex-col gap-1 transition-colors"
                        style={{
                          border: active ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.10)',
                          padding: 0,
                          background: 'transparent',
                        }}
                      >
                        {/* Thumbnail */}
                        <div
                          style={{
                            height: 72,
                            background: theme.bg,
                            display: 'flex',
                            alignItems: 'center',
                            justifyContent: 'center',
                          }}
                        >
                          <span
                            className="font-display"
                            style={{
                              color: theme.textColor,
                              fontSize: theme.key === 'bold-type' ? '1.8rem' : '0.9rem',
                            }}
                          >
                            {theme.key === 'bold-type' ? 'BOLD' :
                             theme.key === 'dark-neon' ? '✦' :
                             theme.key === 'minimal-black' ? '◼' : '◪'}
                          </span>
                        </div>
                        {/* Label */}
                        <p
                          className="font-mono-custom text-xs text-center py-1"
                          style={{ color: active ? '#B5FF4D' : 'rgba(255,255,255,0.40)' }}
                        >
                          {theme.label}
                        </p>
                      </button>
                    );
                  })}
                </div>
              </div>

              {/* Font Weight */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  FONT WEIGHT
                </label>
                <div className="flex gap-2">
                  {FONT_WEIGHTS.map((fw) => (
                    <Chip
                      key={fw}
                      id={`fw-${fw.toLowerCase()}`}
                      label={fw}
                      active={fontWeight === fw}
                      onClick={() => setFontWeight(fw)}
                    />
                  ))}
                </div>
              </div>

              {/* Layout Style */}
              <div>
                <label className="font-mono-custom text-xs tracking-widest mb-2 block" style={{ color: 'rgba(255,255,255,0.40)' }}>
                  LAYOUT STYLE
                </label>
                <div className="flex gap-2">
                  {LAYOUT_STYLES.map(({ key, label, icon: Icon }) => {
                    const active = layoutStyle === key;
                    return (
                      <button
                        key={key}
                        type="button"
                        id={`layout-${key}`}
                        onClick={() => setLayoutStyle(key as LayoutStyle)}
                        className="flex items-center gap-2 font-mono-custom text-xs px-3 py-1.5 transition-colors"
                        style={{
                          background: active ? '#B5FF4D' : 'transparent',
                          color: active ? '#000' : 'rgba(255,255,255,0.40)',
                          border: active ? '1px solid #B5FF4D' : '1px solid rgba(255,255,255,0.20)',
                        }}
                      >
                        <Icon size={12} />
                        {label}
                      </button>
                    );
                  })}
                </div>
              </div>
            </div>
          </section>

          {/* ─── SECTION 4: PLATFORMS ─────────────────────────────────────── */}
          <section>
            <SectionHeader label="04 — PLATFORMS" />
            <div className="flex flex-col gap-2">
              {PLATFORMS.map(({ key, label }) => {
                const active = platforms.has(key);
                return (
                  <button
                    key={key}
                    type="button"
                    id={`platform-${key}`}
                    onClick={() => togglePlatform(key as Platform)}
                    className="flex items-center gap-3 py-2 px-3 transition-colors"
                    style={{
                      border: active ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.20)',
                      background: active ? 'rgba(181,255,77,0.03)' : 'transparent',
                    }}
                  >
                    <div
                      style={{
                        width: 18,
                        height: 18,
                        border: active ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.20)',
                        background: active ? '#B5FF4D' : 'transparent',
                        display: 'flex',
                        alignItems: 'center',
                        justifyContent: 'center',
                        flexShrink: 0,
                      }}
                    >
                      {active && <Check size={12} color="#000" strokeWidth={3} />}
                    </div>
                    <span
                      className="font-mono-custom text-sm"
                      style={{ color: active ? '#fff' : 'rgba(255,255,255,0.60)' }}
                    >
                      {label}
                    </span>
                  </button>
                );
              })}
            </div>
          </section>

        </div>

        {/* ─── Generate Button (sticky bottom of panel) ─────────────────── */}
        <div
          className="sticky bottom-0 p-4"
          style={{ borderTop: '2px solid rgba(255,255,255,0.10)', background: '#111111' }}
        >
          {generateError && (
            <p
              className="font-mono-custom text-xs mb-3 px-3 py-2"
              style={{
                borderLeft: '4px solid #FF3B30',
                color: '#FF3B30',
                background: 'rgba(255,59,48,0.05)',
              }}
            >
              {generateError}
            </p>
          )}
          <button
            type="button"
            id="generate-btn"
            onClick={handleGenerate}
            disabled={!canGenerate || pageState === 'generating'}
            className="font-display text-2xl w-full py-4 transition-colors"
            style={{
              background: canGenerate && pageState !== 'generating' ? '#B5FF4D' : 'rgba(255,255,255,0.10)',
              color: canGenerate && pageState !== 'generating' ? '#000' : 'rgba(255,255,255,0.20)',
              cursor: canGenerate && pageState !== 'generating' ? 'pointer' : 'not-allowed',
              border: 'none',
            }}
          >
            {pageState === 'generating' ? 'GENERATING...' : 'GENERATE →'}
          </button>
          {!canGenerate && (
            <p className="font-mono-custom text-xs mt-2 text-center" style={{ color: 'rgba(255,255,255,0.20)' }}>
              SELECT AT LEAST 1 SPECIAL
            </p>
          )}
        </div>
      </div>

      {/* ════════════════════════════════════════════════════
          RIGHT — Live Preview / Results
          ════════════════════════════════════════════════════ */}
      <div
        className="flex-1 flex flex-col overflow-y-auto"
        style={{ background: '#000', position: 'sticky', top: 0 }}
      >
        {/* ── Feed / Story Toggle ── */}
        <div
          className="flex"
          style={{ borderBottom: '2px solid rgba(255,255,255,0.10)' }}
        >
          {(['1:1', '9:16'] as const).map((aspect) => {
            const active = previewAspect === aspect;
            return (
              <button
                key={aspect}
                type="button"
                id={`preview-tab-${aspect.replace(':', '-')}`}
                onClick={() => setPreviewAspect(aspect)}
                className="font-mono-custom text-xs px-6 py-4 transition-colors"
                style={{
                  color: active ? '#fff' : 'rgba(255,255,255,0.30)',
                  borderBottom: active ? '2px solid #B5FF4D' : '2px solid transparent',
                  marginBottom: '-2px',
                  background: 'transparent',
                  border: 'none',
                }}
              >
                <span style={{ borderBottom: active ? '2px solid #B5FF4D' : 'none', paddingBottom: active ? '14px' : '0' }}>
                  {aspect === '1:1' ? 'FEED (1:1)' : 'STORY (9:16)'}
                </span>
              </button>
            );
          })}
        </div>

        {/* ── Preview Content Area ── */}
        <div className="flex-1 flex flex-col gap-0">

          {/* ── STATE: Idle / Pre-generation — CSS preview ── */}
          {pageState === 'idle' && (
            <div className="p-8 flex flex-col gap-6">
              <PosterPreviewDisplay
                barName={barName}
                specialName={firstSelectedSpecial?.name}
                brandColor={brandColor}
                posterTheme={posterTheme}
                fontWeight={fontWeight}
                layoutStyle={layoutStyle}
                aspect={previewAspect}
              />

              {/* Hint */}
              <div
                className="flex items-center gap-3 px-4 py-3"
                style={{ background: 'rgba(181,255,77,0.05)', border: '1px solid rgba(181,255,77,0.15)' }}
              >
                <Zap size={14} style={{ color: '#B5FF4D', flexShrink: 0 }} />
                <p className="font-mono-custom text-xs" style={{ color: '#B5FF4D' }}>
                  PRESS GENERATE TO CREATE YOUR REAL AI POSTER
                </p>
              </div>
            </div>
          )}

          {/* ── STATE: Generating ── */}
          {pageState === 'generating' && (
            <div className="p-8">
              <GeneratingDisplay step={generatingStep} />
            </div>
          )}

          {/* ── STATE: Results ready ── */}
          {pageState === 'results' && result && (
            <div className="flex flex-col">

              {/* Generated poster image */}
              <div className="p-8 pb-4">
                {result.posterUrl ? (
                  // eslint-disable-next-line @next/next/no-img-element
                  <img
                    src={previewAspect === '1:1' ? result.posterUrl : (result.storyCardUrl || result.posterUrl)}
                    alt="Generated poster"
                    style={{
                      width: '100%',
                      objectFit: 'contain',
                      border: '2px solid rgba(255,255,255,0.10)',
                      aspectRatio: previewAspect === '1:1' ? '1/1' : '9/16',
                      maxHeight: 400,
                    }}
                  />
                ) : (
                  /* Stub state — no image yet (Phase B wires real images) */
                  <div
                    style={{
                      aspectRatio: previewAspect === '1:1' ? '1/1' : '9/16',
                      maxHeight: 400,
                      border: '2px solid rgba(255,255,255,0.10)',
                      display: 'flex',
                      flexDirection: 'column',
                      alignItems: 'center',
                      justifyContent: 'center',
                      gap: 12,
                      background: '#111111',
                    }}
                  >
                    <Image size={48} style={{ color: 'rgba(255,255,255,0.10)' }} />
                    <p className="font-mono-custom text-xs text-center px-6" style={{ color: 'rgba(255,255,255,0.20)' }}>
                      AI POSTER GENERATION REQUIRES API KEYS
                      <br />
                      CAPTIONS READY — SEE BELOW
                    </p>
                  </div>
                )}
              </div>

              {/* Caption picker */}
              <div style={{ borderTop: '2px solid rgba(255,255,255,0.10)' }}>
                <CaptionPicker
                  captions={editedCaptions}
                  onChange={setEditedCaptions}
                />
              </div>

              {/* Download + Regenerate */}
              <div className="p-8 pt-4" style={{ borderTop: '2px solid rgba(255,255,255,0.10)' }}>
                <DownloadPack
                  contentId={result.contentId.startsWith('stub-') ? null : result.contentId}
                  onRegenerate={handleRegenerate}
                  fallbackUrls={{
                    posterUrl: result.posterUrl || undefined,
                    storyCardUrl: result.storyCardUrl || undefined,
                  }}
                />
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
