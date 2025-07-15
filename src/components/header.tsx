
'use client';

import { Medal } from "lucide-react";
import { AuthWidget } from "@/components/auth-widget";
import Link from "next/link";

export function Header() {
    return (
         <header className="py-6 px-4 md:px-8 border-b">
            <div className="container mx-auto flex items-center justify-between">
            <Link href="/" className="flex items-center gap-3">
                <Medal className="h-8 w-8 text-primary" />
                <h1 className="text-3xl font-bold font-headline tracking-tight">
                Nexus Academicus
                </h1>
            </Link>
            <AuthWidget />
            </div>
      </header>
    )
}
