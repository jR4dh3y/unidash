import type { Student } from "@/lib/types";
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Badge } from "@/components/ui/badge";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Github, Linkedin, Code, FileText, UserCog, Sparkles } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";

interface StudentProfileProps {
  student: Student;
  rank: number;
}

const sourceIcons: Record<Student['pointsLog'][number]['source'], React.ReactNode> = {
    'LeetCode': <Code className="h-4 w-4 text-muted-foreground" />,
    'Google Form': <FileText className="h-4 w-4 text-muted-foreground" />,
    'Manual Allocation': <UserCog className="h-4 w-4 text-muted-foreground" />,
    'GitHub': <Github className="h-4 w-4 text-muted-foreground" />,
}

export function StudentProfile({ student, rank }: StudentProfileProps) {
  return (
    <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
      <div className="lg:col-span-1">
        <Card className="shadow-lg border-none sticky top-8">
          <CardContent className="pt-6 flex flex-col items-center text-center">
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-4xl">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">{student.name}</h2>
            <div className="flex flex-col sm:flex-row items-center gap-2 sm:gap-4 mt-2 mb-4 text-muted-foreground">
                <div className="flex items-center gap-1">
                    <Sparkles className="h-4 w-4 text-accent" />
                    <span className="font-semibold text-lg text-foreground">{student.totalPoints.toLocaleString()} Points</span>
                </div>
                <div className="text-lg hidden sm:block">•</div>
                <div className="font-semibold text-lg text-foreground">Rank #{rank}</div>
            </div>
            <div className="flex gap-4">
                <Button asChild variant="ghost" size="icon">
                    <Link href={student.github} target="_blank" rel="noopener noreferrer" aria-label={`${student.name}'s Github Profile`}>
                        <Github className="h-5 w-5" />
                    </Link>
                </Button>
                <Button asChild variant="ghost" size="icon">
                    <Link href={student.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${student.name}'s LinkedIn Profile`}>
                        <Linkedin className="h-5 w-5" />
                    </Link>
                </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      <div className="lg:col-span-2">
        <Card className="shadow-lg border-none">
          <CardHeader>
            <CardTitle>Point History</CardTitle>
            <CardDescription>A log of all points earned.</CardDescription>
          </CardHeader>
          <CardContent>
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead>Date</TableHead>
                  <TableHead>Description</TableHead>
                  <TableHead>Source</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {student.pointsLog.map((log) => (
                  <TableRow key={log.id}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{log.date}</TableCell>
                    <TableCell className="font-medium">{log.description}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {sourceIcons[log.source]}
                            <span className="hidden sm:inline">{log.source}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30">
                            {log.points > 0 ? '+' : ''}{log.points}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
