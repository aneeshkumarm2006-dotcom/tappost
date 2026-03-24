import { NextResponse } from 'next/server';
import type { NextRequest } from 'next/server';
import { getToken } from 'next-auth/jwt';

// ─── Route Protection Middleware ──────────────────────────────────────────────
// Protects /dashboard/* routes.
// Checks:
//   1. User has a valid JWT session → if not, redirect to /login
//   2. Subscription tier is 'trial' and trialEndsAt < now → redirect to /pricing
//   3. Subscription status is 'expired' or 'cancelled' → redirect to /pricing
//
// NOTE: We cannot call MongoDB here (middleware runs on the Edge runtime).
// Subscription enforcement at the DB level is handled in the API routes.
// For trial expiry we rely on a short-lived indicator stored in the JWT or
// fall through to the API layer — the middleware checks the session token fields
// that are written at sign-in / token refresh time.

export async function middleware(request: NextRequest) {
  const { pathname } = request.nextUrl;

  // ─── Only guard /dashboard/* ─────────────────────────────────────────────
  if (!pathname.startsWith('/dashboard')) {
    return NextResponse.next();
  }

  // ─── Check session token ─────────────────────────────────────────────────
  const token = await getToken({
    req: request,
    secret: process.env.NEXTAUTH_SECRET,
  });

  if (!token) {
    // Not authenticated — redirect to login, preserving the intended path
    const loginUrl = new URL('/login', request.url);
    loginUrl.searchParams.set('callbackUrl', pathname);
    return NextResponse.redirect(loginUrl);
  }

  // ─── Trial / Subscription gate ───────────────────────────────────────────
  // subscriptionTier and subscriptionStatus are set in the JWT callback.
  // If they exist and indicate an expired/cancelled subscription, block access.
  const tier = token.subscriptionTier as string | undefined;
  const status = token.subscriptionStatus as string | undefined;
  const trialEndsAt = token.trialEndsAt as number | undefined; // unix ms

  const now = Date.now();

  if (tier === 'trial' && trialEndsAt && trialEndsAt < now) {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  if (status === 'expired' || status === 'cancelled') {
    return NextResponse.redirect(new URL('/pricing', request.url));
  }

  return NextResponse.next();
}

export const config = {
  matcher: ['/dashboard/:path*'],
};
