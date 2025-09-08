
'use client';

import { useEffect, useState } from 'react';
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import { notFound, useParams } from "next/navigation";
import { StudentProfile } from "@/components/student-profile";
import Link from 'next/link';
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useUser } from '@clerk/nextjs';
import type { Student } from '@/lib/types';

export default function StudentPage() {
  const { user } = useUser();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  const studentData = useQuery(api.students.getStudentById, studentId ? { id: studentId } : 'skip');
  const allStudents = useQuery(api.students.getAllStudents);
  useEffect(() => {
    if (!studentId || studentData === undefined || allStudents === undefined) return;
    if (!studentData) {
      notFound();
      return;
    }
    const r = allStudents.findIndex((s: Student) => s.id === studentData.id) + 1;
    setStudent(studentData as Student);
    setRank(r);
    setLoading(false);
  }, [studentId, studentData, allStudents]);

  if (loading) {
    return (
      <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
        <Loader2 className="h-8 w-8 animate-spin" />
      </div>
    );
  }

  if (!student) {
    // This can be replaced with a more user-friendly error component
    return notFound();
  }

  const isOwner = user?.id === student.id;

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
      <main className="container mx-auto px-4 md:px-8 pb-12 pt-8">
        <div className="mb-6">
             <Button asChild variant="outline">
              <Link href="/">
                <ArrowLeft className="mr-2 h-4 w-4" />
                Back to Leaderboard
              </Link>
            </Button>
        </div>
        {rank !== null && <StudentProfile student={student} rank={rank} isOwner={isOwner} />}
      </main>
    </div>
  );
}
