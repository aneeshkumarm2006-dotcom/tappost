'use client';

import { usePathname } from 'next/navigation';

// ─── Page Title Map ───────────────────────────────────────────────────────────

const PAGE_TITLES: Record<string, string> = {
  '/dashboard': "TODAY'S SPECIALS",
  '/dashboard/generate': 'GENERATE',
  '/dashboard/history': 'HISTORY',
  '/dashboard/analytics': 'ANALYTICS',
  '/dashboard/settings': 'SETTINGS',
};

function getTitle(pathname: string): string {
  return PAGE_TITLES[pathname] ?? 'DASHBOARD';
}

// ─── Date Formatter ───────────────────────────────────────────────────────────

function getFormattedDate(): string {
  const now = new Date();
  return now.toLocaleDateString('en-US', {
    weekday: 'long',
    day: '2-digit',
    month: 'short',
    year: 'numeric',
  }).toUpperCase();
}

// ─── TopBar Component ─────────────────────────────────────────────────────────

export default function TopBar() {
  const pathname = usePathname();
  const title = getTitle(pathname);
  const date = getFormattedDate();

  return (
    <header
      className="flex items-center justify-between px-6 shrink-0"
      style={{
        height: '4rem', // h-16
        background: '#000000',
        borderBottom: '2px solid rgba(255,255,255,0.10)',
      }}
    >
      <h1 className="font-display text-3xl text-white">{title}</h1>

      <time
        className="font-mono-custom text-xs"
        style={{ color: 'rgba(255,255,255,0.30)' }}
        dateTime={new Date().toISOString()}
      >
        {date}
      </time>
    </header>
  );
}
