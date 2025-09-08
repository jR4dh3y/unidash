import { NextRequest, NextResponse } from 'next/server';

export async function DELETE(
  _req: NextRequest,
  { params }: { params: { id: string } }
) {
  return NextResponse.json({ error: 'Replaced by Convex (events.deleteEvent).' }, { status: 410 });
}
