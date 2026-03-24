// Caption generation API — will be implemented in Stage 8
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Caption generation API — not yet implemented' }, { status: 501 });
}
