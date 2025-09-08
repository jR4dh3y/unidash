
'use client';

import { AddEventForm } from '@/components/add-event-form';
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import {
  Table,
  TableHeader,
  TableRow,
  TableHead,
  TableBody,
  TableCell,
} from "@/components/ui/table";
import { Badge } from '@/components/ui/badge';
import { Loader2, Trash2 } from 'lucide-react';
import type { AppEvent } from '@/lib/types';
import { format } from 'date-fns';
import { useToast } from '@/hooks/use-toast';
import { useMutation } from 'convex/react';
import { api } from 'convex/_generated/api';
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
  AlertDialogTrigger,
} from "@/components/ui/alert-dialog"

interface EventManagementTabProps {
    events: AppEvent[];
    isLoading?: boolean;
}

export function EventManagementTab({ events, isLoading = false }: EventManagementTabProps) {
    const { toast } = useToast();
    const deleteEvent = useMutation(api.events.deleteEvent);

    const handleDelete = async (eventId: string) => {
        try {
            await deleteEvent({ id: eventId });
            toast({
                title: 'Event Deleted',
                description: 'The event has been successfully removed.',
            });
        } catch (error) {
             toast({
                variant: 'destructive',
                title: 'Error',
                description: 'Failed to delete the event.',
            });
        }
    };
    
    return (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mt-4">
            <div className="md:col-span-1">
                <AddEventForm />
            </div>
            <div className="md:col-span-2">
                 <Card>
                    <CardHeader>
                        <CardTitle>All Events</CardTitle>
                        <CardDescription>View and manage all upcoming and past events.</CardDescription>
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
                                <TableHead>Title</TableHead>
                                <TableHead>Date</TableHead>
                                <TableHead>Status</TableHead>
                                <TableHead className="text-right">Actions</TableHead>
                                </TableRow>
                            </TableHeader>
                            <TableBody>
                                {events.map((event) => (
                                    <TableRow key={event.id}>
                                        <TableCell className="font-medium">{event.title}</TableCell>
                                        <TableCell>{format(new Date(event.date), "PPP")}</TableCell>
                                        <TableCell>
                                            <Badge variant={new Date(event.date) > new Date() ? 'default' : 'secondary'}>
                                                {new Date(event.date) > new Date() ? 'Upcoming' : 'Past'}
                                            </Badge>
                                        </TableCell>
                                        <TableCell className="text-right">
                                            <AlertDialog>
                                                <AlertDialogTrigger asChild>
                                                    <Button variant="ghost" size="icon" className="text-destructive hover:text-destructive">
                                                        <Trash2 className="h-4 w-4" />
                                                    </Button>
                                                </AlertDialogTrigger>
                                                <AlertDialogContent>
                                                    <AlertDialogHeader>
                                                    <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
                                                    <AlertDialogDescription>
                                                        This action cannot be undone. This will permanently delete the event.
                                                    </AlertDialogDescription>
                                                    </AlertDialogHeader>
                                                    <AlertDialogFooter>
                                                    <AlertDialogCancel>Cancel</AlertDialogCancel>
                                                    <AlertDialogAction onClick={() => handleDelete(event.id)} className="bg-destructive hover:bg-destructive/90">
                                                        Delete
                                                    </AlertDialogAction>
                                                    </AlertDialogFooter>
                                                </AlertDialogContent>
                                            </AlertDialog>
                                        </TableCell>
                                    </TableRow>
                                ))}
                                {events.length === 0 && (
                                     <TableRow>
                                        <TableCell colSpan={4} className="h-24 text-center">
                                            No events found.
                                        </TableCell>
                                    </TableRow>
                                )}
                            </TableBody>
                        </Table>
                        )}
                    </CardContent>
                </Card>
            </div>
        </div>
    )
}
