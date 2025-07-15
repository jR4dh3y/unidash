
'use client';

import { AuthWidget } from '@/components/auth-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { ShieldAlert, Loader2 } from 'lucide-react';
import Link from 'next/link';
import { Button } from '@/components/ui/button';
import { useAuth } from '@/components/auth-provider';
import { EventManagementTab } from '@/components/admin/event-management-tab';
import { StudentManagementTab } from '@/components/admin/student-management-tab';
import { useEffect, useState } from 'react';
import type { Student, AppEvent } from '@/lib/types';
import { getAllStudents, getAllEvents } from '@/lib/firebase-service';


const ADMIN_UID = 'IMZ23UOOblMG1Dm6HDF4Hf7UOvK2'; 

export default function AdminPage() {
  const { user, loading } = useAuth();
  const [students, setStudents] = useState<Student[]>([]);
  const [events, setEvents] = useState<AppEvent[]>([]);
  const [dataLoading, setDataLoading] = useState(true);

  useEffect(() => {
    async function fetchData() {
        if(user?.uid === ADMIN_UID) {
            try {
                setDataLoading(true);
                const [studentData, eventData] = await Promise.all([
                    getAllStudents(),
                    getAllEvents()
                ]);
                setStudents(studentData);
                setEvents(eventData);
            } catch (error) {
                console.error("Failed to fetch admin data:", error);
            } finally {
                setDataLoading(false);
            }
        }
    }
    if (!loading) {
        fetchData();
    }
  }, [user, loading]);


  if (loading) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <Loader2 className="h-8 w-8 animate-spin" />
        </div>
    );
  }

  if (!user || user.uid !== ADMIN_UID) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center p-4">
            <Card className="w-full max-w-md mx-auto">
                <CardHeader>
                    <CardTitle className="flex items-center gap-2">
                        <ShieldAlert className="h-6 w-6 text-destructive" />
                        Access Denied
                    </CardTitle>
                </CardHeader>
                <CardContent>
                    <p>You do not have permission to view this page. Please sign in as an administrator.</p>
                    <Button asChild className="mt-4 w-full">
                        <Link href="/">Return to Homepage</Link>
                    </Button>
                </CardContent>
            </Card>
        </div>
    );
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <main className="container mx-auto px-4 py-8">
        <div className="flex items-center justify-between mb-6">
            <h1 className="text-3xl font-bold">Admin Dashboard</h1>
            <AuthWidget />
        </div>
        
        <Tabs defaultValue="events">
            <TabsList className="grid w-full grid-cols-2">
                <TabsTrigger value="events">Event Management</TabsTrigger>
                <TabsTrigger value="students">Student Management</TabsTrigger>
            </TabsList>
            <TabsContent value="events">
                <EventManagementTab events={events} isLoading={dataLoading} />
            </TabsContent>
            <TabsContent value="students">
                <StudentManagementTab students={students} isLoading={dataLoading} />
            </TabsContent>
        </Tabs>

      </main>
    </div>
  );
}

