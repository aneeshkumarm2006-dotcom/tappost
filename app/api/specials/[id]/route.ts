import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import Bar from '@/lib/models/Bar';
import Special from '@/lib/models/Special';
import mongoose from 'mongoose';

// ─── DELETE /api/specials/[id] ────────────────────────────────────────────────
// Deletes a special — verifies barId ownership before deleting.

export async function DELETE(
  _req: NextRequest,
  { params }: { params: Promise<{ id: string }> }
) {
  const session = await getServerSession(authOptions);
  if (!session?.user?.email) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  const { id } = await params;

  if (!mongoose.isValidObjectId(id)) {
    return NextResponse.json({ error: 'Invalid special ID' }, { status: 400 });
  }

  await connectToDatabase();

  const bar = await Bar.findOne({ userId: session.user.email.toLowerCase() }).lean();
  if (!bar) {
    return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
  }

  // Only delete if the special belongs to this bar (ownership check)
  const deleted = await Special.findOneAndDelete({
    _id: id,
    barId: bar._id,
  });

  if (!deleted) {
    return NextResponse.json(
      { error: 'Special not found or not owned by this bar' },
      { status: 404 }
    );
  }

  return NextResponse.json({ success: true });
}
