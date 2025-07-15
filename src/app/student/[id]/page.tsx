
'use client';

import { useEffect, useState } from 'react';
import { getStudentById, getAllStudents } from "@/lib/firebase-service";
import { notFound, useParams } from "next/navigation";
import { StudentProfile } from "@/components/student-profile";
import Link from 'next/link';
import { ArrowLeft, Loader2 } from "lucide-react";
import { Button } from "@/components/ui/button";
import { useAuth } from "@/components/auth-provider";
import type { Student } from '@/lib/types';

export default function StudentPage() {
  const { user } = useAuth();
  const params = useParams();
  const studentId = params.id as string;

  const [student, setStudent] = useState<Student | null>(null);
  const [rank, setRank] = useState<number | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
      if (!studentId) return;
      try {
        const studentData = await getStudentById(studentId);
        if (!studentData) {
          notFound();
          return;
        }

        const allStudents = await getAllStudents();
        const studentRank = allStudents.findIndex(s => s.id === studentData.id) + 1;
        
        setStudent(studentData);
        setRank(studentRank);

      } catch (error) {
        console.error("Failed to fetch student data:", error);
        // Optionally, set an error state here to show an error message
      } finally {
        setLoading(false);
      }
    }

    fetchData();
  }, [studentId]);

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

  const isOwner = user?.uid === student.id;

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
