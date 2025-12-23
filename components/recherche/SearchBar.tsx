
"use client"

import { Input } from "@/components/ui/input"
import { Button } from "@/components/ui/button"
import { Search, Gavel } from "lucide-react"
import { useRouter, useSearchParams } from "next/navigation"
import { useState } from "react"

export function SearchBar() {
    const router = useRouter()
    const searchParams = useSearchParams()
    const [query, setQuery] = useState(searchParams.get("q") || "")

    const handleSearch = () => {
        if (!query.trim()) return
        router.push(`/recherche?q=${encodeURIComponent(query)}`)
    }

    return (
        <div className="w-full max-w-3xl mx-auto space-y-4">
            <div className="flex gap-2">
                <div className="relative flex-1">
                    <Search className="absolute left-3 top-3 h-5 w-5 text-slate-400" />
                    <Input
                        className="pl-10 h-12 text-lg shadow-sm font-serif"
                        placeholder="Rechercher juris., loi (ex: rupture abusive, saisie conservatoire, OHADA...)"
                        value={query}
                        onChange={(e) => setQuery(e.target.value)}
                        onKeyDown={(e) => e.key === 'Enter' && handleSearch()}
                    />
                </div>
                <Button size="lg" className="h-12 px-8 bg-slate-900 text-white hover:bg-slate-800" onClick={handleSearch}>
                    <Gavel className="mr-2 h-4 w-4" /> Rechercher
                </Button>
            </div>

            <div className="flex justify-center gap-4 text-sm text-slate-500">
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-emerald-500 mr-2"></span>CCJA</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-blue-500 mr-2"></span>Cour Suprême Sénégal</span>
                <span className="flex items-center"><span className="w-2 h-2 rounded-full bg-amber-500 mr-2"></span>Actes Uniformes</span>
            </div>
        </div>
    )
}
