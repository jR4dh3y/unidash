
"use client";

import { useState, useMemo, createElement } from "react";
import type { Student, Badge as BadgeType } from "@/lib/types";
import { Input } from "@/components/ui/input";
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Search, Trophy, Sparkles, Sword, Flame, BrainCircuit, CalendarCheck } from "lucide-react";
import Link from "next/link";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Tooltip, TooltipContent, TooltipProvider, TooltipTrigger } from "@/components/ui/tooltip";
import * as LucideIcons from "lucide-react";

interface LeaderboardProps {
  students: Student[];
}

const iconMap: { [key: string]: React.ElementType } = {
  Sword: Sword,
  Flame: Flame,
  Trophy: Trophy,
  BrainCircuit: BrainCircuit,
  CalendarCheck: CalendarCheck,
  // Add other icons you might use here
};


const BadgeIcon = ({ name, ...props }: { name: string, className?: string }) => {
  const IconComponent = iconMap[name];
  if (!IconComponent) return null; // Or return a default icon
  return createElement(IconComponent, props);
};


export function Leaderboard({ students }: LeaderboardProps) {
  const [searchTerm, setSearchTerm] = useState("");

  const filteredStudents = useMemo(() => {
    return students.filter((student) =>
      student.name.toLowerCase().includes(searchTerm.toLowerCase())
    );
  }, [students, searchTerm]);

  const getRankIndicator = (rank: number) => {
    if (rank === 1)
      return <Trophy className="h-5 w-5 text-yellow-500" />;
    if (rank === 2)
      return <Trophy className="h-5 w-5 text-gray-400" />;
    if (rank === 3)
      return <Trophy className="h-5 w-5 text-amber-700" />;
    return <span className="text-muted-foreground">{rank}</span>;
  };

  return (
    <Card className="h-full flex flex-col transition-all duration-300">
      <CardHeader>
        <div className="flex flex-col md:flex-row md:items-center md:justify-between gap-4">
          <CardTitle className="text-2xl font-headline">Student Leaderboard</CardTitle>
          <div className="relative w-full md:w-auto">
            <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground" />
            <Input
              type="search"
              placeholder="Search students..."
              className="pl-9"
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              aria-label="Search students"
            />
          </div>
        </div>
      </CardHeader>
      <CardContent className="flex-grow">
        <TooltipProvider>
          <div className="overflow-x-auto">
            <Table>
              <TableHeader>
                <TableRow>
                  <TableHead className="w-16 text-center">Rank</TableHead>
                  <TableHead>Student</TableHead>
                  <TableHead className="text-right">Points</TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredStudents.map((student, index) => (
                  <TableRow key={student.id} className="transition-transform duration-200 hover:shadow-md hover:-translate-y-1">
                    <TableCell className="font-bold text-center">
                      <div className="flex justify-center items-center">
                        {getRankIndicator(students.findIndex(s => s.id === student.id) + 1)}
                      </div>
                    </TableCell>
                    <TableCell>
                      <Link href={`/student/${student.id}`} className="flex items-center gap-4 group cursor-pointer">
                        <Avatar>
                          <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                          <AvatarFallback>
                            {student.name.charAt(0)}
                          </AvatarFallback>
                        </Avatar>
                        <div className="flex flex-col">
                           <span className="font-medium group-hover:text-primary transition-colors">{student.name}</span>
                           <div className="flex items-center gap-1.5 mt-1">
                            {(student.achievements || []).slice(0, 4).map((badge) => (
                                <Tooltip key={badge.id}>
                                    <TooltipTrigger>
                                        <BadgeIcon name={badge.icon} className="h-4 w-4 text-muted-foreground group-hover:text-primary/80 transition-colors" />
                                    </TooltipTrigger>
                                    <TooltipContent>
                                        <p className="font-semibold">{badge.name}</p>
                                        <p className="text-xs text-muted-foreground">{badge.description}</p>
                                    </TooltipContent>
                                </Tooltip>
                            ))}
                           </div>
                        </div>
                      </Link>
                    </TableCell>
                    <TableCell className="text-right font-semibold text-primary flex justify-end items-center gap-2">
                      <Sparkles className="h-4 w-4 text-accent" />
                      {student.totalPoints.toLocaleString()}
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>
          </div>
        </TooltipProvider>
        {filteredStudents.length === 0 && (
          <div className="text-center py-12 text-muted-foreground">
            <p>No students found.</p>
          </div>
        )}
      </CardContent>
    </Card>
  );
}
