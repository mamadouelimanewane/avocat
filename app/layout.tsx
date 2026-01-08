import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { AppShell } from '@/components/layout/AppShell';
import './globals.css';

// Using standard fonts if Google Fonts fail, but configuring them here
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'LexPremium - Gestion de Cabinet d\'Avocats',
    description: 'Solution de gestion pour cabinets d\'avocats modernes.',
};

import { ThemeProvider } from '@/components/theme-provider';
import { Toaster } from '@/components/ui/toaster';

import { prisma } from '@/lib/prisma';
import { cookies } from 'next/headers';

export default async function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    const cookieStore = cookies();
    const userId = cookieStore.get('auth_token')?.value;
    const isLoggedIn = !!userId;

    let user = null;
    if (userId) {
        user = await prisma.user.findUnique({
            where: { id: userId },
            include: { userRole: true }
        });
    }

    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground min-h-screen`} suppressHydrationWarning>
                <ThemeProvider attribute="class" defaultTheme="system" enableSystem>
                    <AppShell isLoggedIn={isLoggedIn} user={user}>
                        {children}
                    </AppShell>
                    <Toaster />
                </ThemeProvider>
            </body>
        </html>
    );
}
