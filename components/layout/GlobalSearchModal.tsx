"use client"

import * as React from "react"
import {
    Calculator,
    Calendar,
    CreditCard,
    Settings,
    Smile,
    User,
    Search,
    FileText,
    Briefcase,
    Hash,
    ArrowRight,
    Gavel
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
import { Button } from "@/components/ui/button"
import { globalSearch, SearchResult } from "@/lib/search-engine" // Needs to be a server action exposed or called via API
import { useRouter } from "next/navigation"

// Note: Since globalSearch is a server action/function, we need to wrap it.
// In a real implementation this might be an API route to allow distinct async fetching.
// Here we will use a debounced effect to call a Server Action.

import { performGlobalSearch } from "@/app/actions" // We need to expose this

export function GlobalSearchModal() {
    const [open, setOpen] = React.useState(false)
    const [query, setQuery] = React.useState("")
    const [results, setResults] = React.useState<SearchResult[]>([])
    const [loading, setLoading] = React.useState(false)
    const router = useRouter()

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

    // Debounce Search
    React.useEffect(() => {
        if (query.length < 2) {
            setResults([])
            return
        }

        const timer = setTimeout(async () => {
            setLoading(true)
            try {
                const res = await performGlobalSearch(query)
                setResults(res)
            } catch (e) {
                console.error(e)
            } finally {
                setLoading(false)
            }
        }, 300)

        return () => clearTimeout(timer)
    }, [query])

    const handleSelect = (url: string) => {
        setOpen(false)
        router.push(url)
    }

    return (
        <>
            <Button
                variant="outline"
                className="relative h-9 w-64 justify-start rounded-[0.5rem] text-sm text-muted-foreground sm:pr-12 lg:w-96 shadow-sm bg-white/50 backdrop-blur-sm hover:bg-white"
                onClick={() => setOpen(true)}
            >
                <Search className="mr-2 h-4 w-4" />
                <span className="inline-flex">Rechercher (Dossiers, Clients, OCR)...</span>
                <kbd className="pointer-events-none absolute right-1.5 top-1.5 hidden h-6 select-none items-center gap-1 rounded border bg-muted px-1.5 font-mono text-[10px] font-medium opacity-100 sm:flex">
                    <span className="text-xs">⌘</span>K
                </kbd>
            </Button>
            <CommandDialog open={open} onOpenChange={setOpen}>
                <CommandInput
                    placeholder="Tapez votre recherche..."
                    value={query}
                    onValueChange={setQuery}
                />
                <CommandList>
                    <CommandEmpty>
                        {loading ? "Recherche intelligente en cours..." : "Aucun résultat."}
                    </CommandEmpty>

                    {results.length > 0 && (
                        <CommandGroup heading="Suggestions IA">
                            {results.slice(0, 5).map((res) => (
                                <CommandItem key={res.id} onSelect={() => handleSelect(res.url)} className="cursor-pointer">
                                    <IconForType type={res.type} />
                                    <div className="flex flex-col">
                                        <span className="font-medium">{res.title}</span>
                                        <span className="text-xs text-muted-foreground truncate max-w-[300px]">{res.subtitle}</span>
                                    </div>
                                </CommandItem>
                            ))}
                        </CommandGroup>
                    )}

                    <CommandSeparator />

                    {/* Navigation Rapide (Static) */}
                    <CommandGroup heading="Navigation Rapide">
                        <CommandItem onSelect={() => handleSelect('/dossiers')}>
                            <Briefcase className="mr-2 h-4 w-4" />
                            <span>Dossiers</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/agenda')}>
                            <Calendar className="mr-2 h-4 w-4" />
                            <span>Agenda</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/clients')}>
                            <User className="mr-2 h-4 w-4" />
                            <span>Clients</span>
                        </CommandItem>
                        <CommandItem onSelect={() => handleSelect('/comptabilite')}>
                            <Calculator className="mr-2 h-4 w-4" />
                            <span>Comptabilité</span>
                        </CommandItem>
                    </CommandGroup>
                </CommandList>
            </CommandDialog>
        </>
    )
}

function IconForType({ type }: { type: string }) {
    switch (type) {
        case 'DOSSIER': return <Briefcase className="mr-2 h-4 w-4 text-indigo-500" />
        case 'CLIENT': return <User className="mr-2 h-4 w-4 text-emerald-500" />
        case 'DOCUMENT': return <FileText className="mr-2 h-4 w-4 text-slate-500" />
        case 'FACTURE': return <CreditCard className="mr-2 h-4 w-4 text-amber-500" />
        case 'JURISPRUDENCE': return <Gavel className="mr-2 h-4 w-4 text-red-800" />
        default: return <Search className="mr-2 h-4 w-4" />
    }
}
