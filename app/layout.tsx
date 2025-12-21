import type { Metadata } from 'next';
import { Inter, Outfit } from 'next/font/google';
import { Sidebar } from '@/components/layout/Sidebar';
import { Header } from '@/components/layout/Header';
import { MobileBottomNav } from '@/components/layout/MobileBottomNav';
import { LexAIAssistant } from '@/components/ai/LexAIAssistant';
import './globals.css';

// Using standard fonts if Google Fonts fail, but configuring them here
const inter = Inter({ subsets: ['latin'], variable: '--font-inter' });
const outfit = Outfit({ subsets: ['latin'], variable: '--font-outfit' });

export const metadata: Metadata = {
    title: 'LexPremium - Gestion de Cabinet d\'Avocats',
    description: 'Solution de gestion pour cabinets d\'avocats modernes.',
};

import { ThemeProvider } from "@/components/theme-provider"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground md:pl-64 min-h-screen`} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <Sidebar className="hidden md:flex" />
                    <div className="flex flex-col min-h-screen">
                        <Header />
                        <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500 pb-20 md:pb-8">
                            {children}
                            <LexAIAssistant />
                        </main>
                        <MobileBottomNav />
                    </div>
                </ThemeProvider>
            </body>
        </html>
    );
}
