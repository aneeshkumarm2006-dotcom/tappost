'use client';

import { useRef } from 'react';
import { Upload, X } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export const TONES = ['HYPE', 'CASUAL', 'PREMIUM', 'CHEEKY', 'MINIMAL'] as const;
export type Tone = (typeof TONES)[number];

export const VIBES = [
  'SPORTS BAR', 'CRAFT BEER', 'COCKTAIL LOUNGE', 'DIVE BAR', 'ROOFTOP',
  'LIVE MUSIC', 'TRIVIA NIGHT', 'GAY BAR', 'WINE BAR', 'KARAOKE',
] as const;
export type Vibe = (typeof VIBES)[number];

export interface BrandPanelProps {
  tone: Tone;
  onToneChange: (t: Tone) => void;

  selectedVibes: Set<string>;
  onVibeToggle: (v: string) => void;

  brandColor: string;
  onBrandColorChange: (c: string) => void;

  logoOn: boolean;
  onLogoToggle: () => void;

  userPhoto: string | null;
  onPhotoUpload: (file: File) => Promise<void>;
  onPhotoRemove: () => void;
}

// ─── Chip ─────────────────────────────────────────────────────────────────────

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

// ─── BrandPanel ───────────────────────────────────────────────────────────────

/**
 * Section 2 of the Generator — Brand settings.
 * Includes: Tone selector, Vibe multi-select (up to 3), Brand Color swatch + hex input,
 * Logo on/off toggle, and optional photo upload zone.
 * All values default from bar profile (passed in as props).
 */
export default function BrandPanel({
  tone,
  onToneChange,
  selectedVibes,
  onVibeToggle,
  brandColor,
  onBrandColorChange,
  logoOn,
  onLogoToggle,
  userPhoto,
  onPhotoUpload,
  onPhotoRemove,
}: BrandPanelProps) {
  const photoInputRef = useRef<HTMLInputElement>(null);

  return (
    <div className="flex flex-col gap-5">

      {/* ── Tone ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          TONE
        </label>
        <div className="flex flex-wrap gap-2">
          {TONES.map((t) => (
            <Chip
              key={t}
              id={`tone-chip-${t.toLowerCase()}`}
              label={t}
              active={tone === t}
              onClick={() => onToneChange(t)}
            />
          ))}
        </div>
      </div>

      {/* ── Vibe (multi-select, up to 3) ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 flex items-center justify-between"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
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
              onClick={() => onVibeToggle(v)}
            />
          ))}
        </div>
      </div>

      {/* ── Brand Color ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          BRAND COLOUR
        </label>
        <div className="flex items-center gap-3">
          {/* Color swatch — also opens the hidden color picker */}
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
              onChange={(e) => onBrandColorChange(e.target.value)}
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
          {/* Hex input */}
          <input
            id="brand-color-hex"
            type="text"
            value={brandColor}
            onChange={(e) => {
              const v = e.target.value;
              if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) onBrandColorChange(v);
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

      {/* ── Logo Toggle ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
          INCLUDE LOGO
        </label>
        <button
          type="button"
          id="logo-toggle"
          role="switch"
          aria-checked={logoOn}
          onClick={onLogoToggle}
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

      {/* ── Photo Upload ── */}
      <div>
        <label
          className="font-mono-custom text-xs tracking-widest mb-2 block"
          style={{ color: 'rgba(255,255,255,0.40)' }}
        >
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
              onClick={onPhotoRemove}
              className="font-mono-custom text-xs transition-colors"
              style={{ color: 'rgba(255,255,255,0.30)', background: 'none', border: 'none', cursor: 'pointer' }}
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
              background: 'transparent',
              cursor: 'pointer',
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
            if (file) onPhotoUpload(file);
          }}
        />
      </div>
    </div>
  );
}
