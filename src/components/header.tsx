
'use client';

import { Swords, Trophy } from "lucide-react";
import { AuthWidget } from "@/components/auth-widget";
import Link from "next/link";
import { Button } from "./ui/button";

export function Header() {
    return (
         <header className="py-4 px-4 md:px-8 border-b sticky top-0 bg-background/95 backdrop-blur-sm z-10">
            <div className="container mx-auto flex items-center justify-between">
                <div className="flex items-center gap-6">
                    <Link href="/" className="flex items-center gap-3">
                        <Trophy className="h-8 w-8 text-primary" />
                        <h1 className="text-3xl font-bold font-headline tracking-tight">
                        1board
                        </h1>
                    </Link>
                    <nav className="hidden md:flex items-center gap-2">
                        <Button asChild variant="ghost">
                            <Link href="/battle">
                                <Swords className="mr-2 h-4 w-4" />
                                Battle
                            </Link>
                        </Button>
                    </nav>
                </div>
                <AuthWidget />
            </div>
      </header>
    )
}
