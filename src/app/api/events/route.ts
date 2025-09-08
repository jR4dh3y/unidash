import { NextRequest, NextResponse } from 'next/server';

export async function GET(_req: NextRequest) {
  return NextResponse.json({ error: 'Replaced by Convex (events.getAllEvents).' }, { status: 410 });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'Replaced by Convex (events.addEvent).' }, { status: 410 });
}
