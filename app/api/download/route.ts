// Stage 8.5 — GET /api/download
// Accepts ?contentId=xxx, verifies barId ownership,
// builds ZIP via pack utility, increments downloadCount, returns ZIP.

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { connectToDatabase } from '@/lib/mongodb/connect';
import GeneratedContent from '@/lib/models/GeneratedContent';
import Bar from '@/lib/models/Bar';
import Special from '@/lib/models/Special';
import { buildDownloadPack } from '@/lib/download/pack';
import mongoose from 'mongoose';

export async function GET(req: NextRequest) {
  try {
    // ── Auth ────────────────────────────────────────────────────────────────
    const session = await getServerSession(authOptions);
    if (!session?.user) {
      return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
    }

    const userId = (session.user as { id?: string }).id;
    if (!userId) {
      return NextResponse.json({ error: 'Invalid session' }, { status: 401 });
    }

    // ── Query Param ─────────────────────────────────────────────────────────
    const { searchParams } = new URL(req.url);
    const contentId = searchParams.get('contentId');

    if (!contentId || !mongoose.Types.ObjectId.isValid(contentId)) {
      return NextResponse.json({ error: 'Invalid or missing contentId' }, { status: 400 });
    }

    // ── Connect ──────────────────────────────────────────────────────────────
    await connectToDatabase();

    // ── Verify ownership ─────────────────────────────────────────────────────
    // Find the Bar for this user
    const bar = await Bar.findOne({ userId }).lean() as { _id: mongoose.Types.ObjectId; name?: string } | null;
    if (!bar) {
      return NextResponse.json({ error: 'Bar not found' }, { status: 404 });
    }

    // Load the GeneratedContent — must belong to this bar
    const content = await GeneratedContent.findOne({
      _id: contentId,
      barId: bar._id,
    }).lean() as {
      _id: mongoose.Types.ObjectId;
      posterUrl?: string;
      storyCardUrl?: string;
      captions?: {
        feed?: string;
        story?: string;
        facebook?: string;
        tiktok?: string;
        google?: string;
        sms?: string;
      };
      specialIds?: mongoose.Types.ObjectId[];
    } | null;

    if (!content) {
      return NextResponse.json({ error: 'Content not found or access denied' }, { status: 404 });
    }

    // ── Build ZIP ────────────────────────────────────────────────────────────
    // Map GeneratedContent captions to pack format.
    // (feed caption → instagram, story caption ignored — we re-use instagram in both folders)
    const captions = content.captions ?? {};

    let zipBuffer: Buffer;
    try {
      zipBuffer = await buildDownloadPack({
        posterUrl: content.posterUrl,
        storyCardUrl: content.storyCardUrl,
        captions: {
          instagram: captions.feed,
          facebook: captions.facebook,
          tiktok: captions.tiktok,
          google: captions.google,
          sms: captions.sms,
        },
        barName: bar.name ?? 'Your Bar',
      });
    } catch (zipErr) {
      console.error('[api/download] ZIP build error:', zipErr);

      // 8.6 — On ZIP failure: return 500 so client falls back to individual downloads
      return NextResponse.json(
        { error: 'Failed to build ZIP. Use individual file links.' },
        { status: 500 }
      );
    }

    // ── Increment downloadCount ──────────────────────────────────────────────
    // Fire-and-forget — don't block the response
    GeneratedContent.findByIdAndUpdate(contentId, {
      $inc: { downloadCount: 1 },
    }).catch((err: unknown) => {
      console.error('[api/download] Failed to increment downloadCount:', err);
    });

    // ── Return ZIP ───────────────────────────────────────────────────────────
    const safeId = contentId.slice(-6);
    // NextResponse expects BodyInit — convert Buffer to Uint8Array
    return new NextResponse(new Uint8Array(zipBuffer), {
      status: 200,
      headers: {
        'Content-Type': 'application/zip',
        'Content-Disposition': `attachment; filename="tappost-pack-${safeId}.zip"`,
        'Content-Length': String(zipBuffer.byteLength),
      },
    });
  } catch (err) {
    console.error('[api/download] Unexpected error:', err);
    return NextResponse.json({ error: 'Internal server error' }, { status: 500 });
  }
}
