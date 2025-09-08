import { NextResponse } from 'next/server';

// Deprecated: Replaced by Convex functions (students.getStudentById, students.updateStudentProfile)
export async function GET() {
  return NextResponse.json({ error: 'Replaced by Convex (students.getStudentById).' }, { status: 410 });
}

export async function PATCH() {
  return NextResponse.json({ error: 'Replaced by Convex (students.updateStudentProfile).' }, { status: 410 });
}
