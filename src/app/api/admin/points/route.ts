import { NextRequest, NextResponse } from 'next/server';

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'Replaced by Convex (students.awardPoints).' }, { status: 410 });
}
