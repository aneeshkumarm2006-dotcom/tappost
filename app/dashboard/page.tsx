'use client';

import { useState, useEffect, useCallback } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { X, Plus } from 'lucide-react';
import SpecialsInput, { type SpecialFormData } from '@/components/generator/SpecialsInput';

// ─── Types ────────────────────────────────────────────────────────────────────

interface Special {
  _id: string;
  name: string;
  price?: string;
  timeWindow?: string;
  notes?: string;
  photoUrl?: string;
  activeDate: string;
  createdAt: string;
}

// ─── Date Helpers ─────────────────────────────────────────────────────────────

function getTodayHeader(): string {
  return new Date().toLocaleDateString('en-US', {
    weekday: 'long',
    day: 'numeric',
    month: 'short',
  }).toUpperCase();
}

// ─── Special Card ─────────────────────────────────────────────────────────────

function SpecialCard({
  special,
  onDelete,
  deleting,
}: {
  special: Special;
  onDelete: (id: string) => void;
  deleting: boolean;
}) {
  return (
    <div
      className="flex items-center gap-4 p-4 transition-colors"
      style={{
        border: '2px solid rgba(255,255,255,0.10)',
        background: '#111111',
      }}
      onMouseEnter={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)';
      }}
      onMouseLeave={(e) => {
        e.currentTarget.style.borderColor = 'rgba(255,255,255,0.10)';
      }}
    >
      {/* Photo thumbnail */}
      {special.photoUrl && (
        // eslint-disable-next-line @next/next/no-img-element
        <img
          src={special.photoUrl}
          alt={special.name}
          style={{
            width: 48,
            height: 48,
            objectFit: 'cover',
            border: '1px solid rgba(255,255,255,0.20)',
            flexShrink: 0,
          }}
        />
      )}

      {/* Info */}
      <div className="flex-1 min-w-0">
        <div className="flex items-baseline gap-3">
          <span className="font-display text-2xl text-white leading-none truncate">
            {special.name.toUpperCase()}
          </span>
          {special.price && (
            <span
              className="font-mono-custom text-sm shrink-0"
              style={{ color: '#B5FF4D' }}
            >
              {special.price}
            </span>
          )}
        </div>
        {special.timeWindow && (
          <p
            className="font-mono-custom text-xs mt-1"
            style={{ color: 'rgba(255,255,255,0.40)' }}
          >
            {special.timeWindow}
          </p>
        )}
        {special.notes && (
          <p
            className="font-mono-custom text-xs mt-0.5 truncate"
            style={{ color: 'rgba(255,255,255,0.25)' }}
          >
            {special.notes}
          </p>
        )}
      </div>

      {/* Delete */}
      <button
        type="button"
        onClick={() => onDelete(special._id)}
        disabled={deleting}
        aria-label={`Delete ${special.name}`}
        className="shrink-0 transition-colors p-1"
        style={{ color: 'rgba(255,255,255,0.20)' }}
        onMouseEnter={(e) => { e.currentTarget.style.color = '#FF3B30'; }}
        onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.20)'; }}
      >
        <X size={18} />
      </button>
    </div>
  );
}

// ─── Empty State ──────────────────────────────────────────────────────────────

