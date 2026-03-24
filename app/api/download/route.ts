// Download API — will be implemented in Stage 11
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Download API — not yet implemented' }, { status: 501 });
}
