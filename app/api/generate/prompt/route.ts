// Image prompt generation API — will be implemented in Stage 9
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Prompt generation API — not yet implemented' }, { status: 501 });
}