function EmptyState({ onAdd }: { onAdd: () => void }) {
  return (
    <div
      className="flex flex-col items-center justify-center gap-4 p-12 text-center"
      style={{
        border: '2px dashed rgba(255,255,255,0.20)',
      }}
    >
      <p
        className="font-display text-4xl"
        style={{ color: 'rgba(255,255,255,0.30)' }}
      >
        NOTHING ON YET.
      </p>
      <p
        className="font-mono-custom text-sm"
        style={{ color: 'rgba(255,255,255,0.20)' }}
      >
        Add tonight&apos;s specials to get started.
      </p>
      <button
        type="button"
        onClick={onAdd}
        id="add-special-cta"
        className="cta-btn font-mono-custom text-sm px-6 py-3 flex items-center gap-2 mt-2 transition-colors"
        style={{
          border: '2px solid #B5FF4D',
          color: '#B5FF4D',
          background: 'transparent',
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
        <Plus size={16} />
        ADD SPECIAL
      </button>
    </div>
  );
}

// ─── Dashboard Home Page ──────────────────────────────────────────────────────
// Stage 6.2 — displays today's specials with two states:
//   State 1: empty state card with dashed border
//   State 2: list of special cards + "CUSTOMISE & GENERATE →" CTA

export default function DashboardHomePage() {
  const { status } = useSession();
  const router = useRouter();

  const [specials, setSpecials] = useState<Special[]>([]);
  const [loading, setLoading] = useState(true);
  const [showForm, setShowForm] = useState(false);
  const [deletingId, setDeletingId] = useState<string | null>(null);
  const [error, setError] = useState('');

  // ── Fetch today's specials ──────────────────────────────────────────────────
  const fetchSpecials = useCallback(async () => {
    try {
      const res = await fetch('/api/specials');
      if (!res.ok) throw new Error('Failed to fetch specials');
      const data = await res.json();
      setSpecials(data.specials ?? []);
    } catch (err) {
      console.error(err);
      setError('Could not load specials. Please refresh.');
    } finally {
      setLoading(false);
    }
  }, []);

  useEffect(() => {
    if (status === 'authenticated') {
      fetchSpecials();
    }
  }, [status, fetchSpecials]);

  // ── Add special ─────────────────────────────────────────────────────────────
  const handleAdd = async (data: SpecialFormData) => {
    const res = await fetch('/api/specials', {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(data),
    });
    const json = await res.json();
    if (!res.ok) throw new Error(json.error ?? 'Failed to add special');

    setSpecials((prev) => [...prev, json.special]);
    setShowForm(false);
  };

  // ── Delete special ──────────────────────────────────────────────────────────
  const handleDelete = async (id: string) => {
    setDeletingId(id);
    setError('');
    try {
      const res = await fetch(`/api/specials/${id}`, { method: 'DELETE' });
      if (!res.ok) {
        const json = await res.json();
        throw new Error(json.error ?? 'Delete failed');
      }
      setSpecials((prev) => prev.filter((s) => s._id !== id));
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to delete special.');
    } finally {
      setDeletingId(null);
    }
  };

  // ── Loading skeleton ────────────────────────────────────────────────────────
  if (loading || status === 'loading') {
    return (
      <div
        className="min-h-full px-6 lg:px-10 py-8"
        style={{ background: '#000000' }}
      >
        <div className="mb-6 space-y-2">
          <div
            className="h-3 w-32 animate-pulse"
            style={{ background: 'rgba(181,255,77,0.15)' }}
          />
          <div
            className="h-12 w-64 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.06)' }}
          />
        </div>
        {[1, 2].map((i) => (
          <div
            key={i}
            className="h-16 mb-3 animate-pulse"
            style={{ background: 'rgba(255,255,255,0.04)' }}
          />
        ))}
      </div>
    );
  }

  return (
    <div
      className="min-h-full px-6 lg:px-10 py-8"
      style={{ background: '#000000' }}
    >
      {/* ── Date Header ── */}
      <div className="mb-8">
        <p
          className="font-mono-custom text-xs tracking-widest"
          style={{ color: '#B5FF4D' }}
        >
          TODAY&apos;S SPECIALS
        </p>
        <h1 className="font-display text-5xl text-white mt-1">
          {getTodayHeader()}
        </h1>
      </div>

      {/* ── Error Banner ── */}
      {error && (
        <div
          className="font-mono-custom text-xs mb-6 px-4 py-3"
          style={{
            borderLeft: '4px solid #FF3B30',
            background: 'rgba(255,59,48,0.05)',
            color: '#FF3B30',
          }}
        >
          {error}
        </div>
      )}

      {/* ── Content ── */}
      {specials.length === 0 && !showForm ? (
        /* State 1 — empty */
        <EmptyState onAdd={() => setShowForm(true)} />
      ) : (
        /* State 2 — specials list */
        <div className="space-y-3">
          {specials.map((special) => (
            <SpecialCard
              key={special._id}
              special={special}
              onDelete={handleDelete}
              deleting={deletingId === special._id}
            />
          ))}

          {/* Inline add form or "+ ADD ANOTHER" button */}
          {showForm ? (
            <SpecialsInput
              onAdd={handleAdd}
              onCancel={() => setShowForm(false)}
            />
          ) : (
            <button
              type="button"
              id="add-another-special"
              onClick={() => setShowForm(true)}
              className="w-full flex items-center justify-center gap-2 py-4 font-mono-custom text-sm transition-colors"
              style={{
                border: '2px dashed rgba(255,255,255,0.15)',
                color: 'rgba(255,255,255,0.30)',
              }}
              onMouseEnter={(e) => {
                e.currentTarget.style.borderColor = '#B5FF4D';
                e.currentTarget.style.color = '#B5FF4D';
              }}
              onMouseLeave={(e) => {
                e.currentTarget.style.borderColor = 'rgba(255,255,255,0.15)';
                e.currentTarget.style.color = 'rgba(255,255,255,0.30)';
              }}
            >
              <Plus size={14} />
              ADD ANOTHER SPECIAL
            </button>
          )}

          {/* Generate CTA — shown when specials exist and form is not open */}
          {specials.length > 0 && !showForm && (
            <div className="pt-6">
              <button
                type="button"
                id="customise-and-generate"
                onClick={() => router.push('/dashboard/generate')}
                className="cta-btn font-display text-3xl w-full py-6 transition-colors"
                style={{
                  background: '#B5FF4D',
                  color: '#000000',
                }}
                onMouseEnter={(e) => {
                  e.currentTarget.style.background = 'transparent';
                  e.currentTarget.style.color = '#B5FF4D';
                  e.currentTarget.style.border = '2px solid #B5FF4D';
                }}
                onMouseLeave={(e) => {
                  e.currentTarget.style.background = '#B5FF4D';
                  e.currentTarget.style.color = '#000000';
                  e.currentTarget.style.border = 'none';
                }}
              >
                CUSTOMISE &amp; GENERATE →
              </button>
            </div>
          )}
        </div>
      )}

      {/* If empty state but form was opened */}
      {specials.length === 0 && showForm && (
        <SpecialsInput
          onAdd={handleAdd}
          onCancel={() => setShowForm(false)}
        />
      )}
    </div>
  );
}
