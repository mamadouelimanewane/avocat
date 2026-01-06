
"use client"

import { usePathname } from 'next/navigation'
import { Sidebar } from '@/components/layout/Sidebar'
import { Header } from '@/components/layout/Header'
import { MobileBottomNav } from '@/components/layout/MobileBottomNav'
import { LexAIAssistant } from '@/components/ai/LexAIAssistant'
import { VoiceAssistant } from '@/components/ai/VoiceAssistant'

export function AppShell({
    children,
    isLoggedIn,
    user
}: {
    children: React.ReactNode,
    isLoggedIn?: boolean,
    user?: any
}) {
    const pathname = usePathname()

    // Standalone logic: 
    // - If it's a portal/login/register page, always standalone.
    // - If it's the root '/' AND the user is NOT logged in, then it's standalone (marketing).
    // - IF it's the root '/' AND the user IS logged in, we want full Sidebar/Header (dashboard).
    const isLoginPage = pathname?.startsWith('/portal') || pathname?.startsWith('/login') || pathname?.startsWith('/register');
    const isMarketingAtRoot = pathname === '/' && !isLoggedIn;

    const isStandalone = isLoginPage || isMarketingAtRoot;

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
                <Header user={user} />
                <main className="flex-1 p-6 md:p-8 animate-in fade-in duration-500 pb-20 md:pb-8">
                    {children}
                </main>
                <div className="relative z-[100]">
                    <LexAIAssistant />
                    <VoiceAssistant />
                </div>
                <MobileBottomNav />
            </div>
        </>
    )
}
