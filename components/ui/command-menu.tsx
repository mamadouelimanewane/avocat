
"use client"

import * as React from "react"
import {
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Calculator,
    Gavel,
    FileText
} from "lucide-react"

import {
    CommandDialog,
    CommandEmpty,
    CommandGroup,
    CommandInput,
    CommandItem,
    CommandList,
    CommandSeparator,
    CommandShortcut,
} from "@/components/ui/command"

export function CommandMenu() {
    const [open, setOpen] = React.useState(false)

    React.useEffect(() => {
        const down = (e: KeyboardEvent) => {
            if (e.key === "k" && (e.metaKey || e.ctrlKey)) {
                e.preventDefault()
                setOpen((open) => !open)
            }
        }

        document.addEventListener("keydown", down)
        return () => document.removeEventListener("keydown", down)
    }, [])

    return (
        <>
            <button
                onClick={() => setOpen(true)}
                className="text-sm font-medium text-slate-600 dark:text-slate-300 hover:text-foreground hidden md:flex items-center gap-2 p-2 px-3 rounded-md border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900 hover:bg-slate-100 hover:text-accent-foreground transition-colors w-full max-w-sm justify-between shadow-sm h-10"
            >
                <span className="flex items-center gap-2">
                    <span>Rechercher...</span>
                </span>
                <kbd className="pointer-events-none inline-flex h-5 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium text-muted-foreground opacity-100">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </button>

            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput placeholder="Tapez une commande ou une recherche..." />
                <CommandList>
                    <CommandEmpty>Aucun résultat trouvé.</CommandEmpty>
                    <CommandGroup heading="Suggestions">
                        <CommandItem onSelect={() => window.location.href = '/agenda'}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Agenda</span>
                        </CommandItem>
                        <CommandItem onSelect={() => window.location.href = '/dossiers'}>
                            <Smile className="mr-2 h-4 w-4" />
                            <span>Dossiers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => window.location.href = '/factures'}>
                            <CreditCard className="mr-2 h-4 w-4" />
                            <span>Facturation</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Outils">
                        <CommandItem onSelect={() => window.location.href = '/outils'}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Calculatrice Délais</span>
                        </CommandItem>
                        <CommandItem onSelect={() => window.location.href = '/jurisprudence'}>
                            <Gavel className="mr-2 h-4 w-4" />
                            <span>Jurisprudence</span>
                        </CommandItem>
                    </CommandGroup>
                    <CommandSeparator />
                    <CommandGroup heading="Paramètres">
                        <CommandItem onSelect={() => window.location.href = '/admin'}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Profil & Admin</span>
                        </CommandItem>
                        <CommandItem onSelect={() => window.location.href = '/admin'}>
                            <Settings className="mr-2 h-4 w-4" />
                            <span>Configuration</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}
