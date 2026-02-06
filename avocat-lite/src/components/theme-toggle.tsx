"use client"

import * as React from "react"
import { Moon, Sun, Palette } from "lucide-react"
import { useTheme } from "next-themes"

export function ThemeToggle() {
    const { setTheme, theme } = useTheme()

    return (
        <div className="flex items-center gap-2 p-2 rounded-lg bg-white/5 border border-white/10">
            <button
                onClick={() => setTheme("light")}
                className={`p-2 rounded-md transition ${theme === "light" ? "bg-amber-400 text-slate-900" : "text-zinc-400 hover:text-white"}`}
                title="Mode Clair"
            >
                <Sun className="h-4 w-4" />
            </button>
            <button
                onClick={() => setTheme("dark")}
                className={`p-2 rounded-md transition ${theme === "dark" ? "bg-amber-400 text-slate-900" : "text-zinc-400 hover:text-white"}`}
                title="Mode Sombre"
            >
                <Moon className="h-4 w-4" />
            </button>
        </div>
    )
}
