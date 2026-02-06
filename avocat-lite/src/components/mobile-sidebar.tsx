"use client"

import { Menu } from "lucide-react"
import { useState } from "react"
import { Sidebar } from "@/components/sidebar"
import { cn } from "@/lib/utils"

export function MobileSidebar() {
    const [isOpen, setIsOpen] = useState(false)

    return (
        <div className="md:hidden flex items-center justify-between p-4 bg-[#0f172a] text-white sticky top-0 z-[50] border-b border-white/5 shadow-sm">
            <div className="flex items-center">
                <button
                    onClick={() => setIsOpen(!isOpen)}
                    className="p-2 hover:bg-white/10 rounded-lg transition"
                    aria-label="Menu"
                >
                    <Menu className="h-6 w-6" />
                </button>
                <div className="ml-3 font-bold text-lg tracking-tight">
                    LexPremium <span className="text-secondary">Lite</span>
                </div>
            </div>

            {isOpen && (
                <>
                    <div
                        className="fixed inset-0 bg-black/60 backdrop-blur-sm z-[90] transition-opacity animate-in fade-in"
                        onClick={() => setIsOpen(false)}
                    />
                    <div className="fixed inset-y-0 left-0 w-72 z-[100] animate-in slide-in-from-left duration-300">
                        <Sidebar onClose={() => setIsOpen(false)} />
                    </div>
                </>
            )}
        </div>
    )
}

