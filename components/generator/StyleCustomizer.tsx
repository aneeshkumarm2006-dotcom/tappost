'use client';

import { AlignCenter, AlignLeft, Columns2 } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export const POSTER_THEMES = [
  { key: 'dark-neon',     label: 'DARK NEON',    bg: '#000', textColor: '#B5FF4D' },
  { key: 'minimal-black', label: 'MINIMAL BLACK', bg: '#000', textColor: '#FFF'   },
  { key: 'bold-type',     label: 'BOLD TYPE',     bg: '#111', textColor: '#FFF'   },
  { key: 'photo-bg',      label: 'PHOTO BG',      bg: '#222', textColor: '#FFF'   },
] as const;

export type PosterTheme = (typeof POSTER_THEMES)[number]['key'];

export const FONT_WEIGHTS = ['HEAVY', 'MEDIUM', 'LIGHT'] as const;
export type FontWeight = (typeof FONT_WEIGHTS)[number];

export const LAYOUT_STYLES = [
  { key: 'centered', label: 'CENTERED', icon: AlignCenter },
  { key: 'left',     label: 'LEFT',     icon: AlignLeft   },
  { key: 'split',    label: 'SPLIT',    icon: Columns2    },
] as const;
export type LayoutStyle = (typeof LAYOUT_STYLES)[number]['key'];

export interface StyleCustomizerProps {
  posterTheme: PosterTheme;
  onPosterThemeChange: (t: PosterTheme) => void;

  fontWeight: FontWeight;
  onFontWeightChange: (fw: FontWeight) => void;

  layoutStyle: LayoutStyle;
  onLayoutStyleChange: (ls: LayoutStyle) => void;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

function Chip({
  label,
  active,
  onClick,
  id,
  icon: Icon,
}: {
  label: string;
  active: boolean;
  onClick: () => void;
  id?: string;
  icon?: React.ComponentType<{ size?: number }>;
}) {
  return (
    <button
      type="button"
      id={id}
      onClick={onClick}
      className="flex items-center gap-2 font-mono-custom text-xs px-3 py-1.5 transition-colors shrink-0"
      style={{
        background: active ? '#B5FF4D' : 'transparent',
        color: active ? '#000' : 'rgba(255,255,255,0.40)',
        border: active ? '1px solid #B5FF4D' : '1px solid rgba(255,255,255,0.20)',
      }}
    >
      {Icon && <Icon size={12} />}
      {label}
    </button>
  );
}

// ─── StyleCustomizer ──────────────────────────────────────────────────────────

/**
 * Section 3 of the Generator — Visual Style settings.
 * Includes: Poster Theme (4 visual thumbnail cards in 2×2 grid),
 * Font Weight (3 chips: HEAVY / MEDIUM / LIGHT),
 * Layout Style (3 chips: CENTERED / LEFT / SPLIT).
 */
export default function StyleCustomizer({
  posterTheme,
  onPosterThemeChange,
  fontWeight,
  onFontWeightChange,
  layoutStyle,
  onLayoutStyleChange,
}: StyleCustomizerProps) {
  return (
    <div className="flex flex-col gap-5">

      {/* ── Poster Theme — 2×2 grid of visual thumbnail cards ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
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
                onClick={() => onPosterThemeChange(theme.key as PosterTheme)}
                className="flex flex-col gap-1 transition-colors"
                style={{
                  border: active ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.10)',
                  padding: 0,
                  background: 'transparent',
                }}
              >
                {/* Theme thumbnail preview */}
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
                    {theme.key === 'bold-type'    ? 'BOLD' :
                     theme.key === 'dark-neon'    ? '✦'   :
                     theme.key === 'minimal-black' ? '◼'  : '◪'}
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

      {/* ── Font Weight ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          FONT WEIGHT
        </label>
        <div className="flex gap-2">
          {FONT_WEIGHTS.map((fw) => (
            <Chip
              key={fw}
              id={`fw-${fw.toLowerCase()}`}
              label={fw}
              active={fontWeight === fw}
              onClick={() => onFontWeightChange(fw)}
            />
          ))}
        </div>
      </div>

      {/* ── Layout Style ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          LAYOUT STYLE
        </label>
        <div className="flex gap-2">
          {LAYOUT_STYLES.map(({ key, label, icon }) => (
            <Chip
              key={key}
              id={`layout-${key}`}
              label={label}
              active={layoutStyle === key}
              onClick={() => onLayoutStyleChange(key as LayoutStyle)}
              icon={icon}
            />
          ))}
        </div>
      </div>
    </div>
  );
}
