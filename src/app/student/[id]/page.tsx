
import { getStudentById, getAllStudents } from "@/lib/firebase-service";
import { notFound } from "next/navigation";
import { StudentProfile } from "@/components/student-profile";
import Link from 'next/link';
import { ArrowLeft, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";
import { AuthWidget } from "@/components/auth-widget";
import { getAuthenticatedUser } from "@/lib/auth";

interface StudentPageProps {
  params: {
    id: string;
  };
}

export default async function StudentPage({ params }: StudentPageProps) {
  const student = await getStudentById(params.id);
  const user = await getAuthenticatedUser();

  if (!student) {
    notFound();
  }

  // Calculate rank
  const sortedStudents = await getAllStudents();
  const rank = sortedStudents.findIndex(s => s.id === student.id) + 1;

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
        <StudentProfile student={student} rank={rank} isOwner={isOwner} />
      </main>
    </div>
  );
}

// Generate static paths for all students
export async function generateStaticParams() {
  try {
    const students = await getAllStudents();
    return students.map((student) => ({
      id: student.id,
    }));
  } catch (error) {
    console.error("Failed to generate static params for students:", error);
    return [];
  }
}
