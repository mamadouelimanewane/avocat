
"use client"

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { LexAIAssistant } from '@/components/ai/LexAIAssistant'
import { VoiceCommander } from '@/components/ai/VoiceCommander'

export function AppShell({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    // Define public or standalone routes where the main dashboard shell should NOT appear
    // REMOVED '/' from standalone list because it is now the main Pro Dashboard
    const isStandalone = pathname?.startsWith('/portal') || pathname?.startsWith('/login') || pathname?.startsWith('/register')

    if (isStandalone) {
        return (
            <div className="min-h-screen bg-slate-50">
                {children}
            </div>
        )
    }

    return (
        <>
            <Sidebar className="hidden md:flex fixed left-0 top-0 z-50" />
            <div className="flex flex-col min-h-screen md:pl-64 transition-all duration-300">
                <Header />
                <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500 pb-20 md:pb-8">
                    {children}
                    {/* Les assistants sont montés après le contenu principal */}
                    <div className="relative z-50">
                        <LexAIAssistant />
                        <VoiceCommander />
                    </div>
                </main>
                <MobileBottomNav />
            </div>
        </>
    )
}
