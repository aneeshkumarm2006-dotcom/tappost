// Specials API — will be implemented in Stage 6
import { NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ message: 'Specials API — not yet implemented' }, { status: 501 });
}

export async function POST() {
  return NextResponse.json({ message: 'Specials API — not yet implemented' }, { status: 501 });
}
