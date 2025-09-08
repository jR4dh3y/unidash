
'use client';

import { useState, useEffect } from 'react';
import { Leaderboard } from "@/components/leaderboard";
import { useQuery } from 'convex/react';
import { api } from 'convex/_generated/api';
import type { Student, AppEvent, LeetCodeDailyProblem } from "@/lib/types";
import { Calendar, MapPin, ExternalLink, Code, Loader2 } from "lucide-react";
import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getDailyProblemAction } from "@/lib/actions";
import { Badge } from "@/components/ui/badge";
import { Skeleton } from '@/components/ui/skeleton';

function UpcomingEvents() {
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [loading, setLoading] = useState(true);

  const eventsData = useQuery(api.events.getAllEvents);
  useEffect(() => {
    if (eventsData === undefined) return;
    setEvents(eventsData || []);
    setLoading(false);
  }, [eventsData]);

  if (loading) {
    return (
       <Card>
        <CardHeader>
          <CardTitle className="text-2xl font-headline flex items-center gap-2">
            <Calendar className="h-6 w-6 text-primary" />
            Upcoming Events
          </CardTitle>
        </CardHeader>
        <CardContent className="space-y-4">
            <Skeleton className="h-24 w-full" />
            <Skeleton className="h-24 w-full" />
        </CardContent>
      </Card>
    )
  }

  if (events.length === 0) {
    return (
        <Card className="h-full">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <Calendar className="h-6 w-6 text-primary" />
                    Upcoming Events
                </CardTitle>
            </CardHeader>
            <CardContent>
                <div className="flex items-center justify-center h-48 text-muted-foreground">
                    <p>No upcoming events.</p>
                </div>
            </CardContent>
        </Card>
    );
  }

  return (
    <Card className="transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col sm:flex-row gap-4 items-start p-4 rounded-lg bg-muted/50 transition-colors hover:bg-muted/90">
              <div className="flex-shrink-0 w-full sm:w-28 text-center sm:text-left">
                <div className="text-lg font-bold text-primary">
                  {format(new Date(event.date), "MMM")}
                </div>
                <div className="text-4xl font-bold">
                  {format(new Date(event.date), "dd")}
                </div>
                <div className="text-sm text-muted-foreground">
                  {format(new Date(event.date), "eeee")}
                </div>
              </div>
              <div className="flex-grow">
                <h3 className="text-xl font-bold">{event.title}</h3>
                <p className="text-muted-foreground mt-1">{event.description}</p>
                 <div className="flex items-center gap-4 mt-3 text-sm">
                    {event.location && (
                        <div className="flex items-center gap-2">
                            <MapPin className="h-4 w-4" />
                            <span>{event.location}</span>
                        </div>
                    )}
                    {event.link && (
                        <Button asChild variant="link" className="p-0 h-auto">
                            <Link href={event.link} target="_blank" rel="noopener noreferrer">
                                More Info
                                <ExternalLink className="ml-2 h-4 w-4" />
                            </Link>
                        </Button>
                    )}
                 </div>
              </div>
            </div>
          ))}
        </div>
      </CardContent>
    </Card>
  );
}

function LeetCodeCard() {
    const [dailyProblem, setDailyProblem] = useState<LeetCodeDailyProblem | null>(null);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        async function fetchProblem() {
            try {
                const problem = await getDailyProblemAction();
                setDailyProblem(problem);
            } catch (error) {
                console.error("Failed to fetch LeetCode problem:", error);
            } finally {
                setLoading(false);
            }
        }
        fetchProblem();
    }, []);

    if (loading) {
        return (
            <Card className="flex flex-col h-full">
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <Code className="h-6 w-6 text-primary" />
                        Today's LeetCode Problem
                    </CardTitle>
                </CardHeader>
                <CardContent className="flex flex-col flex-grow items-center justify-center">
                    <Skeleton className="h-8 w-3/4 mb-4" />
                    <Skeleton className="h-6 w-1/4" />
                    <Skeleton className="h-10 w-full mt-6" />
                </CardContent>
            </Card>
        )
    }

    if (!dailyProblem) {
        return (
             <Card>
                <CardHeader>
                    <CardTitle className="text-2xl font-headline flex items-center gap-2">
                        <Code className="h-6 w-6 text-primary" />
                        Today's LeetCode Problem
                    </CardTitle>
                </CardHeader>
                <CardContent>
                     <div className="flex items-center justify-center h-48 text-muted-foreground">
                        <p>Could not load problem.</p>
                    </div>
                </CardContent>
            </Card>
        );
    }
    
    const { question } = dailyProblem;
    const difficultyColors: {[key: string]: string} = {
        "Easy": "bg-green-500/20 text-green-500 border-green-500/50",
        "Medium": "bg-yellow-500/20 text-yellow-500 border-yellow-500/50",
        "Hard": "bg-red-500/20 text-red-500 border-red-500/50",
    }

    return (
        <Card className="flex flex-col h-full transition-all duration-300 hover:shadow-lg hover:-translate-y-1">
            <CardHeader>
                <CardTitle className="text-2xl font-headline flex items-center gap-2">
                    <Code className="h-6 w-6 text-primary" />
                    Today's LeetCode Problem
                </CardTitle>
            </CardHeader>
            <CardContent className="flex flex-col flex-grow">
                 <div className="flex flex-col items-center justify-center text-center flex-grow">
                    <h3 className="text-xl font-bold mb-2">{question.title}</h3>
                    <Badge variant="outline" className={difficultyColors[question.difficulty]}>
                        {question.difficulty}
                    </Badge>
                </div>
                <Button asChild className="mt-6 w-full">
                    <Link href={`https://leetcode.com${dailyProblem.link}`} target="_blank" rel="noopener noreferrer">
                        Solve Problem
                        <ExternalLink className="ml-2 h-4 w-4" />
                    </Link>
                </Button>
            </CardContent>
        </Card>
    );
}

function MainLeaderboard() {
  const [students, setStudents] = useState<Student[]>([]);
  const [loading, setLoading] = useState(true);
  const studentsData = useQuery(api.students.getAllStudents) as Student[] | undefined;
  useEffect(() => {
    if (studentsData === undefined) return;
    setStudents(studentsData || []);
    setLoading(false);
  }, [studentsData]);

  if (loading) {
     return (
        <Card>
            <CardHeader>
                <Skeleton className="h-8 w-1/3" />
            </CardHeader>
            <CardContent>
                <div className="space-y-4">
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                    <Skeleton className="h-12 w-full" />
                </div>
            </CardContent>
        </Card>
     )
  }

  return <Leaderboard students={students} />;
}

export default function Home() {
  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 md:px-8 pb-12 pt-8">
        <div className="flex flex-col gap-8">
          <div>
            <MainLeaderboard />
          </div>
          <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
            <div className="lg:col-span-2">
              <UpcomingEvents />
            </div>
            <div>
              <LeetCodeCard />
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
