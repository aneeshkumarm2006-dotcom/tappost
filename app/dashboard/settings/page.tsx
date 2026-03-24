'use client';

import { useState, useEffect, useRef } from 'react';
import { useSession } from 'next-auth/react';
import { Upload, X, Lock, ExternalLink, Check } from 'lucide-react';
import Link from 'next/link';

// ─── Constants ────────────────────────────────────────────────────────────────

const VIBE_OPTIONS = [
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

const TONE_OPTIONS = ['hype', 'casual', 'premium', 'cheeky', 'minimal'] as const;

// ─── Types ────────────────────────────────────────────────────────────────────

interface BarProfile {
  name: string;
  city: string;
  address: string;
  logoUrl: string;
  brandColor: string;
  vibe: string[];
  defaultTone: string;
  subscription: {
    tier: string;
    status: string;
    trialEndsAt?: string;
    currentPeriodEnd?: string;
  };
}

// ─── Sub-components ──────────────────────────────────────────────────────────

function SectionHeader({ label }: { label: string }) {
  return (
    <div
      className="pb-3 mb-6"
      style={{ borderBottom: '1px solid rgba(255,255,255,0.10)' }}
    >
      <span
        className="font-mono-custom text-xs tracking-widest uppercase"
        style={{ color: '#B5FF4D' }}
      >
        {label}
      </span>
    </div>
  );
}

function FormField({
  label,
  id,
  children,
}: {
  label: string;
  id: string;
  children: React.ReactNode;
}) {
  return (
    <div className="flex flex-col gap-2">
      <label
        htmlFor={id}
        className="font-mono-custom text-xs tracking-widest uppercase"
        style={{ color: 'rgba(255,255,255,0.40)' }}
      >
        {label}
      </label>
      {children}
    </div>
  );
}

const inputStyle: React.CSSProperties = {
  background: '#000000',
  border: '2px solid rgba(255,255,255,0.20)',
  color: '#FFFFFF',
  padding: '10px 12px',
  fontFamily: "'Space Mono', monospace",
  fontSize: '0.875rem',
  outline: 'none',
  width: '100%',
  transition: 'border-color 0.2s',
};

function TextInput({
  id,
  value,
  onChange,
  placeholder,
}: {
  id: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type="text"
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => {
        e.currentTarget.style.borderColor = '#B5FF4D';
      }}
      onBlur={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }}
    />
  );
}

// ─── Logo Upload Zone ─────────────────────────────────────────────────────────

function LogoUpload({
  logoUrl,
  onUpload,
  onRemove,
  uploading,
}: {
  logoUrl: string;
  onUpload: (file: File) => void;
  onRemove: () => void;
  uploading: boolean;
}) {
  const fileRef = useRef<HTMLInputElement>(null);

  return (
    <div>
      {logoUrl ? (
        <div className="flex items-center gap-4">
          {/* eslint-disable-next-line @next/next/no-img-element */}
          <img
            src={logoUrl}
            alt="Bar logo"
            className="object-cover"
            style={{
              width: 80,
              height: 80,
              border: '2px solid rgba(255,255,255,0.20)',
            }}
          />
          <button
            type="button"
            onClick={onRemove}
            className="flex items-center gap-2 font-mono-custom text-xs"
            style={{ color: '#FF3B30' }}
          >
            <X size={12} /> REMOVE
          </button>
        </div>
      ) : (
        <button
          type="button"
          onClick={() => fileRef.current?.click()}
          disabled={uploading}
          className="flex flex-col items-center justify-center gap-2 w-full transition-colors"
          style={{
            border: '2px dashed rgba(255,255,255,0.20)',
            padding: '2rem',
            color: 'rgba(255,255,255,0.20)',
            cursor: uploading ? 'wait' : 'pointer',
          }}
          onMouseEnter={(e) => {
            if (!uploading) {
              e.currentTarget.style.borderColor = '#B5FF4D';
              e.currentTarget.style.color = '#B5FF4D';
            }
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
            e.currentTarget.style.color = 'rgba(255,255,255,0.20)';
          }}
        >
          <Upload size={24} />
          <span className="font-mono-custom text-xs tracking-widest">
            {uploading ? 'UPLOADING...' : 'UPLOAD LOGO (OPTIONAL)'}
          </span>
        </button>
      )}
      <input
        ref={fileRef}
        type="file"
        accept="image/*"
        className="hidden"
        onChange={(e) => {
          const file = e.target.files?.[0];
          if (file) onUpload(file);
          e.target.value = '';
        }}
      />
    </div>
  );
}

