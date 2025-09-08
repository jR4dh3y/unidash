import { NextResponse } from 'next/server';

// Deprecated: Replaced by Convex (students.seedDatabase)
export async function POST() {
  return NextResponse.json({ error: 'Replaced by Convex (students.seedDatabase).' }, { status: 410 });
}
