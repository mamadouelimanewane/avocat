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

import { ThemeProvider } from "@/components/theme-provider"
import { I18nProvider } from "@/components/i18n-provider"

export default function RootLayout({
    children,
}: {
    children: React.ReactNode;
}) {
    return (
        <html lang="fr" suppressHydrationWarning>
            <body className={`${inter.variable} ${outfit.variable} font-sans bg-background text-foreground min-h-screen`} suppressHydrationWarning>
                <ThemeProvider
                    attribute="class"
                    defaultTheme="system"
                    enableSystem
                    disableTransitionOnChange
                >
                    <I18nProvider>
                        <AppShell>
                            {children}
                        </AppShell>
                    </I18nProvider>
                </ThemeProvider>
            </body>
        </html>
    );
}