// ─── Subscription Badge ───────────────────────────────────────────────────────

function SubscriptionBadge({ tier }: { tier: string }) {
  if (tier === 'trial') {
    return (
      <span
        className="font-mono-custom text-xs px-3 py-1.5 border inline-block"
        style={{
          background: 'rgba(245,158,11,0.2)',
          borderColor: 'rgb(245,158,11)',
          color: 'rgb(251,191,36)',
        }}
      >
        TRIAL
      </span>
    );
  }
  if (tier === 'pro' || tier === 'multi') {
    return (
      <span
        className="font-mono-custom text-xs px-3 py-1.5 border inline-block"
        style={{
          background: 'rgba(181,255,77,0.10)',
          borderColor: '#B5FF4D',
          color: '#B5FF4D',
        }}
      >
        {tier === 'multi' ? 'MULTI-VENUE' : 'PRO'}
      </span>
    );
  }
  return (
    <span
      className="font-mono-custom text-xs px-3 py-1.5 border inline-block"
      style={{
        background: 'rgba(255,255,255,0.10)',
        borderColor: 'rgba(255,255,255,0.20)',
        color: '#FFFFFF',
      }}
    >
      STARTER
    </span>
  );
}

// ─── Bar Preview Card ─────────────────────────────────────────────────────────

function BarPreviewCard({
  name,
  brandColor,
  logoUrl,
  vibe,
  defaultTone,
}: {
  name: string;
  brandColor: string;
  logoUrl: string;
  vibe: string[];
  defaultTone: string;
}) {
  return (
    <div
      className="p-6 space-y-4"
      style={{
        background: '#111111',
        border: '2px solid rgba(255,255,255,0.10)',
      }}
    >
      <p
        className="font-mono-custom text-[10px] tracking-widest"
        style={{ color: 'rgba(255,255,255,0.20)' }}
      >
        THIS IS HOW TAPPOST KNOWS YOUR BAR
      </p>

      {/* Color swatch + name */}
      <div className="flex items-center gap-3">
        <div
          style={{
            width: 36,
            height: 36,
            background: brandColor || '#B5FF4D',
            border: '2px solid rgba(255,255,255,0.20)',
            flexShrink: 0,
          }}
        />
        <div>
          <p className="font-display text-2xl text-white leading-none">
            {name || 'YOUR BAR'}
          </p>
        </div>
      </div>

      {/* Logo */}
      {logoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={logoUrl}
          alt="Logo"
          className="object-cover"
          style={{
            width: 64,
            height: 64,
            border: '2px solid rgba(255,255,255,0.20)',
          }}
        />
      )}

      {/* Vibe tags */}
      {vibe.length > 0 && (
        <div className="flex flex-wrap gap-2">
          {vibe.map((v) => (
            <span
              key={v}
              className="font-mono-custom text-xs px-2 py-1"
              style={{
                background: 'rgba(181,255,77,0.10)',
                border: '1px solid rgba(181,255,77,0.30)',
                color: '#B5FF4D',
              }}
            >
              {v.toUpperCase()}
            </span>
          ))}
        </div>
      )}

      {/* Tone */}
      {defaultTone && (
        <p
          className="font-mono-custom text-xs"
          style={{ color: 'rgba(255,255,255,0.30)' }}
        >
          DEFAULT TONE:{' '}
          <span className="text-white">{defaultTone.toUpperCase()}</span>
        </p>
      )}
    </div>
  );
}

// ─── Settings Page ────────────────────────────────────────────────────────────

