import { NextRequest, NextResponse } from 'next/server';

export async function GET() {
  return NextResponse.json({ error: 'Replaced by Convex (students.getAllStudents).' }, { status: 410 });
}

export async function POST(_req: NextRequest) {
  return NextResponse.json({ error: 'Replaced by Convex (students mutations).' }, { status: 410 });
}
