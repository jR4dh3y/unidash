
'use client';

import { useState } from 'react';
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Label } from "@/components/ui/label";
import {
  Sheet,
  SheetContent,
  SheetDescription,
  SheetHeader,
  SheetTitle,
  SheetTrigger,
  SheetFooter,
  SheetClose
} from "@/components/ui/sheet";
import { Loader2 } from 'lucide-react';
import type { Student } from '@/lib/types';
import { useToast } from '@/hooks/use-toast';
import { updateStudentProfile } from '@/lib/firebase-service';

interface EditProfileSheetProps {
    student: Student;
    children: React.ReactNode;
}

export function EditProfileSheet({ student, children }: EditProfileSheetProps) {
    const [name, setName] = useState(student.name);
    const [github, setGithub] = useState(student.github || '');
    const [linkedin, setLinkedin] = useState(student.linkedin || '');
    const [saving, setSaving] = useState(false);
    const { toast } = useToast();

    const handleSaveChanges = async () => {
        setSaving(true);
        try {
            const profileData: { name: string; github?: string; linkedin?: string } = { name };
            if (github) profileData.github = github;
            if (linkedin) profileData.linkedin = linkedin;

            await updateStudentProfile(student.id, profileData);
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


    return (
        <Sheet>
            <SheetTrigger asChild>
                {children}
            </SheetTrigger>
            <SheetContent>
                <SheetHeader>
                    <SheetTitle>Edit Profile</SheetTitle>
                    <SheetDescription>
                        Make changes to your profile here. Click save when you're done.
                    </SheetDescription>
                </SheetHeader>
                <div className="grid gap-4 py-4">
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="name" className="text-right">
                            Name
                        </Label>
                        <Input id="name" value={name} onChange={(e) => setName(e.target.value)} className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="github" className="text-right">
                            GitHub
                        </Label>
                        <Input id="github" value={github} onChange={(e) => setGithub(e.target.value)} placeholder="https://github.com/username" className="col-span-3" />
                    </div>
                    <div className="grid grid-cols-4 items-center gap-4">
                        <Label htmlFor="linkedin" className="text-right">
                            LinkedIn
                        </Label>
                        <Input id="linkedin" value={linkedin} onChange={(e) => setLinkedin(e.target.value)} placeholder="https://linkedin.com/in/username" className="col-span-3" />
                    </div>
                </div>
                <SheetFooter>
                    <SheetClose asChild>
                        <Button type="submit" onClick={handleSaveChanges} disabled={saving}>
                             {saving && <Loader2 className="mr-2 h-4 w-4 animate-spin" />}
                             Save Changes
                        </Button>
                    </SheetClose>
                </SheetFooter>
            </SheetContent>
        </Sheet>
    );
}
