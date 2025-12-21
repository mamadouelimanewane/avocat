"use client"

import * as React from "react"
import { Moon, Sun, Monitor, Palette } from "lucide-react"
import { useTheme } from "next-themes"

import { Button } from "@/components/ui/button"
import {
    DropdownMenu,
    DropdownMenuContent,
    DropdownMenuItem,
    DropdownMenuLabel,
    DropdownMenuSeparator,
    DropdownMenuTrigger,
    DropdownMenuSub,
    DropdownMenuSubTrigger,
    DropdownMenuSubContent
} from "@/components/ui/dropdown-menu"

const themes = [
    { name: "Zinc (Défaut)", value: "zinc", color: "#52525b" },
    { name: "Navy Premium", value: "navy", color: "#1e293b" },
    { name: "Bordeaux Élégance", value: "rose", color: "#e11d48" },
    { name: "Vert Nature", value: "green", color: "#16a34a" },
]

export function ThemeCustomizer() {
    const { setTheme, theme } = useTheme()

    // This is a simplified example. In a real app with Tailwind, tackling dynamic primary colors usually involves 
    // interacting with CSS variables at the document root or using a context that writes a style tag.
    // For this demo, we will rely on next-themes to toggle 'dark'/'light' and we can imagine extending it
    // to toggle class names on the body like 'theme-rose', 'theme-navy' if configured in tailwind.config.js.

    // Since we only have one set of CSS variables in globals.css right now, we can't fully switch color palettes 
    // dynamically without adding those classes. 
    // However, I will set the 'theme' in localStorage or similar and we can listen to it.
    // For now, let's Stick to standard Light/Dark/System as the base request was likely about that + maybe branding colors.

    // To properly support multi-theme, we'd need to update globals.css to have .theme-navy, .theme-rose, etc.
    // Let's assume we will implement that in the next step.

    return (
        <DropdownMenu>
            <DropdownMenuTrigger asChild>
                <Button variant="outline" size="icon" className="h-10 w-10 border-slate-300 dark:border-slate-700">
                    <Sun className="h-[1.2rem] w-[1.2rem] rotate-0 scale-100 transition-all dark:-rotate-90 dark:scale-0" />
                    <Moon className="absolute h-[1.2rem] w-[1.2rem] rotate-90 scale-0 transition-all dark:rotate-0 dark:scale-100" />
                    <span className="sr-only">Changer de thème</span>
                </Button>
            </DropdownMenuTrigger>
            <DropdownMenuContent align="end">
                <DropdownMenuLabel>Apparences</DropdownMenuLabel>
                <DropdownMenuItem onClick={() => setTheme("light")}>
                    <Sun className="mr-2 h-4 w-4" />
                    Clair
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("dark")}>
                    <Moon className="mr-2 h-4 w-4" />
                    Sombre
                </DropdownMenuItem>
                <DropdownMenuItem onClick={() => setTheme("system")}>
                    <Monitor className="mr-2 h-4 w-4" />
                    Système
                </DropdownMenuItem>

                <DropdownMenuSeparator />

                <DropdownMenuLabel>Couleur Principale</DropdownMenuLabel>
                {themes.map((t) => (
                    <DropdownMenuItem
                        key={t.value}
                        onClick={() => {
                            // This would ideally set a data-attribute on the body
                            document.documentElement.setAttribute('data-theme', t.value);
                            // Also save to locaStorage for persistence if not handled by next-themes
                            localStorage.setItem('app-theme-color', t.value);
                        }}
                        className="flex items-center gap-2 cursor-pointer"
                    >
                        <div className="h-3 w-3 rounded-full" style={{ backgroundColor: t.color }} />
                        {t.name}
                    </DropdownMenuItem>
                ))}
            </DropdownMenuContent>
        </DropdownMenu>
    )
}
