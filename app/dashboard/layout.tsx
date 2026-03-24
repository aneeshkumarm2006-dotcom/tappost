import type { ReactNode } from 'react';
import Sidebar from '@/components/dashboard/Sidebar';
import TopBar from '@/components/dashboard/TopBar';

// ─── Dashboard Shell Layout ───────────────────────────────────────────────────
// Renders the persistent Sidebar + TopBar around each dashboard page.
// Mobile: sidebar hidden below md, accessible via drawer (handled in Sidebar via CSS).

export default function DashboardLayout({ children }: { children: ReactNode }) {
  return (
    <div className="flex h-screen overflow-hidden" style={{ background: '#000000' }}>
      {/* ── Sidebar (hidden on mobile) ── */}
      <div className="hidden md:flex md:flex-col md:shrink-0">
        <Sidebar />
      </div>

      {/* ── Main Column ── */}
      <div className="flex flex-col flex-1 min-w-0 overflow-hidden">
        <TopBar />
        <main
          className="flex-1 overflow-y-auto"
          style={{ background: '#000000' }}
        >
          {children}
        </main>
      </div>
    </div>
  );
}
