// Image generation API — will be implemented in Stage 10
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Image generation API — not yet implemented' }, { status: 501 });
}
