import { NextResponse, type NextRequest } from 'next/server';

// Deprecated Firebase session endpoints. Keep as 410 to avoid breaking links.
export async function POST(_request: NextRequest) {
  return NextResponse.json({ error: 'Deprecated. Use Clerk/Convex auth.' }, { status: 410 });
}

export async function DELETE(_request: NextRequest) {
  return NextResponse.json({ error: 'Deprecated. Use Clerk/Convex auth.' }, { status: 410 });
}
