"use client"

import Link from "next/link"
import { usePathname } from "next/navigation"
import { cn } from "@/lib/utils"
import {
    LayoutDashboard,
    Briefcase,
    Users,
    Calendar,
    FileText,
    MessageSquare,
    Settings,
    PenTool,
    LogOut,
    Beaker,
    Mail,
    Handshake,
    Inbox,
    Smartphone,
    Wallet,
    Library
} from "lucide-react"

const routes = [
    {
        label: "Tableau de Bord",
        icon: LayoutDashboard,
        href: "/",
        color: "text-sky-500",
    },
    {
        label: "Dossiers",
        icon: Briefcase,
        href: "/dossiers",
        color: "text-violet-500",
    },
    {
        label: "Clients",
        icon: Users,
        href: "/clients",
        color: "text-blue-500",
    },
    {
        label: "Courrier Arrivé",
        icon: Inbox,
        href: "/courrier",
        color: "text-orange-500",
    },
    {
        label: "Mails IA",
        icon: Mail,
        href: "/mails",
        color: "text-indigo-500",
    },
    {
        label: "Relations",
        icon: Handshake,
        href: "/relations",
        color: "text-emerald-500",
    },
    {
        label: "LexConnect",
        icon: Smartphone,
        href: "/connect",
        color: "text-sky-400",
    },
    {
        label: "Redaction",
        icon: PenTool,
        href: "/redaction",
        color: "text-rose-500",
    },
    {
        label: "LexAI",
        icon: MessageSquare,
        href: "/lex-ai",
        color: "text-emerald-500",
    },
    {
        label: "Assistants IA",
        icon: Beaker,
        href: "/lab",
        color: "text-amber-500",
    },
    {
        label: "Facturation",
        icon: FileText,
        href: "/facturation",
        color: "text-blue-700",
    },
    {
        label: "Comptabilité",
        icon: Wallet,
        href: "/accounting",
        color: "text-amber-400",
    },
    {
        label: "Bibliothèque",
        icon: Library,
        href: "/bibliotheque",
        color: "text-emerald-400",
    },
    {
        label: "Paramètres",
        icon: Settings,
        href: "/settings",
    },
]


import { ThemeToggle } from "@/components/theme-toggle"

interface SidebarProps {
    onClose?: () => void;
}

export function Sidebar({ onClose }: SidebarProps) {
    const pathname = usePathname()

    return (
        <div className="space-y-4 py-4 flex flex-col h-full bg-[#0f172a] text-white">
            <div className="px-3 py-2 flex-1 overflow-y-auto custom-scrollbar scroll-smooth">
                <Link
                    href="/"
                    onClick={onClose}
                    className="flex items-center pl-3 mb-14"
                >
                    <h1 className="text-2xl font-bold tracking-tight">
                        LexPremium <span className="text-secondary">Lite</span>
                    </h1>
                </Link>
                <div className="space-y-1">
                    {routes.map((route) => (
                        <Link
                            key={route.href}
                            href={route.href}
                            onClick={onClose}
                            className={cn(
                                "text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-white/10 rounded-lg transition-all duration-200",
                                pathname === route.href ? "text-white bg-white/10 shadow-sm" : "text-zinc-400",
                            )}
                        >
                            <div className="flex items-center flex-1">
                                <route.icon className={cn("h-5 w-5 mr-3 shrink-0", route.color)} />
                                <span className="truncate">{route.label}</span>
                            </div>
                        </Link>
                    ))}
                </div>
            </div>

            <div className="px-3 py-2 border-t border-white/5 space-y-4">
                <div className="px-3">
                    <p className="text-xs font-semibold text-zinc-500 uppercase tracking-wider mb-2">
                        Apparence
                    </p>
                    <ThemeToggle />
                </div>
                <button
                    onClick={() => {
                        if (onClose) onClose();
                        document.cookie = "auth=; expires=Thu, 01 Jan 1970 00:00:00 UTC; path=/;"
                        window.location.href = "/login"
                    }}
                    className="text-sm group flex p-3 w-full justify-start font-medium cursor-pointer hover:text-white hover:bg-red-500/10 rounded-lg transition text-zinc-400"
                >
                    <div className="flex items-center flex-1">
                        <LogOut className="h-5 w-5 mr-3 text-red-400" />
                        Déconnexion
                    </div>
                </button>
            </div>
        </div>
    )
}