export default function SettingsPage() {
  const { data: session } = useSession();

  // ── Form state ──────────────────────────────────────────────────────────────
  const [name, setName] = useState('');
  const [city, setCity] = useState('');
  const [address, setAddress] = useState('');
  const [logoUrl, setLogoUrl] = useState('');
  const [brandColor, setBrandColor] = useState('#B5FF4D');
  const [vibe, setVibe] = useState<string[]>([]);
  const [defaultTone, setDefaultTone] = useState('hype');
  const [subscription, setSubscription] = useState<BarProfile['subscription']>({
    tier: 'trial',
    status: 'active',
  });

  // ── UI state ────────────────────────────────────────────────────────────────
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [saveStatus, setSaveStatus] = useState<'idle' | 'success' | 'error'>('idle');
  const [errorMsg, setErrorMsg] = useState('');

  // ── Fetch bar profile on mount ──────────────────────────────────────────────
  useEffect(() => {
    if (!session?.user?.email) return;

    fetch('/api/bar/profile')
      .then((r) => r.json())
      .then((data) => {
        if (data.bar) {
          const b = data.bar as BarProfile;
          setName(b.name ?? '');
          setCity(b.city ?? '');
          setAddress(b.address ?? '');
          setLogoUrl(b.logoUrl ?? '');
          setBrandColor(b.brandColor ?? '#B5FF4D');
          setVibe(b.vibe ?? []);
          setDefaultTone(b.defaultTone ?? 'hype');
          setSubscription(b.subscription ?? { tier: 'trial', status: 'active' });
        }
      })
      .catch((err) => console.error('Failed to load profile:', err))
      .finally(() => setLoading(false));
  }, [session]);

  // ── Logo upload handler ─────────────────────────────────────────────────────
  const handleLogoUpload = async (file: File) => {
    setUploading(true);
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'tappost/logos');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setLogoUrl(data.url);
    } catch (err) {
      console.error(err);
      setErrorMsg('Logo upload failed. Please try again.');
    } finally {
      setUploading(false);
    }
  };

  // ── Vibe toggle (max 3) ─────────────────────────────────────────────────────
  const toggleVibe = (v: string) => {
    setVibe((prev) => {
      if (prev.includes(v)) return prev.filter((x) => x !== v);
      if (prev.length >= 3) return prev;
      return [...prev, v];
    });
  };

  // ── Save handler ────────────────────────────────────────────────────────────
  const handleSave = async () => {
    setSaving(true);
    setSaveStatus('idle');
    setErrorMsg('');

    try {
      const res = await fetch('/api/bar/profile', {
        method: 'PUT',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, city, address, logoUrl, brandColor, vibe, defaultTone }),
      });
      const data = await res.json();

      if (!res.ok) {
        throw new Error(data.error ?? 'Save failed');
      }

      setSaveStatus('success');
      setTimeout(() => setSaveStatus('idle'), 3000);
    } catch (err: unknown) {
      setSaveStatus('error');
      setErrorMsg(err instanceof Error ? err.message : 'Save failed. Please try again.');
    } finally {
      setSaving(false);
    }
  };

  // ── Loading state ───────────────────────────────────────────────────────────
  if (loading) {
    return (
      <div className="flex items-center justify-center h-64">
        <span
          className="font-mono-custom text-xs animate-pulse"
          style={{ color: 'rgba(255,255,255,0.30)' }}
        >
          LOADING PROFILE...
        </span>
      </div>
    );
  }

  // ── Subscription info helpers ───────────────────────────────────────────────
  const trialDaysLeft = subscription.trialEndsAt
    ? Math.max(
        0,
        Math.ceil((new Date(subscription.trialEndsAt).getTime() - Date.now()) / (1000 * 60 * 60 * 24))
      )
    : 7;

  const billingDate = subscription.currentPeriodEnd
    ? new Date(subscription.currentPeriodEnd).toLocaleDateString('en-US', {
        day: 'numeric',
        month: 'long',
        year: 'numeric',
      })
    : null;

  return (
    <div
      className="min-h-full px-6 lg:px-10 py-8"
      style={{ background: '#000000' }}
    >
      {/* ── Page Header ── */}
      <div className="mb-10">
        <p
          className="font-mono-custom text-xs tracking-widest"
          style={{ color: '#B5FF4D' }}
        >
          SETTINGS
        </p>
        <h1 className="font-display text-5xl text-white mt-1">BAR PROFILE</h1>
      </div>

      {/* ── Error banner ── */}
      {saveStatus === 'error' && errorMsg && (
        <div
          className="flex items-center gap-3 px-4 py-3 mb-6 font-mono-custom text-sm"
          style={{
            borderLeft: '4px solid #FF3B30',
            background: 'rgba(255,59,48,0.05)',
            color: '#FF3B30',
          }}
        >
          {errorMsg}
        </div>
      )}

      {/* ── Two-column layout ── */}
      <div className="grid grid-cols-1 lg:grid-cols-[1fr_320px] gap-8">

        {/* ── LEFT — Form ── */}
        <div className="space-y-12">

          {/* SECTION: BAR DETAILS */}
          <section>
            <SectionHeader label="Bar Details" />
            <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
              <FormField label="Bar Name *" id="bar-name">
                <TextInput
                  id="bar-name"
                  value={name}
                  onChange={setName}
                  placeholder="The Rusty Anchor"
                />
              </FormField>
              <FormField label="City" id="bar-city">
                <TextInput
                  id="bar-city"
                  value={city}
                  onChange={setCity}
                  placeholder="Austin, TX"
                />
              </FormField>
              <div className="md:col-span-2">
                <FormField label="Address" id="bar-address">
                  <TextInput
                    id="bar-address"
                    value={address}
                    onChange={setAddress}
                    placeholder="123 Main Street"
                  />
                </FormField>
              </div>
            </div>
          </section>

          {/* SECTION: BRAND IDENTITY */}
          <section>
            <SectionHeader label="Brand Identity" />
            <div className="space-y-8">

              {/* Logo */}
              <FormField label="Bar Logo" id="bar-logo">
                <LogoUpload
                  logoUrl={logoUrl}
                  onUpload={handleLogoUpload}
                  onRemove={() => setLogoUrl('')}
                  uploading={uploading}
                />
              </FormField>

              {/* Brand Color */}
              <FormField label="Brand Color" id="brand-color">
                <div className="flex items-center gap-3">
                  <div
                    className="relative shrink-0"
                    style={{ width: 40, height: 40 }}
                  >
                    <input
                      type="color"
                      id="brand-color"
                      value={brandColor}
                      onChange={(e) => setBrandColor(e.target.value)}
                      className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                    />
                    <div
                      style={{
                        width: 40,
                        height: 40,
                        background: brandColor,
                        border: '2px solid rgba(255,255,255,0.20)',
                        pointerEvents: 'none',
                      }}
                    />
                  </div>
                  <input
                    type="text"
                    value={brandColor}
                    onChange={(e) => {
                      const v = e.target.value;
                      if (/^#[0-9A-Fa-f]{0,6}$/.test(v)) setBrandColor(v);
                    }}
                    maxLength={7}
                    className="font-mono-custom text-sm"
                    style={{
                      ...inputStyle,
                      width: 120,
                    }}
                    onFocus={(e) => {
                      e.currentTarget.style.borderColor = '#B5FF4D';
                    }}
                    onBlur={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
                    }}
                  />
                </div>
              </FormField>

              {/* Vibe Tags */}
              <FormField label="Vibe Tags (up to 3)" id="vibe-tags">
                <div className="flex flex-wrap gap-2">
                  {VIBE_OPTIONS.map((v) => {
                    const active = vibe.includes(v);
                    return (
                      <button
                        key={v}
                        type="button"
                        onClick={() => toggleVibe(v)}
                        className="font-mono-custom text-xs px-3 py-1 transition-colors"
                        style={{
                          background: active ? '#B5FF4D' : 'transparent',
                          border: active
                            ? '1px solid #B5FF4D'
                            : '1px solid rgba(255,255,255,0.20)',
                          color: active ? '#000000' : 'rgba(255,255,255,0.40)',
                          cursor: !active && vibe.length >= 3 ? 'not-allowed' : 'pointer',
                          opacity: !active && vibe.length >= 3 ? 0.4 : 1,
                        }}
                      >
                        {v.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </FormField>

              {/* Default Tone */}
              <FormField label="Default Tone" id="default-tone">
                <div className="flex flex-wrap gap-2">
                  {TONE_OPTIONS.map((t) => {
                    const active = defaultTone === t;
                    return (
                      <button
                        key={t}
                        type="button"
                        onClick={() => setDefaultTone(t)}
                        className="font-mono-custom text-xs px-4 py-2 transition-colors"
                        style={{
                          background: active ? '#B5FF4D' : 'transparent',
                          border: active
                            ? '1px solid #B5FF4D'
                            : '1px solid rgba(255,255,255,0.20)',
                          color: active ? '#000000' : 'rgba(255,255,255,0.40)',
                        }}
                      >
                        {t.toUpperCase()}
                      </button>
                    );
                  })}
                </div>
              </FormField>
            </div>
          </section>

          {/* SECTION: SUBSCRIPTION */}
          <section>
            <SectionHeader label="Subscription" />
            <div className="space-y-4">
              <div className="flex items-center gap-4">
                <SubscriptionBadge tier={subscription.tier} />
                {subscription.tier === 'trial' && (
                  <span
                    className="font-mono-custom text-xs"
                    style={{ color: 'rgba(255,255,255,0.30)' }}
                  >
                    {trialDaysLeft} DAYS REMAINING
                  </span>
                )}
              </div>

              {billingDate && subscription.tier !== 'trial' && (
                <p
                  className="font-mono-custom text-xs"
                  style={{ color: 'rgba(255,255,255,0.30)' }}
                >
                  NEXT BILLING DATE: {billingDate.toUpperCase()}
                </p>
              )}

              <div className="flex gap-3 pt-2">
                {subscription.tier === 'trial' || subscription.tier === 'starter' ? (
                  <Link
                    href="/pricing"
                    className="font-mono-custom text-xs px-4 py-2 flex items-center gap-2 transition-colors"
                    style={{
                      border: '2px solid #B5FF4D',
                      color: '#B5FF4D',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.background = '#B5FF4D';
                      e.currentTarget.style.color = '#000000';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.background = 'transparent';
                      e.currentTarget.style.color = '#B5FF4D';
                    }}
                  >
                    UPGRADE →
                  </Link>
                ) : (
                  <button
                    type="button"
                    className="font-mono-custom text-xs px-4 py-2 flex items-center gap-2 transition-colors"
                    style={{
                      border: '2px solid rgba(255,255,255,0.20)',
                      color: 'rgba(255,255,255,0.50)',
                    }}
                    onMouseEnter={(e) => {
                      e.currentTarget.style.borderColor = '#FFFFFF';
                      e.currentTarget.style.color = '#FFFFFF';
                    }}
                    onMouseLeave={(e) => {
                      e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
                      e.currentTarget.style.color = 'rgba(255,255,255,0.50)';
                    }}
                    onClick={() => {
                      // Placeholder — Stripe portal wired in Phase B
                      window.location.href = '/pricing';
                    }}
                  >
                    <ExternalLink size={12} />
                    MANAGE BILLING
                  </button>
                )}
              </div>
            </div>
          </section>

          {/* SECTION: INSTAGRAM (locked) */}
          <section>
            <SectionHeader label="Instagram" />
            <div
              className="flex flex-col items-center justify-center gap-4 p-8 text-center"
              style={{
                background: '#111111',
                border: '2px dashed rgba(255,255,255,0.20)',
              }}
            >
              <Lock size={28} style={{ color: 'rgba(255,255,255,0.20)' }} />
              <div>
                <p
                  className="font-mono-custom text-sm"
                  style={{ color: 'rgba(255,255,255,0.30)' }}
                >
                  CONNECT INSTAGRAM
                </p>
                <p
                  className="font-mono-custom text-xs mt-1"
                  style={{ color: '#B5FF4D' }}
                >
                  Available on Pro plan
                </p>
              </div>
              <Link
                href="/pricing"
                className="font-mono-custom text-xs px-4 py-2 transition-colors"
                style={{
                  border: '2px solid rgba(255,255,255,0.20)',
                  color: 'rgba(255,255,255,0.40)',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.borderColor = '#B5FF4D';
                  e.currentTarget.style.color = '#B5FF4D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
                  e.currentTarget.style.color = 'rgba(255,255,255,0.40)';
                }}
              >
                UPGRADE →
              </Link>
            </div>
          </section>

          {/* ── Save Button ── */}
          <div className="pb-10">
            <button
              type="button"
              onClick={handleSave}
              disabled={saving || !name.trim()}
              className="cta-btn font-display text-2xl px-10 py-4 transition-colors"
              style={{
                background: saving || !name.trim() ? 'rgba(255,255,255,0.10)' : '#B5FF4D',
                color: saving || !name.trim() ? 'rgba(255,255,255,0.20)' : '#000000',
                cursor: saving || !name.trim() ? 'not-allowed' : 'pointer',
                border: 'none',
              }}
            >
              {saving ? (
                'SAVING...'
              ) : saveStatus === 'success' ? (
                <span className="flex items-center gap-2">
                  <Check size={18} /> SAVED
                </span>
              ) : (
                'SAVE CHANGES'
              )}
            </button>
          </div>
        </div>

        {/* ── RIGHT — Sticky Preview ── */}
        <div className="lg:sticky lg:top-6 h-fit">
          <BarPreviewCard
            name={name}
            brandColor={brandColor}
            logoUrl={logoUrl}
            vibe={vibe}
            defaultTone={defaultTone}
          />
        </div>
      </div>
    </div>
  );
}
