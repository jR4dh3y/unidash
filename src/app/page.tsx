
import { Leaderboard } from "@/components/leaderboard";
import { getAllStudents, getUpcomingEvents } from "@/lib/firebase-service";
import type { Student, AppEvent } from "@/lib/types";
import { Medal, Calendar, MapPin, ExternalLink, Code } from "lucide-react";
import { AuthWidget } from "@/components/auth-widget";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import Link from "next/link";
import { format } from "date-fns";
import { getDailyProblem } from "@/lib/leetcode";
import { Badge } from "@/components/ui/badge";

async function UpcomingEvents() {
  const events: AppEvent[] = await getUpcomingEvents();

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
    <Card>
      <CardHeader>
        <CardTitle className="text-2xl font-headline flex items-center gap-2">
          <Calendar className="h-6 w-6 text-primary" />
          Upcoming Events
        </CardTitle>
      </CardHeader>
      <CardContent>
        <div className="grid gap-6">
          {events.map((event) => (
            <div key={event.id} className="flex flex-col sm:flex-row gap-4 items-start p-4 rounded-lg bg-muted/50">
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

async function LeetCodeCard() {
    const dailyProblem = await getDailyProblem();

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
        <Card className="flex flex-col h-full">
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


export default async function Home() {
  const sortedStudents: Student[] = await getAllStudents();

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Nexus Academicus
            </h1>
          </div>
          <AuthWidget />
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 pb-12">
        <div className="flex flex-col gap-8">
          <div>
            <Leaderboard students={sortedStudents} />
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
