'use client';

import { useState } from 'react';
import { Download, RefreshCw, AlertTriangle } from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────────

interface DownloadPackProps {
  contentId: string | null;
  onRegenerate?: () => void;
  /** Individual file fallback URLs — used when ZIP fails */
  fallbackUrls?: {
    posterUrl?: string;
    storyCardUrl?: string;
  };
}

// ─── DownloadPack ─────────────────────────────────────────────────────────────

export default function DownloadPack({
  contentId,
  onRegenerate,
  fallbackUrls,
}: DownloadPackProps) {
  const [downloading, setDownloading] = useState(false);
  const [zipError, setZipError] = useState(false);

  const handleDownload = async () => {
    if (!contentId) return;
    setDownloading(true);
    setZipError(false);

    try {
      const res = await fetch(`/api/download?contentId=${encodeURIComponent(contentId)}`);

      if (!res.ok) {
        throw new Error('ZIP generation failed');
      }

      // Stream the ZIP blob as a download
      const blob = await res.blob();
      const url = URL.createObjectURL(blob);
      const a = document.createElement('a');
      a.href = url;
      a.download = `tappost-pack-${contentId.slice(-6)}.zip`;
      document.body.appendChild(a);
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);
    } catch {
      // 8.6 — On ZIP failure: surface fallback individual download options
      setZipError(true);
    } finally {
      setDownloading(false);
    }
  };

  return (
    <div className="flex flex-col gap-3">
      {/* ── ZIP Error Fallback ── */}
      {zipError && (
        <div
          className="font-mono-custom text-xs p-4 flex flex-col gap-3"
          style={{
            borderLeft: '4px solid #FF9F0A',
            background: 'rgba(255,159,10,0.05)',
            color: '#FF9F0A',
          }}
        >
          <div className="flex items-center gap-2">
            <AlertTriangle size={14} />
            <span>ZIP GENERATION FAILED — DOWNLOAD FILES INDIVIDUALLY</span>
          </div>

          {/* Individual fallback downloads */}
          <div className="flex flex-col gap-2 mt-1">
            {fallbackUrls?.posterUrl && (
              <a
                id="fallback-download-poster"
                href={fallbackUrls.posterUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="tappost-poster.png"
                className="font-mono-custom text-xs underline"
                style={{ color: '#B5FF4D' }}
              >
                ↓ DOWNLOAD POSTER (FEED 1:1)
              </a>
            )}
            {fallbackUrls?.storyCardUrl && (
              <a
                id="fallback-download-story"
                href={fallbackUrls.storyCardUrl}
                target="_blank"
                rel="noopener noreferrer"
                download="tappost-story.png"
                className="font-mono-custom text-xs underline"
                style={{ color: '#B5FF4D' }}
              >
                ↓ DOWNLOAD STORY CARD (9:16)
              </a>
            )}
            {!fallbackUrls?.posterUrl && !fallbackUrls?.storyCardUrl && (
              <span style={{ color: 'rgba(255,255,255,0.40)' }}>
                No files available for individual download.
              </span>
            )}
          </div>
        </div>
      )}

      {/* ── Download Pack Button ── */}
      <button
        type="button"
        id="download-pack-btn"
        onClick={handleDownload}
        disabled={downloading || !contentId}
        className="cta-btn font-display text-2xl flex items-center justify-center gap-3 px-8 py-4 transition-colors w-full"
        style={{
          background: contentId && !downloading ? '#B5FF4D' : 'rgba(255,255,255,0.10)',
          color: contentId && !downloading ? '#000000' : 'rgba(255,255,255,0.20)',
          cursor: contentId && !downloading ? 'pointer' : 'not-allowed',
          border: 'none',
        }}
      >
        {downloading ? (
          <>
            <RefreshCw size={20} className="animate-spin" />
            DOWNLOADING...
          </>
        ) : (
          <>
            <Download size={20} />
            DOWNLOAD PACK
          </>
        )}
      </button>

      {/* ── Regenerate Button ── */}
      <button
        type="button"
        id="regenerate-btn"
        onClick={onRegenerate}
        className="font-display text-xl flex items-center justify-center gap-2 px-6 py-4 transition-colors w-full"
        style={{
          border: '2px solid rgba(255,255,255,0.30)',
          color: 'rgba(255,255,255,0.50)',
          background: 'transparent',
        }}
        onMouseEnter={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.80)';
          e.currentTarget.style.color = '#FFFFFF';
        }}
        onMouseLeave={(e) => {
          e.currentTarget.style.borderColor = 'rgba(255,255,255,0.30)';
          e.currentTarget.style.color = 'rgba(255,255,255,0.50)';
        }}
      >
        <RefreshCw size={16} />
        REGENERATE
      </button>

      {/* ── Pack Contents Note ── */}
      {contentId && (
        <p
          className="font-mono-custom text-center"
          style={{ color: 'rgba(255,255,255,0.20)', fontSize: 10 }}
        >
          ZIP INCLUDES: POSTER · STORY CARD · ALL CAPTIONS PER PLATFORM
        </p>
      )}
    </div>
  );
}
