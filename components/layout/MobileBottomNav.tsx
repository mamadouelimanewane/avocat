
"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { LayoutDashboard, Briefcase, Calendar, Menu, Folder } from "lucide-react"
import { cn } from "@/lib/utils"
import { MobileSidebar } from "./MobileSidebar"

export function MobileBottomNav() {
    const pathname = usePathname()

    const navItems = [
        { label: "Accueil", href: "/", icon: LayoutDashboard },
        { label: "Dossiers", href: "/dossiers", icon: Briefcase },
        { label: "Projets", href: "/workflows", icon: Calendar },
        { label: "Fichiers", href: "/documents", icon: Folder },
    ]

    return (
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white/80 backdrop-blur-lg border-t border-slate-200/50 h-16 flex items-center justify-around z-50 px-2 shadow-[0_-4px_12px_rgba(0,0,0,0.05)]">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center flex-1 h-full space-y-1 text-[10px] font-semibold transition-all duration-300",
                            isActive ? "text-indigo-600 scale-110" : "text-slate-400 hover:text-slate-600"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", isActive ? "stroke-[2.5px]" : "stroke-[1.5px]")} />
                        <span>{item.label}</span>
                    </Link>
                )
            })}

            <MobileSidebar>
                <button className="flex flex-col items-center justify-center flex-1 h-full space-y-1 text-[10px] font-semibold text-slate-400 hover:text-slate-600 transition-all duration-300">
                    <Menu className="h-5 w-5 stroke-[1.5px]" />
                    <span>Menu</span>
                </button>
            </MobileSidebar>
        </div>
    )
}
