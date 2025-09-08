
import type {Metadata} from 'next';
import './globals.css';
import { Toaster } from "@/components/ui/toaster";
import { StuckButton } from '@/components/stuck-button';
import { Providers } from '@/components/providers';
import { Header } from '@/components/header';
import { ConvexClientProvider } from './ConvexClientProvider';

export const metadata: Metadata = {
  title: '1board',
  description: 'The Ultimate Leaderboard Experience',
  icons: {
    icon: '/icon.svg',
  },
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en" suppressHydrationWarning>
      <head>
        <link rel="preconnect" href="https://fonts.googleapis.com" />
        <link rel="preconnect" href="https://fonts.gstatic.com" crossOrigin="anonymous" />
        <link href="https://fonts.googleapis.com/css2?family=Inter:wght@400;500;600;700;800&display=swap" rel="stylesheet"></link>
      </head>
      <body className="font-body antialiased">
        <Providers>
          <ConvexClientProvider>
            <div className="relative flex min-h-screen flex-col">
              <Header />
              <main className="flex-1">
                {children}
              </main>
              <StuckButton />
              <Toaster />
            </div>
          </ConvexClientProvider>
        </Providers>
      </body>
    </html>
  );
}
