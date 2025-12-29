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

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground min-h-screen`} suppressHydrationWarning>
                <AppShell>
                    {children}
                </AppShell>
            </body>
        </html>
    );
}
