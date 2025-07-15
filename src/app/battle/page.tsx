
'use client';

import { useState, useEffect } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select';
import { Textarea } from '@/components/ui/textarea';
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table';
import { Avatar, AvatarFallback, AvatarImage } from '@/components/ui/avatar';
import { Flame, Swords, History, Clock, Code, User, Trophy, Loader2 } from 'lucide-react';
import type { Student } from '@/lib/types';
import { getAllStudents } from '@/lib/firebase-service';
import { useAuth } from '@/components/auth-provider';
import Link from 'next/link';

// Mock data for battle history
const mockHistory = [
  { id: 1, opponent: 'Olivia Chen', problem: 'Two Sum', result: 'Won', date: '2024-07-22' },
  { id: 2, opponent: 'Benjamin Carter', problem: 'Valid Parentheses', result: 'Lost', date: '2024-07-21' },
  { id: 3, opponent: 'Sophia Rodriguez', problem: 'Merge K Sorted Lists', result: 'Won', date: '2024-07-20' },
];

export default function BattlePage() {
  const { user } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [opponent, setOpponent] = useState<string>('');
  const [difficulty, setDifficulty] = useState<string>('');
  const [loading, setLoading] = useState(true);
  const [isDuelActive, setIsDuelActive] = useState(false);

  useEffect(() => {
    async function fetchStudents() {
      try {
        const studentData = await getAllStudents();
        // Filter out the current user from the list of opponents
        if(user) {
            setStudents(studentData.filter(s => s.id !== user.uid));
        } else {
            setStudents(studentData);
        }
      } catch (error) {
        console.error("Failed to fetch students:", error);
      } finally {
        setLoading(false);
      }
    }
    fetchStudents();
  }, [user]);

  const handleStartDuel = () => {
      if(opponent && difficulty) {
          setIsDuelActive(true);
      }
  }

  if (!user) {
    return (
        <div className="min-h-[calc(100vh-81px)] flex items-center justify-center">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Swords className="h-6 w-6 text-primary" />
                        Code Duels
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p className="text-center text-muted-foreground">You must be signed in to challenge other students.</p>
                    <Button asChild className="mt-4 w-full">
                        <Link href="/login">Sign In</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="container mx-auto px-4 py-8">
      <div className="flex items-center gap-4 mb-8">
        <Swords className="h-10 w-10 text-primary" />
        <h1 className="text-4xl font-bold font-headline">Code Duels</h1>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Left Column: Start & History */}
        <div className="lg:col-span-1 flex flex-col gap-8">
            {/* Start New Duel Card */}
            <Card>
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <Flame className="h-5 w-5" />
                        Start a New Duel
                    </CardTitle>
                    <CardDescription>Challenge a peer to a timed battle.</CardDescription>
                </CardHeader>
                <CardContent className="space-y-4">
                    <div className="space-y-2">
                        <label className="text-sm font-medium">Choose your opponent</label>
                        <Select onValueChange={setOpponent} value={opponent}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select a student..." />
                        </SelectTrigger>
                        <SelectContent>
                            {loading ? (
                                <div className="flex items-center justify-center p-2">
                                    <Loader2 className="h-4 w-4 animate-spin" />
                                </div>
                            ) : (
                                students.map(s => <SelectItem key={s.id} value={s.id}>{s.name}</SelectItem>)
                            )}
                        </SelectContent>
                        </Select>
                    </div>
                     <div className="space-y-2">
                        <label className="text-sm font-medium">Problem Difficulty</label>
                        <Select onValueChange={setDifficulty} value={difficulty}>
                        <SelectTrigger>
                            <SelectValue placeholder="Select difficulty..." />
                        </SelectTrigger>
                        <SelectContent>
                            <SelectItem value="easy">Easy</SelectItem>
                            <SelectItem value="medium">Medium</SelectItem>
                            <SelectItem value="hard">Hard</SelectItem>
                        </SelectContent>
                        </Select>
                    </div>
                    <Button className="w-full" onClick={handleStartDuel} disabled={!opponent || !difficulty || isDuelActive}>
                        <Swords className="mr-2 h-4 w-4" />
                        {isDuelActive ? 'Duel in Progress' : 'Start Battle'}
                    </Button>
                </CardContent>
            </Card>

            {/* Battle History Card */}
            <Card>
                <CardHeader>
                <CardTitle className="flex items-center gap-2">
                    <History className="h-5 w-5" />
                    Battle History
                </CardTitle>
                </CardHeader>
                <CardContent>
                <Table>
                    <TableHeader>
                    <TableRow>
                        <TableHead>Opponent</TableHead>
                        <TableHead>Result</TableHead>
                    </TableRow>
                    </TableHeader>
                    <TableBody>
                    {mockHistory.map((battle) => (
                        <TableRow key={battle.id}>
                        <TableCell>{battle.opponent}</TableCell>
                        <TableCell>
                            <span className={`font-semibold ${battle.result === 'Won' ? 'text-green-500' : 'text-red-500'}`}>
                                {battle.result}
                            </span>
                        </TableCell>
                        </TableRow>
                    ))}
                    </TableBody>
                </Table>
                </CardContent>
            </Card>
        </div>

        {/* Right Column: Ongoing Duel */}
        <div className="lg:col-span-2">
            <Card className="h-full">
                <CardHeader>
                <CardTitle className="flex items-center justify-between">
                    <span className="flex items-center gap-2">
                        <Code className="h-5 w-5" />
                        Ongoing Duel
                    </span>
                    <div className="flex items-center gap-2 text-xl font-mono bg-muted px-3 py-1 rounded-md">
                        <Clock className="h-5 w-5"/>
                        <span>20:00</span>
                    </div>
                </CardTitle>
                <CardDescription>
                    {isDuelActive ? `Solving a ${difficulty} problem against ${students.find(s => s.id === opponent)?.name}.` : "Start a new duel to begin."}
                </CardDescription>
                </CardHeader>
                <CardContent>
                {isDuelActive ? (
                    <div className="space-y-4">
                        <div>
                            <h3 className="font-bold text-lg mb-2">Problem: Find Median from Data Stream</h3>
                            <p className="text-muted-foreground text-sm">
                                The median is the middle value in an ordered integer list. If the size of the list is even, there is no middle value, and the median is the mean of the two middle values. Implement the MedianFinder class.
                            </p>
                        </div>
                        <Textarea
                            placeholder="Your solution here..."
                            className="min-h-[300px] font-mono text-sm bg-background"
                        />
                        <Button className="w-full" size="lg">Submit Solution</Button>
                    </div>
                ) : (
                    <div className="flex flex-col items-center justify-center h-[400px] text-center bg-muted/50 rounded-lg">
                        <Swords className="h-16 w-16 text-muted-foreground/50 mb-4" />
                        <p className="text-muted-foreground">Your battle arena awaits.</p>
                        <p className="text-sm text-muted-foreground/80">Select an opponent and difficulty to start.</p>
                    </div>
                )}
                </CardContent>
            </Card>
        </div>
      </div>
    </div>
  );
}
