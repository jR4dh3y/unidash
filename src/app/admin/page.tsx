import { notFound } from 'next/navigation';
import { auth } from '@/lib/firebase-config-admin';
import { cookies } from 'next/headers';
import { AuthWidget } from '@/components/auth-widget';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Medal } from 'lucide-react';

const ADMIN_UID = 'YOUR_ADMIN_UID_HERE'; 

async function getAuthenticatedUser() {
  if (!auth) return null;
  try {
    const token = cookies().get('token')?.value;
    if (!token) return null;
    const decodedToken = await auth.verifyIdToken(token);
    return decodedToken;
  } catch (error) {
    console.error("Authentication error:", error);
    return null;
  }
}


export default async function AdminPage() {
  const user = await getAuthenticatedUser();

  // Basic authorization check
  if (!user || user.uid !== ADMIN_UID) {
    // You can redirect to a custom unauthorized page or the home page
    // For now, we'll just show a 404
    notFound();
  }

  return (
    <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
      <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <div className="flex items-center gap-3">
             <Medal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-800 dark:text-gray-200">
              Admin Panel
            </h1>
          </div>
          <AuthWidget />
        </div>
      </header>
      <main className="container mx-auto px-4 md:px-8 pb-12">
        <Card>
            <CardHeader>
                <CardTitle>Welcome, Admin!</CardTitle>
            </CardHeader>
            <CardContent>
                <p>This is the admin dashboard. You can add admin-specific components and functionality here.</p>
            </CardContent>
        </Card>
      </main>
    </div>
  );
}
