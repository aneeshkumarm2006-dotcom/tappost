'use client';

import { useState, useRef } from 'react';
import { X, Upload } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

export interface SpecialFormData {
  name: string;
  price: string;
  timeWindow: string;
  notes: string;
  photoUrl: string;
}

interface SpecialsInputProps {
  onAdd: (data: SpecialFormData) => Promise<void>;
  onCancel: () => void;
}

// ─── Style helpers ────────────────────────────────────────────────────────────

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

function StyledInput({
  id,
  type = 'text',
  value,
  onChange,
  placeholder,
}: {
  id: string;
  type?: string;
  value: string;
  onChange: (v: string) => void;
  placeholder?: string;
}) {
  return (
    <input
      id={id}
      type={type}
      value={value}
      onChange={(e) => onChange(e.target.value)}
      placeholder={placeholder}
      style={inputStyle}
      onFocus={(e) => { e.currentTarget.style.borderColor = '#B5FF4D'; }}
      onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
    />
  );
}

function FieldLabel({ htmlFor, children }: { htmlFor: string; children: React.ReactNode }) {
  return (
    <label
      htmlFor={htmlFor}
      className="font-mono-custom text-xs tracking-widest uppercase block mb-2"
      style={{ color: 'rgba(255,255,255,0.40)' }}
    >
      {children}
    </label>
  );
}

// ─── SpecialsInput Component ──────────────────────────────────────────────────
// Inline form that appears when the user clicks "+ ADD SPECIAL".
// Styled per DESIGN §Page 5 Add Special Form.

export default function SpecialsInput({ onAdd, onCancel }: SpecialsInputProps) {
  const [name, setName] = useState('');
  const [price, setPrice] = useState('');
  const [timeWindow, setTimeWindow] = useState('');
  const [notes, setNotes] = useState('');
  const [photoUrl, setPhotoUrl] = useState('');
  const [photoPreview, setPhotoPreview] = useState('');
  const [uploading, setUploading] = useState(false);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState('');
  const fileRef = useRef<HTMLInputElement>(null);

  // ── Photo upload ────────────────────────────────────────────────────────────
  const handlePhotoUpload = async (file: File) => {
    setUploading(true);
    setError('');
    try {
      const form = new FormData();
      form.append('file', file);
      form.append('folder', 'tappost/specials');

      const res = await fetch('/api/upload', { method: 'POST', body: form });
      const data = await res.json();

      if (!res.ok) throw new Error(data.error ?? 'Upload failed');
      setPhotoUrl(data.url);
      setPhotoPreview(data.url);
    } catch (err) {
      setError('Photo upload failed — you can still add the special without a photo.');
      console.error(err);
    } finally {
      setUploading(false);
    }
  };

  // ── Submit ──────────────────────────────────────────────────────────────────
  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!name.trim()) {
      setError('Special name is required.');
      return;
    }
    setError('');
    setSubmitting(true);
    try {
      await onAdd({ name, price, timeWindow, notes, photoUrl });
    } catch (err: unknown) {
      setError(err instanceof Error ? err.message : 'Failed to add special.');
    } finally {
      setSubmitting(false);
    }
  };

  return (
    <form
      onSubmit={handleSubmit}
      style={{
        border: '2px solid #B5FF4D',
        background: '#000000',
        padding: '1.5rem',
      }}
    >
      {/* Error */}
      {error && (
        <div
          className="font-mono-custom text-xs mb-4 px-3 py-2"
          style={{
            borderLeft: '4px solid #FF3B30',
            background: 'rgba(255,59,48,0.05)',
            color: '#FF3B30',
          }}
        >
          {error}
        </div>
      )}

      <div className="grid grid-cols-1 md:grid-cols-2 gap-5">
        {/* Name */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="special-name">Special Name *</FieldLabel>
          <StyledInput
            id="special-name"
            value={name}
            onChange={setName}
            placeholder="Half-price wings"
          />
        </div>

        {/* Price */}
        <div>
          <FieldLabel htmlFor="special-price">Price (optional)</FieldLabel>
          <StyledInput
            id="special-price"
            value={price}
            onChange={setPrice}
            placeholder="$5"
          />
        </div>

        {/* Time Window */}
        <div>
          <FieldLabel htmlFor="special-time">Time Window (optional)</FieldLabel>
          <StyledInput
            id="special-time"
            value={timeWindow}
            onChange={setTimeWindow}
            placeholder="5 PM – 7 PM"
          />
        </div>

        {/* Notes */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="special-notes">Notes (optional)</FieldLabel>
          <textarea
            id="special-notes"
            value={notes}
            onChange={(e) => setNotes(e.target.value)}
            placeholder="Any extras: dine-in only, while stocks last, etc."
            rows={2}
            style={{
              ...inputStyle,
              resize: 'vertical',
            }}
            onFocus={(e) => { e.currentTarget.style.borderColor = '#B5FF4D'; }}
            onBlur={(e) => { e.currentTarget.style.borderColor = 'rgba(255,255,255,0.20)'; }}
          />
        </div>

        {/* Photo Upload */}
        <div className="md:col-span-2">
          <FieldLabel htmlFor="special-photo">Photo (optional)</FieldLabel>

          {photoPreview ? (
            <div className="flex items-center gap-4">
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={photoPreview}
                alt="Special preview"
                style={{
                  width: 64,
                  height: 64,
                  objectFit: 'cover',
                  border: '2px solid rgba(255,255,255,0.20)',
                }}
              />
              <button
                type="button"
                onClick={() => { setPhotoUrl(''); setPhotoPreview(''); }}
                className="font-mono-custom text-xs flex items-center gap-1"
                style={{ color: '#FF3B30' }}
              >
                <X size={12} /> REMOVE PHOTO
              </button>
            </div>
          ) : (
            <button
              type="button"
              onClick={() => fileRef.current?.click()}
              disabled={uploading}
              className="w-full flex flex-col items-center justify-center gap-2 transition-colors"
              style={{
                border: '2px dashed rgba(255,255,255,0.20)',
                padding: '1rem',
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
              <Upload size={20} />
              <span className="font-mono-custom text-xs tracking-widest">
                {uploading ? 'UPLOADING...' : 'UPLOAD PHOTO (OPTIONAL)'}
              </span>
            </button>
          )}

          <input
            ref={fileRef}
            id="special-photo"
            type="file"
            accept="image/*"
            className="hidden"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handlePhotoUpload(file);
              e.target.value = '';
            }}
          />
        </div>
      </div>

      {/* Actions */}
      <div className="flex items-center gap-4 mt-6">
        <button
          type="submit"
          disabled={submitting || uploading}
          className="cta-btn font-display text-xl px-6 py-3 transition-colors"
          style={{
            background: '#B5FF4D',
            color: '#000000',
            opacity: submitting || uploading ? 0.6 : 1,
            cursor: submitting || uploading ? 'wait' : 'pointer',
          }}
        >
          {submitting ? 'ADDING...' : 'ADD SPECIAL'}
        </button>

        <button
          type="button"
          onClick={onCancel}
          className="font-mono-custom text-sm transition-colors"
          style={{ color: 'rgba(255,255,255,0.30)' }}
          onMouseEnter={(e) => { e.currentTarget.style.color = '#FFFFFF'; }}
          onMouseLeave={(e) => { e.currentTarget.style.color = 'rgba(255,255,255,0.30)'; }}
        >
          CANCEL
        </button>
      </div>
    </form>
  );
}
