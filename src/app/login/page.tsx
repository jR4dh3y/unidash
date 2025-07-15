
'use client';

import { useState } from 'react';
import { useRouter } from 'next/navigation';
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  updateProfile,
} from 'firebase/auth';
import { auth } from '@/lib/firebase-config';
import { Button } from '@/components/ui/button';
import {
  Card,
  CardContent,
  CardDescription,
  CardFooter,
  CardHeader,
  CardTitle,
} from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs';
import { useToast } from '@/hooks/use-toast';
import { Medal } from 'lucide-react';
import { createStudent } from '@/lib/firebase-service';

export default function LoginPage() {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [loading, setLoading] = useState(false);
  const router = useRouter();
  const { toast } = useToast();
  const [activeTab, setActiveTab] = useState('signin');


  const handleSignUp = async () => {
    if (!name || !email || !password) {
        toast({
            variant: 'destructive',
            title: 'Missing information',
            description: 'Please fill out all fields to sign up.',
        });
        return;
    }
    setLoading(true);
    try {
      const userCredential = await createUserWithEmailAndPassword(auth, email, password);
      await updateProfile(userCredential.user, { displayName: name });
      
      // Create a corresponding student document in Firestore
      await createStudent(userCredential.user.uid, name);

      toast({
        title: 'Account Created',
        description: 'You have successfully signed up. Please sign in.',
      });
      setActiveTab('signin');

    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-up failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };

  const handleSignIn = async () => {
    setLoading(true);
    try {
      const userCredential = await signInWithEmailAndPassword(auth, email, password);
      
      // Get the ID token and send it to the server to create a session cookie
      const idToken = await userCredential.user.getIdToken();
      
      await fetch('/api/auth/session', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ idToken }),
      });

      router.push('/');
    } catch (error: any) {
      toast({
        variant: 'destructive',
        title: 'Sign-in failed',
        description: error.message,
      });
    } finally {
      setLoading(false);
    }
  };


  return (
    <div className="flex items-center justify-center min-h-screen bg-background">
       <div className="absolute top-8 left-8 flex items-center gap-3">
          <Medal className="h-8 w-8 text-primary" />
          <h1 className="text-3xl font-bold font-headline tracking-tight text-gray-800 dark:text-gray-200">
            Nexus Academicus
          </h1>
        </div>
      <Tabs value={activeTab} onValueChange={setActiveTab} className="w-[400px]">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="signin">Sign In</TabsTrigger>
          <TabsTrigger value="signup">Sign Up</TabsTrigger>
        </TabsList>
        <TabsContent value="signin">
          <Card>
            <CardHeader>
              <CardTitle>Sign In</CardTitle>
              <CardDescription>
                Access your account to view your progress.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                <Label htmlFor="email-signin">Email</Label>
                <Input
                  id="email-signin"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signin">Password</Label>
                <Input
                  id="password-signin"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignIn} disabled={loading} className="w-full">
                {loading ? 'Signing In...' : 'Sign In'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
        <TabsContent value="signup">
          <Card>
            <CardHeader>
              <CardTitle>Sign Up</CardTitle>
              <CardDescription>
                Create a new account to start your journey.
              </CardDescription>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="space-y-2">
                 <Label htmlFor="name-signup">Full Name</Label>
                <Input
                  id="name-signup"
                  type="text"
                  placeholder="Jane Doe"
                  value={name}
                  onChange={(e) => setName(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="email-signup">Email</Label>
                <Input
                  id="email-signup"
                  type="email"
                  placeholder="m@example.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  required
                />
              </div>
              <div className="space-y-2">
                <Label htmlFor="password-signup">Password</Label>
                <Input
                  id="password-signup"
                  type="password"
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                  required
                />
              </div>
            </CardContent>
            <CardFooter>
              <Button onClick={handleSignUp} disabled={loading} className="w-full">
                {loading ? 'Creating Account...' : 'Create Account'}
              </Button>
            </CardFooter>
          </Card>
        </TabsContent>
      </Tabs>
    </div>
  );
}
