"use client"

import { usePathname } from "next/navigation"
import { Sidebar } from "@/components/sidebar"
import { MobileSidebar } from "@/components/mobile-sidebar"

export function AppWrapper({ children }: { children: React.ReactNode }) {
    const pathname = usePathname()
    const isLoginPage = pathname === "/login"
    const isPortalRoute = pathname?.startsWith("/portal")

    if (isLoginPage || isPortalRoute) {
        return <>{children}</>
    }

    return (
        <div className="h-full relative bg-background text-foreground transition-colors duration-300">
            <MobileSidebar />
            <div className="hidden h-full md:flex md:w-72 md:flex-col md:fixed md:inset-y-0 z-[80] bg-[#0f172a] border-r border-white/10 dark:border-white/5">
                <Sidebar />
            </div>
            <main className="md:pl-72 pb-10 min-h-screen">
                {children}
            </main>
        </div>
    )

}

