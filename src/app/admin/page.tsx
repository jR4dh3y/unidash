
import { notFound } from 'next/navigation';
import { AuthWidget } from '@/components/auth-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal } from 'lucide-react';
import { getAuthenticatedUser } from '@/lib/auth';
import { AddEventForm } from '@/components/add-event-form';

const ADMIN_EMAIL = 'admin@admin.com'; 

export default async function AdminPage() {
  const user = await getAuthenticatedUser();

  if (!user || user.email !== ADMIN_EMAIL) {
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Medal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight">
              Admin Panel
            </h1>
          </div>
          <AuthWidget />
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 pb-12 grid gap-8 md:grid-cols-2">
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
