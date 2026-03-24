// Stripe webhook — will be implemented in Stage 14
import { NextResponse } from 'next/server';

export async function POST() {
  return NextResponse.json({ message: 'Stripe webhook — not yet implemented' }, { status: 501 });
}
