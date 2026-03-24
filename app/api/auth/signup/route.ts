import { NextRequest, NextResponse } from 'next/server';
import bcrypt from 'bcrypt';
import { connectToDatabase } from '@/lib/mongodb/connect';
import Bar from '@/lib/models/Bar';

// POST /api/auth/signup
// Creates a new user (Bar document) with hashed password and 7-day trial

export async function POST(req: NextRequest) {
  try {
    const { barName, email, password, city } = await req.json();

    // ─── Validation ───────────────────────────────────────────────────────────
    if (!barName || typeof barName !== 'string' || barName.trim().length === 0) {
      return NextResponse.json({ error: 'Bar name is required.' }, { status: 400 });
    }
    if (!email || typeof email !== 'string' || !email.includes('@')) {
      return NextResponse.json({ error: 'Valid email is required.' }, { status: 400 });
    }
    if (!password || typeof password !== 'string' || password.length < 8) {
      return NextResponse.json({ error: 'Password must be at least 8 characters.' }, { status: 400 });
    }

    const normalizedEmail = email.trim().toLowerCase();

    await connectToDatabase();

    // ─── Duplicate Check ──────────────────────────────────────────────────────
    const existing = await Bar.findOne({ userId: normalizedEmail });
    if (existing) {
      return NextResponse.json(
        { error: 'An account with this email already exists.' },
        { status: 409 }
      );
    }

    // ─── Hash Password ────────────────────────────────────────────────────────
    const passwordHash = await bcrypt.hash(password, 12);

    // ─── Trial Dates ──────────────────────────────────────────────────────────
    const now = new Date();
    const trialEndsAt = new Date(now.getTime() + 7 * 24 * 60 * 60 * 1000); // +7 days

    // ─── Create Bar Document ──────────────────────────────────────────────────
    const bar = await Bar.create({
      userId: normalizedEmail,
      passwordHash,
      name: barName.trim(),
      city: city?.trim() || '',
      brandColor: '#B5FF4D',
      vibe: [],
      defaultTone: 'hype',
      subscription: {
        tier: 'trial',
        status: 'active',
        trialEndsAt,
      },
    });

    return NextResponse.json(
      {
        success: true,
        barId: bar._id.toString(),
        message: 'Account created successfully.',
      },
      { status: 201 }
    );
  } catch (err) {
    console.error('[POST /api/auth/signup]', err);
    return NextResponse.json(
      { error: 'Internal server error. Please try again.' },
      { status: 500 }
    );
  }
}
