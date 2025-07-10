import { getAllStudents, getStudentById } from "@/lib/firebase-service";
import { notFound } from "next/navigation";
import { StudentProfile } from "@/components/student-profile";
import Link from 'next/link';
import { ArrowLeft, Medal } from "lucide-react";
import { Button } from "@/components/ui/button";

interface StudentPageProps {
  params: {
    id: string;
  };
}

export default async function StudentPage({ params }: StudentPageProps) {
  const student = await getStudentById(params.id);

  if (!student) {
    notFound();
  }

  // Calculate rank
  const sortedStudents = await getAllStudents();
  const rank = sortedStudents.findIndex(s => s.id === student.id) + 1;

  return (
    <div className="min-h-screen bg-background text-foreground">
       <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
             <Medal className="h-8 w-8 text-primary" />
             <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-800">
                Nexus Academicus
             </h1>
          </Link>
          <Button asChild variant="outline">
            <Link href="/">
              <ArrowLeft className="mr-2 h-4 w-4" />
              Back to Leaderboard
            </Link>
          </Button>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 pb-12">
        <StudentProfile student={student} rank={rank} />
      </main>
    </div>
  );
}

// Generate static paths for all students
export async function generateStaticParams() {
  const students = await getAllStudents();
  return students.map((student) => ({
    id: student.id,
  }));
}
