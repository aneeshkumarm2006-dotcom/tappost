'use client';

import { Check } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export const PLATFORMS = [
  { key: 'instagram-feed',  label: 'INSTAGRAM FEED'  },
  { key: 'instagram-story', label: 'INSTAGRAM STORY' },
  { key: 'facebook',        label: 'FACEBOOK'        },
  { key: 'tiktok',          label: 'TIKTOK'          },
  { key: 'google',          label: 'GOOGLE'          },
  { key: 'sms',             label: 'SMS'             },
] as const;

export type Platform = (typeof PLATFORMS)[number]['key'];

export interface PlatformSelectorProps {
  selectedPlatforms: Set<Platform>;
  onToggle: (platform: Platform) => void;
}

// ─── PlatformSelector ─────────────────────────────────────────────────────────

/**
 * Section 4 of the Generator — Platform selection.
 * 6 checkboxes: INSTAGRAM FEED, INSTAGRAM STORY, FACEBOOK, TIKTOK, GOOGLE, SMS.
 * Active state shows lime border + lime checkmark.
 */
export default function PlatformSelector({
  selectedPlatforms,
  onToggle,
}: PlatformSelectorProps) {
  return (
    <div className="flex flex-col gap-2">
      {PLATFORMS.map(({ key, label }) => {
        const active = selectedPlatforms.has(key);
        return (
          <button
            key={key}
            type="button"
            id={`platform-${key}`}
            onClick={() => onToggle(key)}
            className="flex items-center gap-3 py-2 px-3 transition-colors"
            style={{
              border: active ? '2px solid #B5FF4D' : '2px solid rgba(255,255,255,0.20)',
              background: active ? 'rgba(181,255,77,0.03)' : 'transparent',
              cursor: 'pointer',
            }}
          >
            {/* Custom checkbox */}
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
  );
}
