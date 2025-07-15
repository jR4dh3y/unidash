
'use client';

import { useEffect, useState } from 'react';
import { useAuth } from '@/components/auth-provider';
import { getStudentById, updateStudentProfile } from '@/lib/firebase-service';
import type { Student } from '@/lib/types';
import { Card, CardContent, CardDescription, CardHeader, CardTitle, CardFooter } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { useToast } from '@/hooks/use-toast';
import { Loader2, Medal } from 'lucide-react';
import { AuthWidget } from '@/components/auth-widget';
import Link from 'next/link';
import { useRouter } from 'next/navigation';

export default function ProfilePage() {
  const { user, loading: authLoading } = useAuth();
  const [student, setStudent] = useState<Student | null>(null);
  const [name, setName] = useState('');
  const [github, setGithub] = useState('');
  const [linkedin, setLinkedin] = useState('');
  const [loading, setLoading] = useState(true);
  const [saving, setSaving] = useState(false);
  const { toast } = useToast();
  const router = useRouter();


  useEffect(() => {
    if (authLoading) return;
    if (!user) {
      router.push('/login');
      return;
    }

    const fetchStudentData = async () => {
      setLoading(true);
      const studentData = await getStudentById(user.uid);
      if (studentData) {
        setStudent(studentData);
        setName(studentData.name);
        setGithub(studentData.github || '');
        setLinkedin(studentData.linkedin || '');
      } else {
        // Handle case where student document might not exist yet for a new user
        setName(user.displayName || '');
      }
      setLoading(false);
    };

    fetchStudentData();
  }, [user, authLoading, router]);

  const handleSaveChanges = async () => {
    if (!user) return;
    setSaving(true);
    try {
        const profileData: { name: string; github?: string; linkedin?: string } = { name };
        if (github) profileData.github = github;
        if (linkedin) profileData.linkedin = linkedin;

      await updateStudentProfile(user.uid, profileData);
      toast({
        title: 'Success!',
        description: 'Your profile has been updated.',
      });
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Update failed',
        description: error.message,
      });
    } finally {
      setSaving(false);
    }
  };

  if (loading || authLoading) {
    return <div className="flex h-screen items-center justify-center"><Loader2 className="h-8 w-8 animate-spin" /></div>;
  }

  return (
     <div className="min-h-screen bg-background text-foreground dark:bg-gray-900 dark:text-gray-100">
       <header className="py-6 px-4 md:px-8">
        <div className="container mx-auto flex items-center justify-between">
          <Link href="/" className="flex items-center gap-3">
            <Medal className="h-8 w-8 text-primary" />
            <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-800 dark:text-gray-200">
              Nexus Academicus
            </h1>
          </Link>
          <AuthWidget />
        </div>
      </header>
        <main className="container mx-auto px-4 md:px-8 pb-12 flex justify-center">
            <Card className="w-full max-w-2xl">
            <CardHeader>
                <CardTitle>Edit Your Profile</CardTitle>
                <CardDescription>Keep your information up to date.</CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
                <div className="space-y-2">
                <Label htmlFor="name">Full Name</Label>
                <Input id="name" value={name} onChange={(e) => setName(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="github">GitHub Profile URL</Label>
                <Input id="github" placeholder="https://github.com/username" value={github} onChange={(e) => setGithub(e.target.value)} />
                </div>
                <div className="space-y-2">
                <Label htmlFor="linkedin">LinkedIn Profile URL</Label>
                <Input id="linkedin" placeholder="https://linkedin.com/in/username" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} />
                </div>
            </CardContent>
            <CardFooter>
                <Button onClick={handleSaveChanges} disabled={saving}>
                {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                Save Changes
                </Button>
            </CardFooter>
            </Card>
        </main>
    </div>
  );
}
