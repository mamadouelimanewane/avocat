
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
        <div className="md:hidden fixed bottom-0 left-0 right-0 bg-white border-t border-slate-200 h-16 flex items-center justify-around z-50">
            {navItems.map((item) => {
                const isActive = pathname === item.href
                return (
                    <Link
                        key={item.href}
                        href={item.href}
                        className={cn(
                            "flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium transition-colors",
                            isActive ? "text-indigo-600" : "text-slate-500 hover:text-slate-900"
                        )}
                    >
                        <item.icon className={cn("h-5 w-5", isActive && "fill-current")} />
                        <span>{item.label}</span>
                    </Link>
                )
            })}

            {/* Menu Item triggers the Sidebar Sheet */}
            <MobileSidebar>
                <button className="flex flex-col items-center justify-center w-full h-full space-y-1 text-xs font-medium text-slate-500 hover:text-slate-900 transition-colors">
                    <Menu className="h-5 w-5" />
                    <span>Menu</span>
                </button>
            </MobileSidebar>
        </div>
    )
}
