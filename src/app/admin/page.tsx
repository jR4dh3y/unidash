
import { notFound } from 'next/navigation';
import { AuthWidget } from '@/components/auth-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal, ShieldAlert } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/auth';
import { AddEventForm } from '@/components/add-event-form';
import Link from 'next/link';
import { Button } from '@/components/ui/button';

const ADMIN_UID = 'IMZ23UOOblMG1Dm6HDF4Hf7UOvK2'; 

export default async function AdminPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.uid !== ADMIN_UID) {
    return (
        <div className="min-h-screen bg-background text-foreground flex items-center justify-center">
            <Card className="w-full max-w-md mx-4">
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
      <main className="container mx-auto px-4 md:px-8 pb-12 pt-8 grid gap-8 md:grid-cols-2">
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is the admin dashboard. You can add admin-specific components and functionality here.</p>
            </CardContent>
        </Card>
        <AddEventForm />
      </main>
    </div>
  );
}
