'use client';

import { useState } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export type PosterTheme = 'dark-neon' | 'minimal-black' | 'bold-type' | 'photo-bg';
export type FontWeight  = 'HEAVY' | 'MEDIUM' | 'LIGHT';
export type LayoutStyle = 'centered' | 'left' | 'split';

const POSTER_THEMES: Record<PosterTheme, { bg: string; textColor: string }> = {
  'dark-neon':     { bg: '#000000', textColor: '#B5FF4D' },
  'minimal-black': { bg: '#000000', textColor: '#FFFFFF' },
  'bold-type':     { bg: '#111111', textColor: '#FFFFFF' },
  'photo-bg':      { bg: '#222222', textColor: '#FFFFFF' },
};

const fontSizeMap: Record<FontWeight, string> = {
  HEAVY:  '3rem',
  MEDIUM: '2.2rem',
  LIGHT:  '1.6rem',
};

const fontWeightMap: Record<FontWeight, number> = {
  HEAVY:  900,
  MEDIUM: 700,
  LIGHT:  700,
};

const justifyMap: Record<LayoutStyle, string> = {
  centered: 'center',
  left:     'flex-start',
  split:    'flex-start',
};

const alignMap: Record<LayoutStyle, string> = {
  centered: 'center',
  left:     'flex-start',
  split:    'flex-start',
};

const textAlignMap: Record<LayoutStyle, 'center' | 'left'> = {
  centered: 'center',
  left:     'left',
  split:    'left',
};

export interface PosterPreviewProps {
  barName?: string;
  specialName?: string;
  brandColor: string;
  posterTheme: PosterTheme;
  fontWeight: FontWeight;
  layoutStyle: LayoutStyle;

  /** Optionally controlled from outside; component manages tabs internally by default */
  defaultAspect?: '1:1' | '9:16';
}

// ─── PosterPreview ────────────────────────────────────────────────────────────

/**
 * Stage 7.4 — Live CSS-rendered poster preview (NOT AI-generated).
 * Updates reactively as the user changes tone, color, theme, font weight, and layout.
 * Shows bar name + first special in display font.
 * Corner label: "LIVE PREVIEW — NOT FINAL"
 * Toggle between FEED (1:1) and STORY (9:16) tabs.
 */
export default function PosterPreview({
  barName,
  specialName,
  brandColor,
  posterTheme,
  fontWeight,
  layoutStyle,
  defaultAspect = '1:1',
}: PosterPreviewProps) {
  const [aspect, setAspect] = useState<'1:1' | '9:16'>(defaultAspect);

  const theme = POSTER_THEMES[posterTheme];
  const accentColor = brandColor;

  return (
    <div className="flex flex-col">
      {/* ── FEED / STORY toggle tabs ── */}
      <div
        className="flex"
        style={{ borderBottom: '2px solid rgba(255,255,255,0.10)' }}
      >
        {(['1:1', '9:16'] as const).map((a) => {
          const active = aspect === a;
          return (
            <button
              key={a}
              type="button"
              id={`preview-tab-${a.replace(':', '-')}`}
              onClick={() => setAspect(a)}
              className="font-mono-custom text-xs px-6 py-4 transition-colors"
              style={{
                color: active ? '#fff' : 'rgba(255,255,255,0.30)',
                background: 'transparent',
                border: 'none',
                cursor: 'pointer',
              }}
            >
              <span
                style={{
                  borderBottom: active ? '2px solid #B5FF4D' : 'none',
                  paddingBottom: active ? '14px' : '0',
                }}
              >
                {a === '1:1' ? 'FEED (1:1)' : 'STORY (9:16)'}
              </span>
            </button>
          );
        })}
      </div>

      {/* ── Poster mockup ── */}
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
        {/* Grid background texture */}
        <div
          className="grid-bg"
          style={{ position: 'absolute', inset: 0, opacity: 0.4, pointerEvents: 'none' }}
        />

        {/* Glow orb for dark-neon theme */}
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

        {/* Accent divider line */}
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

        {/* Special name headline */}
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
          {specialName ?? "TONIGHT'S SPECIAL"}
        </p>

        {/* Dark neon corner dot */}
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
    </div>
  );
}
