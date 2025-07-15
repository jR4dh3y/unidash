
'use client';

import type { Student } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { BarChart, Bar, XAxis, YAxis, Tooltip, ResponsiveContainer } from 'recharts';
import { Github, Linkedin, Code, FileText, UserCog, Sparkles, Trophy, ListChecks, Edit } from "lucide-react";
import Link from "next/link";
import { Button } from "@/components/ui/button";
import { useMemo } from "react";
import { EditProfileSheet } from "./edit-profile-sheet";
import { Badge } from "./ui/badge";

interface StudentProfileProps {
  student: Student;
  rank: number;
  isOwner: boolean;
}

const sourceIcons: Record<Student['pointsLog'][number]['source'], React.ReactNode> = {
    'LeetCode': <Code className="h-4 w-4 text-muted-foreground" />,
    'Google Form': <FileText className="h-4 w-4 text-muted-foreground" />,
    'Manual Allocation': <UserCog className="h-4 w-4 text-muted-foreground" />,
    'GitHub': <Github className="h-4 w-4 text-muted-foreground" />,
}

function PointsChart({ data }: { data: any[] }) {
    return (
        <ResponsiveContainer width="100%" height={300}>
            <BarChart data={data} margin={{ top: 5, right: 20, left: -10, bottom: 5 }}>
                <XAxis dataKey="name" stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} />
                <YAxis stroke="hsl(var(--muted-foreground))" fontSize={12} tickLine={false} axisLine={false} allowDecimals={false} />
                <Tooltip
                    cursor={{ fill: 'hsl(var(--muted))' }}
                    contentStyle={{ 
                        background: 'hsl(var(--background))',
                        borderColor: 'hsl(var(--border))',
                        borderRadius: 'var(--radius)',
                    }}
                />
                <Bar dataKey="points" fill="hsl(var(--primary))" radius={[4, 4, 0, 0]} />
            </BarChart>
        </ResponsiveContainer>
    );
}

export function StudentProfile({ student, rank, isOwner }: StudentProfileProps) {
  const sortedPointsLog = useMemo(() => 
    student.pointsLog 
      ? [...student.pointsLog].sort((a, b) => new Date(b.date).getTime() - new Date(a.date).getTime())
      : [],
    [student.pointsLog]);

  const pointsBySource = useMemo(() => {
    const sourceMap: { [key: string]: number } = {};
    for (const log of student.pointsLog) {
      if (!sourceMap[log.source]) {
        sourceMap[log.source] = 0;
      }
      sourceMap[log.source] += log.points;
    }
    return Object.entries(sourceMap).map(([name, points]) => ({ name, points }));
  }, [student.pointsLog]);

  return (
    <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
      
      {/* Left Column - Profile & Stats */}
      <div className="lg:col-span-1 flex flex-col gap-6">
        <Card className="shadow-lg border-none sticky top-8 dark:bg-gray-800">
          <CardContent className="pt-6 flex flex-col items-center text-center relative">
            {isOwner && (
                <EditProfileSheet student={student}>
                    <Button variant="outline" size="icon" className="absolute top-4 right-4 h-8 w-8">
                        <Edit className="h-4 w-4" />
                        <span className="sr-only">Edit Profile</span>
                    </Button>
                </EditProfileSheet>
            )}
            <Avatar className="w-32 h-32 mb-4 border-4 border-primary/20">
              <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
              <AvatarFallback className="text-4xl">
                {student.name.charAt(0)}
              </AvatarFallback>
            </Avatar>
            <h2 className="text-2xl font-bold font-headline">{student.name}</h2>
            
             <div className="flex items-center gap-2 mt-2 mb-4 text-muted-foreground">
                <Sparkles className="h-5 w-5 text-accent" />
                <span className="font-semibold text-lg text-foreground">{student.totalPoints.toLocaleString()} Total Points</span>
            </div>

            <div className="flex gap-4">
                {student.github && (
                  <Button asChild variant="ghost" size="icon">
                      <Link href={student.github} target="_blank" rel="noopener noreferrer" aria-label={`${student.name}'s Github Profile`}>
                          <Github className="h-5 w-5" />
                      </Link>
                  </Button>
                )}
                {student.linkedin && (
                  <Button asChild variant="ghost" size="icon">
                      <Link href={student.linkedin} target="_blank" rel="noopener noreferrer" aria-label={`${student.name}'s LinkedIn Profile`}>
                          <Linkedin className="h-5 w-5" />
                      </Link>
                  </Button>
                )}
            </div>
          </CardContent>
        </Card>
        
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium">Rank</CardTitle>
                 <Trophy className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">#{rank}</div>
            </CardContent>
        </Card>
        <Card>
            <CardHeader className="flex flex-row items-center justify-between pb-2">
                 <CardTitle className="text-sm font-medium">Total Submissions</CardTitle>
                 <ListChecks className="h-4 w-4 text-muted-foreground" />
            </CardHeader>
            <CardContent>
                <div className="text-2xl font-bold">{student.pointsLog.length}</div>
            </CardContent>
        </Card>
      </div>

      {/* Right Column - Charts & History */}
      <div className="lg:col-span-3 flex flex-col gap-6">
        <Card className="shadow-lg border-none dark:bg-gray-800">
            <CardHeader>
                <CardTitle>Points by Source</CardTitle>
                <CardDescription>Distribution of points earned from different activities.</CardDescription>
            </CardHeader>
            <CardContent>
                 {pointsBySource.length > 0 ? (
                    <PointsChart data={pointsBySource} />
                 ) : (
                    <div className="flex items-center justify-center h-[300px] text-muted-foreground">
                        No data to display.
                    </div>
                 )}
            </CardContent>
        </Card>

        <Card className="shadow-lg border-none dark:bg-gray-800">
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
                {sortedPointsLog.map((log, index) => (
                  <TableRow key={log.id || index}>
                    <TableCell className="text-muted-foreground whitespace-nowrap">{new Date(log.date).toLocaleDateString()}</TableCell>
                    <TableCell className="font-medium">{log.description}</TableCell>
                    <TableCell>
                        <div className="flex items-center gap-2">
                            {log.source && sourceIcons[log.source]}
                            <span className="hidden sm:inline">{log.source}</span>
                        </div>
                    </TableCell>
                    <TableCell className="text-right">
                        <Badge variant="secondary" className="bg-accent/20 text-accent-foreground hover:bg-accent/30 dark:text-white">
                            {log.points > 0 ? '+' : ''}{log.points}
                        </Badge>
                    </TableCell>
                  </TableRow>
                ))}
                 {sortedPointsLog.length === 0 && (
                    <TableRow>
                        <TableCell colSpan={4} className="h-24 text-center">
                            No point history found.
                        </TableCell>
                    </TableRow>
                )}
              </TableBody>
            </Table>
          </CardContent>
        </Card>
      </div>
    </div>
  );
}
