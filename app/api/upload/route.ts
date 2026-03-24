/**
 * POST /api/upload
 *
 * Accepts a multipart/form-data request with a single `file` field.
 * Uploads the file to Cloudinary (or stub) and returns the URL.
 *
 * Request body (multipart): { file: File, folder?: string }
 * Response:                 { url: string }
 */

import { NextRequest, NextResponse } from 'next/server';
import { getServerSession } from 'next-auth';
import { authOptions } from '@/lib/auth';
import { uploadBuffer } from '@/lib/cloudinary/upload';

export async function POST(request: NextRequest) {
  // ── Auth guard ──────────────────────────────────────────────────────────────
  const session = await getServerSession(authOptions);
  if (!session?.user) {
    return NextResponse.json({ error: 'Unauthorized' }, { status: 401 });
  }

  // ── Parse multipart form ────────────────────────────────────────────────────
  let formData: FormData;
  try {
    formData = await request.formData();
  } catch {
    return NextResponse.json(
      { error: 'Invalid multipart form data' },
      { status: 400 }
    );
  }

  const file = formData.get('file') as File | null;
  if (!file) {
    return NextResponse.json(
      { error: 'No file provided. Expected a "file" field.' },
      { status: 400 }
    );
  }

  // Validate file type
  if (!file.type.startsWith('image/')) {
    return NextResponse.json(
      { error: 'Only image files are supported.' },
      { status: 400 }
    );
  }

  // Validate file size (max 10 MB)
  const MAX_SIZE = 10 * 1024 * 1024;
  if (file.size > MAX_SIZE) {
    return NextResponse.json(
      { error: 'File too large. Maximum size is 10 MB.' },
      { status: 400 }
    );
  }

  // ── Derive upload folder ────────────────────────────────────────────────────
  const folder =
    (formData.get('folder') as string | null) ?? 'tappost/uploads';

  const filename = file.name.replace(/[^a-zA-Z0-9._-]/g, '_');

  // ── Convert to Buffer and upload ────────────────────────────────────────────
  try {
    const arrayBuffer = await file.arrayBuffer();
    const buffer = Buffer.from(arrayBuffer);

    const url = await uploadBuffer(buffer, { folder, filename });

    return NextResponse.json({ url }, { status: 200 });
  } catch (err) {
    console.error('[POST /api/upload] Upload failed:', err);
    return NextResponse.json(
      { error: 'Upload failed. Please try again.' },
      { status: 500 }
    );
  }
}
