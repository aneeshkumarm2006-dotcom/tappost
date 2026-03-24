'use client';

import { useState, useRef, useCallback } from 'react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface Captions {
  instagram?: string;
  facebook?: string;
  tiktok?: string;
  google?: string;
  sms?: string;
}

interface CaptionPickerProps {
  captions: Captions;
  onChange?: (updated: Captions) => void;
}

// ─── Platform Tabs ────────────────────────────────────────────────────────────

const PLATFORMS: { key: keyof Captions; label: string }[] = [
  { key: 'instagram', label: 'INSTAGRAM' },
  { key: 'facebook',  label: 'FACEBOOK'  },
  { key: 'tiktok',   label: 'TIKTOK'    },
  { key: 'google',   label: 'GOOGLE'    },
  { key: 'sms',      label: 'SMS'       },
];

// ─── CaptionPicker ────────────────────────────────────────────────────────────

export default function CaptionPicker({ captions, onChange }: CaptionPickerProps) {
  const [activeTab, setActiveTab] = useState<keyof Captions>('instagram');
  const [edited, setEdited] = useState<Captions>({});
  const editRef = useRef<HTMLDivElement>(null);

  // Merged caption = edited override ?? original
  const getCaption = useCallback(
    (key: keyof Captions): string => {
      if (key in edited) return edited[key] ?? '';
      return captions[key] ?? '';
    },
    [edited, captions]
  );

  // Update edited state on blur (so contenteditable stays controlled)
  const handleBlur = () => {
    if (!editRef.current) return;
    const text = editRef.current.innerText;
    const next = { ...edited, [activeTab]: text };
    setEdited(next);
    onChange?.({ ...captions, ...next });
  };

  // When switching tabs, sync ref content
  const handleTabSwitch = (key: keyof Captions) => {
    // Persist current tab's edit before switching
    if (editRef.current) {
      const text = editRef.current.innerText;
      setEdited((prev) => ({ ...prev, [activeTab]: text }));
    }
    setActiveTab(key);
    // Update ref after React re-render
    setTimeout(() => {
      if (editRef.current) {
        editRef.current.innerText = getCaption(key);
      }
    }, 0);
  };

  const currentCaption = getCaption(activeTab);

  return (
    <div>
      {/* ── Tab Row ── */}
      <div
        className="flex overflow-x-auto"
        style={{ borderBottom: '2px solid rgba(255,255,255,0.10)' }}
      >
        {PLATFORMS.map(({ key, label }) => {
          const isActive = activeTab === key;
          const hasCaption = !!getCaption(key);
          return (
            <button
              key={key}
              type="button"
              id={`caption-tab-${key}`}
              onClick={() => handleTabSwitch(key)}
              className="font-mono-custom text-xs tracking-widest px-4 py-3 shrink-0 transition-colors relative"
              style={{
                color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.30)',
                borderBottom: isActive
                  ? '2px solid #B5FF4D'
                  : '2px solid transparent',
                marginBottom: '-2px',
                background: 'transparent',
                border: 'none',
              }}
            >
              <span
                style={{
                  color: isActive ? '#FFFFFF' : 'rgba(255,255,255,0.30)',
                  borderBottom: isActive ? '2px solid #B5FF4D' : '2px solid transparent',
                  paddingBottom: '12px',
                }}
              >
                {label}
              </span>
              {/* Dot indicator when caption exists */}
              {hasCaption && !isActive && (
                <span
                  className="absolute top-2 right-2 w-1 h-1 inline-block"
                  style={{ background: '#B5FF4D' }}
                />
              )}
            </button>
          );
        })}
      </div>

      {/* ── Editable Caption Area ── */}
      <div className="relative" style={{ background: '#111111' }}>
        {/* Edit hint */}
        {!currentCaption && (
          <p
            className="absolute top-3 left-3 font-mono-custom pointer-events-none select-none"
            style={{ color: 'rgba(255,255,255,0.20)', fontSize: 10 }}
          >
            Click to edit
          </p>
        )}

        <div
          ref={editRef}
          id={`caption-editor-${activeTab}`}
          contentEditable
          suppressContentEditableWarning
          onBlur={handleBlur}
          onFocus={(e) => {
            e.currentTarget.style.borderColor = '#B5FF4D';
          }}
          className="font-mono-custom text-sm min-h-[120px] p-3 outline-none transition-colors"
          style={{
            color: 'rgba(255,255,255,0.70)',
            border: '1px solid transparent',
            whiteSpace: 'pre-wrap',
            wordBreak: 'break-word',
          }}
          onMouseLeave={(e) => {
            if (document.activeElement !== e.currentTarget) {
              e.currentTarget.style.borderColor = 'transparent';
            }
          }}
          dangerouslySetInnerHTML={{ __html: '' }}
          // Use key to force re-mount when tab changes with actual content
          key={activeTab}
        >
          {/* We manage content via ref + dangerouslySetInnerHTML alternative */}
        </div>
      </div>

      {/* ── Helper text ── */}
      <p
        className="font-mono-custom px-3 py-2"
        style={{ color: 'rgba(255,255,255,0.20)', fontSize: 10 }}
      >
        CAPTIONS ARE EDITABLE — YOUR CHANGES WILL BE INCLUDED IN THE DOWNLOAD PACK
      </p>
    </div>
  );
}
