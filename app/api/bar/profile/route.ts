/**
 * POST /api/bar/profile  — Create / upsert Bar document with new bar details
 * PUT  /api/bar/profile  — Update existing Bar document (brand fields, logo URL, etc.)
 * GET  /api/bar/profile  — Fetch authenticated bar's profile
 *
 * All routes authenticate via NextAuth session and filter by session userId.
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import Bar, { VIBE_OPTIONS, TONE_OPTIONS } from '@/lib/models/Bar';

// ── Helpers ────────────────────────────────────────────────────────────────────

function isValidHex(color: string): boolean {
  return /^#([0-9A-Fa-f]{6}|[0-9A-Fa-f]{3})$/.test(color);
}

// ── GET — Fetch current bar profile ───────────────────────────────────────────

export async function GET() {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const bar = await Bar.findOne({ userId: session.user.email.toLowerCase() }).lean();

  if (!bar) {
    return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
  }

  return NextResponse.json({ bar }, { status: 200 });
}

// ── POST — Upsert bar profile ─────────────────────────────────────────────────

export async function POST(request: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  let body: Record<string, unknown>;
  try {
    body = await request.json();
  } catch {
    return NextResponse.json({ error: 'Invalid JSON body' }, { status: 400 });
  }

  const { name, city, address, logoUrl, brandColor, vibe, defaultTone } = body;

  // Validate required fields
  if (!name || typeof name !== 'string' || name.trim().length < 1) {
    return NextResponse.json({ error: 'Bar name is required.' }, { status: 400 });
  }

  // Validate optional brand fields
  if (brandColor && !isValidHex(brandColor as string)) {
    return NextResponse.json({ error: 'Invalid brand color hex value.' }, { status: 400 });
  }

  if (vibe && Array.isArray(vibe)) {
    const invalidVibes = (vibe as string[]).filter(
      (v) => !VIBE_OPTIONS.includes(v as (typeof VIBE_OPTIONS)[number])
    );
    if (invalidVibes.length > 0) {
      return NextResponse.json(
        { error: `Invalid vibe options: ${invalidVibes.join(', ')}` },
        { status: 400 }
      );
    }
    if ((vibe as string[]).length > 3) {
      return NextResponse.json(
        { error: 'Maximum 3 vibe tags allowed.' },
        { status: 400 }
      );
    }
  }

  if (defaultTone && !TONE_OPTIONS.includes(defaultTone as (typeof TONE_OPTIONS)[number])) {
    return NextResponse.json({ error: 'Invalid default tone.' }, { status: 400 });
  }

  await connectToDatabase();

  const userId = session.user.email.toLowerCase();

  // Build the update payload
  const updateFields: Record<string, unknown> = {
    name: (name as string).trim(),
  };
  if (city !== undefined) updateFields.city = city;
  if (address !== undefined) updateFields.address = address;
  if (logoUrl !== undefined) updateFields.logoUrl = logoUrl;
  if (brandColor !== undefined) updateFields.brandColor = brandColor;
  if (vibe !== undefined) updateFields.vibe = vibe;
  if (defaultTone !== undefined) updateFields.defaultTone = defaultTone;

  try {
    const bar = await Bar.findOneAndUpdate(
      { userId },
      { $set: updateFields },
      { new: true, runValidators: true, upsert: false }
    ).lean();

    if (!bar) {
      return NextResponse.json({ error: 'Bar not found.' }, { status: 404 });
    }

    return NextResponse.json({ bar, message: 'Profile updated.' }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/bar/profile]', err);
    return NextResponse.json(
      { error: 'Failed to update profile. Please try again.' },
      { status: 500 }
    );
  }
}

// ── PUT — Full profile update (alias to POST logic) ──────────────────────────

export async function PUT(request: NextRequest) {
  return POST(request);
}
