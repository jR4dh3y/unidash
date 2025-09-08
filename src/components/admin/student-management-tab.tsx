
'use client';

import { useState } from 'react';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Loader2, Award } from 'lucide-react';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import {
  Dialog,
  DialogContent,
  DialogDescription,
  DialogFooter,
  DialogHeader,
  DialogTitle,
  DialogTrigger,
  DialogClose
} from "@/components/ui/dialog"
import { Label } from '../ui/label';

interface StudentManagementTabProps {
    students: Student[];
    isLoading?: boolean;
}

function AwardPointsDialog({ student }: { student: Student }) {
    const awardPoints = useMutation(api.students.awardPoints);
    const [points, setPoints] = useState(0);
    const [reason, setReason] = useState('');
    const [isSaving, setIsSaving] = useState(false);
    const [isOpen, setIsOpen] = useState(false);
    const { toast } = useToast();

    const handleAwardPoints = async () => {
        if (!points || !reason) {
            toast({
                variant: 'destructive',
                title: 'Missing Information',
                description: 'Please provide points and a reason.'
            });
            return;
        }

        setIsSaving(true);
        try {
            await awardPoints({ id: student.id, points: Number(points), reason });
            toast({
                title: 'Points Awarded!',
                description: `${student.name} received ${points} points.`
            });
            setIsOpen(false); // Close dialog on success
            setPoints(0);
            setReason('');
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to award points.',
            });
        } finally {
            setIsSaving(false);
        }
    };
    
    return (
        <Dialog open={isOpen} onOpenChange={setIsOpen}>
            <DialogTrigger asChild>
                <Button variant="outline" size="sm">
                    <Award className="mr-2 h-4 w-4" />
                    Award Points
                </Button>
            </DialogTrigger>
            <DialogContent className="sm:max-w-[425px]">
                <DialogHeader>
                    <DialogTitle>Award Points to {student.name}</DialogTitle>
                    <DialogDescription>
                        Manually add or remove points. Use negative numbers to subtract.
                    </DialogDescription>
                </DialogHeader>
                 <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="points" className="text-right">Points</Label>
                        <Input
                            id="points"
                            type="number"
                            value={points}
                            onChange={(e) => setPoints(Number(e.target.value))}
                            className="col-span-3"
                        />
                    </div>
                     <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="reason" className="text-right">Reason</Label>
                        <Input
                            id="reason"
                            value={reason}
                            onChange={(e) => setReason(e.target.value)}
                            placeholder="e.g., Won hackathon"
                            className="col-span-3"
                        />
                    </div>
                </div>
                <DialogFooter>
                    <DialogClose asChild>
                        <Button variant="outline">Cancel</Button>
                    </DialogClose>
                    <Button onClick={handleAwardPoints} disabled={isSaving}>
                        {isSaving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                        Confirm Award
                    </Button>
                </DialogFooter>
            </DialogContent>
        </Dialog>
    );
}

export function StudentManagementTab({ students, isLoading = false }: StudentManagementTabProps) {
    
    return (
        <div className="mt-4">
            <Card>
                <CardHeader>
                    <CardTitle>All Students</CardTitle>
                    <CardDescription>View and manage all registered students.</CardDescription>
                </CardHeader>
                <CardContent>
                    {isLoading ? (
                         <div className="flex justify-center items-center h-48">
                            <Loader2 className="h-8 w-8 animate-spin text-primary" />
                        </div>
                    ) : (
                    <Table>
                        <TableHeader>
                            <TableRow>
                            <TableHead>Student</TableHead>
                            <TableHead>Total Points</TableHead>
                            <TableHead className="text-right">Actions</TableHead>
                            </TableRow>
                        </TableHeader>
                        <TableBody>
                            {students.map((student) => (
                                <TableRow key={student.id}>
                                    <TableCell>
                                        <div className="flex items-center gap-4">
                                            <Avatar>
                                                <AvatarImage src={student.avatar} alt={student.name} data-ai-hint="person portrait" />
                                                <AvatarFallback>
                                                {student.name.charAt(0)}
                                                </AvatarFallback>
                                            </Avatar>
                                            <span className="font-medium">{student.name}</span>
                                        </div>
                                    </TableCell>
                                    <TableCell>{student.totalPoints.toLocaleString()}</TableCell>
                                    <TableCell className="text-right">
                                        <AwardPointsDialog student={student} />
                                    </TableCell>
                                </TableRow>
                            ))}
                             {students.length === 0 && (
                                <TableRow>
                                    <TableCell colSpan={3} className="h-24 text-center">
                                        No students found.
                                    </TableCell>
                                </TableRow>
                            )}
                        </TableBody>
                    </Table>
                    )}
                </CardContent>
            </Card>
        </div>
    )
}
