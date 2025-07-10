import { Leaderboard } from "@/components/leaderboard";
import { getAllStudents } from "@/lib/firebase-service";
import type { Student } from "@/lib/types";
import { Medal } from "lucide-react";

export default async function Home() {
  const sortedStudents: Student[] = await getAllStudents();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center gap-3">
          <Medal className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-800">
            Nexus Academicus
          </h1>
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 pb-12">
        <Leaderboard students={sortedStudents} />
      </main>
    </div>
  );
}
