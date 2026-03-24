'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';
import { signOut, useSession } from 'next-auth/react';
import {
  Zap,
  Calendar,
  Image as ImageIcon,
  History,
  BarChart3,
  Settings,
  LogOut,
  Lock,
} from 'lucide-react';

// ─── Nav Config ──────────────────────────────────────────────────────────────

const NAV_ITEMS = [
  {
    label: "TODAY'S SPECIALS",
    href: '/dashboard',
    icon: Calendar,
    locked: false,
  },
  {
    label: 'GENERATE',
    href: '/dashboard/generate',
    icon: ImageIcon,
    locked: false,
  },
  {
    label: 'HISTORY',
    href: '/dashboard/history',
    icon: History,
    locked: false,
  },
  {
    label: 'ANALYTICS',
    href: '/dashboard/analytics',
    icon: BarChart3,
    locked: true, // locked on Starter plan
  },
  {
    label: 'SETTINGS',
    href: '/dashboard/settings',
    icon: Settings,
    locked: false,
  },
];

// ─── Subscription Badge ───────────────────────────────────────────────────────

function SubscriptionBadge({
  tier,
  trialEndsAt,
}: {
  tier: string;
  trialEndsAt?: number | null;
}) {
  if (tier === 'trial') {
    let daysLeft = 7;
    if (trialEndsAt) {
      const diff = trialEndsAt - Date.now();
      daysLeft = Math.max(0, Math.ceil(diff / (1000 * 60 * 60 * 24)));
    }
    return (
      <span
        className="font-mono-custom text-xs px-2 py-1 border"
        style={{
          background: 'rgba(245,158,11,0.2)',
          borderColor: 'rgb(245,158,11)',
          color: 'rgb(251,191,36)',
        }}
      >
        TRIAL — {daysLeft} DAYS LEFT
      </span>
    );
  }

  if (tier === 'pro' || tier === 'multi') {
    return (
      <span
        className="font-mono-custom text-xs px-2 py-1 border"
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

  // starter
  return (
    <span
      className="font-mono-custom text-xs px-2 py-1 border"
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

// ─── Sidebar Component ────────────────────────────────────────────────────────

export default function Sidebar() {
  const pathname = usePathname();
  const { data: session } = useSession();

  // Pull subscription info from session token
  const sessionRecord = session?.user as Record<string, unknown> | undefined;
  const tier = (sessionRecord?.subscriptionTier as string | undefined) ?? 'trial';
  const trialEndsAt = sessionRecord?.trialEndsAt as number | null | undefined;

  const isActive = (href: string) => {
    if (href === '/dashboard') return pathname === '/dashboard';
    return pathname.startsWith(href);
  };

  return (
    <aside
      className="flex flex-col h-full"
      style={{
        width: '16rem', // 256px / w-64
        background: '#111111',
        borderRight: '2px solid rgba(255,255,255,0.10)',
      }}
    >
      {/* ── Logo ── */}
      <div
        className="flex items-center gap-2 px-6 py-5"
        style={{ borderBottom: '2px solid rgba(255,255,255,0.10)' }}
      >
        <Link href="/" className="flex items-center gap-1">
          <span className="font-display text-2xl text-white">TAP</span>
          <span
            className="font-display text-2xl"
            style={{ color: '#B5FF4D' }}
          >
            POST
          </span>
          <span
            className="inline-block w-2 h-2 ml-0.5 mb-0.5"
            style={{ background: '#B5FF4D' }}
          />
        </Link>
      </div>

      {/* ── Navigation ── */}
      <nav className="flex-1 py-4 overflow-y-auto">
        {NAV_ITEMS.map((item) => {
          const Icon = item.icon;
          const active = isActive(item.href);

          return (
            <Link
              key={item.href}
              href={item.href}
              className="flex items-center gap-3 px-6 py-3 transition-colors"
              style={{
                borderLeft: active
                  ? '4px solid #B5FF4D'
                  : '4px solid transparent',
                background: active ? 'rgba(181,255,77,0.05)' : undefined,
                color: active
                  ? '#B5FF4D'
                  : 'rgba(255,255,255,0.40)',
              }}
              onMouseEnter={(e) => {
                if (!active) {
                  e.currentTarget.style.color = '#FFFFFF';
                  e.currentTarget.style.background = 'rgba(255,255,255,0.05)';
                }
              }}
              onMouseLeave={(e) => {
                if (!active) {
                  e.currentTarget.style.color = 'rgba(255,255,255,0.40)';
                  e.currentTarget.style.background = 'transparent';
                }
              }}
            >
              <Icon
                size={16}
                strokeWidth={1.5}
                style={{ flexShrink: 0 }}
              />
              <span className="font-mono-custom text-xs tracking-widest flex-1">
                {item.label}
              </span>
              {item.locked && (
                <span
                  className="flex items-center gap-1 font-mono-custom text-[10px] px-1.5 py-0.5"
                  style={{
                    background: 'rgba(255,255,255,0.05)',
                    border: '1px solid rgba(255,255,255,0.10)',
                    color: 'rgba(255,255,255,0.30)',
                  }}
                >
                  <Lock size={8} />
                </span>
              )}
            </Link>
          );
        })}
      </nav>

      {/* ── Bottom: Subscription + Email + Logout ── */}
      <div
        className="px-6 py-4 space-y-3"
        style={{ borderTop: '2px solid rgba(255,255,255,0.10)' }}
      >
        <SubscriptionBadge tier={tier} trialEndsAt={trialEndsAt} />

        {session?.user?.email && (
          <p
            className="font-mono-custom text-xs truncate"
            style={{ color: 'rgba(255,255,255,0.30)' }}
          >
            {session.user.email}
          </p>
        )}

        <button
          onClick={() => signOut({ callbackUrl: '/login' })}
          className="flex items-center gap-2 font-mono-custom text-xs transition-colors w-full"
          style={{ color: 'rgba(255,255,255,0.20)' }}
          onMouseEnter={(e) => {
            e.currentTarget.style.color = '#FF3B30';
          }}
          onMouseLeave={(e) => {
            e.currentTarget.style.color = 'rgba(255,255,255,0.20)';
          }}
        >
          <LogOut size={12} />
          SIGN OUT
        </button>
      </div>
    </aside>
  );
}
