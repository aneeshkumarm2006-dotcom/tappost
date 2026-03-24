import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import Bar from '@/lib/models/Bar';
import Special from '@/lib/models/Special';

// ─── GET /api/specials ────────────────────────────────────────────────────────
// Returns today's specials for the authenticated bar, sorted by createdAt ASC.

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

  // Build a date range for "today" (midnight → next midnight, local UTC day)
  const now = new Date();
  const todayStart = new Date(
    Date.UTC(now.getUTCFullYear(), now.getUTCMonth(), now.getUTCDate())
  );
  const todayEnd = new Date(todayStart.getTime() + 24 * 60 * 60 * 1000);

  const specials = await Special.find({
    barId: bar._id,
    activeDate: { $gte: todayStart, $lt: todayEnd },
  })
    .sort({ createdAt: 1 })
    .lean();

  return NextResponse.json({ specials });
}

// ─── POST /api/specials ───────────────────────────────────────────────────────
// Creates a new special for the authenticated bar.

export async function POST(req: NextRequest) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  await connectToDatabase();

  const bar = await Bar.findOne({ userId: session.user.email.toLowerCase() }).lean();
  if (!bar) {
    return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
  }

  const body = await req.json().catch(() => null);
  if (!body?.name?.trim()) {
    return NextResponse.json({ error: 'Special name is required' }, { status: 400 });
  }

  const special = await Special.create({
    barId: bar._id,
    name: body.name.trim(),
    price: body.price?.trim() || undefined,
    timeWindow: body.timeWindow?.trim() || undefined,
    notes: body.notes?.trim() || undefined,
    photoUrl: body.photoUrl?.trim() || undefined,
    activeDate: body.activeDate ? new Date(body.activeDate) : new Date(),
  });

  return NextResponse.json({ special }, { status: 201 });
}
